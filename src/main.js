import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'; // 使用图标
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
import router from './router'; // 引入路由配置
import axios from 'axios';

const app = createApp(App); // 创建 Vue 应用实例

app.use(ElementPlus, { locale: zhCn }); // 使用 ElementPlus 和语言包

// 注册 ElementPlus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
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
