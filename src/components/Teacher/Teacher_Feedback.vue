<template>
  <!-- 搜索筛选栏 -->
  <div class="search-container" style="margin-bottom: 20px;"> <!-- 增加搜索栏下方的距离 -->
    <el-input
        v-model="searchQuery"
        placeholder="搜索内容"
        class="search-input"
        style="width: auto"
    />
    <el-button @click="search" type="primary" class="search-button" style="margin-left: 10px;">搜索</el-button>
    <el-button @click="resetSearch" class="reset-button" style="margin-left: 10px;">重置</el-button>
  </div>

  <div class="feedback-section">
    <!-- 上部按钮 -->
    <div class="button-container">
      <el-button @click="openAddDialog" type="primary">我要发言</el-button>
      <el-button @click="filterMyFeedback" type="success">我的发言</el-button>
    </div>

<!--    &lt;!&ndash; 留言展示 &ndash;&gt;-->
<!--    <div class="feedback-list">-->
<!--      <el-table :data="filteredData" border={false} style="width: 100%">-->
<!--        <el-table-column prop="feedbackPerson" label="反馈人" min-width="100" />-->
<!--        <el-table-column prop="feedbackRole" label="角色" min-width="100" />-->
<!--        <el-table-column prop="feedbackText" label="反馈内容" min-width="250" />-->
<!--        <el-table-column prop="feedbackTime" label="反馈时间" min-width="150" />-->
<!--      </el-table>-->
<!--    </div>-->
    <div class="feedback-list">
      <!-- 使用 v-for 循环展示每条反馈数据 -->
      <div v-for="feedback in filteredData" :key="feedback.id" class="feedback-card">
        <!-- 反馈人和角色显示在同一行 -->
        <div class="feedback-header">
          <span>{{ feedback.feedbackPerson }}</span> - <span>{{ feedback.feedbackRole }}</span>
        </div>
        <!-- 反馈内容单独一行 -->
        <div class="feedback-content">{{ feedback.feedbackText }}</div>
        <!-- 反馈时间单独一行 -->
        <div class="feedback-time">时间: {{ feedback.feedbackTime }}</div>
      </div>
    </div>

    <!-- 留言提交表单 -->
    <el-dialog title="我要发言" v-model="addDialogVisible" width="30%">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="姓名">
          <el-input v-model="addForm.feedbackPerson"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="addForm.feedbackRole"></el-input>
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input type="textarea" v-model="addForm.feedbackText"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addFeedback">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: '', // 搜索关键词
      feedbackList: [], // 全部留言
      filteredList: [], // 过滤后的留言
      currentUser: '当前用户姓名', // 假设有一个当前用户的姓名
      addDialogVisible: false,
      addForm: {
        feedbackPerson: '',
        feedbackRole: '',
        feedbackText: '',
      },
    };
  },
  computed: {
    filteredData() {
      // 如果有过滤后的列表，按时间排序；否则对全体留言排序
      const data = this.filteredList.length ? this.filteredList : this.feedbackList;
      return data.sort((a, b) => new Date(b.feedbackTime) - new Date(a.feedbackTime));
    }
  },
  created() {
    this.fetchFeedback();
  },
  methods: {
    // 获取所有留言数据
    async fetchFeedback() {
      try {
        const response = await axios.get("http://localhost:8081/feedback/selectall");
        this.feedbackList = response.data.data;
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    },
    // 过滤我的留言
    filterMyFeedback() {
      this.filteredList = this.feedbackList.filter(
          feedback => feedback.feedbackPerson === this.currentUser
      );
    },
    // 打开发言对话框
    openAddDialog() {
      this.addDialogVisible = true;
    },
    // 提交留言
    async addFeedback() {
      try {
        const response = await axios.post("http://localhost:8081/feedback/insert", this.addForm);
        if (response.data.success) {
          this.$message.success("留言提交成功！");
          this.fetchFeedback(); // 重新获取留言
          this.addDialogVisible = false; // 关闭对话框
        } else {
          this.$message.error("提交失败！");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        this.$message.error("提交失败！");
      }
    },
    // 搜索功能
    search() {
      this.filteredList = this.feedbackList.filter(feedback =>
          feedback.feedbackText.includes(this.searchQuery) || // 搜索反馈内容
          feedback.feedbackPerson.includes(this.searchQuery) || // 搜索反馈人
          feedback.feedbackRole.includes(this.searchQuery) ||// 搜索角色
          feedback.feedbackTime.includes(this.searchQuery) // 搜索角色
      );
    },

    // 重置搜索
    resetSearch() {
      this.searchQuery = '';
      this.filteredList = this.feedbackList;
    },

  }
};
</script>

<style scoped>
.feedback-section {
  padding: 20px;
  gap: 10px;
  margin-top: -20px; /* 调整按钮上移的距离 */
  margin-left: -20px;
  min-height: 605px; /*调整背景高度*/
  border-radius: 10px; /* 设置圆角半径 */
}
.button-container {
  margin-bottom: 20px;
}
.feedback-list {
  margin-top: 20px;
}
.dialog-footer {
  text-align: right;
}
.feedback-list {
  margin-top: 20px;
}

/* 新增：卡片样式的反馈展示 */
.feedback-card {
  background-color: #f9f9f9; /* 背景色 */
  border: 1px solid #ddd; /* 边框 */
  padding: 15px;
  margin-bottom: 10px; /* 每条反馈之间的间距 */
  border-radius: 8px; /* 圆角边框 */
}

.feedback-header {
  font-weight: bold;
  margin-bottom: 5px; /* 反馈人和角色与内容之间的间距 */
}

.feedback-content {
  margin-bottom: 10px; /* 内容与反馈时间之间的间距 */
}

.feedback-time {
  color: #888; /* 时间字体颜色 */
  font-size: 12px; /* 时间字体大小 */
}
</style>
