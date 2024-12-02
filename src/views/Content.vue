<!--中间主体-->
<template>
  <div>
    <MainBack v-if="selectedSection ==='0'"/>
    <Order v-if="selectedSection === '1-1'" />
    <Examine v-if="selectedSection === '1-2'" />
    <Review v-if="selectedSection === '1-3'" />
    <Homework v-if="selectedSection === '1-4'" />
    <Feedback v-if="selectedSection === '1-5'" />
    <Notice v-if="selectedSection === '1-6'" />
    <Admin v-if="selectedSection === '2-1'" />
    <Teacher v-if="selectedSection === '2-2'" />
    <Parent v-if="selectedSection === '2-3'" />
  </div>
</template>


<script>
import Order from '../components/MainPart/Order.vue';
import Review from '../components/MainPart/Review.vue';
import Examine from '../components/MainPart/Examine.vue';
import Notice from '../components/MainPart/Notice.vue';
import Parent from "../components/MainPart/Parent.vue";
import Teacher from "../components/MainPart/Teacher.vue";
import Admin from "../components/MainPart/Admin.vue";
import Feedback from "../components/MainPart/Feedback.vue";
import Homework from "../components/MainPart/Homework.vue";
import MainBack from "../components/MainPart/MainBack.vue";
export default {
  components:{
    MainBack,
    Order,
    Review,
    Examine,
    Notice,
    Parent,
    Teacher,
    Admin,
    Feedback,
    Homework,
  },
  props: {
    selectedSection: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
.el-main {
  padding: 20px;
  background-color: ghostwhite;
}
</style>
