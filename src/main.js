import Vue from 'vue';

import '@/styles/bulma.css';// bulma样式优先级最低
import '@/initializer';

import App from './App.vue';
import store from './store';
import router from './router';

import '@/styles';
import './permission'; // permission control

import * as filters from './filters'; // global filters

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV === 'development';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
