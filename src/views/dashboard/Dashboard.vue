<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :lg="8">
        <el-card class="box-card" body-style="padding: 10px">
          <div slot="header">
            <div>最近文章</div>
            <el-carousel height="130px" :interval="2000" indicator-position="none">
              <el-carousel-item v-for="thumbnail in thumbnailList" :key="thumbnail">
                <el-image
                  :src="thumbnail"
                  fit="scale-down"
                  alt="文章封面"
                  placeholder="等待加载..."
                  @error="thumbnailLoadError"
                >
                  <template v-slot:error>
                    封面加载失败
                  </template>
                </el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
          <el-scrollbar ref="scrollbar">
            <div style="height: 300px; padding: 2px">
              <el-timeline>
                <el-timeline-item
                  v-for="(post, index) in postList"
                  :key="post.id"
                  :timestamp="post.createTime | timeFormat"
                  color="#0bbd87"
                >
                  <h1>{{`${index + 1}. ${post.title}`}}</h1>
                  <div style="text-align: right">
                    <svg-icon name="eye" class="icon"/>
                    {{post.readCount}}
                    <svg-icon name="comment" class="icon"/>
                    {{post.commentCount}}
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="box-card" body-style="padding: 10px">
          <div slot="header">
            <span>最新评论</span>
            <el-button
              type="text"
              @click="toggleCommentCollapse"
              style="float: right; padding: 3px 0"
            >
              {{expandedCommentIdList.length > 0 ? '折叠所有' : '展开所有'}}
            </el-button>
          </div>
          <el-scrollbar ref="scrollbar">
            <div style="height: 430px; padding: 2px">
              <el-collapse v-model="expandedCommentIdList">
                <el-collapse-item
                  v-for="(comment, index) in commentList"
                  :key="comment.id"
                  :name="comment.id"
                >
                  <template v-slot:title>
                    <div style="display:flex; width: 100%">
                      <h1>{{`${index + 1}. ${comment.authorName}`}}</h1>
                      <div style="flex: auto"></div>
                      <div>
                        <template v-if="comment.status === blogConst.COMMENT_STATUS_APPROVED">
                          <el-tag effect="dark" size="mini" class="tag-approved">已批准</el-tag>
                        </template>
                        <template
                          v-else-if="comment.status === blogConst.COMMENT_STATUS_UNAPPROVED">
                          <el-tag effect="dark" size="mini" class="tag-unapproved">未批准</el-tag>
                        </template>
                        <template v-else-if="comment.status === blogConst.COMMENT_STATUS_PENDING">
                          <el-tag effect="dark" size="mini" class="tag-padding">待批准</el-tag>
                        </template>
                        <template v-else>
                          <el-tag effect="dark" size="mini">未知状态</el-tag>
                        </template>
                      </div>
                    </div>
                  </template>
                  <div>{{comment.content}}</div>
                  <div style="text-align: right">
                    {{comment.createTime | timeFormat}}
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="box-card" body-style="padding: 10px">
          <div slot="header">
            <span>统计</span>
          </div>
          <el-divider content-position="left">
            <svg-icon name="FileText" class="statistics-icon"/>
            <span class="statistics-title">文章总数量:</span>
            <span class="statistics-num">{{statistics.posts}}</span>
          </el-divider>
          <el-divider content-position="left">
            <svg-icon name="comment" class="statistics-icon"/>
            <span class="statistics-title">评论总数量:</span>
            <span class="statistics-num">{{statistics.comments}}</span>
          </el-divider>
          <el-divider content-position="left">
            <svg-icon name="cloudUpload" class="statistics-icon"/>
            <span class="statistics-title">附件总数量:</span>
            <span class="statistics-num">{{statistics.attachments}}</span>
          </el-divider>
          <el-divider content-position="left">
            <svg-icon name="tags" class="statistics-icon"/>
            <span class="statistics-title">标签总数量:</span>
            <span class="statistics-num">{{statistics.tags}}</span>
          </el-divider>
          <el-divider content-position="left">
            <svg-icon name="folder" class="statistics-icon"/>
            <span class="statistics-title">分类总数量:</span>
            <span class="statistics-num">{{statistics.categories}}</span>
          </el-divider>
        </el-card>
        <el-card class="box-card" body-style="padding: 10px">
          <div slot="header">
            <span>标签</span>
          </div>
          <el-scrollbar ref="scrollbar">
            <div style="height: 430px; padding: 2px">
              <el-tag
                v-for="(tag, index) in tagSet"
                :key="index"
                size="mini"
                effect="light"
                style="color: #d9d6d6"
                :color="['#51a831', '#df5e88', '#f6ab6c', '#D4A87D', '#CB90DA']
                [Math.floor( Math.random() * 5 )]"
              >
                {{tag}}
              </el-tag>
            </div>
          </el-scrollbar>
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import dashboardApi from '@/api/dashboard';
import { blogConstMixin } from '@/utils/mixin';

export default {
  name: 'Dashboard',
  components: {},
  mixins: [blogConstMixin],
  data() {
    return {
      postList: [],
      commentList: [],
      tagSet: [],
      statistics: [],
      loadErrorThumbnailList: [],
      expandedCommentIdList: [],
      loading: false
    };
  },
  computed: {
    thumbnailList() {
      const thumbnailList = [];
      this.postList.forEach(post => {
        if (post.thumbnail
          && !thumbnailList.includes(post.thumbnail)
          && !this.loadErrorThumbnailList.includes(post.thumbnail)) {
          thumbnailList.push(post.thumbnail);
        }
      });
      return thumbnailList;
    },
    allCommentIdList() {
      const expandComments = [];
      this.commentList.forEach(comment => {
        expandComments.push(comment.id);
      });
      return expandComments;
    }
  },
  created() {
    this.getDashboard();
  },
  methods: {
    getDashboard() {
      this.loading = true;
      dashboardApi.getDashboard()
        .then(res => {
          const { data: { postList, commentList, tagSet, statistics } } = res;
          this.postList = postList;
          this.commentList = commentList;
          this.tagSet = tagSet;
          this.statistics = statistics;

          this.expandedCommentIdList = [...this.allCommentIdList];
        })
        .catch(() => {

        })
        .finally(() => {
          this.loading = false;
        });
    },
    thumbnailLoadError(error) {
      const { src } = error.path[0];
      const thumbnail = src.slice(src.indexOf('/file'));
      this.loadErrorThumbnailList.push(thumbnail);
    },
    toggleCommentCollapse() {
      if (this.expandedCommentIdList.length === 0) {
        this.expandedCommentIdList = [...this.allCommentIdList];
      } else {
        this.expandedCommentIdList = [];
      }
    }
  }
};
</script>

<style lang="scss">
.dashboard {
  height: 100%;
  width: 100%;
  padding: 0 10px;

  .statistics-icon {
    margin-right: 3px;
  }

  .statistics-title {
    display: inline-block;
    width: 75px;
    text-align: right;
  }

  .statistics-num {
    display: inline-block;
    margin-left: 6px;
  }

  .icon {
    padding: 0 2px 0 5px;
  }

  .el-tag + .el-tag {
    margin-left: 3px;
  }
}
</style>
