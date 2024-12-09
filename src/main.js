import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'; // 使用图标
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
import router from './router'; // 引入路由配置
import axios from 'axios';

const app = createApp(App); // 创建 Vue 应用实例

// 检查 localStorage 数据并跳转
const role = localStorage.getItem('role');
const token = localStorage.getItem('token');

if (token && role) {
    switch (role) {
        case 'teacher':
            router.push('/teacher'); // 跳转到教师页面
            break;
        case 'parent':
            router.push('/parent'); // 跳转到家长页面
            break;
        case 'admin':
            router.push('/home'); // 跳转到管理员页面
            break;
        default:
            router.push('/login'); // 如果 role 不合法，跳转到登录页
    }
}

app.use(ElementPlus, { locale: zhCn }); // 使用 ElementPlus 和语言包

// 防止localStorage被修改
// window.addEventListener('storage', function(e) {
//     localStorage.setItem(e.key, e.oldValue)
// });
// // 防止sessionStorage被修改
// window.addEventListener('storage', function(e) {
//     this.sessionStorage.setItem(e.key, e.oldValue)
// });
// // 注册 ElementPlus 图标组件
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component);
// }

// 添加响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果 Token 过期（401 错误）
        if (response && response.data.code === 401 && response.data.msg === "请重新登录") {
            // 清除 localStorage 中的数据
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('role');
            localStorage.removeItem('userPicture');

            // 使用 Vue 实例的全局属性访问 $message
            // app.config.globalProperties.$message.error('登录已过期，请重新登录！');

            // 跳转到登录页面
            router.push('/login');
        }
        return response; // 确保返回 response
    },
    // error => {
    //     return Promise.reject(error); // 将错误继续传递
    // }
);

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');  // 获取 token
        // console.log("main.js中的token"+token);
        if (token) {
            // 如果 token 存在，添加到请求头
            config.headers['token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


app.use(router); // 使用路由
app.mount('#app'); // 挂载 Vue 应用
