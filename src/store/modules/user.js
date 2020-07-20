import Vue from 'vue';
import md5 from 'md5';
import jwtDecode from 'jwt-decode';
import userApi from '@/api/user';
import router, { resetRouter } from '@/router';

const states = {
  token: '',
  username: '',
  nickname: '',
  email: '',
  avatar: '',
  description: '',
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_DESCRIPTION: (state, description) => {
    state.description = description;
  },
  SET_USERNAME: (state, username) => {
    state.username = username;
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname;
  },
  SET_EMAIL: (state, email) => {
    state.email = email;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // user login
  login({ commit }, form) {
    const { username, password, rememberMe } = form;
    return new Promise((resolve, reject) => {
      userApi.login({
        username: username.trim(),
        password
      })
        .then(response => {
          const { data } = response;
          commit('SET_TOKEN', data);

          const { iat, exp } = jwtDecode(data);
          const expire = (exp - iat) * 1000;// ms

          Vue.ls.set('access_token', data, expire);
          Vue.ls.set('remember-me', rememberMe, expire);

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!state.token) {
        reject(Error('认证失败, 请重新登陆.'));
      }
      const userInfo = jwtDecode(state.token);
      const { sub, nickname, email, authorities, description } = userInfo;

      if (!authorities || authorities.length <= 0) {
        reject(Error('用户角色错误.'));
      }
      const avatar = `https://cn.gravatar.com/avatar/${md5(email.trim().toLowerCase())}`;

      commit('SET_ROLES', authorities);
      commit('SET_USERNAME', sub);
      commit('SET_NICKNAME', nickname);
      commit('SET_EMAIL', email);
      commit('SET_AVATAR', avatar);
      commit('SET_DESCRIPTION', description);
      resolve(userInfo);
    });
  },

  /**
   * user logout
   * @param dispatch
   * @param state
   * @param force {boolean} 不通知后台服务器直接强制退出
   * @returns {Promise}
   */
  logout({ dispatch, state }, force) {
    return new Promise((resolve, reject) => {
      if (force) {
        dispatch('resetToken');
        resetRouter();
        Vue.ls.remove('access_token');
        Vue.ls.remove('remember-me');
        resolve();
      } else {
        userApi.logout(state.token)
          .then(() => {
            dispatch('resetToken');
            resetRouter();
            Vue.ls.remove('access_token');
            Vue.ls.remove('remember-me');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, token) {
    return async resolve => {
      commit('SET_TOKEN', token);

      const { authorities } = await dispatch('getInfo');

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', authorities, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      resolve();
    };
  }
};

export default {
  namespaced: true,
  state: states,
  mutations,
  actions
};
