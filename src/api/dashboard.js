import request from '@/utils/request';

const baseUrl = '/admin';

const dashboardApi = {
  getDashboard() {
    return request({
      url: `${baseUrl}/dashboard`,
      method: 'get'
    });
  }
};

export default dashboardApi;
