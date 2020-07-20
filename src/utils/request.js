import Vue from 'vue';
import axios from 'axios';
import store from '@/store';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: process.env.NODE_ENV === 'development' ? 0 : 1000 * 60 * 3
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    // 退出登陆时后台返回的内容没有 response.data
    if (response.status === 200 && !response.data) {
      return {};
    }
    const res = response.data;

    // 业务异常的统一处理
    if (res.status === 600) {
      Vue.prototype.$message.error(res.message);
    }

    if (res.status === 511) {
      Vue.prototype.$confirm('需要重新登录.', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          window.location.reload();
        });
      });
    }

    if (res.status >= 500 && res.status <= 599) {
      Vue.prototype.$message({
        message: res.message || '服务器发生错误',
        type: 'error',
        duration: 5 * 1000
      });
    }

    if (!res.success) {
      return Promise.reject(new Error(res.message || '操作失败'));
    }

    return res;
  },
  error => {
    // 服务器异常的统一处理
    let needPrint = false;
    let errorMessage;
    if (error.response) {
      const { status, message } = error.response.data;

      if (status === 403) {
        errorMessage = '没有操作权限';
        needPrint = true;
      } else if (status === 404) {
        errorMessage = '404 Not Found';
        needPrint = true;
      } else {
        errorMessage = message;
      }
    } else {
      errorMessage = error.message;
    }

    Vue.prototype.$message({
      message: errorMessage,
      type: 'error',
      showClose: true,
      duration: 0
    });

    if (needPrint) {
      console.dir(error);
    }
    return Promise.reject(error);
  }
);

export default service;
