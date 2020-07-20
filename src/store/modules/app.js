import Vue from 'vue';
import {
  headerFixed,
  sidebarFixed,
  sidebarCollapsed,
  sidebarLogo
} from '@/settings';

const states = {
  sidebar: {
    collapsed: Vue.ls.get('sidebarCollapsed') ? !!+Vue.ls.get('sidebarCollapsed') : sidebarCollapsed,
    fixed: Vue.ls.get('sidebarFixed') ? !!+Vue.ls.get('sidebarFixed') : sidebarFixed,
    logo: Vue.ls.get('sidebarLogo') ? !!+Vue.ls.get('sidebarLogo') : sidebarLogo
  },
  header: {
    fixed: Vue.ls.get('headerFixed') ? !!+Vue.ls.get('headerFixed') : headerFixed
  },
  device: 'desktop'
};

const mutations = {
  TOGGLE_SIDEBAR_COLLAPSED: state => {
    state.sidebar.collapsed = !state.sidebar.collapsed;
    if (state.sidebar.collapsed) {
      Vue.ls.set('sidebarCollapsed', 1);
    } else {
      Vue.ls.set('sidebarCollapsed', 0);
    }
  },
  SET_SIDEBAR_COLLAPSED: (state, collapsed) => {
    state.sidebar.collapsed = collapsed;
    if (state.sidebar.collapsed) {
      Vue.ls.set('sidebarCollapsed', 1);
    } else {
      Vue.ls.set('sidebarCollapsed', 0);
    }
  },
  SET_SIDEBAR_FIXED: (state, fixed) => {
    state.sidebar.fixed = fixed;
    if (state.sidebar.fixed) {
      Vue.ls.set('sidebarFixed', 1);
    } else {
      Vue.ls.set('sidebarFixed', 0);
    }
  },
  FIXED_SIDEBAR: state => {
    state.sidebar.fixed = true;
    Vue.ls.set('sidebarFixed', 1);
  },
  SET_SIDEBAR_LOGO: (state, value) => {
    state.sidebar.logo = value;
    if (state.sidebar.logo) {
      Vue.ls.set('sidebarLogo', 1);
    } else {
      Vue.ls.set('sidebarLogo', 0);
    }
  },
  SET_HEADER_FIXED: (state, fixed) => {
    state.header.fixed = fixed;
    if (state.header.fixed) {
      Vue.ls.set('headerFixed', 1);
    } else {
      Vue.ls.set('headerFixed', 0);
    }
  },
  FIXED_HEADER: state => {
    state.header.fixed = true;
    Vue.ls.set('headerFixed', 1);
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  }
};

const actions = {
  toggleSidebarCollapsed({ commit }) {
    commit('TOGGLE_SIDEBAR_COLLAPSED');
  },
  setSidebarCollapsed({ commit }, collapsed) {
    commit('TOGGLE_SIDEBAR_COLLAPSED', collapsed);
  },
  setSidebarFixed({ commit }, fixed) {
    commit('SET_SIDEBAR_FIXED', fixed);
  },
  fixedSidebar({ commit }) {
    commit('FIXED_SIDEBAR');
  },
  setSidebarLogo({ commit }, logo) {
    commit('SET_SIDEBAR_LOGO', logo);
  },
  setHeaderCollapsed({ commit }, collapsed) {
    commit('TOGGLE_HEADER_COLLAPSED', collapsed);
  },
  setHeaderFixed({ commit }, fixed) {
    commit('SET_HEADER_FIXED', fixed);
  },
  fixedHeader({ commit }) {
    commit('FIXED_HEADER');
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  }
};

export default {
  namespaced: true,
  state: states,
  mutations,
  actions
};
