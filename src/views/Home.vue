<template>
  <el-container style="height: 100%;">
    <el-header>
      <Header :userPicture="userPicture" :userName="userName" />
    </el-header>
    <div class="divider"></div> <!-- 分割线 -->
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
    }
  },
  mounted() {
    const userPicture = localStorage.getItem('userPicture');
    const userName = localStorage.getItem('userName');
    this.userPicture = userPicture || ''; // 如果获取不到则设为空字符串
    this.userName = userName || '';
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
