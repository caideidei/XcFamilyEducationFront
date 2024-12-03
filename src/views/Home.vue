<template>
  <el-container style="height: 100%;">
    <el-header>
      <Header :userPicture="userPicture" :userName="userName" @logout="logout" />
    </el-header>
    <div class="divider"></div>
    <el-container style="width: 100%">
      <el-aside width="200px">
        <Sidebar @select="updateContent" />
      </el-aside>
      <el-main>
        <Content :selectedSection="selectedSection" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import Content from './Content.vue';

export default {
  components: {
    Header,
    Sidebar,
    Content,
  },
  data() {
    return {
      selectedSection: '0',
      userPicture: '',
      userName: '',
    };
  },
  methods: {
    updateContent(index) {
      this.selectedSection = index;
    },

    // 退出登录的方法
    logout() {
      // 清除本地存储中的用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPicture');

      // 跳转到登录页
      this.$router.push('/login');
    }
  },
  mounted() {
    // 从 localStorage 获取用户信息
    const userPicture = localStorage.getItem('userPicture');
    const userName = localStorage.getItem('userName');

    // 如果有数据，则更新组件的 data
    if (userPicture && userName) {
      this.userPicture = userPicture;
      this.userName = userName;
    } else {
      // 如果没有数据，可以尝试重新获取（例如用户未登录时）
      const token = localStorage.getItem('token');
      if (token) {
        this.fetchUserInfo(token); // 调用 API 获取用户信息
      }
    }
  }
};
</script>

<style>
.el-header {
  width: 100%;
  padding: 0;
  background-color: slateblue;
  border-radius: 5px;
}
</style>
