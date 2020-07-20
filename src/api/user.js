import request from '@/utils/request';

const baseUrl = '/admin';

const userApi = {
  login(data) {
    return request({
      url: `${baseUrl}/login`,
      method: 'post',
      data
    });
  },
  logout() {
    return request({
      url: `${baseUrl}/logout`,
      method: 'post'
    });
  },
  updatePassword(data) {
    return request({
      url: `${baseUrl}/user/password`,
      method: 'put',
      data
    });
  },
  getProfile() {
    return request({
      url: `${baseUrl}/user/profile`,
      method: 'get'
    });
  },
  updateProfile(data) {
    return request({
      url: `${baseUrl}/user/profile`,
      method: 'put',
      data
    });
  }
};

export default userApi;
