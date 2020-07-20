<template>
  <div class="multi-tab">
    <el-tabs
      type="card"
      v-model="activeKey"
      @tab-remove="closeThat"
    >
      <el-tab-pane
        style="height: 0"
        v-for="(item, index) in pages"
        :key="item.fullPath"
        :name="item.fullPath"
        :closable="pages.length > 1"
      >
        <template #label v-if="pages.length > 1">
          <el-dropdown
            trigger=""
            :ref="item.fullPath"
            @command="closeMenuClick"
            @contextmenu.prevent.native="handleContextmenu(item.fullPath)"
          >
            <span style="user-select: none; outline: none">{{ item.meta.title }}</span>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{method: 'closeThat', arg: item.fullPath}">
                  关闭当前标签
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="index < pages.length - 1"
                  :command="{method: 'closeRight', arg: item.fullPath}"
                >
                  关闭右侧
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="index > 0"
                  :command="{method: 'closeLeft', arg: item.fullPath}"
                >
                  关闭左侧
                </el-dropdown-item>
                <el-dropdown-item :command="{method: 'closeAll', arg: item.fullPath}">
                  关闭全部
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #label v-else>
          <span style="user-select: none; outline: none">{{ item.meta.title }}</span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'MultiTab',
  data() {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
    };
  },
  created() {
    this.pages.push(this.$route);
    this.fullPathList.push(this.$route.fullPath);
    this.selectedLastPath();
  },
  methods: {
    remove(targetKey) {
      this.pages = this.pages.filter(page => page.fullPath !== targetKey);
      this.fullPathList = this.fullPathList.filter(path => path !== targetKey);
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath();
      }
    },
    selectedLastPath() {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1];
    },
    closeThat(e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        this.remove(e);
      } else {
        this.$message({
          message: '这是最后一个标签了, 无法被关闭',
          type: 'info',
          duration: 1500
        });
      }
    },
    closeLeft(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message({
          message: '左侧没有标签',
          type: 'info',
          duration: 1500
        });
      }
    },
    closeRight(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex < (this.fullPathList.length - 1)) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message({
          message: '右侧没有标签',
          type: 'info',
          duration: 1500
        });
      }
    },
    closeAll(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item);
        }
      });
    },
    closeMenuClick(command) {
      const { method, arg } = command;
      this[method](arg);
    },
    handleContextmenu(fullPath) {
      this.$refs[fullPath][0].handleClick();
    }
  },
  watch: {
    $route(newVal) {
      this.activeKey = newVal.fullPath;
      if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath);
        this.pages.push(newVal);
      }
    },
    activeKey(newPathKey) {
      this.$router.push({ path: newPathKey });
    }
  }
};
</script>

<style lang="scss">
.multi-tab {
  margin: -16px -18px 0px -18px;
  background: #fff;
}

/* 处理因 tab 内嵌套了 dropdown 导致 tab 内的文字不能按原颜色显示的问题 */
.el-dropdown {
  color: inherit;
}
</style>
