<template>
  <div class="user-menu">
    <el-dropdown
      @command="handleCommand"
      :hide-on-click="false"
    >
      <div class="dropdown-menu-trigger user-info">
        <el-avatar :src="avatar" alt="avatar"></el-avatar>
        <span>{{ username }}</span>
      </div>
      <template v-slot:dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <a target="_blank" href="https://github.com/0xChen">
              <svg-icon name="eye" style="margin-right: 5px"/>
              <span>查看网站</span>
            </a>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link :to="{ name: 'Profile' }">
              <svg-icon name="user" style="margin-right: 5px"/>
              <span>个人设置</span>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <svg-icon name="logout" style="margin-right: 5px"/>
            <span>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'username',
      'device'
    ])
  },
  methods: {
    handleCommand(command) {
      if (command) {
        this[command]();
      }
    },
    logout() {
      this.$confirm('将退出系统返回到登陆页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout', false)
          .then(() => {
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          })
          .catch(error => {
            console.dir(error);
            this.$confirm('退出时出现错误', '错误', {
              confirmButtonText: '强制退出',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.$store.dispatch('user/logout', true);
              this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            });
          });
      });
    }
  }
};
</script>

<style lang="scss">
.user-menu {
  height: $header-height;
  line-height: $header-height;
  overflow: hidden;

  .user-info {
    display: flex;
    align-items: center;

    > * {
      margin: 0 4px;
    }
  }

  .dropdown-menu-trigger {
    padding: 0 12px;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.025)
    }
  }
}
</style>
