<template>
  <el-footer height="auto" class="global-footer">
    <div style="font-size: 0.75rem">
      <p>
        Designed with ♥ by
        <a href="https://developerchen.com" rel="noopener" target="_blank" title="0xChen's website">
          0xChen
        </a>
        . Licensed under the
        <a href="https://www.mit-license.org" rel="noopener" target="_blank" title="MIT License">
          MIT License
        </a>.
      </p>
    </div>
  </el-footer>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data() {
    return {};
  }
};
</script>

<style>
.global-footer {
  text-align: center;
  background: linear-gradient(270deg, #d53e4f, #fc8d59, #fee08b, #e6f598,
  #99d594, #3288bd) 0 100% repeat-x;
  background-size: 50% 2px;
}
</style>
