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
      <el-button @click="openAddDialog" type="success" class="add-button" >新增</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="pagedData" stripe style="width: 100%">
      <el-table-column prop="feedbackId" label="反馈号" sortable min-width="100"/>
      <el-table-column prop="feedbackPerson" label="反馈人"  min-width="100"/>
      <el-table-column prop="feedbackRole" label="角色" sortable min-width="100"/>
      <el-table-column prop="feedbackText" label="反馈内容" min-width="150"/>
      <el-table-column prop="feedbackTime" label="反馈时间" sortable min-width="150"/>
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
          :page-sizes="[1,3,5,10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

<!--    增加数据对话框-->
    <el-dialog
        title="新增反馈"
        v-model="addDialogVisible"
        width="30%"
        @close="resetAddForm"
        @keydown="handleAddKeyDown"
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="反馈号">
          <el-input v-model="addForm.feedbackId" />
        </el-form-item>
        <el-form-item label="反馈人">
          <el-input v-model="addForm.feedbackPerson" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="addForm.feedbackRole" />
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input type="textarea" v-model="addForm.feedbackText" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addFeedback">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑反馈"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
        @keydown="handleUpdateKeyDown"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="反馈号">
          <el-input v-model="form.feedbackId" disabled />
        </el-form-item>
        <el-form-item label="反馈人">
          <el-input v-model="form.feedbackPerson" disabled/>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.feedbackRole" disabled/>
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input type="textarea" v-model="form.feedbackText" @keydown.enter.native.stop/>
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
        @close="handleDialogClose"
        @keydown="handleDeleteKeyDown">
      <br>
      <span>你确定要删除该数据吗？</span>
      <br><br><br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="deleteRow">确认</el-button>
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
      editingRow: null, // 当前编辑的行数据
      dialogVisible1: false, // 控制删除确认对话框显示
      deleteIndex: null, // 当前待删除的项的索引
      deleteRowData: null, // 当前待删除的项的数据
      addDialogVisible: false, // 控制新增对话框显示
      form: {
        feedbackId: '',
        feedbackPerson: '',
        feedbackRole: '',
        feedbackText: '',
        feedbackTime: '',
      },
      addForm: {
        feedbackId: '',
        feedbackPerson: '',
        feedbackRole: '',
        feedbackText: '',
        feedbackTime: null, // 可以在后端自动生成时间
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
        const response = await axios.get('http://localhost:8081/feedback/selectall'); // 更新为你的后端API URL
        this.tableData = response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    search() {
      // 搜索逻辑已经在 computed 中处理，点击按钮可触发计算
    },
    resetSearch() {
      this.searchQuery = '';
    },

    editRow(row) {
      this.dialogVisible2 = true; // 显示编辑对话框
      this.form = { ...row }; // 复制行数据到表单
    },
    async updateFeedback() {
      try {
        this.form.feedbackTime = null; // 将反馈时间设置为 null
        const response = await axios.put(`http://localhost:8081/feedback/${this.form.feedbackId}`, this.form); // 更新为你的后端API URL
        if (response.data.success === true) {
          this.$message.success('修改成功');
        } else {
          this.$message.error('修改失败');
        }
        this.dialogVisible2 = false; // 隐藏对话框
        this.fetchData(); // 刷新表格数据
      } catch (error) {
        console.error('Error updating feedback:', error);
        this.$message.error('修改失败');
      }
    },
    resetForm() {
      this.form = {
        feedbackId: '',
        feedbackPerson: '',
        feedbackRole: '',
        feedbackText: '',
        feedbackTime: '',
      };
    },
    handleUpdateKeyDown(event) {
      if (event.key === 'Enter') {
        this.updateFeedback();
      }
    },
    // 打开新增数据对话框
    openAddDialog() {
      this.addDialogVisible = true;
    },
    //具体方法
    async addFeedback() {
      try {
        const response = await axios.post('http://localhost:8081/feedback/insert', this.addForm);
        if (response.data.success === true) {
          this.$message.success('新增成功');
          this.fetchData(); // 刷新表格数据
          this.addDialogVisible = false; // 隐藏对话框
        } else {
          this.$message.error('新增失败');
        }
      } catch (error) {
        console.error('Error adding feedback:', error);
        this.$message.error('新增失败');
      }
    },
    //重置数据
    resetAddForm() {
      this.addForm = {
        feedbackId: '',
        feedbackPerson: '',
        feedbackRole: '',
        feedbackText: '',
        feedbackTime: null,
      };
    },
    handleAddKeyDown(event) {
      if (event.key === 'Enter') {
        this.addFeedback();
      }
    },

    confirmDelete(index, row) {
      this.deleteIndex = index;
      this.deleteRowData = row;
      this.dialogVisible1 = true;
    },
    async deleteRow() {
      try {
        const response = await axios.delete(`http://localhost:8081/feedback/${this.deleteRowData.feedbackId}`); // 更新为你的后端API URL
        if (response.data.success === true) {
          this.tableData.splice(this.deleteIndex, 1);
          this.$message.success('删除成功');
        } else {
          this.$message.error('删除失败');
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        this.$message.error('删除失败');
      }
      this.handleDialogClose();
    },
    handleDialogClose() {
      this.dialogVisible1 = false;
      this.deleteIndex = null;
      this.deleteRowData = null;
    },
    handleDeleteKeyDown(event) {
      if (event.key === 'Enter') {
        this.deleteRow();
      }
    },

    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1; // 重置当前页码为 1
    },
    handleCurrentChange(page) {
      this.currentPage = page;
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
  gap: 10px; /* Add some space between buttons */
}

.action-button {
  border: 1px solid #dcdfe6; /* Light border color */
  border-radius: 4px; /* Rounded corners */
  padding: 4px 8px; /* Padding around the text */
}

.pagination-container {
  margin-top: 20px;
}

/*对话框样式*/
.dialog-footer {
  text-align: right;
}
</style>
