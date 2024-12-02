<!--家教信息：公告信息 notice表-->
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
      <el-table-column prop="noticeId" label="公告号" sortable min-width="100"/>
      <el-table-column prop="noticeTime" label="发布时间" sortable min-width="100"/>
      <el-table-column prop="noticeText" label="公告" min-width="150"/>
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

    <el-dialog
        title="新增公告"
        v-model="addDialogVisible"
        width="30%"
        @close="resetAddForm"
        @keydown="handleAddKeyDown"
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="反馈号">
          <el-input v-model="addForm.noticeId" />
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input type="textarea" v-model="addForm.noticeText" />
        </el-form-item>
        <!-- 这里不需要填写反馈时间，因为它可以在后端自动生成 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNotice">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
      <el-dialog
          title="编辑公告"
          v-model="dialogVisible2"
          width="30%"
          @close="resetForm"
          @keydown="handleUpdateKeyDown"
      >
        <el-form :model="form" ref="form">
          <el-form-item label="公告号">
            <el-input v-model="form.noticeId" disabled />
          </el-form-item>
<!--          <el-form-item label="发布时间">-->
<!--            <el-input v-model="form.noticeTime" />-->
<!--          </el-form-item>-->
          <el-form-item label="公告内容">
            <el-input type="textarea" v-model="form.noticeText" @keydown.enter.native.stop/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="updateNotice">确定</el-button>
        </div>
      </el-dialog>



    <!-- 删除确认对话框 -->
<!--    <div @keydown="handleDeleteKeyDown">-->
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
<!--    </div>-->

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
      editingRow: null, // 当前编辑的行数据
      dialogVisible1: false, //删除对话框
      deleteIndex: null, // 当前待删除的项的索引
      deleteRowData: null, // 当前待删除的项的数据
      addDialogVisible: false, // 控制新增对话框显示
      form: {
        noticeId: '',
        noticeTime: '',
        noticeText: '',
      },
      addForm: {
        noticeId: '',
        noticeTime: null,// 可以在后端自动生成时间
        noticeText: '',
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
    async fetchData() {//从后端获取数据
      try {
        const response = await axios.get('http://localhost:8081/notice/selectall'); // 更新为你的后端API URL
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
      this.dialogVisible2 = true; // 显示对话框
      this.form = { ...row }; // 复制行数据到表单
    },
    handleUpdateKeyDown(event) {
      if (event.key === 'Enter') {
        // console.log("按下enter!!!");
        this.updateNotice();
      }
    },
    async updateNotice() {
      try {
        this.form.noticeTime=null;//这里实现当修改内容时修改时间变为null,而在后端中时间为null，则赋值当前时间
        const response = await axios.put(`http://localhost:8081/notice/${this.form.noticeId}`, this.form); // 更新为你的后端API URL
        if (response.data.success === true) {
          this.$message.success('修改成功'); // 显示修改成功提示
        } else {
          this.$message.error('修改失败'); // 显示修改失败提示
        }
        this.dialogVisible2 = false; // 隐藏对话框
        this.fetchData(); // 刷新表格数据
      } catch (error) {
        console.error('Error updating notice:', error);
        this.$message.error('修改失败'); // 显示修改失败提示
      }
    },
    resetForm() {
      this.form = {
        noticeId: '',
        noticeTime: '',
        noticeText: '',

      };
    },

    // 打开新增数据对话框
    openAddDialog() {
      this.addDialogVisible = true;
    },
    //具体方法
    async addNotice() {
      try {
        const response = await axios.post('http://localhost:8081/notice/insert', this.addForm);
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
        noticeId: '',
        noticeTime: null,
        noticeText: '',
      };
    },
    handleAddKeyDown(event) {
      if (event.key === 'Enter') {
        this.addNotice();
      }
    },

    handleDeleteKeyDown(event) {
      if (event.key === 'Enter') {
        this.deleteRow(); // 按下 Enter 键时调用删除方法
      }
    },
    confirmDelete(index, row) {
      this.deleteIndex = index;
      this.deleteRowData = row;
      this.dialogVisible1 = true;
    },
    async deleteRow() {
      try {
        const response = await axios.delete(`http://localhost:8081/notice/${this.deleteRowData.noticeId}`); // 后端删除请求
        if (response.data.success === true) {
          this.tableData.splice(this.deleteIndex, 1); // 从 tableData 中删除项
          this.$message.success('删除成功');
        } else {
          this.$message.error('删除失败1');
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        this.$message.error('删除失败2');
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
