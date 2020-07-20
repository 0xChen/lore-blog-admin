<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadList"
      :key="item.path"
    >
      <router-link
        v-if="item.name !== name && index !== 1"
        :to="{ name: item.name, params}"
      >
        {{ item.meta.title }}
      </router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      params: {},
      breadList: []
    };
  },
  created() {
    this.getBreadcrumb();
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    getBreadcrumb() {
      this.name = this.$route.name;
      this.params = this.$route.params;
      this.breadList = this.$route.matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    }
  }
};
</script>

<style type="scss">
.el-breadcrumb__item > span {
  vertical-align: text-top;
}
</style>
