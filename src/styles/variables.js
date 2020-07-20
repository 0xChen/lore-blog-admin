/**
 * 将 css 变量 export 为 js 变量, 这样其它文件在
 * import variables from '@/styles/variables';
 * 后输入 variables. 编译器会有代码提示列出所有可以变量
 */
import variables from '@/styles/variables.scss';

export default {
  primaryColor: variables.primaryColor,
  menuTextColor: variables.menuTextColor,
  menuActiveTextColor: variables.menuActiveTextColor,
  menuBackgroundColor: variables.menuBackgroundColor,
  sidebarWidth: variables.sidebarWidth,
  sidebarCollapsedWidth: variables.sidebarCollapsedWidth,
  headerHeight: variables.headerHeight
};
