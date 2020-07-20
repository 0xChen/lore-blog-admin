import request from '@/utils/request';
import { blogConst } from '@/utils/constant';

const baseUrl = '/admin';

const pageApi = {
  getPage(id) {
    return request({
      url: `${baseUrl}/pages/${id}`,
      method: 'get'
    });
  },
  getPagePage({ title, slug, content, status, page, size }) {
    return request({
      url: `${baseUrl}/pages`,
      method: 'get',
      params: {
        title,
        slug,
        content,
        status,
        type: blogConst.POST_TYPE_PAGE,
        page,
        size
      }
    });
  },
  saveOrUpdatePage({
    id,
    title,
    slug,
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
      url: `${baseUrl}/pages`,
      method,
      data: {
        id,
        title,
        slug,
        thumbnail,
        content,
        status,
        type: blogConst.POST_TYPE_PAGE,
        contentType,
        commentStatus,
        pingStatus,
        pubdate,
        categoryId
      }
    });
  },
  updatePage({
    id,
    title,
    slug,
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
      url: `${baseUrl}/pages/${id}`,
      method: 'put',
      data: {
        id,
        title,
        slug,
        thumbnail,
        content,
        status,
        type: blogConst.POST_TYPE_PAGE,
        contentType,
        commentStatus,
        pingStatus,
        pubdate,
        categoryId
      }
    });
  },
  updatePageStatus(id, status) {
    return request({
      url: `${baseUrl}/pages/${id}/status`,
      method: 'put',
      data: {
        status
      }
    });
  },
  deletePage(id) {
    return request({
      url: `${baseUrl}/pages/${id}`,
      method: 'delete'
    });
  },
  /**
   * 批量删除
   *
   * @param ids {Array}
   * @returns {AxiosPromise}
   */
  deletePageBatch(ids) {
    return request({
      url: `${baseUrl}/pages/${ids.join(',')}/batch`,
      method: 'delete'
    });
  }
};

export default pageApi;
