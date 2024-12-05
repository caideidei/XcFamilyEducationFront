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
      <el-table-column prop="id" label="订单ID" sortable min-width="100"/>
      <el-table-column prop="parentId" label="家长ID" min-width="120"/>
      <el-table-column prop="subject" label="学科" min-width="120"/>
      <el-table-column prop="grade" label="年级" min-width="120"/>
      <el-table-column prop="price" label="价格" min-width="120"/>
      <el-table-column prop="classNumber" label="课时数" min-width="120"/>
      <el-table-column prop="address" label="地址" min-width="150"/>
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
      <el-table-column prop="teacherId" label="教师ID" min-width="100"/>
      <el-table-column prop="status" label="状态" sortable min-width="120">
        <template v-slot="scope">
          <span v-if="scope.row.status === 'pendingReview'">待审核</span>
          <span v-else-if="scope.row.status === 'reviewFailed'">审核未通过</span>
          <span v-else-if="scope.row.status === 'reviewPassed'">审核通过</span>
          <span v-else-if="scope.row.status === 'inTrail'">试课中</span>
          <span v-else>成功接单</span>
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="发布时间" sortable min-width="150"/>

      <!-- 操作列 -->
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <div class="action-buttons">
            <el-button
                size="small"
                :type="scope.row.status === 'pendingReview' ? 'primary' : 'default'"
                @click="editRow(scope.row)"
                style="width:45px;"
                :disabled="scope.row.status !== 'pendingReview'"
            >
              {{ scope.row.status === 'pendingReview' ? '待审核' : '已审核' }}
            </el-button>            <el-button size="small" type="danger" @click="confirmDelete(scope.$index, scope.row)">删除</el-button>
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
        title="编辑订单信息"
        v-model="dialogVisible2"
        width="30%"
        @close="resetForm"
    >
      <el-form :model="form" ref="form">
        <el-form-item label="订单ID">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="家长ID">
          <el-input v-model="form.parentId" disabled />
        </el-form-item>
        <el-form-item label="学科">
          <el-input v-model="form.subject" disabled/>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.grade" disabled/>
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="form.time" disabled/>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" disabled/>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" disabled/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.note" disabled/>
        </el-form-item>
<!--        <el-form-item label="教师ID">-->
<!--          <el-input v-model="form.teacherId" />-->
<!--        </el-form-item>-->
        <el-form-item label="发布时间">
          <el-input v-model="form.createdAt" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="待审核" value="pendingReview"></el-option>
            <el-option label="通过" value="reviewPassed"></el-option>
            <el-option label="未通过" value="reviewFailed"></el-option>
          </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateOrder">确定</el-button>
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
import axios from 'axios'; // 用于发送请求
export default {
  data() {
    return {
      searchQuery: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dialogVisible1: false, // 删除对话框
      deleteIndex: null, // 当前待删除的项的索引
      deleteRowData: null, // 当前待删除的项的数据
      dialogVisible2: false, // 控制编辑对话框显示
      editingRow: null, // 当前编辑的行数据
      form: {
        id: '',
        parentId: '',
        subject: '',
        grade: '',
        time: '',
        price: '',
        classNumber:'',
        address: '',
        note: '',
        teacherId: '',
        status: '',
        createdAt: '',
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
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8889/order/selectAllOrders'); // 获取订单数据
        if(response.data.code === 200){
          this.tableData = response.data.data.map(order => ({
            id: order.id, // 订单ID
            teacherId: order.teacherId, // 教师ID
            parentId: order.parentId, // 家长ID
            status: order.status || '未定义', // 订单状态
            time: order.time || '未定义', // 时间
            note: order.note || '无', // 备注
            price: order.price || 0, // 价格
            classNumber:order.classNumber,
            address: order.address || '无', // 地址
            grade: order.grade || '无', // 年级
            subject: order.subject || '无', // 科目
            createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString() : '无', // 创建时间格式化
          }));
        }else{
          this.$message.error(response.data.msg);
        }

      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    search() {
      // 搜索逻辑已经在 computed 中处理，点击按钮可触发计算
    },
    resetSearch() {
      this.searchQuery = '';
    },
    editRow(row) {
      this.dialogVisible2 = true;
      this.form = { ...row }; // 将当前行数据传入表单
    },
    async updateOrder() {
      this.form.createdAt = null;
      console.log(this.form.status);
      try {
        const response = await axios.put(`http://localhost:8889/order/passOrFailOrder`, this.form); // 后端更新请求
        if (response.data.code === 200) {
          // 如果返回成功，重新获取数据并关闭对话框
          this.fetchData();
          this.dialogVisible2 = false;
          this.$message.success('审核订单更新成功');
        } else {
          // 如果返回失败，显示错误信息
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error updating order:', error);
        this.$message.error('更新订单信息失败');
      }
    },
    resetForm() {
      this.form = {
        id: '',
        parentId: '',
        subject: '',
        grade: '',
        time: '',
        price: '',
        address: '',
        note: '',
        teacherId: '',
        status: '',
        createdAt: '',
      };
    },
    confirmDelete(index, row) {
      this.deleteIndex = index;
      this.deleteRowData = row;
      this.dialogVisible1 = true;
    },
    async deleteRow() {
      try {
        const response = await axios.delete(`http://localhost:8889/order/${this.deleteRowData.id}`); // 后端删除请求
        if (response.data.success === true) {
          this.tableData.splice(this.deleteIndex, 1); // 删除表格中的数据
          this.$message.success('删除成功');
        } else {
          this.$message.error('删除失败');
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        this.$message.error('删除失败');
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
      this.currentPage = 1; // 重置为第一页
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    }
  },
};
</script>

<style scoped>

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
