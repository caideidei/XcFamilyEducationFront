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
      <el-table-column prop="teacherId" label="教师ID" sortable min-width="100"/>
      <el-table-column prop="userId" label="用户ID" sortable min-width="100"/>
      <el-table-column prop="teacherName" label="用户名" sortable min-width="100"/>
      <el-table-column prop="realName" label="姓名" sortable min-width="100"/>
      <el-table-column prop="teacherPhone" label="电话" min-width="150"/>
      <el-table-column prop="teacherEmail" label="邮箱" min-width="150"/>
      <el-table-column prop="status" label="状态" min-width="100"/>
      <el-table-column prop="createdAt" label="创建时间" min-width="180"/>
      <el-table-column prop="officialTeacher" label="是否正式教师" min-width="150"/>
      <el-table-column prop="subjects" label="擅长科目" min-width="150"/>
      <el-table-column prop="teacherPicture" label="头像" min-width="100">
        <template #default="scope">
          <img :src="scope.row.teacherPicture || 'default-avatar.png'" alt="头像" class="avatar" style="width: 40px; height: 40px; object-fit: cover;"/>
        </template>
      </el-table-column>
      <el-table-column prop="teacherQualification" label="资质" min-width="150"/>
      <el-table-column prop="teacherIntro" label="简介" min-width="150">
        <template #default="scope">
          <el-tooltip :content="scope.row.teacherIntro" placement="top">
            <el-input
                type="textarea"
                :rows="1"
                :value="scope.row.teacherIntro"
                disabled
                style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
            />
          </el-tooltip>
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
          :page-sizes="[1, 3, 5, 10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑教师信息"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="教师ID">
          <el-input v-model="form.teacherId" disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.teacherName" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.teacherPhone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.teacherEmail" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.teacherPicture" />
        </el-form-item>
        <el-form-item label="资质">
          <el-input v-model="form.teacherQualification" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.teacherIntro" />
        </el-form-item>
        <el-form-item label="是否正式教师">
          <el-input v-model="form.officialTeacher" />
        </el-form-item>
        <el-form-item label="擅长科目">
          <el-input v-model="form.subjects" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateTeacher">确定</el-button>
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
        <el-button type="primary" @click="deleteTeacher">确认</el-button>
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
        teacherId: '',
        userId: '',
        teacherName: '',
        realName: '',
        teacherPhone: '',
        teacherEmail: '',
        teacherPicture: '',
        teacherQualification: '',
        teacherIntro: '',
        officialTeacher: '',
        subjects: ''
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
        const response = await axios.get('http://localhost:8889/teacher/selectAllTeachers'); // 更新为你的后端API URL
        if(response.data.code === 200){
          this.tableData = response.data.data.map(teacher => ({
            teacherId: teacher.id, // 教师ID
            userId: teacher.userId, // 用户ID
            teacherName: teacher.username, // 用户名
            realName: teacher.realName, // 真实姓名
            teacherPhone: teacher.phoneNumber, // 电话
            teacherEmail: teacher.email || '无', // 邮箱
            status: teacher.status || '未定义', // 状态
            createdAt: teacher.createdAt ? new Date(teacher.createdAt).toLocaleString() : '无', // 创建时间
            teacherPicture: teacher.picture || 'default-avatar.png', // 头像
            teacherQualification: teacher.qualification || '无', // 资质
            teacherIntro: teacher.intro || '无', // 简介
            officialTeacher: teacher.officialTeacher ? '是' : '否', // 是否正式教师
            subjects: teacher.subjects || '无', // 擅长科目
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
    async updateTeacher() {
      try {
        const response = await axios.put(`http://localhost:8081/teacher/${this.form.teacherId}`, this.form);
        if (response.status === 200) {
          this.fetchData();
          this.dialogVisible2 = false;
        }
      } catch (error) {
        console.error('Error updating teacher:', error);
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
    async deleteTeacher() {
      try {
        const response = await axios.delete(`http://localhost:8081/teacher/${this.deleteRowData.teacherId}`);
        if (response.status === 200) {
          this.tableData.splice(this.deleteIndex, 1);
          this.dialogVisible1 = false;
        }
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style scoped>
.avatar {
  border-radius: 50%;
}
.search-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-button {
  margin-left: 10px;
}
.reset-button {
  margin-left: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: center;
}
</style>
