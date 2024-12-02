<template>
  <div>
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-input
          v-model="searchQuery"
          placeholder="搜索公告标题"
          class="search-input"
      />
      <el-button @click="search" type="primary" class="search-button">搜索</el-button>
      <el-button @click="resetSearch" class="reset-button">重置</el-button>
    </div>

    <!-- 公告表格 -->
    <el-table :data="pagedData" stripe style="width: 100%">
      <el-table-column prop="id" label="公告ID" sortable min-width="100"/>
      <el-table-column prop="title" label="公告标题" sortable min-width="200"/>
      <el-table-column prop="content" label="公告内容" min-width="250">
        <template #default="scope">
          <el-tooltip :content="scope.row.content" placement="top">
            <el-input
                type="textarea"
                :rows="1"
                :value="scope.row.content"
                disabled
                style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" label="发布人ID" min-width="150"/>
      <el-table-column prop="createdAt" label="发布时间" min-width="180"/>
      <el-table-column prop="expirationDate" label="过期时间" min-width="180"/>
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

    <!-- 编辑公告对话框 -->
    <el-dialog
        title="编辑公告"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="公告ID">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="公告标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input v-model="form.content" />
        </el-form-item>
        <el-form-item label="发布人ID">
          <el-input v-model="form.createdBy" disabled />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input v-model="form.createdAt" disabled />
        </el-form-item>
        <el-form-item label="过期时间">
          <el-input v-model="form.expirationDate" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateNotice">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
        title="确认删除"
        v-model="dialogVisible1"
        width="30%"
        @close="handleDialogClose">
      <br>
      <span>你确定要删除该公告吗？</span>
      <br><br><br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="deleteNotice">确认</el-button>
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
        title: '',
        content: '',
        createdBy: '',
        createdAt: '',
        expirationDate: ''
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
        const response = await axios.get('http://localhost:8889/notice/selectAllNotices');
        if(response.data.code === 200){
          this.tableData = response.data.data.map(notice => ({
            id: notice.id,
            title: notice.title,
            content: notice.content,
            createdBy: notice.createdBy,
            createdAt: notice.createdAt ? new Date(notice.createdAt).toLocaleString() : '无',
            expirationDate: notice.expirationDate ? new Date(notice.expirationDate).toLocaleString() : '无',
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
    async updateNotice() {
      try {
        const response = await axios.put(`http://localhost:8081/notice/${this.form.id}`, this.form);
        if (response.status === 200) {
          this.fetchData();
          this.dialogVisible2 = false;
        }
      } catch (error) {
        console.error('Error updating notice:', error);
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
    async deleteNotice() {
      try {
        const response = await axios.delete(`http://localhost:8081/notice/${this.deleteRowData.id}`);
        if (response.status === 200) {
          this.tableData.splice(this.deleteIndex, 1);
          this.dialogVisible1 = false;
        }
      } catch (error) {
        console.error('Error deleting notice:', error);
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
