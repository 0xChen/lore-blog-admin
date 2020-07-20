import request from '@/utils/request';

const baseUrl = '/admin';

const themeApi = {
  getThemes() {
    return request({
      url: `${baseUrl}/themes`,
      method: 'get'
    });
  },
  getActiveTheme() {
    return request({
      url: `${baseUrl}/theme/active`,
      method: 'get'
    });
  },
  activateTheme(themeName) {
    return request({
      url: `${baseUrl}/themes/${themeName}/active`,
      method: 'put'
    });
  },
  getThemeSetting(themeName) {
    return request({
      url: `${baseUrl}/themes/${themeName}/setting`,
      method: 'get'
    });
  },
  saveThemeSetting(themeName, data) {
    return request({
      url: `${baseUrl}/themes/${themeName}/setting`,
      method: 'post',
      data
    });
  }
};

export default themeApi;
