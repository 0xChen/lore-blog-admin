import request from '@/utils/request';

const baseUrl = '/admin';

const systemApi = {
  getOptions() {
    return request({
      url: `${baseUrl}/options`,
      method: 'get'
    });
  },
  updateOptions(data) {
    return request({
      url: `${baseUrl}/options`,
      method: 'post',
      data
    });
  }
};

export default systemApi;
