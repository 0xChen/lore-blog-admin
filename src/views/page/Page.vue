<template>
  <div class="page">
    <el-form
      label-position="right"
      label-width="80px"
      :model="page"
      status-icon
      :rules="pageRules"
      v-loading="loading"
      ref="pageForm"
    >
      <el-row>
        <el-col :lg="12" :md="24">
          <el-form-item label="页面标题" prop="title">
            <el-input placeholder="请输入页面标题(必须)" v-model="page.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24">
          <el-form-item label="缩略名称" prop="slug">
            <el-input placeholder="用于自定义访问路径" v-model="page.slug"></el-input>
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
          :value="page.content"
          :mode="vditorMode"
        />
        <div v-else style="height: 500px" v-loading.lock="loading"></div>
      </el-col>
    </el-row>
    <sticky :stickyBottom="0" class-name="bottom-toolbar">
      <el-row :gutter="2" type="flex" justify="start">
        <el-col :lg="3" :md="12">
          <el-radio-group v-model="page.commentStatus">
            <el-radio :label="systemConst.YES">允许评论</el-radio>
            <el-radio :label="systemConst.NO">关闭评论</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :lg="10" :md="12">
          发布时间
          <el-date-picker
            type="datetime"
            v-model="page.pubdate"
            value-format="timestamp"
            placeholder='默认点击"发布页面"按钮时的时间'
            size="small"
            style="width: 270px"
          >
          </el-date-picker>
        </el-col>
        <el-col :lg="11" :md="24">
          <div style="float: right">
            <el-button type="danger" size="small" v-if="id" @click="deletePage">
              删除页面
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="submitForm('pageForm', blogConst.POST_STATUS_DRAFT)"
            >
              存为草稿
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="submitForm('pageForm', blogConst.POST_STATUS_PUBLISH)"
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
import pageApi from '@/api/page';
import Sticky from '@/components/Sticky/Sticky.vue';

export default {
  name: 'PageEdit',
  components: {
    Vditor,
    Sticky
  },
  mixins: [blogConstMixin],
  props: ['id'],
  data() {
    return {
      page: {
        id: null,
        title: null,
        slug: null,
        thumbnail: null,
        content: null,
        status: null,
        contentType: null,
        commentStatus: null,
        pingStatus: null,
        pubdate: null,
        categoryId: null
      },
      pageRules: {
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
        }]
      },
      loading: false
    };
  },
  computed: {
    tableColumns() {
      return this.tableHead.filter(i => i.display);
    },
    vditorId() {
      return this.id ? `vditor-${this.id}` : 'vditor-page-create';
    },
    vditorMode() {
      switch (this.page.contentType) {
        case this.blogConst.POST_CONTENT_TYPE_MD:
          return 'sv';
        case this.blogConst.POST_CONTENT_TYPE_HTML:
          return 'wysiwyg';
        default:
          return 'sv';
      }
    }
  },
  created() {
    this.loading = true;
    if (this.id) {
      this.getPage(this.id);
    } else {
      this.page.status = this.blogConst.POST_STATUS_AUTO_DRAFT; // 自动草稿
      this.page.contentType = this.blogConst.POST_CONTENT_TYPE_MD; // markdown
      this.page.commentStatus = this.systemConst.YES; // 允许评论
      this.page.pingStatus = this.systemConst.YES; // 允许Ping
      this.page.categoryId = this.blogConst.CATEGORY_ROOT_ID;
      this.loading = false;
    }
  },
  methods: {
    getPage(id) {
      this.loading = true;
      pageApi.getPage(id)
        .then(res => {
          const { data } = res;
          this.page = data;
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
          this.page.status = status;
          const vditorMode = this.$refs.vditor.getCurrentMode();
          if (vditorMode === 'wysiwyg') {
            this.page.content = this.$refs.vditor.getHTML();
            this.page.contentType = this.blogConst.POST_CONTENT_TYPE_HTML;
          } else {
            this.page.content = this.$refs.vditor.getValue();
            this.page.contentType = this.blogConst.POST_CONTENT_TYPE_MD;
          }
          pageApi.saveOrUpdatePage(this.page)
            .then(res => {
              const { id, pubdate } = res.data;
              this.page.id = id;
              this.page.pubdate = pubdate;
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
    deletePage() {
      this.loading = true;
      pageApi.deletePage(this.page.id)
        .then(() => {
          this.$message.success('删除成功, 已跳转到 "页面管理" 功能');
          this.$router.push({
            name: 'PageList'
          });
        })
        .catch(() => {
          this.$message.error('删除失败');
        });
    }
  }
};
</script>

<style lang="scss">
.page {
  min-height: 100%;
  padding: 0 20px;

  .bottom-toolbar {
    background-color: #ffffff;
    margin-top: 5px;
    padding: 5px 0;
  }
}

</style>
