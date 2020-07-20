module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'element-ui',
        // styleLibraryDirectory: 'packages/theme-chalk',
        style: name => `element-ui/packages/theme-chalk/src/${name.replace('element-ui/lib/', '')}.scss`
      }
    ]
  ],
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
};
