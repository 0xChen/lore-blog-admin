<template>
  <div class="layout-setting">
    <el-dropdown :hide-on-click="false">
      <div class="dropdown-menu-trigger">
        <svg-icon name="layout"/>
      </div>
      <template v-slot:dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <el-checkbox v-model="headerFixed">固定 Header</el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox v-model="sidebarFixed">固定侧边栏</el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox v-model="sidebarLogo">显示 Logo</el-checkbox>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'header',
      'sidebar',
      'device'
    ]),
    headerFixed: {
      get() {
        return this.header.fixed;
      },
      set(val) {
        this.$store.dispatch('app/setHeaderFixed', val);
      }
    },
    sidebarFixed: {
      get() {
        return this.sidebar.fixed;
      },
      set(val) {
        this.$store.dispatch('app/setSidebarFixed', val);
      }
    },
    sidebarLogo: {
      get() {
        return this.sidebar.logo;
      },
      set(val) {
        this.$store.dispatch('app/setSidebarLogo', val);
      }
    }
  },
  methods: {
  }
};
</script>

<style lang="scss">
  .layout-setting {
    height: $header-height;
    line-height: $header-height;
    overflow: hidden;

    .dropdown-menu-trigger {
      padding: 0 12px;
      cursor: pointer;

      &:hover{
        background: rgba(0, 0, 0, 0.025)
      }
    }
  }
</style>
