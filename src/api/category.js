import request from '@/utils/request';

const baseUrl = '/admin';

const categoryApi = {
  getCategoryTree() {
    return request({
      url: `${baseUrl}/category/tree`,
      method: 'get'
    });
  },
  getCategory(name) {
    return request({
      url: `${baseUrl}/categories`,
      method: 'get',
      params: {
        name
      }
    });
  },
  updateCategory({ id, name }) {
    return request({
      url: `${baseUrl}/categories/${id}`,
      method: 'put',
      data: {
        name
      }
    });
  },
  saveCategory({ parentId, name }) {
    return request({
      url: `${baseUrl}/categories`,
      method: 'post',
      data: {
        parentId,
        name
      }
    });
  },
  deleteCategory({ id }) {
    return request({
      url: `${baseUrl}/categories/${id}`,
      method: 'delete'
    });
  }

};

export default categoryApi;
