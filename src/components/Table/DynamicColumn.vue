<template>
  <el-popover
    :placement="placement"
    :trigger="trigger"
  >
    <el-tree
      ref="tree"
      :data="data"
      :props="column2Label"
      :default-checked-keys="defaultChecked"
      show-checkbox
      node-key="prop"
      default-expand-all
      draggable
      :allow-drop="allowDrop"
      @check-change="checkChange"
      @node-drop="nodeDrop"
    >
    </el-tree>
    <!-- 基于 template 的 v-slot 无效, element-ui 的 bug -->
    <svg-icon slot="reference" name="table"/>
  </el-popover>
</template>

<script>
export default {
  name: 'DynamicColumn',
  data() {
    return {
      defaultChecked: [],
      data: []
    };
  },
  props: {
    placement: {
      type: String,
      default: 'top'
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    tableColumns: {
      type: Array,
      default() {
        return [];
      }
    },
    column2Label: {
      type: Object,
      default() {
        return {
          label: 'label'
        };
      }
    }
  },
  methods: {
    initDataAndDefaultChecked() {
      this.tableColumns.forEach(c => {
        this.data.push({ ...c });
      });

      this.data.forEach(c => {
        if (c.display) {
          this.defaultChecked.push(c.prop);
        }
      });
    },
    allowDrop(draggingNode, dropNode, type) {
      return type !== 'inner';
    },
    checkChange(data, checked) {
      if (checked) {
        data.display = true;
        this.defaultChecked.push(data.prop);
      } else {
        data.display = false;
        const temp = [];
        this.defaultChecked.forEach(prop => {
          if (prop !== data.prop) {
            temp.push(prop);
          }
        });
        this.defaultChecked = temp;
      }
      this.columnUpdate();
    },
    nodeDrop() {
      // 节点拖拽成功结束后会丢失选中状态, 不清楚是 bug 还是有意为之.
      // 这里通过更新 defaultChecked 阻止选中状态的变更
      this.defaultChecked = [...this.defaultChecked];
      this.columnUpdate();
    },
    columnUpdate() {
      this.$emit('column-update', this.data);
    }
  },
  created() {
    this.initDataAndDefaultChecked();
  }
};
</script>

<style lang="scss">

</style>
