const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const appSettings = require('./src/settings.js');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const { title } = appSettings; // page title
const isDevelopment = process.env.NODE_ENV === 'development';
const port = process.env.port || process.env.npm_config_port || 8088; // dev port

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios'
  },
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vuex@3.5.1/dist/vuex.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js'
  ]
};

// https://cli.vuejs.org/config/
module.exports = {
  // https://cli.vuejs.org/config/#publicpath
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: 'dist/admin',
  assetsDir: 'static',
  lintOnSave: isDevelopment,
  productionSourceMap: false,
  devServer: {
    port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: ''
        }
      },
      // 后台的文件服务
      '^/files/': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        ws: true
      },
      // 后台的静态资源服务
      '^/resources/': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        ws: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    externals: isDevelopment ? {} : assetsCDN.externals
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递配置
      scss: {
        prependData: '@import "~@/styles/variables.scss"; @import "~@/styles/element-variables.scss";'
      }
    }
  },
  chainWebpack: config => {
    // set module
    config.module
      // set file-loader
      .rule('svg')
      .exclude
      .add(resolve('src/icons'))
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons'))
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end();

    // set plugin
    config.plugins
      .delete('prefetch')
      .end()
      .plugin('preload')
      .tap(() => [
        {
          rel: 'preload',
          // to ignore runtime.js
          // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
          fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
          include: 'initial'
        }
      ])
      .end()
      .plugin('html')
      .tap(options => {
        options[0].title = title;
        if (!isDevelopment) {
          options[0].cdn = assetsCDN;
        }
        return options;
      })
      .end()
      .when(!isDevelopment, configs => configs
        .plugin('scriptExtension')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end());

    // set optimization
    config.when(!isDevelopment, configs => configs
      .optimization
      .splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            // only package third parties that are initially dependent
            chunks: 'initial'
          },
          elementUI: {
            // split elementUI into a single package
            name: 'chunk-elementUI',
            // in order to adapt to cnpm
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            // the weight needs to be larger than libs and app
            // or it will be packaged into libs or app
            priority: 20
          },
          commons: {
            name: 'chunk-commons',
            // can customize your rules
            test: resolve('src/components'),
            //  minimum common number
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      .runtimeChunk('single')
      .end());
  }
};
