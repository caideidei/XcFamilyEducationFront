import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Register from "@/views/Register.vue";
import Teacher from "@/components/Teacher/Teacher.vue";
import Parent from "@/components/Parent/Parent.vue";

const routes = [
    {
        path: '/',
        redirect: '/login', // 默认路径指向登录界面
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        props: route => ({
            userPicture: route.params.userPicture,
            userName: route.params.userName,
        }),
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,  // 注册页面的路由配置
    },
    {
        path: '/teacher',
        name: 'Teacher',
        component: Teacher,  // 教师页面的路由配置
    },
    {
        path: '/parent',
        name: 'Parent',
        component: Parent,  // 家长页面的路由配置
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
