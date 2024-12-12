<template>
  <div class="personCenter">
    <h2>个人中心</h2>
    <p>欢迎来到您的个人中心！</p>
    <p>这里可以进行个人信息编辑、查看任务等操作。</p>
  </div>
</template>

<script>
export default {
  name: 'Teacher_PersonCenter',
};
</script>

<style scoped>
.personCenter { /* 修改为 .personCenter 而不是 .profile */
  padding: 20px;
  background-color: #f4f4f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.personCenter h2 {
  font-size: 24px;
  color: #333;
}

.personCenter p {
  font-size: 16px;
  color: #666;
}
</style>
