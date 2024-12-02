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
    </div>

    <!-- 表格 -->
    <el-table :data="pagedData" stripe style="width: 100%">
      <!-- 家长ID -->
      <el-table-column prop="id" label="家长ID" sortable min-width="100"/>
      <!-- 用户ID -->
      <el-table-column prop="userId" label="用户ID" sortable min-width="100"/>
      <!-- 用户名 -->
      <el-table-column prop="username" label="用户名" sortable min-width="100"/>
      <!-- 姓名 -->
      <el-table-column prop="realName" label="姓名" sortable min-width="100"/>
      <!-- 电话 -->
      <el-table-column prop="phoneNumber" label="电话" min-width="150"/>
      <!-- 邮箱 -->
      <el-table-column prop="email" label="邮箱" min-width="150"/>
      <!-- 角色 -->
<!--      <el-table-column prop="role" label="角色" min-width="100"/>-->
      <!-- 状态 -->
      <el-table-column prop="status" label="状态" min-width="100"/>
      <!-- 创建时间 -->
      <el-table-column prop="createdAt" label="创建时间" sortable min-width="200">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <!-- 头像 -->
      <el-table-column prop="picture" label="头像" min-width="100">
        <template #default="scope">
          <img :src="scope.row.picture || '/path/to/default-avatar.png'" alt="头像" class="avatar" style="width: 40px; height: 40px; object-fit: cover;"/>
        </template>
      </el-table-column>
      <!-- 操作 -->
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

    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑家长信息"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="家长ID">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.role" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.picture" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateParent">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
        title="确认删除"
        v-model="dialogVisible1"
        width="30%"
        @close="handleDialogClose">
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
      dialogVisible2: false, // 控制对话框显示
      form: {
        id: '',
        username: '',
        realName: '',
        role: '',
        phoneNumber: '',
        email: '',
        picture: ''
      },
      editingRow: null, // 当前编辑的行数据
      dialogVisible1: false, // 删除对话框
      deleteIndex: null, // 当前待删除的项的索引
      deleteRowData: null, // 当前待删除的项的数据
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
        const response = await axios.get('http://localhost:8889/parent/selectAllParents'); // 更新为你的后端API URL
        if(response.data.code===200){
          this.tableData = response.data.data;
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
    async updateParent() {
      try {
        const response = await axios.put(`http://localhost:8081/parent/${this.form.id}`, this.form); // 更新为你的后端API URL
        if(response.data.success) {
          this.$message.success("修改成功！");
        } else {
          this.$message.error("修改失败");
        }
        this.dialogVisible2 = false;
        this.fetchData();
      } catch (error) {
        console.error('Error updating parent:', error);
        this.$message.error("修改失败");
      }
    },
    resetForm() {
      this.form = {
        id: '',
        username: '',
        realName: '',
        role: '',
        phoneNumber: '',
        email: '',
        picture: ''
      };
    },
    confirmDelete(index, row) {
      this.deleteIndex = index;
      this.deleteRowData = row;
      this.dialogVisible1 = true;
    },
    async deleteRow() {
      try {
        const response = await axios.delete(`http://localhost:8081/parent/${this.deleteRowData.id}`); // 后端删除请求
        if (response.data.success) {
          this.tableData.splice(this.deleteIndex, 1); // 从 tableData 中删除项
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
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1; // 重置当前页码为 1
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString();
    }
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
  flex-grow: 1;
  margin-right: 10px;
}

.search-button {
  margin-right: 10px;
}

.reset-button {
  margin-left: 10px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.avatar {
  border-radius: 50%;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
}
</style>
