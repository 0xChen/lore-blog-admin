const blogConst = {
  OPTION_BLOG_THEME: 'blog_theme',
  OPTION_BLOG_TITLE: 'blog_title',
  OPTION_BLOG_DESCRIPTION: 'blog_description',
  OPTION_THEME_LOGO_URL: 'theme_logo_url',
  OPTION_ALLOW_COMMENT_APPROVE: 'allow_comment_approve',

  OPTION_THEME_OPTION_PREFIC: 'theme_',
  /**
   * 最近文章
   */
  POST_RECENT: 'recent',
  /**
   * 随机文章
   */
  POST_RANDOM: 'random',
  /**
   * 每次获取随机文章的数量
   */
  POST_RANDOM_SIZE: 10,
  /**
   * 删除状态
   */
  POST_STATUS_TRASH: '0',
  /**
   * 自动草稿
   */
  POST_STATUS_AUTO_DRAFT: '1',
  /**
   * 草稿状态
   */
  POST_STATUS_DRAFT: '2',
  /**
   * 发布状态
   */
  POST_STATUS_PUBLISH: '3',
  /**
   * markdown 格式
   */
  POST_CONTENT_TYPE_MD: 'markdown',
  /**
   * html 格式
   */
  POST_CONTENT_TYPE_HTML: 'html',
  /**
   * 博文
   */
  POST_TYPE_POST: 'post',
  /**
   * 页面
   */
  POST_TYPE_PAGE: 'page',

  // comment 相关常量
  /**
   * 已批准
   */
  COMMENT_STATUS_APPROVED: '1',
  /**
   * 未批准
   */
  COMMENT_STATUS_UNAPPROVED: '0',
  /**
   * 等待审批
   */
  COMMENT_STATUS_PENDING: '2 ',
  /**
   * 一次获取最近评论的数量
   */
  COMMENT_RECENT_SIZE: 5,

  // category 相关常量
  /**
   * 顶级默认分类名称
   */
  CATEGORY_ROOT_ID: 0,
  CATEGORY_ROOT_NAME: '默认分类'
};

const systemConst = {
  /**
   * 配置项相关
   */
  OPTION_SCHEME: 'scheme',
  OPTION_HOSTNAME: 'hostname',

  /**
   * 是/否
   */
  YES: '1',
  NO: '0',

  /**
   * 分页相关
   */
  PAGE_DEFAULT_SIZE: 10, // 默认每页数量

  /**
   * 角色
   */
  ROLE_ADMIN: '1', // 管理员
  ROLE_USER: '2', // 普通用户
  ROLE_GUEST: '3', // 访客

  /**
   * 用户状态
   */
  USER_STATUS_DISABLED: '0', // 禁用
  USER_STATUS_ENABLED: '1', // 正常
  USER_STATUS_LOCKED: '2', // 锁定
  USER_STATUS_EXPIRED: '3', // 过期

  /**
   * log类型
   */
  LOG_INFO: 'info', // 普通信息日志
  LOG_EMAIL: 'email', // Email日志
  LOG_EXCEPTION: 'exception', // 异常日志

  /**
   * Request key
   */
  REQUEST_USER_ID: 'userId', // 放置当前登陆用户的ID
  REQUEST_USER_NAME: 'username', // 放置当前登陆用户的用户名
  REQUEST_REMEMBER_ME: 'remember-me', // 记住我

  /**
   * Cookie key
   */
  COOKIE_ACCESS_TOKEN: 'access_token' // 权限认证凭据
};

export { blogConst, systemConst };
