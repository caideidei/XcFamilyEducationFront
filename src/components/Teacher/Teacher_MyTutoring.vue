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
          <el-table-column label="订单ID" prop="id" width="100px" sortable></el-table-column>
          <el-table-column label="家长ID" prop="parentId" width="90px"></el-table-column>
          <el-table-column label="订单状态" prop="status" width="110px" sortable>
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
              <el-button
                  type="success"
                  size="small"
                  style="height: 35px"
                  :disabled="scope.row.status === 'inTrial'"
                  :style="{
                  backgroundColor: scope.row.status === 'inTrial' ? '#dcdcdc' : '',
                  borderColor: scope.row.status === 'inTrial' ? '#dcdcdc' : '',
                  color: scope.row.status === 'inTrial' ? '#888' : '',
                  cursor: scope.row.status === 'inTrial' ? 'not-allowed' : '',
                  borderRadius: '5px'
                  }"
                  @click="publishHomework(scope.row)"
                  >
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
    <div class="left-section" v-else>
      <div class="section-header">
        <div class="section-label" style="display: flex; justify-content: space-between; align-items: center;">
          <span>当前订单信息</span>
          <span class="more-info-label" @click="backToOrders" style="display: flex; align-items: center;">
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

      <div class="homework-section" style="margin-top: 10px;">
        <h4 style="color: #999; margin-top: 10px;">待完成作业</h4>
        <el-table :data="pendingHomework" style="width: 100%">
          <el-table-column label="作业ID" prop="id" width="80px"></el-table-column>
          <el-table-column label="作业标题" prop="title" width="150px">
            <template #default="scope">
              <el-tooltip :content="scope.row.title" placement="top">
                <el-input
                    type="textarea"
                    :rows="1"
                    :value="scope.row.title"
                    disabled
                    style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="description" width="200px">
            <template #default="scope">
              <el-tooltip :content="scope.row.description" placement="top">
                <el-input
                    type="textarea"
                    :rows="1"
                    :value="scope.row.description"
                    disabled
                    style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="截止时间" prop="deadline" width="180px">
            <template #default="scope">
              {{ new Date(scope.row.deadline).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="100px">
            <template #default="scope">
                <span>
                  {{
                    scope.row.status === 'incompleted' ? '待完成' :
                        scope.row.status === 'completed' ? '待评价' :
                            scope.row.status === 'overdue' ? '已超时' :
                                scope.row.status === 'evaluated' ? '已完成' : '其他'
                  }}
                </span>
            </template>
          </el-table-column>

          <el-table-column label="文件URL" prop="fileUrl" width="100px">
            <template #default="scope">
              <el-link v-if="scope.row.fileUrl" :href="scope.row.fileUrl" target="_blank">查看附件</el-link>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="教师反馈" prop="review" width="150px">
            <template #default="scope">
              <el-tooltip :content="scope.row.review || '待反馈'" placement="top">
                <el-input
                    v-if="scope.row.review"
                    type="textarea"
                    :rows="1"
                    :value="scope.row.review"
                    disabled
                    style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
                />
                <span v-else>待反馈</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180px">
            <template #default="scope">
              <el-button
                  @click="editHomework(scope.row)"
                  size="small"
                  type="primary">修改</el-button>
              <el-button
                  @click="evaluateHomework(scope.row)"
                  size="small"
                  type="success">评价</el-button>
            </template>
          </el-table-column>
        </el-table>

        <h4 style="color: #999; margin-top: 10px;">已完成作业</h4>
        <el-table :data="finishedHomework" style="width: 100%">
          <el-table-column label="作业ID" prop="id" width="80px"></el-table-column>
          <el-table-column label="作业标题" prop="title" width="150px">
            <template #default="scope">
              <el-tooltip :content="scope.row.title" placement="top">
                <el-input
                    type="textarea"
                    :rows="1"
                    :value="scope.row.title"
                    disabled
                    style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="description" width="200px">
            <template #default="scope">
              <el-tooltip :content="scope.row.description" placement="top">
                <el-input
                    type="textarea"
                    :rows="1"
                    :value="scope.row.description"
                    disabled
                    style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="截止时间" prop="deadline" width="180px">
            <template #default="scope">
              {{ new Date(scope.row.deadline).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="100px">
            <template #default="scope">
                <span>
                  {{
                    scope.row.status === 'incompleted' ? '待完成' :
                        scope.row.status === 'completed' ? '待评价' :
                            scope.row.status === 'overdue' ? '已超时' :
                                scope.row.status === 'evaluated' ? '已完成' : '其他'
                  }}
                </span>
            </template>
          </el-table-column>

          <el-table-column label="文件URL" prop="fileUrl" width="100px">
            <template #default="scope">
              <el-link v-if="scope.row.fileUrl" :href="scope.row.fileUrl" target="_blank">查看附件</el-link>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="教师反馈" prop="review" width="150px">
            <template #default="scope">
              <el-tooltip :content="scope.row.review || '待反馈'" placement="top">
                <el-input
                    v-if="scope.row.review"
                    type="textarea"
                    :rows="1"
                    :value="scope.row.review"
                    disabled
                    style="resize: none; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: normal; max-height: 50px;"
                />
                <span v-else>待反馈</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180px">
            <template #default="scope">
              <el-button
                  @click="editHomework(scope.row)"
                  size="small"
                  type="primary"
                  :disabled="!scope.row.editable"
                  :style="{
                  backgroundColor: scope.row.editable ? '' : '#dcdcdc',
                  borderColor: scope.row.editable ? '' : '#dcdcdc',
                  color: scope.row.editable ? '' : '#888',
                  cursor: scope.row.editable ? 'pointer' : 'not-allowed'
                  }">
                  修改
              </el-button>

              <el-button
                  @click="evaluateHomework(scope.row)"
                  size="small"
                  type="success">评价</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
        title="评价作业"
        v-model="dialogVisible"
        width="500px"
        @close="resetDialog">

      <el-form :model="form">
        <el-form-item label="作业标题">
          <el-input v-model="form.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input v-model="form.description" disabled></el-input>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-input v-model="form.deadline" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论">
          <el-input
              type="textarea"
              v-model="form.review"
              placeholder="请输入教师评论"
              rows="4">
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="修改作业"
        v-model="dialogVisible2"
        width="500px"
        @close="resetDialog">

      <el-form :model="form">
        <el-form-item label="作业标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input
              type="textarea"
              v-model="form.description"
              placeholder="请输入作业描述"
              rows="4">
          </el-input>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-input v-model="form.deadline"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateHomework">确认</el-button>
      </div>
    </el-dialog>

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
      homeworkData: [], // 存储作业信息
      dialogVisible: false,  // 控制评论对话框显示与否
      dialogVisible2: false,  // 控制修改对话框显示与否
      form: {
        id: null,
        orderId: null,
        title: '',
        description: '',
        deadline: '',
        fileUrl: '',
        review: '',
        createdAt:'',
      }
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
    pendingHomework() {
      // 筛选未完成作业（incompleted、overdue、completed）
      return this.homeworkData.filter(item =>
          item.status === 'incompleted' ||
          item.status === 'overdue' ||
          item.status === 'completed'
      );
    },
    finishedHomework() {
      // 筛选已完成作业（evaluated）
      return this.homeworkData.filter(item => item.status === 'evaluated');
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
          this.homeworkData = response.data.data; // 保存获取到的作业信息
          this.showHomework = true; // 显示布置作业界面
          this.homeworkData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    evaluateHomework(row) {
      this.form.id = row.id;
      this.form.orderId = row.orderId;
      this.form.title = row.title;
      this.form.description = row.description;
      this.form.deadline = row.deadline;
      this.form.fileUrl = row.fileUrl;
      this.form.review = row.review || '';  // 如果有评论，则显示评论内容，否则为空
      this.dialogVisible = true;  // 打开对话框
    },
    editHomework(row) {
      this.form.id = row.id;
      this.form.orderId = row.orderId;
      this.form.title = row.title;
      this.form.description = row.description;
      this.form.deadline = row.deadline;
      this.form.fileUrl = row.fileUrl;
      this.form.review = row.review || '';  // 如果有评论，则显示评论内容，否则为空
      this.dialogVisible2 = true;  // 打开对话框
    },

    // 提交评论数据到后端
    async submitReview() {
      try {
        const response = await axios.put('http://localhost:8889/homework/review', this.form);
        if (response.data.code === 200) {
          this.$message.success('评价成功');
          this.dialogVisible = false; // 关闭对话框
          await this.publishHomework(this.currentOrder);
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        this.$message.error('提交失败，请稍后重试');
      }
    },
    async updateHomework() {
      try {
        const response = await axios.put('http://localhost:8889/homework/updateHomework', this.form);
        if (response.data.code === 200) {
          this.$message.success('评价成功');
          this.dialogVisible2 = false; // 关闭对话框
          await this.publishHomework(this.currentOrder);
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error updating homework:', error);
        this.$message.error('提交失败，请稍后重试');
      }
    },

    // 重置对话框数据
    resetDialog() {
      this.form = {
        id: null,
        orderId: null,
        title: '',
        description: '',
        deadline: '',
        fileUrl: '',
        review: ''
      };
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

.more-info-label {
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

</style>
