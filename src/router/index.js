import Vue from 'vue';
import VueRouter from 'vue-router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { BaseLayout } from '@/layouts';

// 禁止全局路由错误处理打印
// Uncaught (in promise) e { name: "NavigationDuplicated", name: "NavigationDuplicated",
// message: "Navigating to current location ("***") is not allowed", stack: "Error" ...
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

/**
 * hidden: true                  是否需要显示在侧边栏的菜单项中, 如果父级设置了 true, 所有子级也都不显示
 *                               默认 false.
 * displayOnMenu: true           是否需要显示在侧边栏的菜单项中, 如果父级设置了 false, 其下所有的子级将显示在
 *                               父级别的位置, 默认 true.
 * redirect: false               如果设置成 false 对应的 breadcrumb 不会重定向
 * name:'router-name'            router.push({ name: 'router-name'}),
 *                               <router-link :to="{name: 'router-name'}"/> 必须设置
 *
 * meta : {
 *  title: 'title'               menu title
 *  icon: 'icon'                 menu icon
 *  target: '_blank'             打开到新窗口
 *  roles: ['admin','editor']    访问页面所需要拥有的角色
 *  keepAlive: true              如果设置 false, 页面在失活时将不会被缓存
 *  routerViewKey: false         如果设置 true 将使用 $route.fullPath 作为 router-view 组件的 key
 *                               阻止同一组件对应多个路由时组件被复用不执行生命周期, 如果
 *                               不喜欢 watch $route 的话可以开启.
 *  breadcrumb: true             如果设置 false, 不显示在 breadcrumb 中
 *  activeMenu: '/example/list'  sidebar 侧边栏将高亮对应的 menu
 * }
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/AuthRedirect.vue'),
    hidden: true
  },
  {
    path: '/',
    name: 'Index',
    component: BaseLayout,
    redirect: '/dashboard',
    displayOnMenu: false,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          keepAlive: false
        }
      },
      {
        path: 'post/create',
        name: 'PostCreate',
        component: () => import('@/views/post/PostCreate.vue'),
        meta: {
          title: '发布文章',
          icon: 'Edit',
          routerViewKey: true
        }
      },
      {
        path: 'post/list',
        name: 'PostList',
        component: () => import('@/views/post/PostList.vue'),
        meta: {
          title: '文章管理',
          icon: 'UnorderedList'
        }
      },
      {
        path: 'post/:id/edit',
        name: 'PostEdit',
        component: () => import('@/views/post/PostEdit.vue'),
        props: true,
        hidden: true,
        meta: {
          title: '编辑文章',
          routerViewKey: true
        }
      },
      {
        path: 'page/list',
        name: 'PageList',
        component: () => import('@/views/page/PageList.vue'),
        meta: {
          title: '页面管理',
          icon: 'FileText'
        }
      },
      {
        path: 'page/:id/edit',
        name: 'PageEdit',
        component: () => import('@/views/page/PageEdit.vue'),
        props: true,
        hidden: true,
        meta: {
          title: '编辑页面',
          routerViewKey: true
        }
      },
      {
        path: 'page/create',
        name: 'PageCreate',
        component: () => import('@/views/page/PageCreate.vue'),
        hidden: true,
        meta: {
          title: '创建页面',
          routerViewKey: true
        }
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/comment/Comment.vue'),
        meta: {
          title: '评论管理',
          icon: 'comment'
        }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/Category.vue'),
        meta: {
          title: '分类管理',
          icon: 'folder'
        }
      },
      {
        path: 'link',
        name: 'Link',
        component: () => import('@/views/link/Link.vue'),
        meta: {
          title: '链接管理',
          icon: 'link',
          keepAlive: false
        }
      },
      {
        path: 'attachment',
        name: 'Attachment',
        component: () => import('@/views/attachment/Attachment.vue'),
        meta: {
          title: '附件管理',
          icon: 'cloudUpload'
        }
      },
      {
        path: 'theme',
        name: 'Theme',
        component: () => import('@/views/theme/Theme.vue'),
        meta: {
          title: '主题管理',
          icon: 'skin'
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: {
          title: '个人设置',
          icon: 'user'
        }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/setting/Setting.vue'),
        meta: {
          title: '系统设置',
          icon: 'setting'
        }
      }
    ]
  }
];

export const asyncRoutes = [];

const createRouter = () => new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

// 导航时页面顶部显示进度条
NProgress.configure({
  showSpinner: false
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
