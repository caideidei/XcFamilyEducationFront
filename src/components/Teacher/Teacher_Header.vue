<template>
  <div class="header">
    <div class="header-left">
      <img src="@/images/4.png" alt="Logo" class="logo" />
      <div class="title">智学家教平台</div>
    </div>
    <div class="header-center">
      <el-menu
          mode="horizontal"
          @select="handleMenuSelect"
          :default-active="selectedSection"
          active-text-color="#ffd04b"
          background-color="transparent"
          text-color="white"
      >
        <el-menu-item index="家教广场">家教广场</el-menu-item>
        <el-menu-item index="我的家教">我的家教</el-menu-item>
        <el-menu-item index="系统公告">系统公告</el-menu-item>
        <el-menu-item index="留言反馈">留言反馈</el-menu-item>
      </el-menu>
    </div>
    <div class="header-right">
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
    </div>

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
export default {
  props: {
    userPicture: {
      type: String,
      default: () => require('@/images/3.jpg'),
    },
    userName: {
      type: String,
      default: '用户',
    },
  },
  data() {
    return {
      selectedSection: '家教广场', // 默认选中的栏目
      dialogVisible: false,
    };
  },
  methods: {
    handleMenuSelect(section) {
      this.selectedSection = section;
      this.$emit('selectSection', section);
    },
    handleCommand(command) {
      if (command === 'profile') {
        alert('个人中心');
      } else if (command === 'logout') {
        this.dialogVisible = true; // 显示对话框
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPicture');
      localStorage.removeItem('role');
      this.dialogVisible = false;
      this.$router.push('/login'); // 跳转到 Login.vue
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中对齐 */
  padding: 0 30px;
  height: 60px; /* 适当调整头部高度 */
  background-color: slateblue;
  box-sizing: border-box; /* 包含边框和内边距在宽度和高度中 */
  border-radius: 10px; /* 设置圆角半径 */
}

.header-left {
  display: flex;
  align-items: center;
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
}

.header-center {
  flex-grow: 1;
  text-align: center;
  padding-left: 50px; /* 将选择栏整体向右移动 */
}


.el-menu-item.is-active {
  background-color: darkslateblue !important; /* 选中项背景颜色 */
  font-weight: bold; /* 选中文字变粗 */
  color: #ffffff !important; /* 选中项文字颜色 */
}

.el-menu-item {
  padding: 0 15px !important; /* 左右增加 padding，扩大点击区域 */
  margin: 0 2px !important; /* 增加选项之间的间距 */
  padding-bottom: 0px !important; /* 消除可能导致底部黄线的 padding */
  margin-bottom: 0px !important; /* 修正底部对齐问题 */
}

.el-menu {
  border-bottom: none !important; /* 去掉底部边框 */
  padding-bottom: 0px; /* 增加底部内边距，防止内容挤到下方 */
}




.header-right {
  display: flex;
  align-items: center;
}

.user-picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover; /* 确保图片按比例显示 */
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  font-size: 15px;
}

.el-dropdown-link:focus {
  outline: none;
}

.dialog-footer {
  text-align: right;
}
</style>
