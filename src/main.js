import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus, {ElMessage} from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'; // 使用图标
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
import router from './router'; // 引入路由配置
import axios from 'axios';

const app = createApp(App); // 创建 Vue 应用实例

app.use(ElementPlus, { locale: zhCn }); // 使用 ElementPlus 和语言包

['localStorage', 'sessionStorage'].forEach((storageType) => {
    window.addEventListener('storage', function (e) {
        if (e.storageArea === window[storageType]) {
            window[storageType].setItem(e.key, e.oldValue);
        }
    });
});
// 注册 ElementPlus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

axios.interceptors.response.use(
    response => {
        // 如果 Token 过期（401 错误）
        if (response && response.data.code === 401 && response.data.msg === "请重新登录") {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                // 尝试使用 refreshToken 刷新 token
                return axios.post('http://localhost:8889/common/refreshToken', { refreshToken: refreshToken }, {
                    headers: {
                        'token': localStorage.getItem('token'),  // 也可以传递当前的 token 作为头部
                        'refreshToken':refreshToken
                    }
                }).then(refreshResponse => {
                    if (refreshResponse && refreshResponse.data.code === 200) {
                        // console.log("回复token"+refreshResponse.data.data)
                        // 获取新的 token 并更新到 localStorage
                        const newToken = refreshResponse.data.data;
                        localStorage.setItem('token', newToken);
                        // 更新请求头中的 token
                        axios.defaults.headers['token'] = newToken;

                        // 重新请求原来的接口
                        response.config.headers['token'] = newToken;
                        return axios(response.config); // 返回新的请求
                    } else {
                        // console.log("回复"+refreshResponse)
                        // 刷新失败，跳转到登录页面
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userPicture');
                        localStorage.removeItem('role');
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        router.push('/login');
                        ElMessage.error('刷新 Token 失败，请重新登录');
                    }
                });
            } else {
                // 没有 refreshToken，跳转到登录页面
                localStorage.removeItem('userName');
                localStorage.removeItem('userPicture');
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                router.push('/login');
                ElMessage.error('刷新 Token 失败，请重新登录');
            }
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
