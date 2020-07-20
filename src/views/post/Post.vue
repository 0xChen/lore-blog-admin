<template>
  <div class="post">
    <el-form
      label-position="right"
      label-width="80px"
      :model="post"
      status-icon
      :rules="postRules"
      v-loading="loading"
      ref="postForm"
    >
      <el-row>
        <el-col :lg="12" :md="24">
          <el-form-item label="文章标题" prop="title">
            <el-input placeholder="请输入文章标题(必须)" v-model="post.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24">
          <el-form-item label="缩略名称" prop="slug">
            <el-input placeholder="用于自定义访问路径" v-model="post.slug"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :md="24">
          <el-form-item label="文章标签" prop="tags">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag)"
              :type="['success', 'info', 'warning', 'danger'][Math.floor( Math.random() * 4 )]"
            >
              {{tag}}
            </el-tag>
            <el-input
              ref="tagInput"
              class="input-new-tag"
              v-if="tagInputVisible"
              v-model="tagInputValue"
              size="small"
              @keyup.enter.native="tagInputConfirm"
              @blur="tagInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showTagInput">
              + 新标签
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24">
          <el-form-item label="文章分类" prop="categoryId">
            <el-cascader
              v-model="post.categoryId"
              :options="categories"
              :props="categoryProps"
              clearable
              filterable
              :show-all-levels="false"
              placeholder="选择文章分类"
            >
              <template slot-scope="{ node, data }">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :md="24">
          <el-form-item label="封面图片" prop="thumbnail">
            <el-input placeholder="请输入封面图片地址" v-model="post.thumbnail">
              <template v-slot:suffix>
                <svg-icon name="PictureOutlined" style="line-height: 40px"/>
              </template>
              <template v-slot:append>
                <el-button @click="previewThumbnail">预览</el-button>
                <el-dialog
                  title="封面预览"
                  :visible="previewThumbnailDialogVisible"
                  @close="previewThumbnailDialogVisible = false"
                >
                  <div :style="previewThumbnailStyle"></div>
                </el-dialog>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col>
        <vditor
          v-if="!loading"
          ref="vditor"
          :id="vditorId"
          :value="post.content"
          :mode="vditorMode"
        />
        <div v-else style="height: 500px" v-loading.lock="loading"></div>
      </el-col>
    </el-row>
    <sticky :stickyBottom="0" class-name="bottom-toolbar">
      <el-row :gutter="2" type="flex" justify="start">
        <el-col :lg="3" :md="12">
          <el-radio-group v-model="post.commentStatus">
            <el-radio :label="systemConst.YES">允许评论</el-radio>
            <el-radio :label="systemConst.NO">关闭评论</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :lg="10" :md="12">
          发布时间
          <el-date-picker
            type="datetime"
            v-model="post.pubdate"
            value-format="timestamp"
            placeholder='默认点击"发布页面"按钮时的时间'
            size="small"
            style="width: 270px"
          >
          </el-date-picker>
        </el-col>
        <el-col :lg="11" :md="24">
          <div style="float: right">
            <el-button type="danger" size="small" v-if="id" @click="deletePost">
              删除页面
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="submitForm('postForm', blogConst.POST_STATUS_DRAFT)"
            >
              存为草稿
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="submitForm('postForm', blogConst.POST_STATUS_PUBLISH)"
            >
              发布页面
            </el-button>
          </div>
        </el-col>
      </el-row>
    </sticky>
  </div>
</template>

<script>
import Vditor from '@/components/Vditor/Vditor.vue';
import { blogConstMixin } from '@/utils/mixin';
import postApi from '@/api/post';
import categoryApi from '@/api/category';
import Sticky from '@/components/Sticky/Sticky.vue';

export default {
  name: 'PostEdit',
  components: {
    Vditor,
    Sticky
  },
  mixins: [blogConstMixin],
  props: ['id'],
  data() {
    return {
      post: {
        id: null,
        title: null,
        slug: null,
        tags: null,
        categoryId: null,
        categoryName: null,
        thumbnail: null,
        content: null,
        status: null,
        contentType: null,
        commentStatus: null,
        pingStatus: null,
        pubdate: null
      },
      postRules: {
        title: [
          {
            max: 200,
            rigger: 'blur',
            message: '标题长度不能超过 200 个字符'
          },
          {
            required: true,
            message: '标题必填',
            trigger: 'blur'
          }
        ],
        slug: [{
          max: 300,
          trigger: 'blur',
          message: '缩略名长度不能超过 300 个字符'
        }],
        categoryId: [
          {
            required: true,
            message: '必选选择一个分类',
            trigger: 'blur'
          }
        ],
        thumbnail: [
          {
            max: 255,
            trigger: 'blur',
            message: '封面图片链接不能超过 255 个字符'
          }
        ]
      },
      categories: [],
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      dynamicTags: [],
      tagInputVisible: false,
      tagInputValue: '',
      previewThumbnailDialogVisible: false,
      loading: false
    };
  },
  watch: {
    dynamicTags(val) {
      this.post.tags = val.join(',');
    }
  },
  computed: {
    tableColumns() {
      return this.tableHead.filter(i => i.display);
    },
    vditorId() {
      return this.id ? `vditor-${this.id}` : 'vditor-post-create';
    },
    vditorMode() {
      switch (this.post.contentType) {
        case this.blogConst.POST_CONTENT_TYPE_MD:
          return 'sv';
        case this.blogConst.POST_CONTENT_TYPE_HTML:
          return 'wysiwyg';
        default:
          return 'sv';
      }
    },
    previewThumbnailStyle() {
      return {
        backgroundImage: `url(${this.post.thumbnail})`,
        minHeight: ' 260px',
        borderRadius: '5px',
        backgroundPosition: '50% 50%',
        backgroundSize: 'cover',
        boxShadow: '0 1px 4px rgba(0, 0, 0, .04)'
      };
    }
  },
  created() {
    this.loading = true;
    if (this.id) {
      this.getPost(this.id);
    } else {
      this.post.status = this.blogConst.POST_STATUS_AUTO_DRAFT; // 自动草稿
      this.post.contentType = this.blogConst.POST_CONTENT_TYPE_MD; // markdown
      this.post.commentStatus = this.systemConst.YES; // 允许评论
      this.post.pingStatus = this.systemConst.YES; // 允许Ping
      this.loading = false;
    }
    categoryApi.getCategoryTree()
      .then(res => {
        this.categories = res.data;
      })
      .catch(error => {
        console.dir(error);
        this.$confirm('获取分类数据失败, 是否重新获取?', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.getCategoryTree();
        }).catch(() => {
        });
      });
  },
  methods: {
    getPost(id) {
      this.loading = true;
      postApi.getPost(id)
        .then(res => {
          const { data } = res;
          this.post = data;

          if (this.post.tags) {
            this.dynamicTags = this.post.tags.split(',');
          }
        })
        .catch(() => {

        })
        .then(() => {
          this.loading = false;
        });
    },
    submitForm(formName, status) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // do submit
          this.post.status = status;
          const vditorMode = this.$refs.vditor.getCurrentMode();
          if (vditorMode === 'wysiwyg') {
            this.post.content = this.$refs.vditor.getHTML();
            this.post.contentType = this.blogConst.POST_CONTENT_TYPE_HTML;
          } else {
            this.post.content = this.$refs.vditor.getValue();
            this.post.contentType = this.blogConst.POST_CONTENT_TYPE_MD;
          }
          postApi.saveOrUpdatePost(this.post)
            .then(res => {
              const { id, pubdate } = res.data;
              this.post.id = id;
              this.post.pubdate = pubdate;
              this.$message.success('保存成功');
            })
            .catch(() => {
              this.$message.success('保存失败');
            });
        } else {
          // handle error
          return false;
        }
        return true;
      });
    },
    deletePost() {
      this.loading = true;
      postApi.deletePost(this.post.id)
        .then(() => {
          this.$message.success('删除成功, 已跳转到 "页面管理" 功能');
          this.$router.push({
            name: 'PostList'
          });
        })
        .catch(() => {
          this.$message.error('删除失败');
        });
    },
    deleteTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showTagInput() {
      this.tagInputVisible = true;
      this.$nextTick(() => {
        this.$refs.tagInput.$refs.input.focus();
      });
    },
    tagInputConfirm() {
      if (this.tagInputValue) {
        this.dynamicTags.push(this.tagInputValue);
      }
      this.tagInputVisible = false;
      this.tagInputValue = '';
    },
    previewThumbnail() {
      if (this.post.thumbnail) {
        this.previewThumbnailDialogVisible = true;
      }
    }
  }
};
</script>

<style lang="scss">
.post {
  min-height: 100%;
  padding: 0 20px;

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .bottom-toolbar {
    background-color: #ffffff;
    margin-top: 5px;
    padding: 5px 0;
  }
}

</style>
