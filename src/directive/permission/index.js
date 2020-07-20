import permission from './permission';

const install = function (vue) {
  vue.directive('permission', permission);
};

if (window.Vue) {
  window.permission = permission;
  // eslint-disable-next-line
  Vue.use(install);
}

permission.install = install;
export default permission;
