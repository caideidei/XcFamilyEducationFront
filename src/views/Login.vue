<template>
  <div class="login-container">
    <div class="form-container">
<!--      <h2>用户登录</h2>-->
      <br>
      <div class="login-toggle">
        <span
            :class="{ active: loginMethod === 'password' }"
            @click="switchToPasswordLogin"
        >
          账号密码登录
        </span>
        <span
            :class="{ active: loginMethod === 'phoneCode' }"
            @click="switchToPhoneCodeLogin"
        >
          手机验证码登录
        </span>
      </div>
      <form @submit.prevent="login">
        <div v-if="loginMethod === 'password'" class="form-group">
          <label for="phoneNumber">账号：</label>
          <input
              type="text"
              id="phoneNumber"
              v-model="phoneNumber"
              placeholder="请输入登录账号(手机号)"
              required
          />
        </div>
        <div v-if="loginMethod === 'password'" class="form-group">
          <label for="password">密码：</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="请输入密码"
              required
          />
        </div>
        <div v-if="loginMethod === 'phoneCode'" class="form-group">
          <label for="phone">手机号：</label>
          <input
              type="text"
              id="phone"
              v-model="phoneNumber"
              placeholder="请输入手机号"
              required
          />
        </div>
        <div v-if="loginMethod === 'phoneCode'" class="form-group">
          <label for="phoneCode">验证码：</label>
          <div class="code-container">
            <input
                type="text"
                id="phoneCode"
                v-model="phoneCode"
                placeholder="请输入验证码"
                required
            />
            <button
                type="button"
                @click="sendCode"
                :disabled="sendingCode || countdown > 0"
                :style="{
                    width: '160px',
                    height: '34px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: countdown > 0 ? '#ccc' : '#007bff'
                  }"
                >
              <span v-if="countdown > 0" :style="{ fontSize: '12px' }">{{ countdown }}s 后重新获取</span>
              <span v-else>发送验证码</span>
            </button>


          </div>
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
import axios from "axios";

export default {
  data() {
    return {
      phoneNumber: "",
      password: "",
      phoneCode: "",
      errorMessage: null,
      loginMethod: "password", // 当前登录方式: 'password' 或 'phoneCode'
      sendingCode: false, // 发送验证码状态
      countdown: 0, // 用于显示倒计时
    };
  },
  methods: {
    switchToPasswordLogin() {
      this.loginMethod = "password";
      this.errorMessage = null; // 清空错误信息
    },
    switchToPhoneCodeLogin() {
      this.loginMethod = "phoneCode";
      this.errorMessage = null; // 清空错误信息
    },
    async login() {
      try {
        const url =
            this.loginMethod === "password"
                ? "http://localhost:8889/user/login"
                : "http://localhost:8889/user/loginByPhoneCode";

        const payload =
            this.loginMethod === "password"
                ? { phoneNumber: this.phoneNumber, password: this.password }
                : { phoneNumber: this.phoneNumber, phoneCode: this.phoneCode };

        const response = await axios.post(url, payload);

        if (response.data.code === 200) {
          const token = response.data.data.token;
          const refreshToken = response.data.data.refreshToken;
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken",refreshToken);
          await this.fetchUserInfo(token);
          this.$message.success("登录成功");
          const role = localStorage.getItem("role");
          if (role === "teacher") {
            this.$router.push({ name: "Teacher" });
          } else if (role === "parent") {
            this.$router.push({ name: "Parent" });
          } else if (role === "admin") {
            this.$router.push({ name: "Home" });
          }
        } else {
          this.errorMessage = response.data.msg || "登录失败";
        }
      } catch (error) {
        this.errorMessage = "登录失败，请检查输入信息";
        console.error(error);
      }
    },
    async sendCode() {
      if (!this.phoneNumber) {
        this.$message.error("请输入手机号");
        return;
      }
      try {
        this.sendingCode = true;
        const response = await axios.get(
            "http://localhost:8889/common/sendMessage",
            { params: { phone: this.phoneNumber } }
        );
        if (response.data.code === 200) {
          this.$message.success("验证码已发送");
          this.countdown = 60; // 设置倒计时60秒
          const interval = setInterval(() => {
            if (this.countdown <= 0) {
              clearInterval(interval);
              this.sendingCode = false; // 恢复按钮状态
            } else {
              this.countdown--; // 每秒减1
            }
          }, 1000);
        } else {
          this.$message.error(response.data.msg || "验证码发送失败");
        }
      } catch (error) {
        this.$message.error("验证码发送失败，请重试");
        console.error(error);
      }
    },
    toggleLoginMethod() {
      this.loginMethod = this.loginMethod === "password" ? "phoneCode" : "password";
      this.errorMessage = null; // 清空错误信息
    },
    async fetchUserInfo(token) {
      try {
        const response = await axios.get("http://localhost:8889/user/user-info");
        if (response.data.code === 200) {
          const userInfo = response.data.data;
          this.userName = userInfo.username;
          this.userPicture = userInfo.picture || "src/images/3.jpg";
          this.role = userInfo.role;
          localStorage.setItem("userName", this.userName);
          localStorage.setItem("userPicture", this.userPicture);
          localStorage.setItem("role", this.role);
        } else {
          console.error("获取用户信息失败", response.data.msg);
        }
      } catch (error) {
        console.error("请求用户信息失败", error);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
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
.register-link span {
  color: #007bff;
  cursor: pointer;
}
.register-link span:hover {
  text-decoration: underline;
}
.code-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.login-toggle {
  display: flex;
  justify-content: center;
  gap: 20px; /* 设置间距 */
  margin-bottom: 20px; /* 与其他部分保持距离 */
  font-size: 18px; /* 字体大小 */
  font-weight: bold; /* 加粗 */
}

.login-toggle span {
  font-size: 16px;
  cursor: pointer;
  color: #555;
  position: relative;
  transition: color 0.3s;
}

.login-toggle span:hover {
  color: #007bff;
}

.login-toggle span.active {
  color: #007bff;
  font-weight: bold;
}

.login-toggle span.active::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: #007bff;
  position: absolute;
  bottom: -5px;
  left: 0;
}

</style>
