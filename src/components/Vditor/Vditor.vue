<template>
  <div :id="vditorId" class="vditor">
    <div :style="{height: `${height}px`}"></div>
  </div>
</template>

<script>
import Vditor from 'vditor';

export default {
  name: 'Vditor',
  props: {
    id: {
      type: String,
      default() {
        return `vditor-${new Date().getTime()}${(Math.random() * 1000).toFixed(0)}`;
      }
    },
    value: {
      type: String,
      default() {
        return '';
      }
    },
    mode: {
      type: String,
      default() {
        return 'sv';
      }
    },
    height: {
      type: Number,
      default() {
        return 500;
      }
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      vditorId: this.id,
      vditor: null,
      init: -1, // -1 未初始化, 0 已销毁, 1 初始化中, 2 初始化完成
      setValueHolder: null
    };
  },
  watch: {
    value(val) {
      if (this.init === 2) {
        this.vditor.setValue(val);
        this.vditor.focus();
      } else {
        // 等待 lute.min.js 加载完毕 vditor 初始化完成后被调用
        this.setValueHolder = () => {
          this.vditor.setValue(val);
          this.vditor.focus();
        };
      }
    },
    mode() {
      // 由于原组件并未提供动态改变编辑模式的方法, 只能销毁重新初始化
      this.destroyVditor();
      this.initVditor();
    },
    init(newValue) {
      if (newValue === 2 && typeof this.setValueHolder === 'function') {
        this.setValueHolder();
        this.setValueHolder = null;
      }
    }
  },
  mounted() {
    this.initVditor();
  },
  activated() {
    if (this.init === 0 && this.vditor) {
      const { options } = this.vditor.vditor;
      options.value = this.vditor.getValue();
      options.mode = this.vditor.getCurrentMode();

      this.vditor = new Vditor(this.vditorId, options);
    } else if (this.init === -1 || this.init === 0) {
      this.initVditor();
    }
  },
  deactivated() {
    this.destroyVditor();
  },
  destroyed() {
    this.destroyVditor();
  },
  methods: {
    getValue() {
      return this.invoke('getValue');
    },
    getHTML() {
      return this.invoke('getHTML');
    },
    getCurrentMode() {
      return this.invoke('getCurrentMode');
    },
    initVditor() {
      const that = this;
      const defaultOptions = {
        value: this.value,
        width: '100%',
        height: this.height,
        resize: {
          enable: true
        },
        tab: '  ',
        counter: {
          enable: true
        },
        typewriterMode: false,
        mode: this.mode,
        preview: {
          delay: 100,
          hljs: {
            enable: true,
            style: 'dracula'
          }
        },
        cache: {
          enable: true,
          id: this.vditorId
        },
        upload: {},
        after() {
          that.init = 2;
        }
      };
      this.vditor = new Vditor(this.vditorId, { ...defaultOptions, ...this.options });
      this.init = 1;
    },
    destroyVditor() {
      this.vditor.destroy();
      this.init = 0;
    },
    invoke(methodName, ...args) {
      let result = null;
      if (this.vditor[methodName]) {
        result = this.vditor[methodName](...args);
      }
      return result;
    },
    getVditorInstance() {
      return this.vditor;
    }
  }
};
</script>

<style lang="scss">
@import "~vditor/src/assets/scss/index";
</style>
