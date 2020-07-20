<template>
  <div class="comment">
    <div class="search-form">
      <el-row :gutter="4">
        <el-col :md="9" :sm="12">
          <el-input
            v-model="queryParam.email"
            @keyup.enter.native="handleFilter"
            placeholder="评论者邮箱"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="9" :sm="12">
          <el-input
            v-model="queryParam.url"
            @keyup.enter.native="handleFilter"
            placeholder="评论者网址"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="6" :sm="12">
          <el-input
            v-model="queryParam.authorName"
            @keyup.enter.native="handleFilter"
            placeholder="评论者姓名"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="18" :sm="12">
          <el-input
            v-model="queryParam.content"
            @keyup.enter.native="handleFilter"
            placeholder="评论内容"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="6" :sm="8">
          <el-select
            v-model="queryParam.status"
            placeholder="评论状态"
            @change="handleFilter"
            size="small"
            clearable
            style="width: 100%"
          >
            <el-option
              label='已批准'
              :key="blogConst.COMMENT_STATUS_APPROVED"
              :value="blogConst.COMMENT_STATUS_APPROVED"
            />
            <el-option
              label="未批准"
              :key="blogConst.COMMENT_STATUS_UNAPPROVED"
              :value="blogConst.COMMENT_STATUS_UNAPPROVED"
            />
            <el-option
              label="待批准"
              :key="blogConst.COMMENT_STATUS_PENDING"
              :value="blogConst.COMMENT_STATUS_PENDING"
            />
          </el-select>
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
        <svg-icon name="reload" @click.stop.prevent="getCommentPage" class="table-toolbar-item"/>
      </el-tooltip>
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
        @click="getCommentPage"
        size="small"
      >
        搜索
      </el-button>
    </div>

    <div class="table-container">
      <el-table
        ref="commentTable"
        v-loading="tableLoading"
        :data="records"
        :row-key="rowKey"
        :border="true"
        :stripe="true"
        :row-style="rowStyle"
        empty-text="N/A"
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
            <template v-if="column.property === 'status'">
              <template v-if="row[column.property] === blogConst.COMMENT_STATUS_APPROVED">
                <el-tag effect="dark" size="medium" class="tag-approved">已批准</el-tag>
              </template>
              <template v-else-if="row[column.property] === blogConst.COMMENT_STATUS_UNAPPROVED">
                <el-tag effect="dark" size="medium" class="tag-unapproved">未批准</el-tag>
              </template>
              <template v-else-if="row[column.property] === blogConst.COMMENT_STATUS_PENDING">
                <el-tag effect="dark" size="medium" class="tag-padding">待批准</el-tag>
              </template>
              <template v-else>
                <el-tag effect="dark" size="medium">未知状态</el-tag>
              </template>
            </template>
            <template v-else-if="column.property === 'createTime'">
              {{ row[column.property] | timeFormat}}
            </template>
            <template v-else-if="row.isEdit">
              <template v-if="column.property === 'content'">
                <el-input
                  v-model="row[column.property]"
                  :placeholder="column.label"
                  type="textarea"
                  autosize
                  size="small"
                />
              </template>
              <template v-else>{{ row[column.property] }}</template>
            </template>
            <template v-else>{{ row[column.property] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="auto"
          min-width="200"
          fixed="right"
        >
          <template v-slot:default="{ row }">
            <template v-if="row.isEdit">
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
            <template v-else>
              <template v-if="row.status === blogConst.COMMENT_STATUS_APPROVED">
                <el-button
                  type="text"
                  size="mini"
                  @click="handleApprove(row, blogConst.COMMENT_STATUS_UNAPPROVED)"
                >
                  驳回
                </el-button>
              </template>
              <template v-else-if="row.status === blogConst.COMMENT_STATUS_UNAPPROVED">
                <el-button
                  type="text"
                  size="mini"
                  @click="handleApprove(row, blogConst.COMMENT_STATUS_APPROVED)"
                >
                  批准
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleApprove(row, blogConst.COMMENT_STATUS_UNAPPROVED)"
                >
                  驳回
                </el-button>
              </template>
              <template
                v-else-if="row.status === blogConst.COMMENT_STATUS_PENDING"
              >
                <el-button
                  type="text"
                  size="mini"
                  @click="handleApprove(row, blogConst.COMMENT_STATUS_APPROVED)"
                >
                  批准
                </el-button>
              </template>
              <el-button
                type="text"
                size="mini"
                @click="displayReplyForm(row)"
              >
                回复
              </el-button>
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

    <el-dialog title="回复评论" :visible="replyFormVisible" @close="replyFormVisible = false">
      <el-form :model="replyForm">
        <el-form-item>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="输入回复内容"
            v-model="replyForm.content"
            autocomplete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div>
          <el-button @click="replyFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleReply"
            :loading="replyFormButtonLoading"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import commentApi from '@/api/comment';
import { blogConstMixin } from '@/utils/mixin';
import DynamicColumn from '@/components/Table/DynamicColumn.vue';

export default {
  name: 'Comment',
  components: {
    DynamicColumn
  },
  mixins: [blogConstMixin],
  data() {
    return {
      records: [],
      tableHead: [
        {
          prop: 'content',
          label: '评论内容',
          width: 300,
          showOverflowTooltip: true,
          display: true
        },
        {
          prop: 'authorName',
          label: '评论者',
          sortable: true,
          width: 120,
          display: true
        },
        {
          prop: 'createTime',
          label: '评论时间',
          align: 'right',
          width: 160,
          sortable: true,
          display: true
        },
        {
          prop: 'status',
          label: '评论状态',
          sortable: true,
          width: 120,
          display: true
        },
        {
          prop: 'email',
          label: '评论者电子邮箱',
          showOverflowTooltip: true,
          width: 120,
          display: true
        },
        {
          prop: 'url',
          label: '评论者网址',
          showOverflowTooltip: true,
          width: 160,
          display: true
        },
        {
          prop: 'ip',
          label: '评论者IP',
          width: 120,
          display: true
        },
        {
          prop: 'agent',
          label: '评论者Agent',
          showOverflowTooltip: true,
          width: 180,
          display: true
        }
      ],
      queryParam: {
        email: '',
        url: '',
        authorName: '',
        content: '',
        status: ''
      },
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      replyForm: {
        parentId: null,
        content: null
      },
      replyFormVisible: false,
      tableLoading: false,
      replyFormButtonLoading: false
    };
  },
  computed: {
    tableColumns() {
      return this.tableHead.filter(i => i.display);
    }
  },
  created() {
    this.getCommentPage();
  },
  methods: {
    getCommentPage() {
      this.tableLoading = true;
      commentApi.getCommentPage({ ...this.queryParam, ...this.pagination })
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
      this.getCommentPage();
    },
    columnUpdate(columns) {
      this.tableHead = columns;
      this.$nextTick(() => {
        this.$refs.commentTable.doLayout();
      });
    },
    rowKey(row) {
      return row.id;
    },
    deleteBatch() {
      const selectRow = this.$refs.commentTable.selection;
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
        commentApi.deleteCommentBatch(deleteIds)
          .then(() => {
            this.$message.success('删除成功');
          })
          .catch(() => {
            this.$message.error('删除失败');
          })
          .then(() => {
            this.getCommentPage();
          });
      }
    },
    handleSave(row) {
      this.tableLoading = true;
      commentApi.replyComment(row.id, row)
        .then(() => {
          this.$message.success('保存成功');
          this.getCommentPage();
        }).catch(() => {
          this.$message.error('保存失败');
        }).then(() => {
          this.tableLoading = false;
        });
    },
    handleDelete(row) {
      this.tableLoading = true;
      commentApi.deleteComment(row.id)
        .then(() => {
          this.$message.success('删除成功');
        })
        .catch(() => {
          this.$message.error('删除失败');
        })
        .then(() => {
          this.getCommentPage();
        });
    },
    handleRemove(index) {
      this.records.splice(index, 1);
    },
    handleUpdate(row) {
      this.tableLoading = true;
      commentApi.updateCommentContent(row.id, row.content)
        .then(() => {
          this.$message.success('保存成功');
          this.getCommentPage();
        })
        .catch(() => {
          this.$message.error('保存失败');
        })
        .then(() => {
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
    displayReplyForm(row) {
      this.replyForm.parentId = row.id;
      this.replyFormVisible = true;
    },
    handleReply() {
      this.replyFormButtonLoading = true;
      commentApi.replyComment(this.replyForm.parentId, this.replyForm)
        .then(() => {
          this.$message.success('回复成功');
          this.replyForm.content = null;
          this.replyFormVisible = false;
          this.getCommentPage();
        })
        .catch(() => {
          this.$message.error('回复失败');
        })
        .then(() => {
          this.replyFormButtonLoading = false;
        });
    },
    handleApprove(row, status) {
      this.tableLoading = true;
      commentApi.approveComment(row.id, status)
        .then(() => {
          this.$message.success('审批成功');
          this.getCommentPage();
        })
        .catch(() => {
          this.$message.error('审批失败');
        })
        .then(() => {
          this.tableLoading = false;
        });
    },
    handleCancel(row) {
      row.isEdit = false;
    },
    handleFilter() {
    },
    rowStyle({ row }) {
      if (row.status === this.blogConst.COMMENT_STATUS_UNAPPROVED) {
        return {
          backgroundColor: '#fef0f0'
        };
      }
      return null;
    }
  }
};
</script>

<style lang="scss">
.comment {
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

    .tag-approved {
      background-color: #f0f9eb;
      border-color: #e1f3d8;
      color: #67c23a;
    }

    .tag-padding {
      background-color: #fdf6ec;
      border-color: #faecd8;
      color: #e6a23c;
    }

    .tag-unapproved {
      background-color: #fef0f0;
      border-color: #fde2e2;
      color: #f56c6c;
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
