<template>
  <div class="register-container">
    <div class="form-container">
      <h2>用户注册</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">姓名：</label>
          <input
              type="text"
              id="name"
              v-model="name"
              placeholder="请输入您的姓名"
              required
          />
        </div>
        <div class="form-group">
          <label for="phone">手机号：</label>
          <input
              type="text"
              id="phone"
              v-model="phone"
              placeholder="请输入您的手机号(请输入您的真实手机号)"
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
        <div class="form-group">
          <label for="confirmPassword">确认密码：</label>
          <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="请再次输入密码"
              required
          />
        </div>
        <div class="form-group">
          <div class="radio-group">
            <label>
              <input
                  type="radio"
                  name="role"
                  value="teacher"
                  v-model="role"
                  required
              />
              教师
            </label>
            <label>
              <input
                  type="radio"
                  name="role"
                  value="parent"
                  v-model="role"
                  required
              />
              家长
            </label>
          </div>
        </div>

        <button type="submit">注册</button>
      </form>
      <p class="login-link">
        注册完毕，<span @click="goToLogin">去登录</span>
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
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
      errorMessage: null,
    };
  },
  methods: {
    async register() {
      // 表单验证
      if (this.password !== this.confirmPassword) {
        this.errorMessage = '两次输入的密码不一致';
        return;
      }

      // 确保用户名、手机号、密码和角色都不为空
      if (!this.name || !this.phone || !this.password || !this.role) {
        this.errorMessage = '请填写完整的注册信息';
        return;
      }

      try {
        // 向后端发送注册请求
        const response = await axios.post('http://localhost:8889/user/register', {
          username: this.name,
          phoneNumber: this.phone,
          password: this.password,
          role: this.role,
        });

        // 处理返回的数据
        if (response.data.code === 200) {
          this.$message.success("注册成功");
          // 注册成功后跳转到登录页面
          this.$router.push({ name: 'Login' });
        } else {
          // 如果返回的msg不为注册成功，显示错误信息
          this.errorMessage = response.data.msg || '注册失败，请检查输入信息';
        }
      } catch (error) {
        // 根据错误代码处理不同的错误信息
        if (error.response.status === 500) {
          if (error.response.data.msg === "该手机号已被注册") {
            this.errorMessage = "该手机号已被注册";
          } else {
            this.errorMessage = error.response.data.msg || '注册失败，请检查输入信息';
          }
        } else {
          this.$message.error("注册失败");
          this.errorMessage = '注册失败，请检查输入信息';
        }
      }
    },
    goToLogin() {
      // 跳转到登录页面
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>

<style scoped>
.register-container {
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
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
  position: absolute;
  top: 55%;
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
input[type="email"],
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

.radio-group {
  display: flex;
  gap: 25px;
}

.radio-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

.login-link span {
  color: #007bff;
  cursor: pointer;
}
.login-link span:hover {
  text-decoration: underline;
}
.login-link {
  text-align: right; /* 将文字靠右对齐 */
  margin-top: 15px;
  font-size: 14px;
}
</style>
