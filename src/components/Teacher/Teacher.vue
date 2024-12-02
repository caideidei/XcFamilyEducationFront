<template>
  <el-container style="height: 100%;">
    <el-header>
      <Teacher_Header
          :userName="userName"
          :userPicture="userPicture"
          @selectSection="updateSection"
      />
    </el-header>
    <el-main>
      <Teacher_Content :selectedSection="selectedSection" />
    </el-main>
  </el-container>
</template>

<script>
import Teacher_Header from './Teacher_Header.vue';
import Teacher_Content from './Teacher_Content.vue';

export default {
  components: {
    Teacher_Header,
    Teacher_Content,
  },
  data() {
    return {
      selectedSection: '家教广场', // 默认选中的栏目
      userName: '当前用户', // 假设默认名称为 "当前用户"
      userPicture: '', // 假设头像暂时为空
    };
  },
  methods: {
    updateSection(section) {
      this.selectedSection = section;
    },
  },
  mounted() {
    // 这里可以从localStorage获取实际的用户信息，如果有的话
    const userPicture = localStorage.getItem('userPicture');
    const userName = localStorage.getItem('userName');
    this.userPicture = userPicture || '';
    this.userName = userName || '当前用户';
  }
};
</script>

<style scoped>
.el-header {
  background-color: slateblue;
  color: white;
  padding: 0;
}
</style>
