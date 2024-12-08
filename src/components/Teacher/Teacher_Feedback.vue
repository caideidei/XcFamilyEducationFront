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
          style="width: auto; height: 40px"
      />
      <el-button @click="search" type="primary" class="search-button" style="margin-left: 10px;">搜索</el-button>
      <el-button @click="resetSearch" type="" class="reset-button" style="margin-left: 10px;">重置</el-button>
      <el-button @click="openAddDialog" type="success" class="add-button">我要反馈</el-button>
      <!-- 上部按钮 -->
      <el-button @click="toggleFeedbackType" type="warning" class="toggle-button">
        {{ isMyFeedback ? '所有反馈' : '我的反馈' }}
      </el-button>
    </div>

    <div class="feedback-list">
      <!-- 使用 v-for 循环展示每条反馈数据 -->
      <div v-for="feedback in filteredData" :key="feedback.id" class="feedback-card">
        <div class="feedback-header">
          <div class="feedback-header-left">
            <img :src="feedback.picture" alt="头像" class="avatar"/>
            <span class="username">{{ feedback.username }}</span>
            <span class="message">{{ feedback.message }}</span>
          </div>
          <div class="feedback-actions">
            <el-button @click="editFeedback(feedback.id)" size="mini" type="primary">编辑</el-button>
            <el-button @click="showDeleteDialog(feedback.id)" size="mini" type="danger">删除</el-button>
          </div>
        </div>

        <div class="feedback-time">{{ feedback.createdAt }}</div>
      </div>
    </div>

    <el-dialog
        title="新增反馈"
        v-model="dialogVisible"
        width="30%"
        @close="resetForm"
        :style="{ marginTop: '250px' }"
    >
      <el-form :model="addForm" ref="form">
        <el-form-item label="反馈信息">
          <el-input v-model="addForm.message" type="textarea" rows="4" placeholder="请输入反馈内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNewFeedback">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
        title="确认删除"
        v-model="deleteDialogVisible"
        width="30%"
        @close="resetDeleteDialog"
        :style="{ marginTop: '250px',width:'300px'}"
    >
      <span>您确定要删除该反馈吗？</span>
      <br>
      <br>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteFeedback">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="编辑反馈"
        v-model="dialogVisible1"
        width="30%"
        @close="resetForm"
        :style="{ marginTop: '250px' }"
    >
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="反馈信息">
          <el-input v-model="editForm.message" type="textarea" rows="4" placeholder="请输入修改后的反馈内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateFeedback">确定</el-button>
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
      isMyFeedback: false, // 默认显示所有反馈
      dialogVisible: false, // 控制新增反馈对话框显示
      dialogVisible1:false,//编辑反馈对话框
      addForm:{message:''},
      deleteDialogVisible: false, // 控制删除对话框的显示与否
      feedbackIdToDelete: null,  // 存储需要删除的反馈的ID
      editForm: {
        id: '',  // 反馈ID
        senderId: '',  // 默认senderId，可以根据需要更改
        message: '',  // 修改的反馈内容
      },
    };
  },
  computed: {
    filteredData() {
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
      this.isMyFeedback = !this.isMyFeedback;
      if (this.isMyFeedback) {
        this.filterMyFeedback();
      } else {
        this.fetchFeedback();
      }
      this.resetSearch(); // 在切换反馈类型时重置搜索条件
    },
    async fetchFeedback() {
      try {
        const response = await axios.get("http://localhost:8889/feedback/selectAllFeedbacks");
        if (response.data.code === 200) {
          this.feedbackList = response.data.data.map(feedback => ({
            id: feedback.id,
            senderId: feedback.senderId,
            username: feedback.username || '匿名',
            role: feedback.role || '未定义',
            picture: feedback.picture || '',
            message: feedback.message || '无内容',
            createdAt: feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : '无时间',
          }));
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    },
    async filterMyFeedback() {
      try {
        const response = await axios.get("http://localhost:8889/feedback/selectMyFeedbacks");
        if (response.data.code === 200) {
          this.feedbackList = response.data.data.map(feedback => ({
            id: feedback.id,
            senderId: feedback.senderId,
            username: feedback.username || '匿名',
            role: feedback.role || '未定义',
            picture: feedback.picture || '',
            message: feedback.message || '无内容',
            createdAt: feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : '无时间',
          }));
        } else {
          this.$message.info(response.data.msg);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    },
    async addNewFeedback() {
      try {
        const response = await axios.post('http://localhost:8889/feedback/insertFeedback', this.addForm);
        if (response.data.code === 200) {
          await this.fetchFeedback();
          this.dialogVisible = false;
          this.$message.success('新增反馈成功');
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error adding feedback:', error);
        this.$message.error('新增反馈失败');
      }
    },
    search() {
      this.filteredList = this.feedbackList.filter(feedback =>
          feedback.message.includes(this.searchQuery) ||
          feedback.username.includes(this.searchQuery) ||
          feedback.role.includes(this.searchQuery) ||
          feedback.createdAt.includes(this.searchQuery)
      );
    },
    openAddDialog() {
      this.dialogVisible = true;
      this.addForm = { message:'' };
    },
    resetSearch() {
      this.searchQuery = '';
      this.filteredList = this.feedbackList;
    },
    resetForm() {
      this.addForm = { message:'' };
    },
    // 显示删除确认对话框
    showDeleteDialog(id) {
      this.deleteDialogVisible = true;
      this.feedbackIdToDelete = id;
      console.log("得到id:"+id)
      console.log("得到显示:"+this.deleteDialogVisible)
    },
    // 删除反馈
    async deleteFeedback() {
      try {
        const response = await axios.delete(`http://localhost:8889/feedback/deleteFeedback`, {
          params: { id: this.feedbackIdToDelete },
        });
        if (response.data.code === 200) {
          this.$message.success('删除成功');
          await this.fetchFeedback(); // 重新获取反馈列表
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error("删除反馈失败:", error);
        this.$message.error('删除失败');
      }
      this.deleteDialogVisible = false;
    },
    // 重置删除对话框状态
    resetDeleteDialog() {
      this.feedbackIdToDelete = null;
    },
    async editFeedback(id) {
      // 获取反馈信息进行修改
      const feedback = this.feedbackList.find(fb => fb.id === id);
      if (feedback) {
        this.editForm = { ...feedback }; // 将当前反馈信息传入表单
        this.dialogVisible1 = true; // 显示对话框
      }
    },
    async updateFeedback() {
      this.feedbackList.createdAt = null;
      try {
        const response = await axios.put('http://localhost:8889/feedback/updateFeedback', this.editForm);
        if (response.data.code === 200) {
          await this.fetchFeedback(); // 更新反馈列表
          this.dialogVisible1 = false; // 关闭对话框
          this.$message.success('修改反馈成功');
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error updating feedback:', error);
        this.$message.error('修改反馈失败');
      }
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

.username {
  margin-right: 10px; /* 用户名与消息之间的间距 */
}

.feedback-list {
  margin-top: 20px;
}

.feedback-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.feedback-header {
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  align-items: center; /* 保证头像和用户名垂直居中 */
  justify-content: space-between; /* 让头像、用户名和按钮之间分布 */
  width: 100%; /* 确保父容器占满宽度 */
}

.feedback-header-left {
  display: flex;
  align-items: center; /* 保证头像和用户名垂直居中 */
}

.feedback-header .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px; /* 头像与用户名之间的间距 */
}

.message {
  font-size: 14px;
  color: #333;
  font-weight: normal;
  margin-right: 20px; /* 确保消息与按钮有间距 */
}

.feedback-actions {
  display: flex;
  gap: 10px;
  align-items: center; /* 垂直居中按钮 */
}

.feedback-actions button {
  padding: 5px 10px;
}

.feedback-time {
  color: #888;
  font-size: 12px;
}

</style>
