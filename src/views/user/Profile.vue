<template>
  <div class="profile">
    <el-card :body-style="{ padding: '16px 0', height: '100%' }" style="height: 100%">
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="个人资料">
          <div class="profile-content">
            <el-row :gutter="16">
              <el-col :lg="8" :md="24">
                <el-form
                  label-position="top"
                  :model="profileForm"
                  status-icon
                  :rules="profileRules"
                  ref="profileForm"
                  v-loading="loading"
                >
                  <el-form-item label="用户名" prop="username" ref="username">
                    <el-input
                      v-model="profileForm.username"
                      :disabled="true"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="昵称" prop="nickname">
                    <el-input
                      v-model="profileForm.nickname"
                      placeholder="输入一个你喜欢的昵称"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="电子邮箱" prop="email">
                    <el-input
                      type="email"
                      v-model="profileForm.email"
                      placeholder="例如: email@gmail.com"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="个人简介" prop="description">
                    <el-input
                      type="textarea"
                      placeholder="来个简短介绍吧..."
                      v-model="profileForm.description"
                      :autosize="{ minRows: 4 }"
                      maxlength="255"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('profileForm')">
                      保存
                    </el-button>
                    <el-button type="danger" @click="getProfile" v-if="!profileForm.username">
                      重新获取个人资料
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          <update-password/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import UpdatePassword from '@/views/user/UpdatePassword.vue';
import userApi from '@/api/user';

export default {
  name: 'Profile',
  components: {
    UpdatePassword
  },
  data() {
    return {
      profileForm: {
        username: '',
        nickname: '',
        email: '',
        description: ''
      },
      profileRules: {
        nickname: [
          {
            max: 25,
            trigger: 'blur',
            message: '昵称长度不能超过 25 个字符'
          }
        ],
        email: [
          {
            type: 'email',
            required: true,
            max: 100,
            trigger: ['blur'],
            message: '请输入正确的邮箱地址'
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        debugger;
        if (valid) {
          // do submit
          this.loading = true;
          userApi.updateProfile(this.profileForm)
            .then(() => {
              this.$message.info('修改成功');
              this.loading = false;
            })
            .catch(() => {
              this.$message.error('修改失败, 请重新保存');
              this.loading = false;
            });
        } else {
          // handle error
          return false;
        }
        return true;
      });
    },
    getProfile() {
      this.loading = true;
      userApi.getProfile()
        .then(res => {
          const { username, nickname, email, description } = res.data;
          this.profileForm.username = username;
          this.profileForm.nickname = nickname;
          this.profileForm.email = email;
          this.profileForm.description = description;
          this.loading = false;
        })
        .catch(error => {
          console.dir(error);
          this.$confirm('获取个人资料失败, 是否重新获取?', '错误', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.getProfile();
          }).catch(() => {
            this.loading = false;
          });
        });
    }
  },
  mounted() {
    this.getProfile();
  }
};
</script>

<style lang="scss">
.profile {
  .profile-content {
    padding: 10px 30px;
  }
}
</style>
