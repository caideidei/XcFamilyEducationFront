<template>
  <div className="content">
    <component :is="getComponent(selectedSection)"/>
  </div>
</template>

<script>
import Teacher_HomeSection from './Teacher_HomeSection.vue';
import Teacher_MyTutoring from './Teacher_MyTutoring.vue';
import Teacher_SystemAnnouncements from './Teacher_SystemAnnouncements.vue';
import Teacher_Feedback from './Teacher_Feedback.vue';

export default {
  props: {
    selectedSection: String,
  },
  components: {
    Teacher_HomeSection,
    Teacher_MyTutoring,
    Teacher_SystemAnnouncements,
    Teacher_Feedback,
  },
  methods: {
    getComponent(section) {
      switch (section) {
        case '家教广场':
          return 'Teacher_HomeSection';
        case '我的家教':
          return 'Teacher_MyTutoring';
        case '系统公告':
          return 'Teacher_SystemAnnouncements';
        case '留言反馈':
          return 'Teacher_Feedback';
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
