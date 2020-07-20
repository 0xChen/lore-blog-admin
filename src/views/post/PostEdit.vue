<template>
  <post :id="id"/>
</template>

<script>
import Post from './Post.vue';

export default {
  name: 'PostEdit',
  components: {
    Post
  },
  props: ['id']
};
</script>
