<template>
  <div class="login-container">
    <div class="form-container">
      <h2>用户登录</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="phoneNumber">账号：</label>
          <input
              type="text"
              id="phoneNumber"
              v-model="phoneNumber"
              placeholder="请输入登录账号(手机号)"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">密码：</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="请输入密码"
              required
          />
        </div>

        <button type="submit">登录</button>
      </form>
      <p class="register-link">
        还没有账号？<span @click="goToRegister">去注册</span>
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      phoneNumber: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8889/user/login', {
          phoneNumber: this.phoneNumber,
          password: this.password,
        });

        if (response.data.code === 200) {
          console.log("登录得到的信息如下："+response.data.data.token)
          // 获取 token 并保存到 localStorage
          const token = response.data.data.token;
          localStorage.setItem('token', token);  // 保存 token
          // 登录成功后获取用户信息
          await this.fetchUserInfo(token);
          // 显示成功消息
          this.$message.success("登录成功");

          // 跳转到首页
          this.$router.push({
            name: 'Home',
            // params: { userName, userPicture }
          });
        } else {
          this.errorMessage = response.data.msg || '登录失败，请检查账号和密码';
        }
      } catch (error) {
        this.errorMessage = '登录失败，请检查账号和密码';
        console.error(error);
      }
    },

    async fetchUserInfo(token) {
      try {
        const response = await axios.get('http://localhost:8889/user/user-info', {
          headers: {
            token: token,  // 从 localStorage 中获取 token 并传递给后端
          },
        });

        if (response.data.code === 200) {
          const userInfo = response.data.data;
          this.userName = userInfo.username;  // 更新用户名
          if (response.data.code === 200) {
            const userInfo = response.data.data;
            this.userName = userInfo.username;  // 更新用户名
            this.userPicture = userInfo.picture ? userInfo.picture : 'src/images/3.jpg';
            // 保存用户信息到 localStorage
            localStorage.setItem('userName', this.userName);
            localStorage.setItem('userPicture', this.userPicture);
          }

          // 保存用户信息到 localStorage
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('userPicture', this.userPicture);
        } else {
          console.error("获取用户信息失败", response.data.msg);
        }
      } catch (error) {
        console.error("请求用户信息失败", error);
      }
    },

    goToRegister() {
      this.$router.push('/register');  // 跳转到注册页面
    }
  },
};
</script>

<style scoped>
.login-container {
  position: relative;
  width: auto;
  height: 98vh;
  background-image: url('@/images/2.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10%;
}

.form-container {
  width: 300px;
  padding: 25px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
  position: absolute;
  top: 52%;
  right: 20%;
  transform: translateY(-50%);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 15px;
  text-align: center;
}

.register-link {
  text-align: right;
  margin-top: 15px;
  font-size: 14px;
}
</style>
