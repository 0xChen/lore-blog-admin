import request from '@/utils/request';

const baseUrl = '/admin';

const linkApi = {
  getLink(id) {
    return request({
      url: `${baseUrl}/links/${id}`,
      method: 'get'
    });
  },
  getLinkPage({ name, url, description, visible, page, size }) {
    return request({
      url: `${baseUrl}/links`,
      method: 'get',
      params: {
        name,
        url,
        description,
        visible,
        page,
        size
      }
    });
  },
  saveLink({ id, name, url, sort, description, visible }) {
    return request({
      url: `${baseUrl}/links`,
      method: 'post',
      data: {
        id,
        name,
        url,
        sort,
        description,
        visible
      }
    });
  },
  deleteLink(id) {
    return request({
      url: `${baseUrl}/links/${id}`,
      method: 'delete'
    });
  },
  /**
   * 批量删除
   *
   * @param ids {Array}
   * @returns {AxiosPromise}
   */
  deleteLinkBatch(ids) {
    return request({
      url: `${baseUrl}/links/${ids.join(',')}/batch`,
      method: 'delete'
    });
  },
  updateLink({ id, name, url, sort, description, visible }) {
    return request({
      url: `${baseUrl}/links/${id}`,
      method: 'put',
      data: {
        id,
        name,
        url,
        sort,
        description,
        visible
      }
    });
  }

};

export default linkApi;
