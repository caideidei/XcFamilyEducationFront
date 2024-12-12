<template>
  <div className="content">
    <component :is="getComponent(selectedSection)"/>
  </div>
</template>

<script>
import Teacher_StudySquare from './Teacher_StudySquare.vue';
import Teacher_MyTutoring from './Teacher_MyTutoring.vue';
import Teacher_SystemAnnouncements from './Teacher_SystemAnnouncements.vue';
import Teacher_Feedback from './Teacher_Feedback.vue';
import Teacher_PersonCenter from './Teacher_PersonCenter.vue';

export default {
  props: {
    selectedSection: String,
  },
  components: {
    Teacher_StudySquare,
    Teacher_MyTutoring,
    Teacher_SystemAnnouncements,
    Teacher_Feedback,
    Teacher_PersonCenter,
  },
  methods: {
    getComponent(section) {
      switch (section) {
        case '家教广场':
          return 'Teacher_StudySquare';
        case '我的家教':
          return 'Teacher_MyTutoring';
        case '系统公告':
          return 'Teacher_SystemAnnouncements';
        case '留言反馈':
          return 'Teacher_Feedback';
        case '个人中心':
          return 'Teacher_PersonCenter';
        default:
          return 'Teacher_HomeSection';
      }
    }
  }
};
</script>

<style scoped>
.content {
  padding: 20px;
}
</style>
