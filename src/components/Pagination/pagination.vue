<script type="text/jsx">
export default {
  inheritAttrs: false,
  name: 'Pagination',
  data() {
    return {
      currentPage: this.current,
      pageSize: this.size
    };
  },
  props: {
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50, 100];
      }
    },
    // 后端采用的 mybatis-plus 其分页对象中用 current 属性表示当前页数
    current: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'slot, prev, pager, next, sizes, total'
    }
  },
  computed: {
    // 计算属性的 getter
    currentRange() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      if (start === this.total) {
        return start;
      }
      let end = this.currentPage * this.pageSize;
      if (this.total < end) {
        end = this.total;
      }
      return `${start} - ${end}`;
    }
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.emitPagination();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.emitPagination();
    },
    emitPagination() {
      this.$emit('pagination', { page: this.currentPage, size: this.pageSize });
    }
  },
  render() {
    const that = this;
    const props = {
      on: {
        ...this.$listeners,
        'current-change': function (val) {
          if (typeof (that.$listeners['current-change']) === 'function') {
            that.$listeners['current-change'](val);
          }
          that.currentChange(val);
        },
        'size-change': function (val) {
          if (typeof (that.$listeners['size-change']) === 'function') {
            that.$listeners['size-change'](val);
          }
          that.sizeChange(val);
        }
      },
      props: {
        layout: this.layout,
        pageSizes: this.pageSizes,
        'current-page': this.current,
        'page-size': this.size,
        total: this.total,
        ...this.$attrs
      },
      scopedSlots: this.$scopedSlots,
      slot: this.$slots
    };

    return (
      <el-pagination {...props}>
        <span {...{ class: 'pagination-current-range' }}>第 {this.currentRange} 条</span>
      </el-pagination>
    );
  }
};
</script>

<style lang="scss">
.pagination-current-range {
  margin-right: 10px;
  font-weight: normal;
  color: #606266;
}
</style>
