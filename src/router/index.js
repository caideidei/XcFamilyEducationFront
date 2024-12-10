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
    const role = localStorage.getItem('role'); // 获取角色
    const token = localStorage.getItem('token'); // 获取 token

    if (to.path === '/register') {
        return next();
    }

    // 如果没有 token，强制跳转到登录页面
    if (!token) {
        if (to.path !== '/login') {
            return next('/login');
        }
    } else if (role) {
        // 有 token 和 role，根据角色跳转
        if (to.path === '/login') {
            // 如果已登录但访问登录页面，跳转到对应角色的主页
            switch (role) {
                case 'teacher':
                    return next('/teacher');
                case 'parent':
                    return next('/parent');
                case 'admin':
                    return next('/home');
                default:
                    return next('/login');
            }
        }

        // 检查路由权限
        if (to.meta.role && to.meta.role !== role) {
            // 角色和访问页面不匹配
            switch (role) {
                case 'teacher':
                    return next('/teacher');
                case 'parent':
                    return next('/parent');
                case 'admin':
                    return next('/home');
                default:
                    return next('/login');
            }
        }
    }

    next(); // 放行
});


export default router;
