const getters = {
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  nickname: state => state.user.nickname,
  roles: state => state.user.roles,
  token: state => state.user.token,
  description: state => state.user.description,
  sidebar: state => state.app.sidebar,
  header: state => state.app.header,
  device: state => state.app.device,
  permissionRoutes: state => state.permission.routes
};
export default getters;
