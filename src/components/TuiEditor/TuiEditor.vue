<template>
  <editor
    ref="editor"
    :options="options"
    :height="height"
    :initial-edit-type="initialEditType"
    :preview-style="previewStyle"
    :initial-value="initialValue"
  />
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { Editor } from '@toast-ui/vue-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from './highlight';

export default {
  name: 'TuiEditor',
  components: {
    Editor
  },
  props: {
    previewStyle: {
      type: String
    },
    height: {
      type: String,
      default: '100%'
    },
    initialEditType: {
      type: String,
      default: 'markdown'
    },
    initialValue: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default() {
        return {
          plugins: [[codeSyntaxHighlight, { hljs }]],
          usageStatistics: false,
          language: 'zh-CN'
        };
      }
    }
  },
  methods: {
    setValue(value) {
      this.invoke('setValue', value);
    },
    getValue() {
      return this.invoke('getValue');
    },
    setHtml(value) {
      this.invoke('setHtml', value);
    },
    getHtml() {
      return this.invoke('getHtml');
    },
    setMarkdown(value) {
      this.invoke('setMarkdown', value);
    },
    getMarkdown() {
      return this.invoke('getMarkdown');
    },
    invoke(methodName, ...args) {
      const { editor } = this.$refs;
      let result = null;
      if (editor[methodName]) {
        result = editor[methodName](...args);
      }
      return result;
    }
  }
};
</script>

<style lang="scss">

</style>
