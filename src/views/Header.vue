<template>
  <div class="header">
    <img src="@/images/4.png" alt="Logo" class="logo" />
    <div class="title">智学家教平台</div>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <img :src="userPicture" class="user-picture" alt="用户头像" />
        {{ userName }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 退出登录确认对话框 -->
    <el-dialog
        title="确认退出"
        v-model="dialogVisible"
        width="30%"
    >
      <span>你是否确定退出登录？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="logout">退出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  props: {
    userName: String,
    userPicture: String,
  },
  data() {
    return {
      dialogVisible: false, // 初始化 dialogVisible 状态
    };
  },
  methods: {
    handleCommand(command) {
      if (command === 'profile') {
        alert('个人中心');
      } else if (command === 'logout') {
        this.dialogVisible = true; // 显示退出登录对话框
      }
    },
    async logout() {
      // 获取当前用户的 token
      const token = localStorage.getItem('token');
      // 调用后端的退出接口
      try {
        const response = await axios.post('http://localhost:8889/user/logout');

        if (response.data.code === 200) {
          // 退出成功，清除本地存储的用户数据
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userPicture');
          localStorage.removeItem('role');
          this.$router.push('/login'); // 跳转到登录页面
          this.$message.success(response.data.msg); // 提示成功退出
        } else {
          this.$message.error(response.data.msg || '退出失败');
        }
      } catch (error) {
        this.$message.error('退出失败，请稍后重试');
        console.error(error);
      }
      this.dialogVisible = false; // 关闭对话框
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 60px;
  background-color: slateblue;
  box-sizing: border-box;
  border-radius: 10px;
}

.logo {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid white;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin-right: auto;
}

.user-picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  font-size: 15px;
}

.dialog-footer {
  text-align: right;
}
</style>
