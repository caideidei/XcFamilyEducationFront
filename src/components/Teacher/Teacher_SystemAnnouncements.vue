<template>
  <div class="system-announcements-section">
    <!-- 左上角标签 -->
    <div class="header-label">系统公告</div>

    <div class="search-container">
      <el-input
          v-model="searchQuery"
          placeholder="搜索公告标题"
          class="search-input"
          style="height: 40px;"
      />
      <el-button @click="search" type="primary" class="search-button">搜索</el-button>
      <el-button @click="resetSearch" class="reset-button">重置</el-button>
    </div>

    <el-table :data="pagedData" stripe style="width: 100%">
      <!-- 公告标题列 -->
      <el-table-column prop="title" label="公告标题" sortable min-width="50"/>

      <!-- 发布时间列，使用自定义排序 -->
      <el-table-column
          prop="createdAt"
          label="发布时间"
          sortable
          min-width="80"
      />

      <!-- 公告内容列 -->
      <el-table-column prop="content" label="公告内容" min-width="450">
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

  </div>
</template>

<script>
import axios from "axios";
export default {
  data(){
    return {
      searchQuery: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    }
  },
  computed:{
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
  methods:{
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
          // this.tableData.sort((a, b) => b.createdAt - a.createdAt);
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
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  }
};
</script>

<style scoped>
.system-announcements-section {
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

