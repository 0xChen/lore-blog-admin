<template>
  <div class="category" v-loading="loading">
    <el-row :gutter="16">
      <el-col :lg="12" :md="24">
        <el-card class="box-card" body-style="padding: 10px" style="min-width: 550px">
          <div slot="header">
            <el-input
              placeholder="搜索页面中的类别"
              v-model="searchText">
            </el-input>
          </div>
          <el-tree
            :props="mapping"
            :data="data"
            node-key="id"
            :default-expanded-keys="expandedKeys"
            :expand-on-click-node="true"
            :filter-node-method="searchNode"
            :render-content="renderContent"
            ref="categoryTree"
          >
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/jsx">
import categoryApi from '@/api/category';

export default {
  name: 'Category',
  data() {
    return {
      searchText: '',
      mapping: {
        label: 'name',
        children: 'children'
      },
      expandedKeys: [],
      newCategoryName: '',
      data: [],
      loading: false,
      buttonLoading: false
    };
  },
  watch: {
    searchText(val) {
      this.$refs.categoryTree.filter(val);
    }
  },
  methods: {
    renderContent(h, { node, data }) {
      const style = {
        color: this.randomColor()
      };
      return (
        <div class="extension-tree-node">
          <span style={style}>{node.label}</span>
          <span class="operation-button">
            {this.renderAddButton(data, style)}
            {this.renderUpdateButton(data, style)}
            {this.renderDeleteButton(node, data, style)}
         </span>
        </div>
      );
    },
    renderAddButton(data, style) {
      const that = this;
      const popoverProps = {
        attrs: {
          placement: 'left',
          title: `添加 "${data.name}" 的子分类`
        },
        ref: `popper-${data.id}-create`
      };
      const inputProps = {
        attrs: {
          value: this.newCategoryName,
          maxlength: 25,
          'show-word-limit': true,
          size: 'small',
          placeholder: '请输入新分类名称'
        },
        on: {
          input(value) {
            that.newCategoryName = value;
          }
        }
      };
      const cancelButtonProps = {
        on: {
          click() {
            that.$refs[`popper-${data.id}-create`].doClose();
          }
        }
      };
      const saveButtonProps = {
        props: {
          loading: this.buttonLoading
        },
        on: {
          click() {
            that.create(data);
          }
        }
      };
      return (
        <el-popover {...popoverProps}>
          <el-input {...inputProps}/>
          <div style="text-align: right; margin-top: 5px">
            <el-button type="text" size="mini" {...cancelButtonProps}>取消</el-button>
            <el-button type="primary" size="mini" {...saveButtonProps}>保存</el-button>
          </div>
          <template {...{ slot: 'reference' }}>
            <el-button
              type="text"
              style={style}
              on-click={event => {
                event.stopPropagation();
                that.closePopper();
              }}
            >
              添加子分类
            </el-button>
          </template>
        </el-popover>
      );
    },
    renderUpdateButton(data, style) {
      const that = this;
      const popoverProps = {
        attrs: {
          placement: 'left',
          title: `更改 "${data.name}" 分类名称`
        },
        ref: `popper-${data.id}-update`
      };
      const inputProps = {
        attrs: {
          value: this.newCategoryName,
          maxlength: 25,
          'show-word-limit': true,
          size: 'small',
          placeholder: '请输入新名称'
        },
        on: {
          input(value) {
            that.newCategoryName = value;
          }
        }
      };
      const cancelButtonProps = {
        on: {
          click() {
            that.$refs[`popper-${data.id}-update`].doClose();
          }
        }
      };
      const updateButtonProps = {
        props: {
          loading: this.buttonLoading
        },
        on: {
          click() {
            that.update(data);
          }
        }
      };
      return (
        <el-popover {...popoverProps}>
          <el-input {...inputProps}/>
          <div style="text-align: right; margin-top: 5px">
            <el-button type="text" size="mini" {...cancelButtonProps}>取消</el-button>
            <el-button type="primary" size="mini" {...updateButtonProps}>确认</el-button>
          </div>
          <template {...{ slot: 'reference' }}>
            <el-button
              type="text"
              style={style}
              on-click={event => {
                event.stopPropagation();
                that.closePopper();
              }}
            >
              修改名称
            </el-button>
          </template>
        </el-popover>
      );
    },
    renderDeleteButton(node, data, style) {
      const that = this;
      const title = `此操作将删除 "${data.name}" 及其下的所有子分类`;
      const props = {
        attrs: {
          placement: 'left',
          title
        },
        on: {
          onConfirm() {
            that.delete(node, data);
          }
        }
      };
      return (
        <el-popconfirm {...props}>
          <template {...{ slot: 'reference' }}>
            <el-button
              type="text"
              style={style}
              on-click={event => event.stopPropagation()}
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      );
    },
    closePopper() {
      for (const ref in this.$refs) {
        if (ref.startsWith('popper-')) {
          this.$refs[ref].doClose();
        }
      }
    },
    searchNode(value, data) {
      if (value === '') {
        return true;
      }
      return data.name.indexOf(value) !== -1;
    },
    defaultExpanded(data) {
      for (const nodeData of data) {
        if (nodeData.level <= 2) {
          this.expandedKeys.push(nodeData.id);
          if (nodeData.children && nodeData.children.length > 0) {
            this.defaultExpanded(nodeData.children);
          }
        } else {
          break;
        }
      }
    },
    create(data) {
      if (!this.validateCategoryName()) {
        return;
      }
      this.buttonLoading = true;
      categoryApi.saveCategory({
        parentId: data.id,
        name: this.newCategoryName
      }).then(res => {
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(res.data);
        this.$refs.categoryTree.store.nodesMap[data.id].expanded = true;
        this.newCategoryName = '';
        this.$refs[`popper-${data.id}-create`].doClose();
      }).catch(error => {
        console.dir(error);
      }).then(() => {
        this.buttonLoading = false;
        this.newCategoryName = '';
      });
    },
    update(data) {
      if (!this.validateCategoryName()) {
        return;
      }
      this.buttonLoading = true;
      categoryApi.updateCategory({
        id: data.id,
        name: this.newCategoryName
      }).then(() => {
        data.name = this.newCategoryName;
        this.$refs[`popper-${data.id}-update`].doClose();
      }).catch(() => {
      }).then(() => {
        this.buttonLoading = false;
        this.newCategoryName = '';
      });
    },
    delete(node, data) {
      categoryApi.deleteCategory(data)
        .then(() => {
          const { parent } = node;
          // 没有 children 说明它就是树的顶点
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
        });
      // 异常已经统一处理过一次, 如果不需要业务逻辑上的处理, 只需要弹窗提示的话, 就无需 catch 处理了.
    },
    validateCategoryName() {
      if (this.newCategoryName.length <= 0) {
        this.$message.warning('请输入分类名称');
        return false;
      }
      return true;
    },
    getCategoryTree() {
      this.loading = true;
      categoryApi.getCategoryTree()
        .then(res => {
          this.defaultExpanded(res.data);
          this.data = res.data;
          this.loading = false;
        })
        .catch(error => {
          console.dir(error);
          this.$confirm('获取分类数据失败, 是否重新获取?', '错误', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.getCategoryTree();
          }).catch(() => {
          });
          this.loading = false;
        });
    },
    randomColor() {
      const colors = [
        'rgb(121, 189, 143)',
        'rgb(0, 163, 136)',
        'rgb(103, 169, 207)',
        'rgb(54, 144, 192)',
        'rgb(1, 108, 89)',
        '#3DB889',
        '#9890e3',
        '#E94A8C',
        '#ebc0fd',
        '#ffda8e',
        '#fe4365'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  },
  mounted() {
    this.getCategoryTree();
  }
};
</script>

<style lang="scss">
.category {
  margin-left: 10px;
  margin-right: 10px;

  .extension-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
  }

  .operation-button {
     &>span {
       padding-right: 5px;
     }
  }
}
</style>
