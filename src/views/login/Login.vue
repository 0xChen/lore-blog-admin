<template>
  <div class="login-container">
    <el-card class="form-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <el-divider><span class="form-title">登录</span></el-divider>
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          >
            <template v-slot:prefix>
              <svg-icon name="user" class="el-input__icon"/>
            </template>
          </el-input>
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大写锁定" placement="right" manual>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <template v-slot:prefix>
                <svg-icon name="lock" class="el-input__icon"/>
              </template>
              <template v-slot:suffix>
                <svg-icon
                  @click="showPassword"
                  :name="passwordType === 'password' ? 'eyeInvisible' : 'eye'"
                  class="el-input__icon"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-tooltip>
        <el-divider content-position="right">
          <el-checkbox label="记住登陆状态" v-model="loginForm.rememberMe"></el-checkbox>
        </el-divider>
        <el-form-item>
          <el-button
            :loading="loading" type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('用户名必须大于5位.'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度必须大于6位.'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: 'sunyuchen',
        password: 'SUNyuCHEN@blog',
        rememberMe: false
      },
      loginRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler(route) {
        const { query } = route;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus();
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus();
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        this.capsTooltip = (shiftKey && (key >= 'a' && key <= 'z')) || (!shiftKey && (key >= 'A' && key <= 'Z'));
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPassword() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
        return true;
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style lang="scss">
.login-container {
  height: 100%;
  background: linear-gradient(to left bottom, hsl(27, 100%, 85%) 0%,hsl(222, 100%, 85%) 100%);
  overflow: hidden;

  .form-container {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 160px auto 0;
    overflow: hidden;
    background: linear-gradient(to left bottom, hsl(222, 100%, 85%) 0%, hsl(27, 100%, 85%) 100%);
  }

  .login-form {

    .form-title {
      font-size: 1.5em;
      color: #FFFFFF;
    }

    .el-divider__text {
      background-color: unset;
    }
  }
}
</style>
