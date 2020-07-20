import request from '@/utils/request';

const baseUrl = '/admin';

const commentApi = {
  getComment(id) {
    return request({
      url: `${baseUrl}/comments/${id}`,
      method: 'get'
    });
  },
  getCommentPage({ authorName, email, url, content, status, page, size }) {
    return request({
      url: `${baseUrl}/comments`,
      method: 'get',
      params: {
        authorName,
        email,
        url,
        content,
        status,
        page,
        size
      }
    });
  },
  replyComment(commentId, { content }) {
    return request({
      url: `${baseUrl}/comments/${commentId}/reply`,
      method: 'post',
      data: {
        content
      }
    });
  },
  approveComment(commentId, status) {
    return request({
      url: `${baseUrl}/comments/${commentId}/status`,
      method: 'put',
      data: {
        status
      }
    });
  },
  deleteComment(id) {
    return request({
      url: `${baseUrl}/comments/${id}`,
      method: 'delete'
    });
  },
  /**
   * 批量删除
   *
   * @param ids {Array}
   * @returns {AxiosPromise}
   */
  deleteCommentBatch(ids) {
    return request({
      url: `${baseUrl}/comments/${ids.join(',')}/batch`,
      method: 'delete'
    });
  },
  /**
   * 更新评论内容
   *
   * @param id
   * @param content
   * @return {AxiosPromise}
   */
  updateCommentContent(id, content) {
    return request({
      url: `${baseUrl}/comments/${id}/content`,
      method: 'put',
      data: {
        content
      }
    });
  }
};

export default commentApi;
