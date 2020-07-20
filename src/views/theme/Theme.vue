<template>
  <div class="theme">
    <el-row :gutter="16">
      <el-col :lg="6" :md="8" :sm="12" v-for="(theme, index) in themes" :key="index">
        <el-card :body-style="{ padding: '16px 10px', height: '100%' }" class="theme-card">
          <div style="min-height: 160px">
            <el-image
              :src="themePreviewUrl.replace('themeName', theme.name)"
              :preview-src-list="[themePreviewUrl.replace('themeName', theme.name)]"
            >
              <template v-slot:placeholder>
                <div>
                  加载中...
                </div>
              </template>
            </el-image>
          </div>
          <div class="theme-card-bottom">
            <div class="theme-card-bottom-text">
              <span>主题名称: {{ theme.name }}</span>
              <span v-if="theme.name === activeThemeName">（当前主题）</span>
            </div>
            <div class="theme-card-bottom-button">
              <el-button
                v-if="theme.name === activeThemeName && theme.hasSetting"
                type="primary"
                size="small"
                @click="openThemeSettingDrawer()"
                style="display: block; margin: 0 auto;">
                主题设置
              </el-button>
              <el-button
                v-if="theme.name !== activeThemeName"
                type="primary"
                size="small"
                @click="activateTheme(theme.name)"
                style="display: block; margin: 0 auto;">
                启用该主题
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer
      :visible="drawer"
      direction="rtl"
      :wrapper-closable="true"
      :append-to-body="false"
      :show-close="true"
      @close="handleDrawerClose"
     >
      <template v-slot:title>
        <span>主题设置</span>
      </template>
      <div class="drawer-content">
        <el-form
          label-position="top"
          :model="themeOptions"
          ref="themeOptions"
          label-width="100px"
        >
          <el-form-item
            v-for="(option, index) in themeOptions.options"
            :label="option.label"
            :key="option.name"
            :prop="'options.' + index + '.value'"
            :rules="[{ max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }]"
          >
            <el-input v-model="option.value" :placeholder="option.description"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-footer">
        <el-button @click="handleDrawerClose">取 消</el-button>
        <el-button
          type="primary"
          @click="saveThemeSetting"
          :loading="buttonLoading"
        >
          {{ buttonLoading ? '保存中 ...' : '保 存' }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import themeApi from '@/api/theme';

export default {
  name: 'Theme',
  data() {
    return {
      themePreviewUrl: '/resources/themes/themeName/screenshot.png',
      activeThemeName: 'default',
      themes: [],
      themeOptions: {
        options: []
      },
      drawer: false,
      loading: false,
      buttonLoading: false
    };
  },
  mounted() {
    this.getThemes();
  },
  methods: {
    getThemes() {
      this.loading = true;
      themeApi.getThemes()
        .then(res => {
          this.themes = res.data;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.$confirm('获取主题列表失败, 是否重新获取?', '错误', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.getThemes();
          }).catch(() => {
            this.loading = false;
          });
        });
    },
    getActiveTheme() {
      this.loading = true;
      themeApi.getActiveTheme()
        .then(res => {
          this.activeThemeName = res.data;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    activateTheme(themeName) {
      this.$confirm('确定启用该主题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.loading = true;
        themeApi.activateTheme({ themeName })
          .then(res => {
            if (res.success) {
              this.activeThemeName = themeName;
              this.$message.info(res.message || '主题启用成功');
            } else {
              this.$message.error(res.message || '主题启用失败');
            }
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
            this.$message.error('主题启用失败');
            this.loading = false;
          });
      }).catch(() => {
        this.loading = false;
      });
    },
    saveThemeSetting() {
      this.$refs.themeOptions.validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          themeApi.saveThemeSetting(this.activeThemeName, this.themeOptions.options)
            .then(res => {
              if (res.success) {
                this.$message.info(res.message || '设置保存成功');
              } else {
                this.$message.error(res.message || '设置保存失败');
              }
              this.buttonLoading = false;
            })
            .catch(error => {
              console.log(error);
              this.$message.error('设置保存失败');
              this.buttonLoading = false;
            });
        } else {
          // handle error
          return false;
        }
        return true;
      });
    },
    openThemeSettingDrawer() {
      themeApi.getThemeSetting(this.activeThemeName)
        .then(res => {
          this.themeOptions.options = [...res.data];
          this.drawer = true;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleDrawerClose() {
      this.drawer = false;
    }
  }
};
</script>

<style lang="scss">
.theme {
  padding: 0 10px;

  .theme-card {
    margin-bottom: 10px;
  }

  .theme-card-bottom {
    padding: 10px;
  }

  .theme-card-bottom-text {
    padding-top: 5px;
    text-align: center;
  }

  .theme-card-bottom-button {
    padding-top: 5px;
  }

  .el-drawer__body {
    overflow: auto;
  }

  .drawer-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 50px);

    form {
      flex: 1;
      overflow: auto;
      padding: 0 20px;
    }
  }

  .drawer-footer {
    display: flex;
    padding: 0 20px;

    button {
      flex: 1;
    }
  }
}
</style>
