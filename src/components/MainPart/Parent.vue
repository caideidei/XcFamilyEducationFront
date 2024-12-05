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
      <el-table-column prop="parentId" label="家长ID" sortable min-width="100"/>
      <!-- 用户ID -->
      <el-table-column prop="id" label="用户ID" sortable min-width="100"/>
      <!-- 用户名 -->
      <el-table-column prop="username" label="用户名" sortable min-width="100"/>
      <!-- 姓名 -->
      <el-table-column prop="realName" label="姓名" sortable min-width="100"/>
      <!-- 电话 -->
      <el-table-column prop="phoneNumber" label="电话" min-width="150"/>
      <!-- 邮箱 -->
      <el-table-column prop="email" label="邮箱" min-width="150"/>

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
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <div class="action-buttons">
            <el-button size="small" @click="editRow(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="small" :type="scope.row.status === 'active' ? 'danger' : 'success'"
                       @click="toggleStatus(scope.row)">
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
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
        <!-- 用户ID -->
        <el-form-item label="用户ID">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <!-- 真实姓名 -->
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码">
          <el-input v-model="form.password" />
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <!-- 头像 -->
        <el-form-item label="头像">
          <img v-if="form.picture" :src="form.picture" class="avatar" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;" />
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8889/common/oss/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="uploadHeaders"
          >
            <el-button size="small" type="primary" style="width: 60px; height: 30px; padding: 0; line-height: 40px;">上传头像</el-button>
          </el-upload>
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
        <el-button type="primary" @click="deleteParent">确认</el-button>
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
        picture: '',
        parentId:'',
        password:''
      },
      uploadHeaders: {
        token: localStorage.getItem('token') // 获取 token
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
        const response = await axios.get('http://localhost:8889/parent/selectAllParents');
        if (response.data.code === 200) {
          // 处理数据映射
          this.tableData = response.data.data.map(item => ({
            parentId: item.id, // 家长ID（parentId）
            id: item.userId, // 用户ID
            username: item.username,
            realName: item.realName,
            phoneNumber: item.phoneNumber,
            email: item.email,
            picture: item.picture,
            createdAt: item.createdAt,
            status: item.status
          }));
        } else {
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
        const response = await axios.put(`http://localhost:8889/parent/updateParent`, this.form);
        if (response.data.code === 200) {
          this.$message.success("家长信息更新成功！");
          this.dialogVisible2 = false;
          // 重新加载数据，更新表格
          await this.fetchData();
        }else{
          this.$message.error(response.data.msg ||"修改失败");
        }
      } catch (error) {
        console.error('Error updating teacher:', error);
        this.$message.error("更新失败！");
      }
    },
    resetForm() {
      this.form = {
        userId: '',
        username: '',
        realName: '',
        role: '',
        phoneNumber: '',
        email: '',
        picture: '',
        password: ''
      };
    },
    confirmDelete(index, row) {
      this.deleteIndex = index;
      this.deleteRowData = row;
      this.dialogVisible1 = true;
    },
    async deleteParent() {
      try {
        // 发送删除请求，传入 userId 参数
        const response = await axios.delete(`http://localhost:8889/parent/deleteParent`, {
          params: { userId: this.deleteRowData.id }  // 传递用户ID作为请求参数
        });

        if (response.data.code === 200) {
          this.$message.success(response.data.msg);  // 显示删除成功消息
          // 从表格中移除已删除的行
          this.tableData.splice(this.deleteIndex, 1);
          this.dialogVisible1 = false;  // 关闭确认删除对话框
        } else {
          this.$message.error(response.data.msg || '删除失败');
        }
      } catch (error) {
        console.error('Error deleting teacher:', error);
        this.$message.error("删除失败！");
      }
    },
    async toggleStatus(row) {
      try {
        const response = await axios.put('http://localhost:8889/parent/updateParentStatus', null, {
          params: { userId: row.id }  // 传递用户ID作为请求参数
        });

        if (response.data.code === 200) {
          // 状态切换成功，更新前端显示
          row.status = row.status === 'active' ? 'banned' : 'active';
          this.$message.success('状态更新成功');
        } else {
          this.$message.error('状态更新失败');
        }
      } catch (error) {
        console.error('修改状态时出错', error);
        this.$message.error('状态更新失败');
      }
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
    },
    handleAvatarSuccess(response, file) {
      if (response.code === 200) {
        // 获取上传后的图片路径并赋值到 form.picture
        this.form.picture = response.data;  // 假设后端返回的路径是 response.data
        this.$message.success('头像上传成功');
      } else {
        this.$message.error('头像上传失败');
      }
    },
    // 上传前的处理
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件');
      }
      return isImage;
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
