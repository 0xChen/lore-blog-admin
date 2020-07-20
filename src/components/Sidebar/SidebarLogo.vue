<template>
  <div class="sidebar-logo">
    <router-link to="/">
      <img :src="logo" alt="logo">
      <h1 v-if="!collapse">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import logo from '@/assets/logo.png';

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: 'Lore Blog Admin',
      logo
    };
  }
};
</script>

<style lang="scss">
.sidebar-logo {
  position: relative;
  height: $header-height;
  background: #2a3a4a;
  overflow: hidden;
  transition:all 0.3s;

  & a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;

    & img {
      width: 32px;
      height: 32px;
      margin-left: 16px;
      flex-shrink: 0;
    }

    & h1 {
      margin: 0 0 0 10px;
      color: #fff;
      font-weight: 600;
      font-size: 16px;
      flex-shrink: 0;
      font-family: Microsoft YaHei, Helvetica Neue, Arial, Helvetica, sans-serif;
    }
  }
}
</style>
