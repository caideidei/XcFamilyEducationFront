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
      <el-table-column prop="id" label="审核ID" sortable min-width="100"/>
      <el-table-column prop="teacherId" label="教师ID" sortable min-width="100"/>
      <el-table-column prop="realName" label="姓名" sortable min-width="100"/>
      <el-table-column prop="sex" label="性别" sortable min-width="100"/>
      <el-table-column prop="qualification" label="资质" min-width="150"/>
      <el-table-column prop="intro" label="简介" min-width="150">
        <template #default="scope">
          <el-tooltip :content="scope.row.intro" placement="top">
            <el-input
                type="textarea"
                :rows="1"
                :value="scope.row.intro"
                disabled
                style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="subjects" label="擅长科目" min-width="150"/>
      <el-table-column prop="adminId" label="管理员ID" min-width="100"/>
      <el-table-column prop="status" label="状态" sortable min-width="100"/>
      <el-table-column prop="reason" label="审核理由" min-width="200"/>
      <el-table-column prop="createdAt" label="创建时间" min-width="180"/>
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <div class="action-buttons">
            <!-- 审核按钮，根据状态值判断显示文本和样式 -->
            <el-button
                size="small"
                :type="scope.row.status === 'pending' ? 'primary' : 'default'"
                @click="editRow(scope.row)"
                style="width:45px;"
                :disabled="scope.row.status !== 'pending'"
            >
              {{ scope.row.status === 'pending' ? '待审核' : '已审核' }}
            </el-button>
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
        title="编辑审核信息"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="审核ID">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="教师ID">
          <el-input v-model="form.teacherId" disabled />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" disabled/>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.sex" disabled/>
        </el-form-item>
        <el-form-item label="资质">
          <el-input v-model="form.qualification" disabled/>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.intro" disabled/>
        </el-form-item>
        <el-form-item label="擅长科目">
          <el-input v-model="form.subjects" disabled/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="通过" value="approved"></el-option>
            <el-option label="未通过" value="rejected"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核理由">
          <el-select v-model="form.reason" placeholder="请选择审核理由" @change="handleReasonChange">
            <el-option label="审核通过" value="审核通过" />
            <el-option label="数据填写不完整" value="数据填写不完整" />
            <el-option label="数据不真实" value="数据不真实" />
            <el-option label="其他" value="其他" />
          </el-select>

          <!-- 如果选择 "其他"，可以进行自定义输入 -->
          <el-input
              v-if="form.reason === '其他'"
              v-model="form.customReason"
              placeholder="请输入自定义理由"
              style="margin-top: 10px;"
          />
        </el-form-item>

        <!--        <el-form-item label="创建时间">-->
<!--          <el-input v-model="form.createdAt" disabled />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateExamine">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
        title="确认删除"
        v-model="dialogVisible1"
        width="30%"
        @close="handleDialogClose">
      <br>
      <span>你确定要删除该审核信息吗？</span>
      <br><br><br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="deleteExamine">确认</el-button>
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
        teacherId: '',
        realName: '',
        sex: '',
        qualification: '',
        intro: '',
        subjects: '',
        status: '',
        reason: '',
        createdAt: '',
        customReason:''
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
        const response = await axios.get('http://localhost:8889/examine/selectAllExamines'); // 更新为你的后端API URL

        if (response.data.code === 200) {
          // 如果返回成功
          this.tableData = response.data.data.map(examine => ({
            id: examine.id, // 审核ID
            teacherId: examine.teacherId, // 教师ID
            realName: examine.realName, // 姓名
            sex: examine.sex, // 性别
            qualification: examine.qualification, // 资质
            intro: examine.intro || '无', // 简介
            subjects: examine.subjects || '无', // 擅长科目
            adminId: examine.adminId || null, // 审核管理员ID
            status: examine.status || '未定义', // 状态
            reason: examine.reason || null, // 审核理由
            createdAt: examine.createdAt ? new Date(examine.createdAt).toLocaleString() : '无', // 创建时间
          }));
        } else {
          // 如果返回错误（比如权限不足）
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        this.$message.error('发生错误，请稍后再试');
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
    async updateExamine() {
      this.form.createdAt = null;
      if (this.form.reason === '其他' && this.form.customReason) {
        this.form.reason = this.form.customReason;
      }
      try {
        // 发送审核修改请求
        const response = await axios.put('http://localhost:8889/examine/approvedOrRejectedExamine', this.form);

        if (response.data.code === 200) {
          // 如果返回成功，重新获取数据并关闭对话框
          this.fetchData();
          this.dialogVisible2 = false;
          this.$message.success('审核信息更新成功');
        } else {
          // 如果返回失败，显示错误信息
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error updating examine:', error);
        this.$message.error('更新审核信息失败');
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
    async deleteExamine() {
      try {
        const response = await axios.delete(`http://localhost:8081/examine/${this.deleteRowData.id}`);
        if (response.status === 200) {
          this.tableData.splice(this.deleteIndex, 1);
          this.dialogVisible1 = false;
        }
      } catch (error) {
        console.error('Error deleting examine:', error);
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
