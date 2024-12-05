<template>
  <div class="container">
    <!-- 左侧部分 -->
    <div class="left-side">
      <h2>左侧部分</h2>
    </div>

    <!-- 右侧部分 -->
    <div class="right-side">
      <div class="top-right">
        <h2>右上部分</h2>
      </div>
      <div class="bottom-right">
        <h2>右下部分</h2>
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
  height: 85vh; /* 使用90%视口高度，而不是100vh，减少高度 */
  margin: 0 auto; /* 使容器水平居中 */
  gap:15px;
}

/* 左侧部分 */
.left-side {
  width: 50%;  /* 占用一半宽度 */
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box; /* 使内边距不影响总宽度 */
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
  overflow: auto; /* 防止内容溢出 */
}

/* 右下部分 */
.bottom-right {
  flex: 1;  /* 占据右侧的下半部分 */
  background-color: #b0b0b0;
  border-radius: 10px;
  padding: 20px;
  overflow: auto; /* 防止内容溢出 */
}
</style>
