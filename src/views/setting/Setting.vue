<template>
  <div class="setting">
    <el-card :body-style="{ padding: '16px 0', height: '100%' }" style="height: 100%">
      <template v-slot:header>
        <span>网站设置</span>
      </template>
      <div class="setting-content">
        <el-row :gutter="16">
          <el-col :lg="8" :md="24">
            <el-form
              label-position="top"
              :model="options"
              status-icon
              :rules="optionRules"
              ref="optionsForm"
              v-loading="loading"
            >
              <el-form-item label="网站域名" prop="hostname">
                <el-input placeholder="域名" v-model="options.hostname">
                  <template v-slot:prepend>
                    <el-select
                      v-model="options.scheme"
                      placeholder="请选择"
                      class="scheme-select"
                    >
                      <el-option label="http://" value="http"></el-option>
                      <el-option label="https://" value="https"></el-option>
                    </el-select>
                  </template>
                </el-input>
                <span><small>请和你当前访问的域名保持一致，否则会出现渲染错误。</small></span>
              </el-form-item>
              <el-form-item label="博客标题" prop="blog_title">
                <el-input v-model="options.blog_title" placeholder="博客标题"></el-input>
              </el-form-item>
              <el-form-item label="博客关键字" prop="blog_keywords">
                <el-input
                  type="textarea"
                  placeholder="seo"
                  v-model="options.blog_keywords"
                  :autosize="{ minRows: 2 }"
                  maxlength="500"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="博客描述" prop="blog_description">
                <el-input
                  type="textarea"
                  placeholder="博客描述"
                  v-model="options.blog_description"
                  :autosize="{ minRows: 4 }"
                  maxlength="500"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item label="评论是否需要审批">
                <el-switch
                  v-model="options.allow_comment_approve"
                  :active-value="systemConst.YES"
                  :inactive-value="systemConst.NO"
                  active-text="需要"
                  inactive-text="不需要"
                >
                </el-switch>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('optionsForm')">
                  保存设置
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import systemApi from '@/api/system';

export default {
  name: 'Setting',
  data() {
    const baseRule = {
      max: 500,
      trigger: 'blur',
      message: '长度不能超过 500 个字符'
    };
    const validateHostname = (rule, value, callback) => {
      if (this.options.scheme === '') {
        callback(new Error('请选择Http协议'));
      } else if (value === '' || this.options.scheme === '') {
        callback(new Error('请输入网站域名'));
      } else {
        callback();
      }
    };
    return {
      options: {
        scheme: '',
        hostname: '',
        blog_title: '',
        blog_keywords: '',
        blog_description: '',
        allow_comment_approve: '0'
      },
      oldOptions: {},
      optionRules: {
        hostname: [baseRule, {
          validator: validateHostname,
          trigger: ['blur', 'change']
        }],
        blog_title: [baseRule],
        blog_keywords: [baseRule],
        blog_description: [baseRule]
      },
      loading: false
    };
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    getOptions() {
      this.loading = true;
      systemApi.getOptions()
        .then(res => {
          Object.assign(this.oldOptions, res.data);
          Object.keys(res.data).forEach(name => {
            this.$set(this.options, name, res.data[name]);
          });
          this.loading = false;
        })
        .catch(error => {
          console.dir(error);
          this.$confirm('获取网站设置数据失败, 是否重新获取?', '错误', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.getOptions();
          }).catch(() => {
            this.loading = false;
          });
        });
    },
    updateOptions() {
      const changedOptions = this.diffOptions(this.options, this.oldOptions);
      if (Object.getOwnPropertyNames(changedOptions).length === 0) {
        this.$message.info('没有任何配置被修改过, 无需保存');
        return;
      }

      systemApi.updateOptions(changedOptions)
        .then(() => {
          this.$message.info('保存成功');
          this.loading = false;
        })
        .catch(() => {
          this.$message.error('保存失败, 请重新保存');
          this.loading = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // do submit
          this.updateOptions();
        } else {
          // handle error
          return false;
        }
        return true;
      });
    },
    /**
     * 比对配置项, 找出被修改过的配置项并返回
     *
     * @param {Object} newOption 发生过修改的配置项
     * @param {Object} oldOption 原始配置项
     * @return {Object} 被修改过的配置项
     *
     * @author syc
     */
    diffOptions(newOption, oldOption) {
      const modifyOption = {};
      Object.keys(newOption).forEach(name => {
        const newValue = newOption[name];
        const oldValue = oldOption[name];
        if (newValue !== oldValue) {
          modifyOption[name] = newValue;
        }
      });
      return modifyOption;
    }
  }
};
</script>

<style lang="scss">
.setting {

  .setting-content {
    padding: 0 20px;

    .scheme-select {
      width: 110px;
    }
  }
}
</style>
