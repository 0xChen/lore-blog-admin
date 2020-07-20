import Vue from 'vue';
import store from '@/store/';
import { systemConst } from '@/utils/constant';

Vue.mixin({
  data() {
    return {
      systemConst: {
        YES: systemConst.YES,
        NO: systemConst.NO
      }
    };
  }
});

(() => {
  window.onbeforeunload = function () {
    // 避免在登陆时没有勾选"记住登陆状态"页面需要重新登陆
    if (Vue.ls.get('remember-me') !== true) {
      Vue.ls.set('remember-me', 'brief', 15 * 1000);// 15s
    }
  };

  if (Vue.ls.get('remember-me')) {
    store.commit('user/SET_TOKEN', Vue.ls.get('access_token'));
  }
})();
