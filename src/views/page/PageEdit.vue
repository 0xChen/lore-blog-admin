<template>
  <page :id="id"/>
</template>

<script>
import Page from './Page.vue';

export default {
  name: 'PageEdit',
  components: {
    Page
  },
  props: ['id']
};
</script>
