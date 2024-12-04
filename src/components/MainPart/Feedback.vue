<template>
  <div>
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-input
          v-model="searchQuery"
          placeholder="搜索内容"
          class="search-input"
      />
      <el-button @click="search" type="primary" class="search-button">搜索</el-button>
      <el-button @click="resetSearch" class="reset-button">重置</el-button>
      <el-button type="success" @click="openAddDialog" class="add-button">新增</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="pagedData" stripe style="width: 100%">
      <el-table-column prop="id" label="反馈ID" sortable min-width="100"/>
      <el-table-column prop="senderId" label="用户ID" sortable min-width="100"/>
      <el-table-column prop="username" label="用户名" min-width="100"/>
      <el-table-column prop="role" label="角色" min-width="100"/>
      <el-table-column label="头像" min-width="100">
        <template #default="scope">
          <img v-if="scope.row.picture" :src="scope.row.picture" alt="头像" style="width: 50px; height: 50px; border-radius: 50%;"/>
          <span v-else>暂无头像</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="反馈内容" min-width="200">
        <template #default="scope">
          <el-tooltip :content="scope.row.message" placement="top">
            <el-input
                type="textarea"
                :rows="1"
                :value="scope.row.message"
                disabled
                style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="反馈时间" min-width="180"/>
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <div class="action-buttons">
            <el-button size="small" @click="editRow(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(scope.$index, scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页选择器 -->
    <div class="pagination-container">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[1, 3, 5, 10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增反馈对话框 -->
    <el-dialog
        title="新增反馈"
        v-model="dialogVisible"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="addForm" ref="form">
        <el-form-item label="反馈内容">
          <el-input v-model="addForm.message" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addFeedback">确定</el-button>
      </div>
    </el-dialog>


    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑反馈信息"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="form" ref="form">

        <el-form-item label="反馈内容">
          <el-input
              type="textarea"
              v-model="form.message"
              :autosize="{ minRows: 3, maxRows: 6 }"
              placeholder="请输入反馈内容"
              style="resize: none; overflow: hidden;"
          />
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled/>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.role" disabled />
        </el-form-item>
        <el-form-item label="反馈时间">
          <el-input v-model="form.createdAt" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateFeedback">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
        title="确认删除"
        v-model="dialogVisible1"
        width="30%"
        @close="handleDialogClose">
      <br>
      <span>你确定要删除该反馈信息吗？</span>
      <br><br><br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="deleteFeedback">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dialogVisible2: false, // 控制编辑对话框显示
      form: {
        id: '',
        senderId: '',
        message: '',
        createdAt: '',
        username: '',
        role: '',
        picture: ''
      },
      editingRow: null, // 当前编辑的行数据
      dialogVisible1: false, // 删除对话框
      deleteIndex: null, // 当前待删除的项的索引
      deleteRowData: null, // 当前待删除的项的数据
      dialogVisible: false, // 控制新增反馈对话框显示
      addForm: { // 新增反馈的表单
        message: ''
      },
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.tableData;
      return this.tableData.filter(item =>
          Object.values(item).some(val =>
              String(val).toLowerCase().includes(this.searchQuery.toLowerCase())
          )
      );
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.totalItems = this.filteredData.length;
      return this.filteredData.slice(start, end);
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8889/feedback/selectAllFeedbacks'); // 更新为你的后端API URL
        if(response.data.code===200){
          this.tableData = response.data.data.map(feedback => ({
            id: feedback.id, // 反馈ID
            senderId: feedback.senderId, // 用户ID
            message: feedback.message, // 反馈内容
            createdAt: feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : '无', // 反馈时间
            username: feedback.username || '未知', // 用户名
            role: feedback.role || '未知', // 角色
            picture: feedback.picture || '', // 头像URL
          }));
        }else{
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    search() {},
    resetSearch() {
      this.searchQuery = '';
    },
    editRow(row) {
      this.dialogVisible2 = true;
      this.form = { ...row };
    },
    async updateFeedback() {
      this.form.createdAt = null;
      try {
        const response = await axios.put(`http://localhost:8889/feedback/updateFeedback`, this.form);
        if (response.data.code === 200) {
          this.$message.success("反馈信息更新成功！");
          this.dialogVisible2 = false;
          // 重新加载数据，更新表格
          await this.fetchData();
        }else{
          this.$message.error(response.data.msg ||"修改失败");
        }
      } catch (error) {
        console.error('Error updating feedback:', error);
        this.$message.error("更新失败！");
      }
    },
    confirmDelete(index, row) {
      this.dialogVisible1 = true;
      this.deleteIndex = index;
      this.deleteRowData = row;
    },
    handleDialogClose() {
      this.dialogVisible1 = false;
    },
    async deleteFeedback() {
      try {
        const response = await axios.delete(`http://localhost:8081/feedback/${this.deleteRowData.id}`);
        if (response.status === 200) {
          this.tableData.splice(this.deleteIndex, 1);
          this.dialogVisible1 = false;
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    openAddDialog() {
      this.dialogVisible = true;
      this.addForm = { message: '' }; // 清空新增反馈表单
    },
    async addFeedback() {
      try {
        const response = await axios.post('http://localhost:8889/feedback/insertFeedback', {
          message: this.addForm.message,
        });
        if (response.data.code === 200) {
          this.fetchData(); // 新增成功后重新获取数据
          this.dialogVisible = false; // 关闭对话框
          this.$message.success('新增反馈成功');
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error adding feedback:', error);
        this.$message.error('新增反馈失败');
      }
    },
    resetForm() {
      this.addForm = { message: '' }; // 重置新增反馈表单
    },
  },

};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  margin-right: 10px;
}

.search-button,
.reset-button {
  margin-left: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
