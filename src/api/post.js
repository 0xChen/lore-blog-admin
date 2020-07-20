import request from '@/utils/request';
import { blogConst } from '@/utils/constant';

const baseUrl = '/admin';

const postApi = {
  getPost(id) {
    return request({
      url: `${baseUrl}/posts/${id}`,
      method: 'get'
    });
  },
  getPostPage({ title, slug, tags, categoryId, content, status, post, size }) {
    return request({
      url: `${baseUrl}/posts`,
      method: 'get',
      params: {
        title,
        slug,
        tags,
        categoryId,
        content,
        status,
        type: blogConst.POST_TYPE_POST,
        post,
        size
      }
    });
  },
  saveOrUpdatePost({
    id,
    title,
    slug,
    tags,
    thumbnail,
    content,
    status,
    contentType,
    commentStatus,
    pingStatus,
    pubdate,
    categoryId
  }) {
    let method;
    if (id) {
      method = 'put';
    } else {
      method = 'post';
    }
    return request({
      url: `${baseUrl}/posts`,
      method,
      data: {
        id,
        title,
        slug,
        tags,
        thumbnail,
        content,
        status,
        type: blogConst.POST_TYPE_POST,
        contentType,
        commentStatus,
        pingStatus,
        pubdate,
        categoryId
      }
    });
  },
  updatePost({
    id,
    title,
    slug,
    tags,
    thumbnail,
    content,
    status,
    contentType,
    commentStatus,
    pingStatus,
    pubdate,
    categoryId
  }) {
    return request({
      url: `${baseUrl}/posts/${id}`,
      method: 'put',
      data: {
        id,
        title,
        slug,
        tags,
        thumbnail,
        content,
        status,
        type: blogConst.POST_TYPE_POST,
        contentType,
        commentStatus,
        pingStatus,
        pubdate,
        categoryId
      }
    });
  },
  updatePostStatus(id, status) {
    return request({
      url: `${baseUrl}/posts/${id}/status`,
      method: 'put',
      data: {
        status
      }
    });
  },
  deletePost(id) {
    return request({
      url: `${baseUrl}/posts/${id}`,
      method: 'delete'
    });
  },
  /**
   * 批量删除
   *
   * @param ids {Array}
   * @returns {AxiosPromise}
   */
  deletePostBatch(ids) {
    return request({
      url: `${baseUrl}/posts/${ids.join(',')}/batch`,
      method: 'delete'
    });
  }
};

export default postApi;
