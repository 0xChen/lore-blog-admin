<template>
  <div class="trigger" :style="triggerStyle" @click="toggle">
    <svg
      :class="{'fold': fold}"
      class="trigger-icon"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8
      8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8
      8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8
      8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8
      8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0
      632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8
      8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4
      642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4
      381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Trigger',
  props: {
    fold: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      require: true
    },
    width: {
      type: String,
      require: true
    }
  },
  computed: {
    triggerStyle() {
      const height = this.height.replace('px', '');
      const width = this.width.replace('px', '');

      return {
        height: this.height,
        width: this.width,
        padding: `${(height - height * 0.375) / 2}px ${(width - width * 0.375) / 2}px`
      };
    }
  },
  methods: {
    toggle() {
      this.$emit('toggle');
    }
  }
};
</script>

<style lang="scss">
.trigger {
  cursor: pointer;

  &:hover{
    background: rgba(0, 0, 0, 0.025)
  }

  & .trigger-icon {
    display: inline-block;
    transition: all 0.3s;

    &.fold {
      transform: rotateY(180deg);
    }
  }
}
</style>
