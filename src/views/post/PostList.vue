<template>
  <div class="post-list">
    <div class="search-form">
      <el-row :gutter="4">
        <el-col :md="2" :sm="12">
          <el-input
            v-model="queryParam.tags"
            @keyup.enter.native="handleFilter"
            placeholder="标签"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="4" :sm="12">
          <el-select
            v-model="queryParam.categoryName"
            filterable
            remote
            placeholder="分类名称"
            :remote-method="getCategory"
            size="small"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :md="4" :sm="12">
          <el-input
            v-model="queryParam.title"
            @keyup.enter.native="handleFilter"
            placeholder="标题"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="3" :sm="8">
          <el-select
            v-model="queryParam.status"
            placeholder="发布状态"
            @change="handleFilter"
            size="small"
            clearable
          >
            <el-option
              label="已发布"
              :key="blogConst.POST_STATUS_PUBLISH"
              :value="blogConst.POST_STATUS_PUBLISH"
            />
            <el-option
              label="草稿"
              :key="blogConst.POST_STATUS_DRAFT"
              :value="blogConst.POST_STATUS_DRAFT"
            />
            <el-option
              label="自动草稿"
              :key="blogConst.POST_STATUS_AUTO_DRAFT"
              :value="blogConst.POST_STATUS_AUTO_DRAFT"
            />
            <el-option
              label="垃圾箱"
              :key="blogConst.POST_STATUS_TRASH"
              :value="blogConst.POST_STATUS_TRASH"
            />
          </el-select>
        </el-col>
        <el-col :md="4" :sm="12">
          <el-input
            v-model="queryParam.slug"
            @keyup.enter.native="handleFilter"
            placeholder="缩略名"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="7" :sm="12">
          <el-input
            v-model="queryParam.content"
            @keyup.enter.native="handleFilter"
            placeholder="页面内容"
            size="small"
            clearable
          />
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
        <svg-icon name="reload" @click.stop="getPostPage" class="table-toolbar-item"/>
      </el-tooltip>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click.stop="createPost"
      >
        添加新页面
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
      <div style="flex: auto"></div>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getPostPage"
        size="small"
      >
        搜索
      </el-button>
    </div>

    <div class="table-container">
      <el-table
        ref="postTable"
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
          :formatter="formatter"
          :align="column.align ? column.align : 'center'"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="right"
          min-width="160"
          fixed="right"
        >
          <template v-slot:default="{ row }">
            <el-button
              type="text"
              size="mini"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-popover
              title="选择新状态"
              placement="top"
              trigger="click"
            >
              <div style="text-align: right; margin: 0">
                <el-button
                  type="text"
                  size="mini"
                  @click="updatePostStatus(row, blogConst.POST_STATUS_PUBLISH)"
                >
                  已发布
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="updatePostStatus(row, blogConst.POST_STATUS_DRAFT)"
                >
                  草稿
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="updatePostStatus(row, blogConst.POST_STATUS_TRASH)"
                >
                  垃圾箱
                </el-button>
              </div>
              <el-button
                type="text"
                size="mini"
                slot="reference"
              >
                更改状态
              </el-button>
            </el-popover>
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
        </el-table-column>
      </el-table>
    </div>

    <div class="table-pagination">
      <pagination v-bind="pagination" @pagination="handlePagination"/>
    </div>

  </div>
</template>

<script type="text/jsx">
import { blogConstMixin } from '@/utils/mixin';
import { timeFormat } from '@/filters';
import postApi from '@/api/post';
import categoryApi from '@/api/category';
import DynamicColumn from '@/components/Table/DynamicColumn.vue';

export default {
  name: 'PostList',
  components: {
    DynamicColumn
  },
  mixins: [blogConstMixin],
  data() {
    return {
      records: [],
      tableHead: [
        {
          prop: 'title',
          label: '页面标题',
          width: 160,
          display: true
        },
        {
          prop: 'slug',
          label: '缩略名',
          width: 120,
          showOverflowTooltip: true,
          display: true
        },
        {
          prop: 'pubdate',
          label: '发布时间',
          width: 160,
          sortable: true,
          display: true
        },
        {
          prop: 'status',
          label: '发布状态',
          width: 100,
          display: true
        },
        {
          prop: 'tags',
          label: '标签',
          'header-align': 'center',
          align: 'left',
          width: 180,
          display: true
        },
        {
          prop: 'categoryName',
          label: '分类',
          width: 80,
          display: true
        },
        {
          prop: 'readCount',
          label: '浏览量',
          'header-align': 'center',
          align: 'right',
          width: 80,
          display: true
        },
        {
          prop: 'commentCount',
          label: '评论数量',
          'header-align': 'center',
          align: 'right',
          width: 80,
          display: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 160,
          sortable: true,
          display: true
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          width: 160,
          sortable: true,
          display: true
        }
      ],
      categories: [],
      queryParam: {
        title: '',
        slug: '',
        tags: '',
        categoryId: '',
        content: '',
        status: ''
      },
      pagination: {
        post: 1,
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
    this.getPostPage();
  },
  methods: {
    getPostPage() {
      this.tableLoading = true;
      postApi.getPostPage({ ...this.queryParam, ...this.pagination })
        .then(res => {
          const { data } = res;
          this.records = data.records;
          this.pagination.post = data.current;
          this.pagination.size = data.size;
          this.pagination.total = data.total;
        })
        .catch(() => {

        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlePagination(pagination) {
      this.pagination.post = pagination.post;
      this.pagination.size = pagination.size;
      this.getPostPage();
    },
    columnUpdate(columns) {
      this.tableHead = columns;
      this.$nextTick(() => {
        this.$refs.postTable.doLayout();
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
    formatter(row, column, cellValue) {
      let resultValue = cellValue;
      if (column.property === 'status') {
        let classStr;
        if (this.blogConst.POST_STATUS_TRASH === cellValue) {
          resultValue = '垃圾箱';
          classStr = 'tag-trash';
        } else if (this.blogConst.POST_STATUS_AUTO_DRAFT === cellValue) {
          resultValue = '自动草稿';
          classStr = 'tag-auto-draft';
        } else if (this.blogConst.POST_STATUS_DRAFT === cellValue) {
          resultValue = '草稿';
          classStr = 'tag-draft';
        } else if (this.blogConst.POST_STATUS_PUBLISH === cellValue) {
          resultValue = '已发布';
          classStr = 'tag-publish';
        } else {
          resultValue = '未知状态';
          classStr = 'tag-trash';
        }
        resultValue = (<el-tag effect="dark" size="medium" class={classStr}>{resultValue}</el-tag>);
      } else if (column.property === 'tags') {
        if (!cellValue) {
          return cellValue;
        }
        const tagList = cellValue.split(',');
        resultValue = [];
        tagList.forEach(tag => {
          resultValue.push(<el-tag effect="dark" size="mini"
                                   style="margin-right: 3px">{tag}</el-tag>);
        });
      } else if (column.property === 'pubdate'
        || column.property === 'createTime'
        || column.property === 'updateTime') {
        resultValue = timeFormat(cellValue);
      }
      return resultValue;
    },
    updatePostStatus(row, status) {
      postApi.updatePostStatus(row.id, status)
        .then(() => {
          this.$message.success('更新成功');
          row.status = status;
        })
        .catch(() => {
          this.$message.error('更新失败');
        })
        .then(() => {
        });
    },
    deleteBatch() {
      const selectRow = this.$refs.postTable.selection;
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
        postApi.deletePostBatch(deleteIds)
          .then(() => {
            this.$message.success('删除成功');
            this.getPostPage();
          })
          .catch(() => {
            this.$message.error('删除失败');
          })
          .then(() => {
            this.tableLoading = false;
          });
      }
    },
    handleDelete(row) {
      this.tableLoading = true;
      postApi.deletePost(row.id)
        .then(() => {
          this.$message.success('删除成功');
        })
        .catch(() => {
          this.$message.error('删除失败');
        })
        .then(() => {
          this.getPostPage();
        });
    },
    createPost() {
      this.$router.push({
        name: 'PostCreate',
        query: {
          t: new Date().getTime()
        }
      });
    },
    handleEdit({ id }) {
      this.$router.push({
        name: 'PostEdit',
        params: { id }
      });
    },
    handleCancel(row) {
      row.isEdit = false;
    },
    getCategory(name) {
      categoryApi.getCategory(name)
        .then(res => {
          const { data } = res;
          this.categories = data;
        });
    },
    handleFilter() {
    }
  }
};
</script>

<style lang="scss">
.post-list {
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

    .tag-trash {
      background-color: #fef0f0;
      border-color: #fde2e2;
      color: #f56c6c;
    }

    .tag-auto-draft {
      background-color: #f4f4f5;
      border-color: #e9e9eb;
      color: #909399;
    }

    .tag-draft {
      background-color: #ecf5ff;
      border-color: #d9ecff;
      color: #409eff;
    }

    .tag-publish {
      background-color: #f0f9eb;
      border-color: #e1f3d8;
      color: #67c23a;
    }
  }

  .table-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
  }
}
</style>
