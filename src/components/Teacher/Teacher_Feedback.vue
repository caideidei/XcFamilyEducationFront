<template>
  <!-- 留言反馈界面 -->
  <div class="feedback-section">
    <!-- 左上角标签 -->
    <div class="header-label">留言反馈</div>

    <!-- 搜索筛选栏 -->
    <div class="search-container" style="margin-bottom: 20px;">
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
        <el-button @click="addNewFeedback" type="paimary">我要反馈</el-button>
        <!-- 上部按钮 -->
          <el-button @click="toggleFeedbackType" type="success">
            {{ isMyFeedback ? '所有反馈' : '我的反馈' }}
          </el-button>

      </div>

      <div class="feedback-list">
        <!-- 使用 v-for 循环展示每条反馈数据 -->
        <div v-for="feedback in filteredData" :key="feedback.id" class="feedback-card">
          <div class="feedback-header">
            <img :src="feedback.picture" alt="头像" class="avatar"/>
            <span class="username">{{ feedback.username }}</span>
<!--            <span>{{ feedback.role }}</span>-->
            <span class="message">{{ feedback.message }}</span>
          </div>
<!--          <div class="feedback-content">{{ feedback.message }}</div>-->
          <div class="feedback-time">{{ feedback.createdAt }}</div>
        </div>
      </div>


    </div>
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
      isMyFeedback: false, // 默认显示所有反馈
    };
  },
  computed: {
    filteredData() {
      // 如果有过滤后的列表，按时间排序；否则对全体留言排序
      const data = this.filteredList.length ? this.filteredList : this.feedbackList;
      return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.totalItems = this.filteredData.length;
      return this.filteredData.slice(start, end);
    },
  },
  created() {
    this.fetchFeedback();
  },
  methods: {
    toggleFeedbackType() {
      this.isMyFeedback = !this.isMyFeedback;  // 切换状态
      if (this.isMyFeedback) {
        this.filterMyFeedback();  // 显示我的反馈
      } else {
        this.fetchFeedback();  // 显示所有反馈
      }
    },
    // 获取所有留言数据
    async fetchFeedback() {
      try {
        const response = await axios.get("http://localhost:8889/feedback/selectAllFeedbacks");
        if (response.data.code === 200) {
          // 映射数据到反馈列表
          this.feedbackList = response.data.data.map(feedback => ({
            id: feedback.id, // 留言ID
            senderId: feedback.senderId, // 发送者ID
            username: feedback.username || '匿名', // 用户名
            role: feedback.role || '未定义', // 角色
            picture: feedback.picture || '', // 头像
            message: feedback.message || '无内容', // 反馈内容
            createdAt: feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : '无时间', // 时间格式化
          }));
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    },
    // 过滤我的留言
    async filterMyFeedback() {
      try {
        const response = await axios.get("http://localhost:8889/feedback/selectMyFeedbacks");
        if (response.data.code === 200) {
          // 映射数据到反馈列表
          this.feedbackList = response.data.data.map(feedback => ({
            id: feedback.id, // 留言ID
            senderId: feedback.senderId, // 发送者ID
            username: feedback.username || '匿名', // 用户名
            role: feedback.role || '未定义', // 角色
            picture: feedback.picture || '', // 头像
            message: feedback.message || '无内容', // 反馈内容
            createdAt: feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : '无时间', // 时间格式化
          }));
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    },
    // 搜索功能
    search() {
      this.filteredList = this.feedbackList.filter(feedback =>
          feedback.message.includes(this.searchQuery) || // 搜索反馈内容
          feedback.username.includes(this.searchQuery) || // 搜索反馈人
          feedback.role.includes(this.searchQuery) || // 搜索角色
          feedback.createdAt.includes(this.searchQuery) // 搜索时间
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
  margin-top: -20px;
  margin-left: -20px;
  min-height: 605px;
  border-radius: 10px;
}

.header-label {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
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
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.feedback-header {
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.feedback-header .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.feedback-content {
  margin-bottom: 10px;
}
.username {
  font-weight: bold;
  margin-right: 20px; /* 用户名和反馈内容之间的间距 */
}
.feedback-time {
  color: #888;
  font-size: 12px;
}
.message {
  font-size: 14px; /* 设置反馈内容的字体大小 */
  color: #333; /* 文字颜色 */
  font-weight: normal;
}
</style>
