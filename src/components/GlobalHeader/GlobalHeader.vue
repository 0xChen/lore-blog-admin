<template>
  <el-header :height="headerHeight">
    <div class="global-header">
      <trigger
        :fold="!sidebar.collapsed"
        :height="headerHeight"
        :width="headerHeight"
        @toggle="toggleSidebarCollapsed"
      />
      <breadcrumb/>
      <div style="flex: 1 1 0;"></div>
      <header-search id="header-search"/>
      <layout-setting/>
      <user-menu/>
    </div>
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex';
import Trigger from '@/components/Navbar/Trigger.vue';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue';
import HeaderSearch from '@/components/HeaderSearch/HeaderSearch.vue';
import LayoutSetting from '@/components/Navbar/LayoutSetting.vue';
import UserMenu from '@/components/Navbar/UserMenu.vue';
import variables from '@/styles/variables';

export default {
  name: 'GlobalHeader',
  data() {
    return {
      headerHeight: variables.headerHeight
    };
  },
  components: {
    Trigger,
    Breadcrumb,
    HeaderSearch,
    LayoutSetting,
    UserMenu
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSidebarCollapsed() {
      this.$store.dispatch('app/toggleSidebarCollapsed');
    }
  }
};
</script>

<style lang="scss">
  .global-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: $header-height;
    padding: 0;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
</style>
