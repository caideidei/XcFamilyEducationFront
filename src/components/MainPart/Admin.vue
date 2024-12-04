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
      <el-table-column prop="id" label="管理员ID" sortable min-width="120"/>
      <el-table-column prop="userId" label="用户ID" sortable min-width="100"/>
      <el-table-column prop="username" label="用户名" sortable min-width="100"/>
      <el-table-column prop="realName" label="姓名" sortable min-width="100"/>
      <el-table-column prop="phoneNumber" label="电话" min-width="150"/>
      <el-table-column prop="email" label="邮箱" min-width="150"/>
<!--      <el-table-column prop="role" label="角色" min-width="100"/>-->
      <el-table-column prop="status" label="状态" min-width="100"/>
      <el-table-column prop="createdAt" label="创建时间" min-width="200">
        <template #default="scope">
          <!-- 格式化创建时间 -->
          <span>{{ formatDate(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="picture" label="头像" min-width="100">
        <template #default="scope">
          <!-- 如果头像为null，什么都不显示 -->
          <img v-if="scope.row.picture" :src="scope.row.picture" alt="头像" class="avatar" style="width: 40px; height: 40px; object-fit: cover;"/>
        </template>
      </el-table-column>
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

    <!-- 新增管理员对话框 -->
    <el-dialog
        title="新增管理员"
        v-model="addDialogVisible"
        width="20%"
        :style="{ height: '240px' , padding: '30px'}"
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="用户名">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="addForm.phoneNumber" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAdmin">确认</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑管理员信息"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.role" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.status" />
        </el-form-item>

        <el-form-item label="头像">
          <img v-if="form.picture" :src="form.picture" class="avatar" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;"/>
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
        <el-button type="primary" @click="updateManager">确定</el-button>
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
import axios from 'axios';
export default {
  data() {
    return {
      searchQuery: '',
      tableData: [],  // 初始化为空数组
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dialogVisible2: false,  // 控制编辑对话框显示
      form: {
        id: '',
        username: '',
        realName: '',
        phoneNumber: '',
        email: '',
        role: '',
        picture: '',
        password:''
      },
      editingRow: null,  // 当前编辑的行数据
      dialogVisible1: false,  // 删除对话框
      deleteIndex: null,  // 当前待删除的项的索引
      deleteRowData: null,  // 当前待删除的项的数据
      addDialogVisible: false,  // 控制新增管理员对话框显示
      addForm: {
        username: '',
        phoneNumber: ''
      },
      uploadHeaders: {
        token: localStorage.getItem('token') // 获取 token
      },
    };
  },
  computed: {
    // 数据搜索查询
    filteredData() {
      if (!this.searchQuery) return this.tableData;
      return this.tableData.filter(item =>
          Object.values(item).some(val =>
              String(val).toLowerCase().includes(this.searchQuery.toLowerCase())
          )
      );
    },
    // 分页
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
    // 从后台读取数据并返回前端
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8889/admin/selectAllAdmins', {
          withCredentials: true, // 保持跨域请求的凭据
        });
        if (response.data.code === 200) {
          // 请求成功，更新表格数据
          this.tableData = response.data.data;
        } else {
          // 如果返回的code不是200，表示失败，显示错误信息
          // console.error('数据加载失败:', response.data.msg);
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        // 请求出错（例如网络问题），显示通用错误信息
        console.error('Error fetching data:', error);
        this.$message.error('发生错误，请稍后再试');
      }
    },
    // 格式化日期
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleString();  // 格式化为本地日期时间格式
    },
    // 编辑行
    editRow(row) {
      this.dialogVisible2 = true;
      // 确保 adminId 和 id 映射正确
      this.form = {
        adminId: row.id,   // adminId 对应管理员ID
        id: row.userId,     // id 对应用户ID
        username: row.username,
        realName: row.realName,
        phoneNumber: row.phoneNumber,
        email: row.email,
        role: row.role,
        status: row.status,
        picture: row.picture,
        password :''
      };
    },

    // 更新管理员信息
    async updateManager() {
      if (this.form.password === '') {
        delete this.form.password;
      }
      try {
        const response = await axios.put('http://localhost:8889/admin/updateAdmin', this.form);
        if (response.data.code === 200) {
          this.$message.success("修改成功！");
          this.dialogVisible2 = false;
          this.fetchData();  // 刷新数据
        } else {
          this.$message.error(response.data.msg ||"修改失败");
        }
      } catch (error) {
        console.error('Error updating admin:', error);
        this.$message.error("修改失败");
      }
    },

    // 重置表单
    resetForm() {
      this.form = {
        adminId: '',
        id: '',
        username: '',
        realName: '',
        phoneNumber: '',
        email: '',
        role: '',
        status: '',
        picture: '',
        password: ''
      };
    },
    // 确认删除
    confirmDelete(index, row) {
      this.deleteIndex = index;
      this.deleteRowData = row;
      this.dialogVisible1 = true;
    },
    // 删除管理员
    async deleteRow() {
      try {
        const response = await axios.delete(
            'http://localhost:8889/admin/deleteAdmin',
            {
              params: {
                userId: this.deleteRowData.userId  // 使用管理员的电话号码作为标识符传递
              }
            }
        );
        if (response.data.code === 200) {
          this.tableData.splice(this.deleteIndex, 1); // 从 tableData 中删除项
          this.$message.success('删除成功');
        } else {
          this.$message.error(response.data.msg || '删除失败');
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        this.$message.error('删除失败，请稍后重试');
      } finally {
        this.handleDialogClose();
      }
    },
    // 关闭删除对话框
    handleDialogClose() {
      this.dialogVisible1 = false;
      this.deleteIndex = null;
      this.deleteRowData = null;
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;  // 重置当前页码为 1
    },
    // 分页当前页变化
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    // 打开新增管理员对话框
    openAddDialog() {
      this.addDialogVisible = true;
      this.addForm = { username: '', phoneNumber: '' };  // 清空表单
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
    // 新增管理员
    async addAdmin() {
      try {
        const response = await axios.post('http://localhost:8889/admin/insertAdmin', this.addForm);
        if (response.data.code === 200) {
          this.$message.success('新增管理员成功');
          this.addDialogVisible = false;
          await this.fetchData();  // 刷新数据
        } else {
          this.$message.error(response.data.msg || '新增管理员失败');
        }
      } catch (error) {
        console.error('Error adding admin:', error);
        this.$message.error('新增管理员失败，请稍后重试');
      }
    },
  },
  name: 'AdminTable',
}
</script>

<style scoped>
/* 搜索栏属性 */
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
/* 表格按钮 */
.action-buttons {
  display: flex;
  gap: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.pagination-container {
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}

</style>
