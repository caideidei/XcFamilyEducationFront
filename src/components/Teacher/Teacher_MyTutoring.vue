<template>
  <div class="study-square">
    <div class="content-wrapper"  v-if="!showHomework">
      <!-- 左侧内容区域 -->
      <div class="left-section">
        <div class="section-header">
          <div class="section-label">我的订单</div>
          <br>
        </div>
        <el-table :data="pagedData" style="width: 100%">
          <el-table-column label="订单ID" prop="id" width="80px"></el-table-column>
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
          <el-table-column label="目前课时数" prop="nowClassNumber" sortable></el-table-column>
          <el-table-column label="操作" min-width="80">
            <template #default="scope">
              <el-button type="success" size="small" style="height: 35px" @click="publishHomework(scope.row)">
                布置作业
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-section">
        <div class="section-header">
          <div class="section-label">我的评价</div>
        </div>
        <p>这里是我的评价部分，暂时显示简单文字。</p>
      </div>
    </div>

    <!-- 布置作业界面 -->
    <!-- 布置作业界面 -->
    <div class="left-section" v-else>
      <div class="section-header">
        <div class="section-label">
          当前订单信息
          <span class="more-info-label" @click="backToOrders">
                  返回
              <img src="/icons/返回.png" alt="返回" class="icon" />
          </span>
        </div>
      </div>
      <!-- 新增表格显示订单数据 -->
      <el-table :data="[currentOrder]" style="width: 100%">
        <el-table-column label="订单ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="家长ID" prop="parentId" width="80px"></el-table-column>
        <el-table-column label="订单状态" prop="status" width="80px">
          <template v-slot="scope">
        <span>
          {{ scope.row.status === 'accepted' ? '已接单' : scope.row.status === 'inTrial' ? '试课中' : '其他' }}
        </span>
          </template>
        </el-table-column>
        <el-table-column label="年级" prop="grade" width="90px"></el-table-column>
        <el-table-column label="科目" prop="subject" width="100px"></el-table-column>
        <el-table-column label="总课时数" prop="classNumber" width="90px"></el-table-column>
        <el-table-column label="目前课时数" prop="nowClassNumber" width="100px"></el-table-column>
        <el-table-column label="家教时间" prop="time" width="150px">
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
        <el-table-column label="订单备注" prop="note" width="150px">
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
        <el-table-column label="家教地址" prop="address" width="150px">
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
      </el-table>

<!--      <el-button type="primary" @click="backToOrders" style="margin-top: 20px;">返回订单列表</el-button>-->
      <div class="homework-section" style="margin-top: 30px;">
        <h4>作业信息</h4>
        <p>这里是作业信息部分（占位文字）。</p>
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
      showHomework: false, // 是否显示布置作业界面
      currentOrder: {}, // 当前选中的订单信息
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
            nowClassNumber:order.nowClassNumber,
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
    async publishHomework(order) {
      try {
        const response = await axios.get('http://localhost:8889/homework/selectMyHomeworks', {
          params: { orderId: order.id }
        });
        if (response.data.code === 200) {
          this.currentOrder = order; // 保存当前订单信息
          this.showHomework = true; // 显示布置作业界面
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching homework:', error);
      }
    },
    backToOrders() {
      this.showHomework = false; // 返回订单界面
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

.el-table {
  border-radius: 10px; /* 表格圆角 */
  overflow: hidden;   /* 保证表格内容显示时圆角不被覆盖 */
}

.el-table th,
.el-table td {
  padding: 10px; /* 给表格单元格增加内边距，使圆角更加明显 */
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
/*!* 修改section-header样式 *!*/
/*.section-header {*/
/*  display: flex;*/
/*  justify-content: space-between; !* 使标题和按钮分别位于两端 *!*/
/*  align-items: center; !* 垂直居中对齐 *!*/
/*}*/

/*!* 返回按钮的样式 *!*/
/*.more-info-label {*/
/*  font-size: 16px;*/
/*  cursor: pointer;*/
/*  display: flex;*/
/*  align-items: center;*/
/*  font-weight: normal; !* 确保返回按钮不加粗 *!*/
/*}*/

/*!* 标题不加粗 *!*/
/*.section-label {*/
/*  font-size: 18px;*/
/*  font-weight: normal; !* 不加粗 *!*/
/*}*/


</style>
