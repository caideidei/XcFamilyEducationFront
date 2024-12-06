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
        meta: { role: 'admin' },
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
        meta: { role: 'teacher' },
    },
    {
        path: '/parent',
        name: 'Parent',
        component: Parent,  // 家长页面的路由配置
        meta: { role: 'parent' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
// 路由守卫
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('role'); // 获取当前角色

    // 如果路由需要特定角色且当前角色不匹配
    if (to.meta.role && to.meta.role !== role) {
        // 角色不匹配时，跳转到指定页面
        if (role === 'teacher') {
            next('/teacher'); // 如果是教师角色，跳转到教师页面
        } else if (role === 'parent') {
            next('/parent'); // 如果是家长角色，跳转到家长页面
        } else if (role === 'admin') {
            next('/home'); // 如果是家长角色，跳转到家长页面
        }
        else {
            next('/login'); // 如果是其他角色，跳转到登录页面
        }
    } else {
        next(); // 角色匹配，正常跳转
    }
});

export default router;
