<template>
  <div class="study-square">

    <!-- 家教信息推荐标签和按钮放在同一行 -->
    <div class="section-header">
      <div class="section-label">{{ showAllOrders ? '所有家教' : '家教推荐' }}</div>
      <div class="button-container">
        <!-- 换一换标签 -->
        <span class="change-label" v-if="!showAllOrders" @click="fetchData">换一换
           <img src="/icons/刷新.png" alt="换一换" class="icon"/>
        </span>
        <!-- 更多信息标签 -->
        <span class="more-info-label" @click="toggleShowAllOrders">
              {{ showAllOrders ? '返回' : '更多信息' }}
              <img :src="showAllOrders ? '/icons/返回.png' : '/icons/更多.png'" alt="返回/更多信息" class="icon"/>
        </span>
      </div>
    </div>

    <div class="search-container" v-if="showAllOrders">
      <el-input
          v-model="searchQuery"
          placeholder="搜索内容"
          class="search-input"
      />
      <el-button @click="search" type="primary" class="search-button">搜索</el-button>
      <el-button @click="resetSearch" class="reset-button">重置</el-button>
    </div>

    <!--  家教分类图片  -->
    <div v-if="showAllOrders" class="tag-container">
      <el-row class="tag-row" type="flex" justify="space-around">
        <el-col v-for="tag in tags" :key="tag" :span="2">
          <el-button
              @click="searchByTag(tag)"
              class="tag-button"
              style="width: 100%; text-align: center;height: 60px"
          >
            <img :src="`/icons/${tag}.png`" alt="" class="tag-image"/>
            {{ tag }}
          </el-button>
        </el-col>
      </el-row>
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
      <el-table-column label="操作" min-width="80">
        <template #default="scope">
          <el-button type="success" size="small" style="height: 35px" @click="handleAcceptOrder(scope.row)">
            我要接单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" v-if="showAllOrders">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[1, 3, 5]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <br><br>

<!--    <div class="section-label" v-if="!showAllOrders">家教分类</div>-->
    <div class="category-content" v-if="!showAllOrders">
      <div class="category-left">
        <div class="category-title">家教分类</div>
        <!-- 新增的标签部分 -->
        <el-row class="tag-row" type="flex" justify="space-around">
          <el-col v-for="(tag, index) in tags" :key="index" :span="7">
            <el-button
                @click="searchByTag(tag)"
                class="tag-button"
                style="width: 80%; text-align: center; height: 60px"
            >
              <img :src="`/icons/${tag}.png`" alt="" class="tag-image"/>
              {{ tag }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="category-divider"></div>
      <div class="category-right">
        <div class="category-title">其他分类</div>
        <!-- 其他分类内容展示区 -->
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: '',
      tableData: [],  // 保存所有家教信息
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      showAllOrders: false,  // 是否显示所有家教信息
      tags: ['语文', '数学','英语','物理', '历史', '化学', '地理', '生物', '政治'],
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.tableData;
      return this.tableData.filter(item =>
          item.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) // 仅根据学科标签过滤
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
          if (!this.showAllOrders) {
            // 只显示前三条
            const shuffledData = this.shuffleArray(this.tableData);
            this.tableData = shuffledData.slice(0, 4);
          }
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
    searchByTag(tag) {
      this.searchQuery = tag;
      this.showAllOrders = true; // 显示所有家教信息
      this.fetchData(); // 根据标签重新获取家教信息
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    toggleShowAllOrders() {
      this.showAllOrders = !this.showAllOrders;
      if (!this.showAllOrders) {
        this.searchQuery = '';  // 清空搜索栏
      }
      this.fetchData();  // 切换时重新加载数据
    },
    async handleAcceptOrder(order) {
      this.$message.success("知道你要接单，别急，还没开发完");
    },
  },
};
</script>

<style scoped>
.study-square {
  padding: 20px;
  gap: 10px;
  margin-top: -20px;
  margin-left: -20px;
  min-height: 605px;
  border-radius: 10px;
  height: 75vh;
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

.category-content {
  font-size: 16px;
  color: #666;
}

.pagination-container {
  margin-top: 20px; /* 添加与表格的距离 */
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

.tag-image {
  width: 30px;  /* 调整图片的宽度 */
  height: 30px;  /* 调整图片的高度 */
  margin-bottom: 5px;
  object-fit: contain;  /* 确保图片不会失真 */

}

.tag-container {
  margin-bottom: 20px; /* 增加与表格之间的距离，您可以根据需要调整这个值 */
}

.tag-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;  /* 为按钮添加圆角，您可以根据需要调整这个值 */
  padding: 5px;  /* 添加内边距来保证圆角效果明显 */
}

.el-table {
  border-radius: 10px; /* 表格圆角 */
  overflow: hidden;   /* 保证表格内容显示时圆角不被覆盖 */
}

.el-table th,
.el-table td {
  padding: 10px; /* 给表格单元格增加内边距，使圆角更加明显 */
}

.el-pagination {
  border-radius: 10px; /* 分页圆角 */
}

.category-content {
  display: flex;
  justify-content: space-between; /* 使左右两部分在两边 */
  align-items: flex-start;
}

.category-left, .category-right {
  width: 48%; /* 两个部分各占 48% 宽度，留出空间给竖线 */
}

.category-divider {
  width: 1px;
  background-color: #ccc;
  height: 100%; /* 竖线的高度占满容器 */
}

.category-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.el-col {
  margin-bottom: 20px !important;  /* 为每一行添加间隔 */
}
</style>
