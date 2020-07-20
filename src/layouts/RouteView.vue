<script type="text/jsx">
export default {
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  render() {
    const { $route: { meta, fullPath } } = this;
    const routerView = meta.routerViewKey ? (<router-view key={fullPath}/>) : (<router-view/>);
    const keepAlive = (
      <keep-alive>
        {routerView}
      </keep-alive>
    );

    // 路由中定义的 keepAlive 优先级最高
    if (meta.keepAlive === false) {
      return routerView;
    }
    return this.keepAlive ? keepAlive : routerView;
  }
};
</script>
