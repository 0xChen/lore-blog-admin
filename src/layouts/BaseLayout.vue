<template>
  <el-container :style="{'min-height': '100%'}">
    <el-aside width="auto" :class="{ 'fix-sidebar': fixSidebar }">
      <sidebar/>
    </el-aside>
    <el-container direction="vertical" :style="mainContainerStyle">
      <global-header :style="headerStyle"/>
      <el-main :style="mainStyle">
        <multi-tab></multi-tab>
        <section class="app-main">
          <transition name="page-transition">
            <route-view/>
          </transition>
        </section>
      </el-main>
      <global-footer/>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import GlobalHeader from '@/components/GlobalHeader/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter/GlobalFooter.vue';
import MultiTab from '@/components/MultiTab/MultiTab.vue';
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import variables from '@/styles/variables';
import RouteView from './RouteView.vue';

export default {
  name: 'BasicLayout',
  components: {
    RouteView,
    Sidebar,
    MultiTab,
    GlobalHeader,
    GlobalFooter
  },
  data() {
    return {
      mainContainerStyle: {
        minHeight: 0,
        paddingLeft: 0,
        transition: 'none'
      }
    };
  },
  created() {
    this.changeMainContainerStyle();
  },
  watch: {
    'sidebar.fixed': function () {
      this.changeMainContainerStyle(false);
    },
    'sidebar.collapsed': function () {
      this.changeMainContainerStyle(true);
    }
  },
  computed: {
    ...mapGetters([
      'header',
      'sidebar'
    ]),
    fixSidebar() {
      return this.sidebar.fixed;
    },
    mainStyle() {
      return {
        display: 'flex',
        flexDirection: 'column',
        marginTop: this.header.fixed ? variables.headerHeight : 0,
        position: 'relative'
      };
    },
    headerStyle() {
      const style = {
        padding: 0
      };

      if (this.header.fixed) {
        style.position = 'fixed';
        style.zIndex = 9;
        style.top = 0;
        style.right = 0;
        style.transition = 'all 0.2s';

        if (this.sidebar.collapsed) {
          style.width = `calc(100% - ${variables.sidebarCollapsedWidth})`;
        } else {
          style.width = `calc(100% - ${variables.sidebarWidth})`;
        }
      }
      return style;
    }

  },
  methods: {
    changeMainContainerStyle(transition) {
      if (transition) {
        this.mainContainerStyle.transition = 'all 0.2s';
      } else {
        this.mainContainerStyle.transition = 'none';
      }

      if (this.sidebar.fixed) {
        if (this.sidebar.collapsed) {
          this.mainContainerStyle.paddingLeft = variables.sidebarCollapsedWidth;
        } else {
          this.mainContainerStyle.paddingLeft = variables.sidebarWidth;
        }
      } else {
        this.mainContainerStyle.paddingLeft = '0';
      }
    }
  }
};
</script>

<style lang="scss">
.fix-sidebar {
  position: fixed;
  height: 100%;
}

.app-main {
  display: block;
  flex: auto;
  position: relative;
  min-height: 0;
  margin-top: -15px;
  padding-top: 10px;
  overflow: auto;
  box-sizing: border-box;
}
</style>

<style lang="scss">
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
