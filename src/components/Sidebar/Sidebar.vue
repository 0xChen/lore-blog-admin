<template>
  <div class="sidebar" :class="{ 'has-logo': sidebar.logo, 'collapse': sidebarCollapsed }">
    <sidebar-logo :collapse="sidebarCollapsed" v-if="sidebar.logo" />
    <el-scrollbar ref="scrollbar" wrap-style="overflow-x: hidden; ">
      <sidebar-menu
        :menu="permissionRoutes"
        :collapse="sidebarCollapsed"
        :default-active="activeMenu"
      >
      </sidebar-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarLogo from './SidebarLogo.vue';
import SidebarMenu from './SidebarMenu.vue';

export default {
  components: {
    SidebarLogo,
    SidebarMenu
  },
  computed: {
    ...mapGetters([
      'permissionRoutes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    sidebarCollapsed() {
      return this.sidebar.collapsed;
    }
  },
  mounted() {
    if (!this.sidebar.fixed) {
      this.$refs.scrollbar.wrap.style.marginBottom = '0';
    }
  }
};
</script>

<style lang="scss">
.sidebar {
  width: $sidebar-width;
  height: 100%;
  background-color: #304156;
  transition: all 0.2s;

  &.collapse {
    width: $sidebar-collapsed-width;
  }

  .el-scrollbar {
    height: 100%;
  }

  &.has-logo {
    .el-scrollbar {
      height: calc(100% - #{$header-height});
    }
  }
}
</style>
