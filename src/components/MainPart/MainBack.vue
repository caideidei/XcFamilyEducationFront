<template>
  <div class="container">
    <div class="left-side">
      <div class="top-left">
        <h2>欢迎信息</h2>
      </div>
      <div class="bottom-left">
        <h2>今日TODO</h2>
      </div>
    </div>

    <div class="right-side">
      <div class="top-right">
        <h2>系统用户情况</h2>
      </div>
      <div class="bottom-right">
        <h2>订单收益情况</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainBack"
}
</script>

<style scoped>
/* 外部容器 */
.container {
  display: flex;
  height: 85vh; /* 使用85%视口高度 */
  margin: 0 auto; /* 使容器水平居中 */
  gap: 15px;
}

/* 左侧部分 */
.left-side {
  width: 50%;  /* 占用一半宽度 */
  display: flex;
  flex-direction: column; /* 上下布局 */
  height: 100%; /* 让左侧部分高度充满容器 */
  gap: 15px; /* 为上下部分间增加间距 */
}

/* 上四分之一部分 */
.top-left {
  height: 25%; /* 占左侧高度的25% */
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

/* 下四分之三部分 */
.bottom-left {
  height: 75%; /* 占左侧高度的75% */
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto; /* 防止内容溢出 */
}

/* 右侧部分 */
.right-side {
  width: 50%;  /* 占用一半宽度 */
  display: flex;
  flex-direction: column;  /* 右侧分为上下两部分 */
  height: 100%; /* 让右侧部分高度充满容器 */
}

/* 右上部分 */
.top-right {
  flex: 1;  /* 占据右侧的上半部分 */
  background-color: #d0d0d0;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: auto;
}

/* 右下部分 */
.bottom-right {
  flex: 1;  /* 占据右侧的下半部分 */
  background-color: #b0b0b0;
  border-radius: 10px;
  padding: 20px;
  overflow: auto;
}
</style>
