<template>
  <div class="study-square">

    <div class="content-wrapper">
      <!-- 左侧内容区域，占四分之三 -->
      <div class="left-section">
        <!-- 先使用简单文字表示 -->
        <div class="section-header">
          <div class="section-label">我的订单</div>
          <br>
        </div>
        <el-table :data="pagedData" style="width: 100% " >
          <el-table-column label="订单ID" prop="id" width="80px" ></el-table-column>
          <el-table-column label="家长ID" prop="parentId" width="80px"></el-table-column>
          <el-table-column label="订单状态" prop="status" width="80px">
            <template v-slot="scope">
              <span>
                {{ scope.row.status === 'accepted' ? '已接单' : scope.row.status === 'inTrial' ? '试课中' : '其他' }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="家教时间" prop="time" width="200px">
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
          <el-table-column label="总课时数" prop="classNumber" sortable></el-table-column>
          <el-table-column label="目前课时数" prop="NowClassNumber" sortable></el-table-column>
          <el-table-column label="操作" min-width="80">
            <template #default="scope">
              <el-button type="success" size="small" style="height: 35px" @click="publishHomework(scope.row)">
                布置作业
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <!-- 右侧内容区域，占四分之一 -->
      <div class="right-section">
        <div class="section-header">
          <div class="section-label">我的评价</div>
        </div>
        <p>这里是我的评价部分，暂时显示简单文字。</p>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [], // 初始化 tableData
      searchQuery: "", // 初始化 searchQuery
      currentPage: 1, // 初始化 currentPage
      pageSize: 10, // 初始化每页显示数据条数
      totalItems: 0, // 初始化总条目数
    };
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
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8889/order/teacherSelectOrders');
        if (response.data.code === 200) {
          // 获取所有数据
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
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },

}
</script>

<style scoped>
.study-square {
  width: 100%;
  height: 80vh; /* 修改为占满整个视口高度 */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-left: 0; /* 移除左边距 */
}

.content-wrapper {
  width: 100%; /* 让内容区域宽度占满父元素 */
  display: flex;
}

.left-section {
  width: 75%; /* 左侧占四分之三 */
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 使左侧内容区域可以滚动 */
}

.right-section {
  width: 25%; /* 右侧占四分之一 */
  padding-left: 20px;
}

.section-header {
  margin-bottom: 10px;
}

.section-label {
  font-size: 18px;
  font-weight: bold;
}
</style>
