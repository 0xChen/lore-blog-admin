import request from '@/utils/request';

const baseUrl = '/admin';

const attachmentApi = {
  imgSrcBaseUrl: '/files',
  getAttachment(id) {
    return request({
      url: `${baseUrl}/attachments/${id}`,
      method: 'get'
    });
  },
  getAttachmentPage({ name, originalName, type, description, page, size }) {
    return request({
      url: `${baseUrl}/attachments`,
      method: 'get',
      params: {
        name,
        originalName,
        type,
        description,
        page,
        size
      }
    });
  },
  uploadAttachment(elementUploadObj, attachment) {
    const formData = new FormData();
    if (attachment) {
      Object.keys(attachment).forEach(key => {
        if (attachment[key]) {
          formData.append(key, attachment[key]);
        }
      });
    }

    formData.append(
      elementUploadObj.filename,
      elementUploadObj.file,
      elementUploadObj.file.name
    );

    return request({
      url: `${baseUrl}/attachments`,
      method: 'post',
      timeout: 0,
      data: formData,
      onUploadProgress(e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        elementUploadObj.onProgress(e);
      }
    });
  },
  uploadAttachmentBatch(uploadList) {
    const formData = new FormData();
    uploadList.forEach((uploadObj, index) => {
      formData.append(
        `file${index}`,
        uploadObj.file,
        uploadObj.file.name
      );
    });

    return request({
      url: `${baseUrl}/attachment/batch`,
      method: 'post',
      timeout: 0,
      data: formData,
      onUploadProgress(e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        uploadList.forEach(uploadObj => {
          uploadObj.onProgress(e);
        });
      }
    });
  },
  deleteAttachment(id) {
    return request({
      url: `${baseUrl}/attachments/${id}`,
      method: 'delete'
    });
  },
  /**
   * 批量删除
   *
   * @param ids {Array}
   * @returns {AxiosPromise}
   */
  deleteAttachmentBatch(ids) {
    return request({
      url: `${baseUrl}/attachments/${ids.join(',')}/batch`,
      method: 'delete'
    });
  },
  /**
   * 更新附件内容
   *
   * @param id
   * @param originalName 原始文件名
   * @param description 附件描述
   * @param height 如果是图片就是其的高度
   * @param width 如果是图片就是其的宽度
   * @return {AxiosPromise}
   */
  updateAttachment({ id, originalName, description, height, width }) {
    return request({
      url: `${baseUrl}/attachments/${id}`,
      method: 'put',
      data: {
        id,
        originalName,
        description,
        height,
        width
      }
    });
  }
};

export default attachmentApi;
