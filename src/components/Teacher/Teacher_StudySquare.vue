<template>
  <div class="study-square">
    <!-- 家教广场标签 -->
    <div class="header-label">家教广场</div>

    <!-- 家教信息推荐标签和按钮放在同一行 -->
    <div class="section-header">
      <div class="section-label">家教推荐</div>
      <div class="button-container">
        <!-- 换一换标签 -->
        <span class="change-label">换一换
          <img src="/icons/换一换.png" alt="换一换" class="icon"/>
        </span>
        <!-- 更多信息标签 -->
        <span class="more-info-label">更多信息
          <img src="/icons/更多.png" alt="更多信息" class="icon"/>
        </span>
      </div>
    </div>

    <!-- 家教信息推荐表格 -->
    <el-table :data="pagedData" stripe style="width: 100%">
      <el-table-column prop="subject" label="学科" min-width="100"/>
      <el-table-column prop="grade" label="年级" min-width="80"/>
      <el-table-column prop="price" label="价格" min-width="80"/>
      <el-table-column prop="classNumber" label="课时数" min-width="80"/>
      <el-table-column prop="address" label="地址" min-width="150">
        <template #default="scope">
          <el-tooltip :content="scope.row.address" placement="top">
            <el-input
                type="textarea"
                :rows="1"
                :value="scope.row.address"
                disabled
                style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间" min-width="180">
        <template #default="scope">
          <el-tooltip :content="scope.row.time" placement="top">
            <el-input
                type="textarea"
                :rows="1"
                :value="scope.row.time"
                disabled
                style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" min-width="150">
        <template #default="scope">
          <el-tooltip :content="scope.row.note" placement="top">
            <el-input
                type="textarea"
                :rows="1"
                :value="scope.row.note"
                disabled
                style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="发布时间" sortable min-width="150"/>
    </el-table>

    <div class="separator"></div>

    <div class="section-label">家教分类</div>
    <div class="category-content">家教分类内容展示区</div>

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
        const response = await axios.get('http://localhost:8889/order/selectAllPassedOrders');
        if (response.data.code === 200) {
          this.tableData = response.data.data.map(order => ({
            id: order.id,
            parentId: order.parentId,
            subject: order.subject,
            grade: order.grade,
            price: order.price,
            classNumber: order.classNumber,
            address: order.address,
            time: order.time,
            note: order.note,
            teacherId: order.teacherId,
            status: order.status,
            createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString() : '无', // 创建时间格式化
          }));
          const shuffledData = this.shuffleArray(this.tableData);
          this.tableData = shuffledData.slice(0, 3); // 只取前三条
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
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
  },
};
</script>

<style scoped>
.study-square {
  padding: 20px;
}

.header-label {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-label {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.button-container {
  display: flex;
  gap: 10px;
}

.change-label, .more-info-label {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.separator {
  height: 1px;
  background-color: #ddd;
  margin: 20px 0;
}

.category-content {
  font-size: 16px;
  color: #666;
}
</style>
