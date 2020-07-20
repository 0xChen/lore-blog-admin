<script type="text/jsx">
import path from 'path';
import variables from '@/styles/variables';

export default {
  name: 'SideMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    defaultActive: {
      type: String,
      default: ''
    },
    collapse: Boolean
  },
  methods: {
    resolvePath(menu, basePath) {
      const routePath = menu.path;
      const target = menu.meta && menu.meta.target;

      return target ? routePath : path.resolve(basePath, menu.path);
    },

    // render
    renderIcon(menu) {
      const icon = (menu.meta && menu.meta.icon) || '';
      const style = {
        marginRight: '16px',
        // 覆盖 element ui
        verticalAlign: '-0.125em',
        height: 'auto',
        width: 'auto',
        overflow: 'hidden',
        visibility: 'visible',
        display: 'inline-block'
      };
      return icon ? (<svg-icon name={icon} style={style} />) : null;
    },
    renderTitle(menu) {
      const title = (menu.meta && menu.meta.title) || '';

      return title ? (
        <span
          slot={this.collapse ? 'title' : 'default'}
          // 处理 icon 和 title 不在一个水平线上的问题
          style="verticalAlign: baseline"
        >
        {title}
        </span>
      ) : null;
    },
    renderLink(menu, basePath) {
      const link = this.resolvePath(menu, basePath);
      const target = menu.meta && menu.meta.target;
      const CustomTag = target ? 'a' : 'router-link';
      const attrs = target ? { href: link, target, rel: 'noopener' } : { to: link };

      return ([
        <CustomTag { ...{ attrs } }>
          {this.renderIcon(menu)}
          {this.collapse ? null : this.renderTitle(menu)}
        </CustomTag>,
        this.collapse ? this.renderTitle(menu) : null
      ]);
    },
    renderMenu(menu, basePath) {
      if (menu.hidden) {
        return null;
      }
      if (menu.displayOnMenu !== undefined && !menu.displayOnMenu && menu.children) {
        return menu.children.map(
          item => this.renderMenu(item, this.resolvePath(menu, basePath))
        );
      }
      if (menu.children) {
        return this.renderSubMenu(menu, basePath);
      }
      return this.renderMenuItem(menu, basePath);
    },
    renderMenuItem(menu, basePath) {
      return (
        <el-menu-item index={this.resolvePath(menu, basePath)}>
          {this.renderLink(menu, basePath)}
        </el-menu-item>
      );
    },
    renderSubMenu(menu, basePath) {
      const itemArray = [];

      menu.children.forEach(
        item => {
          const result = this.renderMenu(item, this.resolvePath(menu, basePath));
          if (result) {
            itemArray.push(result);
          }
        }
      );

      if (itemArray.length === 0) {
        return null;
      }

      return (
        <el-submenu index={this.resolvePath(menu, basePath)}>
          <template v-slot:title>
            {this.renderIcon(menu)}
            {this.renderTitle(menu)}
          </template>
          {itemArray}
        </el-submenu>
      );
    }
  },
  render() {
    const props = {
      collapse: this.collapse,
      defaultActive: this.defaultActive,
      backgroundColor: variables.menuBackgroundColor,
      textColor: variables.menuTextColor,
      activeTextColor: variables.menuActiveTextColor,
      uniqueOpened: false,
      collapseTransition: false
    };

    const menuArray = this.menu.map(item => {
      if (item.hidden) {
        return null;
      }
      return this.renderMenu(item, '');
    });

    return (
      <el-menu mode="vertical" {...{ props }} style="border: none">
        {menuArray}
      </el-menu>
    );
  }
};
</script>
<style lang="scss">
  .el-menu {
    &:not(.el-menu--collapse){
      width: $sidebar-width;
    }

    a {
      color: inherit;
      cursor: pointer;
      text-decoration: none
    }

    a:before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: transparent;
      content: "";
    }

    svg {
      margin-left: 5px;
    }
  }
</style>
