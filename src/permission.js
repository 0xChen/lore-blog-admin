import Vue from 'vue';
import NProgress from 'nprogress';
import { getPageTitle } from '@/utils/dom';

import router from './router';
import store from './store';

const whiteList = ['/login', '/auth-redirect'];

router.beforeEach(async (to, from, next) => {
  // set page title
  document.title = getPageTitle(to.meta.title);

  // 根据token判断是否已经登录
  if (store.getters.token) {
    if (to.path === '/login') {
      // 如果已登录跳过登录页面直接访问首页
      NProgress.done();
      next({ path: '/' });
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo');

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles);

          // dynamically add accessible routes
          router.addRoutes(accessRoutes);

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({
            ...to,
            replace: true
          });
        } catch (error) {
          Vue.prototype.$message.error(error.message || '发生错误.');
          // 清除token重新登录
          await store.dispatch('user/resetToken');
          NProgress.done();
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else if (whiteList.includes(to.path)) {
    // in the free login whitelist, go directly
    next();
  } else {
    // other pages that do not have permission to access are redirected to the login page.
    NProgress.done();
    next(`/login?redirect=${to.path}`);
  }
});
