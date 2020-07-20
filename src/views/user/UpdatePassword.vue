<template>
  <div class="change-password">
    <el-row :gutter="16">
      <el-col :lg="8" :md="24">
        <el-form
          label-position="top"
          :model="passwordForm"
          status-icon
          :rules="passwordRules"
          ref="passwordForm"
          v-loading="loading"
        >
          <el-form-item label="输入原密码" prop="oldPassword" ref="oldPassword">
            <el-input
              type="password"
              v-model="passwordForm.oldPassword"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="输入新密码" prop="newPassword">
            <el-input
              type="password"
              v-model="passwordForm.newPassword"
              autocomplete="off"
              placeholder="密码长度 6 到 255 个字符之间"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              type="password"
              v-model="passwordForm.confirmPassword"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('passwordForm')">
              确认修改
            </el-button>
            <el-button @click="resetForm('passwordForm')">重置表单</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userApi from '@/api/user';

export default {
  name: 'ChangePassword',
  data() {
    const validateOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'));
      } else {
        // 后台验证
        callback();
      }
    };
    const validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value === this.passwordForm.oldPassword) {
        callback(new Error('新密码与原密码相同'));
      } else {
        if (this.passwordForm.confirmPassword !== '') {
          this.$refs.passwordForm.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次新密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { max: 255, trigger: 'blur', message: '密码长度不能超过 255 个字符' },
          {
            validator: validateOldPassword,
            trigger: 'blur'
          }
        ],
        newPassword: [
          { min: 6, max: 255, trigger: 'blur', message: '密码长度 6 到 255 个字符之间' },
          {
            validator: validateNewPassword,
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { max: 255, trigger: 'blur', message: '密码长度不能超过 255 个字符' },
          {
            validator: validateConfirmPassword,
            trigger: 'blur'
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // do submit
          this.loading = true;
          userApi.updatePassword(this.passwordForm)
            .then(res => {
              if (res.status !== 200) {
                this.$refs.oldPassword.resetField();
              } else {
                this.$message.info(res.message);
                this.$refs[formName].resetFields();
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          // handle error
          return false;
        }
        return true;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss">
.change-password {
  padding: 10px 30px;
}
</style>
