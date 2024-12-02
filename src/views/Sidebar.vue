<!--侧边栏-->
<template>
    <el-col class="sidebar">
      <el-menu
          default-active="0"
          :default-openeds="['1', '2']"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
      >

        <el-menu-item index="0">
          <el-icon><HomeFilled /></el-icon>
          <span>后台系统</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>系统管理</span>
          </template>
            <el-menu-item index="1-1">订单管理</el-menu-item>
            <el-menu-item index="1-2">审核管理</el-menu-item>
            <el-menu-item index="1-3">评论管理</el-menu-item>
            <el-menu-item index="1-4">作业管理</el-menu-item>
            <el-menu-item index="1-5">反馈管理</el-menu-item>
            <el-menu-item index="1-6">公告管理</el-menu-item>
          </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="2-1">管理员信息</el-menu-item>
          <el-menu-item index="2-2">教师信息</el-menu-item>
          <el-menu-item index="2-3">家长信息</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
</template>

<script>
import { Location, HomeFilled,Menu } from '@element-plus/icons-vue';
export default {
  components: {
    Location,
    HomeFilled,
    Menu,
  },
  methods: {
    handleSelect(index) {
      this.$emit('select', index);
    },
    handleOpen(){},
    handleClose(){},
  }
}

</script>

<style>
.sidebar {
  height: 90vh;
  border-right: none;
  display: flex;
  flex-direction: column;
}
.el-menu {
  flex: 1;
  border-right: none !important; /* 强制移除右侧边框 */
}
.el-menu-item.is-active {
  background-color: ghostwhite ; /* 设置背景颜色 */
  border-left: 4px solid slateblue; /* 设置右侧边框颜色为紫色 */
}

.el-menu-item.is-active .el-icon,
.el-sub-menu__title.is-active .el-icon {
  color: slateblue !important; /* 设置图标颜色为紫色 */
}

</style>
