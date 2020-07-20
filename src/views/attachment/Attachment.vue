<template>
  <div class="attachment">
    <div class="attachment-search-form">
      <el-row :gutter="4">
        <el-col :md="4" :sm="12">
          <el-input
            v-model="queryParam.name"
            @keyup.enter.native="handleFilter"
            placeholder="文件名"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="4" :sm="12">
          <el-input
            v-model="queryParam.originalName"
            @keyup.enter.native="handleFilter"
            placeholder="原始文件名"
            size="small"
            clearable
          />
        </el-col>
        <el-col :md="3" :sm="8">
          <el-input
            v-model="queryParam.type"
            @keyup.enter.native="handleFilter"
            placeholder="类型"
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
        <el-col :md="2" :sm="4">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getAttachmentPage"
            size="small"
          >
            搜索
          </el-button>
        </el-col>
        <el-col :md="3" :sm="4">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            @click="drawer = true"
            size="small"
          >
            上传新附件
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="attachment-list">
      <div class="attachment-list--picture-card">
        <div
          class="attachment-list__item"
          v-for="(attachment, index) in attachmentList"
          :key="attachment.id"
          :title="attachment.originalName"
        >
          <div style="width: 100%; height: 100%">
            <el-image
              class="attachment-list__item-thumbnail"
              :ref="`image-${index}`"
              :src="`${imgSrcBaseUrl}/${attachment.name}`"
              :alt="attachment.originalName"
              fit="scale-down"
              :preview-src-list="attachmentPreviewList"
            >
            </el-image>
            <span class="attachment-list__item-actions">
              <span class="attachment-list__item-operator" @click="handleCopyUrl(attachment.name)">
                <el-tooltip content="复制文件链接" placement="top">
                  <svg-icon name="CopyOutlined"></svg-icon>
                </el-tooltip>
              </span>
              <span class="attachment-list__item-operator" @click="handlePreviewList(index)">
                <el-tooltip content="查看大图" placement="top">
                  <svg-icon name="ZoomInOutlined"></svg-icon>
                </el-tooltip>
              </span>
              <span class="attachment-list__item-operator" @click="handleDownload(attachment.name)">
                <el-tooltip content="下载" placement="top">
                  <svg-icon name="CloudDownloadOutlined"></svg-icon>
                </el-tooltip>
              </span>
              <span class="attachment-list__item-operator">
                <el-tooltip content="删除" placement="top">
                  <el-popconfirm
                    hideIcon
                    placement="top"
                    title="确定删除？"
                    @onConfirm="handleDelete(attachment.id)"
                  >
                    <template v-slot:reference>
                      <svg-icon name="DeleteOutlined"></svg-icon>
                    </template>
                  </el-popconfirm>
                </el-tooltip>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="attachment-pagination">
      <pagination v-bind="pagination" @pagination="handlePagination"/>
    </div>
    <el-drawer
      :visible="drawer"
      size="380"
      direction="rtl"
      :wrapper-closable="true"
      :append-to-body="false"
      :show-close="true"
      @close="handleDrawerClose"
    >
      <template v-slot:title>
        <span>上传附件</span>
      </template>
      <div class="drawer-content">
        <div class="attachment-upload">
          <el-upload
            ref="upload"
            action=""
            drag
            multiple
            :limit="limit"
            :auto-upload="false"
            :http-request="upload"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            :on-change="handleChange"
            list-type="picture"
          >
            <svg-icon name="cloudUpload" class="upload-icon"/>
            <div class="el-upload__text">将文件拖到此处，或点击选取文件</div>
            <template v-slot:tip>
              <div class="el-upload__tip">
                单个文件限制 500MB，最多同时上传 10 个文件, 但总大小不得超过 2GB
              </div>
            </template>
          </el-upload>
        </div>
      </div>
      <div class="drawer-footer">
        <el-button
          type="primary"
          size="small"
          @click="submitUpload"
          :loading="buttonLoading"
        >
          {{ buttonLoading ? '上传中 ...' : '上 传' }}
        </el-button>
        <el-button type="danger" size="small" @click="clearFiles">清 空</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import attachmentApi from '@/api/attachment';

export default {
  name: 'Attachment',
  data() {
    return {
      imgSrcBaseUrl: attachmentApi.imgSrcBaseUrl,
      uploadList: [],
      limit: 10,
      attachmentList: [],
      attachmentPreviewList: [],
      queryParam: {
        name: '',
        originalName: '',
        type: '',
        description: ''
      },
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      drawer: false,
      buttonLoading: false,
      loading: false
    };
  },
  methods: {
    getAttachmentPage() {
      this.loading = true;
      attachmentApi.getAttachmentPage({ ...this.queryParam, ...this.pagination })
        .then(res => {
          const { data } = res;
          this.attachmentList = data.records;
          this.pagination.page = data.current;
          this.pagination.size = data.size;
          this.pagination.total = data.total;
        })
        .catch(() => {

        })
        .then(() => {
          this.loading = false;
        });
    },
    handlePagination(pagination) {
      this.pagination.page = pagination.page;
      this.pagination.size = pagination.size;
      this.getAttachmentPage();
    },
    submitUpload() {
      this.$refs.upload.submit();
      if (this.uploadList.length === 0) {
        this.$message.info('没有需要上传的文件');
        return;
      }
      this.buttonLoading = true;
      attachmentApi.uploadAttachmentBatch(this.uploadList)
        .then(res => {
          this.$message.success('上传成功');
          this.uploadList.forEach(file => file.onSuccess(res));
        })
        .catch(error => {
          this.$message.error('上传失败');
          this.uploadList.forEach(file => file.onError(error));
        })
        .then(() => {
          this.buttonLoading = false;
          this.uploadList = [];
        });
    },
    upload(elementUploadObj) {
      this.uploadList.push(elementUploadObj);
    },
    handleExceed() {
      this.$message.error('添加失败, 超出上传文件数量限制. ');
    },
    handlePreview(file) {
      if (file.status === 'ready') {
        // TODO: 剪裁图片
      }
      console.dir(file);
    },
    handleChange(file, fileList) {
      // 将最后添加的文件调整到列表中的首位
      if (file.status === 'ready') {
        fileList.unshift(fileList.pop());
      }
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    handlePreviewList(index) {
      this.attachmentPreviewList = [];
      for (let i = 0; i < this.attachmentList.length; i++) {
        let j = i + index;
        if (j >= this.attachmentList.length) {
          j -= this.attachmentList.length;
        }
        const url = `${this.imgSrcBaseUrl}/${this.attachmentList[i].name}`;
        this.attachmentPreviewList.push(url);
      }

      this.$refs[`image-${index}`][0].clickHandler();
    },
    handleDownload(attachmentName) {
      window.location.href = `${this.imgSrcBaseUrl}/${attachmentName}`;
    },
    handleDelete(attachmentId) {
      attachmentApi.deleteAttachment(attachmentId)
        .then(() => {
          this.$message.success('删除成功');
          this.getAttachmentPage();
        })
        .catch(() => {
          this.$message.error('删除失败');
        })
        .then(() => {
        });
    },
    handleCopyUrl(attachmentName) {
      this.$copyText(`${this.imgSrcBaseUrl}/${attachmentName}`)
        .then(() => {
          this.$message.success(`复制成功: ${this.imgSrcBaseUrl}/${attachmentName}`);
        })
        .catch(() => {
          this.$message.success('复制失败');
        });
    },
    handleDrawerClose() {
      this.drawer = false;
    },
    handleFilter() {

    }
  },
  created() {
    this.getAttachmentPage();
  }
};
</script>

<style lang="scss">
.attachment {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 4px;

  .attachment-search-form {
    margin: 10px 0;
  }

  .attachment-list {
    flex: auto;
    margin: 0;
    padding: 0;
    list-style: none;

    .attachment-list--picture-card {
      display: flex;
      margin: 0;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      vertical-align: top;

      .attachment-list__item {
        display: inline-block;
        position: relative;
        overflow: hidden;
        font-size: 14px;
        color: #606266;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        width: auto;
        height: 108px;
        line-height: 1.8;
        margin: 0 8px 8px 0;
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
        box-sizing: border-box;

        &:hover {
          background-color: #f5f7fa
        }
      }

      .attachment-list__item-thumbnail {
        display: block;
        width: 100%;
        height: 100%;

        img {
          width: auto;
        }
      }

      .attachment-list__item-actions {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;

        &::after {
          display: inline-block;
          content: "";
          height: 100%;
          vertical-align: middle
        }

        &:hover {
          opacity: 1;

          span {
            display: inline-block;
          }
        }

        span {
          display: none;
          cursor: pointer;
        }

        span + span {
          margin-left: 15px;
        }
      }

      .attachment-list__item-operator {
        position: static;
        top: 0;
        right: 10px;
        font-size: inherit;
        color: inherit;

        &:hover {
          color: #409EFF
        }
      }
    }
  }

  .attachment-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
  }

  /* upload drawer */
  .el-drawer__body {
    overflow: auto;
  }

  .drawer-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 38px);

    .attachment-upload {
      /* el-upload 有个固定360px 的宽度, 所以不能小于360px */
      width: 380px;
      flex: 1;
      overflow: auto;
      padding: 5px 20px;

      .upload-icon {
        font-size: 67px;
        color: #C0C4CC;
        margin: 40px 0 16px;
        line-height: 50px;
      }
    }
  }

  .drawer-footer {
    display: flex;
    padding: 0 20px;

    button {
      flex: 1;
    }
  }
}
</style>
