<template>
  <div :style="{height: height+'px', zIndex: zIndex}">
    <div :class="className" :style="style">
      <slot>
        <div>Sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: -1
    },
    stickyBottom: {
      type: Number,
      default: -1
    },
    zIndex: {
      type: Number,
      default: 10
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      position: '',
      width: undefined,
      height: undefined,
      isSticky: false
    };
  },
  computed: {
    style() {
      const styleObject = {
        zIndex: this.zIndex,
        position: this.position,
        width: this.width,
        height: `${this.height}px`
      };

      if (this.isSticky) {
        if (this.stickyTop >= 0) {
          styleObject.top = `${this.stickyTop}px`;
        } else if (this.stickyBottom >= 0) {
          styleObject.bottom = `${this.stickyBottom}px`;
        } else {
          styleObject.top = 0;
        }
      }

      return styleObject;
    }
  },
  mounted() {
    this.height = this.$el.getBoundingClientRect().height;
    window.addEventListener('scroll', this.handleScroll, true);
    window.addEventListener('resize', this.handleResize, true);
    this.$nextTick(function () {
      this.checkSticky();
    });
  },
  activated() {
    // 被 keep-alive 缓存的组件激活时重新检测
    this.checkSticky();
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    sticky() {
      if (!this.isSticky) {
        this.position = 'fixed';
        this.isSticky = true;
      }
    },
    checkSticky() {
      const { width } = this.$el.getBoundingClientRect();
      this.width = width ? `${width}px` : 'auto';

      if (this.stickyTop >= 0) {
        const offsetTop = this.$el.getBoundingClientRect().top;
        if (offsetTop < this.stickyTop) {
          this.sticky();
          return;
        }
      } else {
        const offsetBottom = this.$el.getBoundingClientRect().bottom;
        if (offsetBottom > document.documentElement.clientHeight) {
          this.sticky();
          return;
        }
      }

      this.handleReset();
    },
    handleReset() {
      if (this.isSticky) {
        this.reset();
      }
    },
    reset() {
      this.position = '';
      this.width = 'auto';
      this.isSticky = false;
    },
    handleScroll() {
      this.checkSticky();
    },
    handleResize() {
      if (this.isSticky) {
        const { width } = this.$el.getBoundingClientRect();
        this.width = width ? `${width}px` : 'auto';
      }
    }
  }
};
</script>
