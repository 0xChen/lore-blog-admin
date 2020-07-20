<template>
  <div class="link">
    <div class="search-form">
      <el-row :gutter="4">
        <el-col :md="4" :sm="12">
          <el-input
            v-model="queryParam.name"
            @keyup.enter.native="handleFilter"
            placeholder="名称"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="6" :sm="12">
          <el-input
            v-model="queryParam.url"
            @keyup.enter.native="handleFilter"
            placeholder="网址"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="8" :sm="12">
          <el-input
            v-model="queryParam.description"
            @keyup.enter.native="handleFilter"
            placeholder="描述"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="3" :sm="8">
          <el-select
            v-model="queryParam.visible"
            placeholder="是否显示"
            @change="handleFilter"
            size="small"
            clearable
          >
            <el-option label="是" :key="1" :value="1"/>
            <el-option label="否" :key="0" :value="0"/>
          </el-select>
        </el-col>
        <el-col :md="3" :sm="4">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getLinkPage"
            size="small"
          >
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div class="table-toolbar">
      <dynamic-column
        :tableColumns="tableColumns"
        @column-update="columnUpdate"
        class="table-toolbar-item"
      />
      <el-tooltip effect="dark" content="刷新表格" placement="top">
        <svg-icon name="reload" @click.stop="getLinkPage" class="table-toolbar-item"/>
      </el-tooltip>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click.stop="addNewLine"
      >
        新增一行
      </el-button>
      <el-tooltip effect="dark" content="删除数据表格中选中的行" placement="top">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-minus"
          @click="deleteBatch"
        >
          批量删除
        </el-button>
      </el-tooltip>
    </div>

    <div class="table-container">
      <el-table
        ref="linkTable"
        v-loading="tableLoading"
        :data="records"
        :row-key="rowKey"
        :border="true"
        :stripe="true"
        :fit="true"
        :highlight-current-row="true"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          :index="1"
          align="center"
          width="50"
          fixed="left"
        >
        </el-table-column>
        <!-- 如果直接用 column.prop 做 key 无法重排序列-->
        <el-table-column
          v-for="(column, index) in tableColumns"
          :key="`${column.prop}-${index}`"
          :column-key="column.prop"
          v-bind="column"
          :align="column.align ? column.align : 'center'"
          header-align="center"
        >
          <template v-slot:default="{ row, column }">
            <template v-if="row.isEdit">
              <template v-if="column.property === 'visible'">
                <el-select
                  v-model="row[column.property]"
                  :placeholder="column.label"
                  size="small"
                >
                  <el-option label="是" :key="1" :value="1"/>
                  <el-option label="否" :key="0" :value="0"/>
                </el-select>
              </template>
              <template v-else-if="column.property === 'createTime'">
               {{ row[column.property] | dateFormat}}
              </template>
              <template v-else>
                <el-input
                  v-model="row[column.property]"
                  :placeholder="column.label"
                  size="small"
                />
              </template>
            </template>
            <template v-else>
              <template v-if="column.property === 'visible'">
                {{ row[column.property] === '1' ? '是' : '否'}}
              </template>
              <template v-else-if="column.property === 'createTime'">
                {{ row[column.property] | dateFormat}}
              </template>
              <template v-else>
                {{ row[column.property] }}
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="120"
          fixed="right"

        >
          <template v-slot:default="{ row, column, $index }">
            <template v-if="row.isEdit">
              <template v-if="row.isNew">
                <el-button
                  type="text"
                  size="mini"
                  @click="handleSave(row)"
                >
                  添加
                </el-button>
                <el-button
                  type="warning"
                  size="mini"
                  @click="handleRemove($index)"
                >
                  移除
                </el-button>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleUpdate(row)"
                >
                  保存
                </el-button>
                <el-button
                  type="warning"
                  size="mini"
                  @click="handleCancel(row)"
                >
                  取消
                </el-button>
              </template>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="mini"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-popconfirm
                hideIcon
                placement="left"
                title="是否要删除此行？"
                @onConfirm="handleDelete(row)"
              >
                <template v-slot:reference>
                  <el-button
                    type="danger"
                    size="mini"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="table-pagination">
      <pagination v-bind="pagination" @pagination="handlePagination"/>
    </div>

  </div>
</template>

<script>
import linkApi from '@/api/link';
import DynamicColumn from '@/components/Table/DynamicColumn.vue';

export default {
  name: 'Link',
  components: {
    DynamicColumn
  },
  data() {
    return {
      records: [],
      tableHead: [
        {
          prop: 'name',
          label: '名称',
          display: true
        },
        {
          prop: 'url',
          label: '网址',
          display: true
        },
        {
          prop: 'sort',
          label: '排序',
          align: 'right',
          width: 80,
          sortable: true,
          display: true
        },
        {
          prop: 'description',
          label: '描述',
          showOverflowTooltip: true,
          display: true
        },
        {
          prop: 'visible',
          label: '是否显示',
          width: 120,
          display: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          sortable: true,
          display: true
        }
      ],
      queryParam: {
        name: '',
        url: '',
        description: '',
        visible: ''
      },
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      tableLoading: false
    };
  },
  computed: {
    tableColumns() {
      return this.tableHead.filter(i => i.display);
    }
  },
  created() {
    this.getLinkPage();
  },
  methods: {
    getLinkPage() {
      this.tableLoading = true;
      linkApi.getLinkPage({ ...this.queryParam, ...this.pagination })
        .then(res => {
          const { data } = res;
          this.records = data.records;
          this.pagination.page = data.current;
          this.pagination.size = data.size;
          this.pagination.total = data.total;
        }).catch(() => {

        }).then(() => {
          this.tableLoading = false;
        });
    },
    handlePagination(pagination) {
      this.pagination.page = pagination.page;
      this.pagination.size = pagination.size;
      this.getLinkPage();
    },
    columnUpdate(columns) {
      this.tableHead = columns;
      this.$nextTick(() => {
        this.$refs.linkTable.doLayout();
      });
    },
    rowKey(row) {
      if (row['row-key']) {
        return row['row-key'];
      }
      if (row.id !== null) {
        return `row-${row.id}`;
      }
      row['row-key'] = `row-${Math.random()}`;
      return row['row-key'];
    },
    addNewLine() {
      const newLine = {
        id: null,
        name: null,
        url: null,
        sort: null,
        description: null,
        visible: 1,
        createTime: new Date().getTime(),
        isEdit: true,
        isNew: true
      };
      this.records.push(newLine);
    },
    deleteBatch() {
      const selectRow = this.$refs.linkTable.selection;
      if (selectRow.length === 0) {
        this.$message.warning('请勾选需要删除的数据');
        return;
      }
      const deleteIds = [];
      selectRow.forEach(row => {
        if (row.id !== null) {
          deleteIds.push(row.id);
        } else {
          // 移除新增的但是还未保存的行
          debugger;
          for (const index of Object.keys(this.records)) {
            if (row['row-key'] === this.records[index]['row-key']) {
              this.records.splice(index, 1);
              break;
            }
          }
        }
      });
      if (deleteIds.length > 0) {
        this.tableLoading = true;
        linkApi.deleteLinkBatch(deleteIds)
          .then(() => {
            this.$message.success('删除成功');
          })
          .catch(() => {
            this.$message.error('删除失败');
          })
          .then(() => {
            this.getLinkPage();
          });
      }
    },
    handleSave(row) {
      this.tableLoading = true;
      linkApi.saveLink(row)
        .then(() => {
          this.$message.success('保存成功');
          this.getLinkPage();
        }).catch(() => {
          this.$message.error('保存失败');
        }).then(() => {
          this.tableLoading = false;
        });
    },
    handleDelete(row) {
      this.tableLoading = true;
      linkApi.deleteLink(row.id)
        .then(() => {
          this.$message.success('删除成功');
        })
        .catch(() => {
          this.$message.error('删除失败');
        })
        .then(() => {
          this.getLinkPage();
        });
    },
    handleRemove(index) {
      this.records.splice(index, 1);
    },
    handleUpdate(row) {
      this.tableLoading = true;
      linkApi.updateLink(row)
        .then(() => {
          this.$message.success('保存成功');
          this.getLinkPage();
        })
        .catch(() => {
          this.$message.error('保存失败');
        }).then(() => {
          this.tableLoading = false;
        });
    },
    handleEdit(row) {
      if (row.isEdit === undefined) {
        this.$set(row, 'isEdit', true);
      } else {
        row.isEdit = true;
      }
    },
    handleCancel(row) {
      row.isEdit = false;
    },
    handleFilter() {
    }
  }
};
</script>

<style lang="scss">
.link {
  padding: 0 4px;

  .search-form {
    margin: 10px 0;
  }

  .table-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 36px;
    padding: 0 20px;
    margin: 10px 0;

    .table-toolbar-item {
      margin-right: 8px;
    }
  }

  .table-container {
    margin: 10px 0;
  }

  .table-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
  }
}
</style>
