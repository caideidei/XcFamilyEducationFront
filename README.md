
# 学习营平台 - 前端部分

## 项目简介

该项目是学习营平台的前端部分，使用Vue3、Element Plus和Axios构建。通过与后端API交互，实现用户管理、课程选择、作业布置等功能。该平台旨在为学习者提供一个高效的学习环境。

## 技术栈

- **Vue3**：现代化JavaScript框架，用于构建用户界面。
- **Element Plus**：基于Vue3的UI框架，提供丰富的UI组件，提升用户体验。
- **Axios**：用于发送HTTP请求，获取后端数据并进行数据处理。

## 项目结构

该项目遵循Vue3的标准目录结构，主要包括以下目录和文件：

- `src/`：包含所有源代码。
  - `assets/`：静态资源，如图片和字体等。
  - `components/`：公共组件，如导航栏、表格组件等。
  - `views/`：页面视图组件，如登录页、课程列表页、用户管理页等。
  - `router/`：路由配置，定义各页面的路由。
  - `store/`：Vuex状态管理，用于存储全局状态，如用户信息、课程数据等。
  - `api/`：与后端进行交互的API接口封装。
  - `App.vue`：根组件。
  - `main.js`：项目的入口文件，初始化Vue实例。

## 安装与运行

### 前提条件

确保本地环境中已安装以下工具：

- Node.js（推荐版本 >= 16.x）
- npm 或 yarn（用于包管理）

### 克隆项目

首先，通过Git克隆此项目：

```bash
git clone https://github.com/your-username/your-repository-name.git
```

### 安装依赖

进入项目目录，安装项目依赖：

```bash
cd your-repository-name
npm install
```

或者使用yarn：

```bash
yarn install
```

### 启动项目

运行以下命令启动开发服务器：

```bash
npm run serve
```

或者使用yarn：

```bash
yarn serve
```

默认情况下，应用将在`http://localhost:8080`运行。

## 与后端交互

前端使用Axios与后端进行数据交互。以下是一些常见的API调用示例：

### 示例：用户登录

- **API URL**：`/api/login`
- **请求方式**：POST
- **请求体**：

```javascript
const data = {
  username: 'user',
  password: 'password'
};

axios.post('/api/login', data)
  .then(response => {
    console.log('登录成功', response.data);
  })
  .catch(error => {
    console.error('登录失败', error);
  });
```

### 示例：获取课程列表

- **API URL**：`/api/courses`
- **请求方式**：GET
- **调用示例**：

```javascript
axios.get('/api/courses')
  .then(response => {
    console.log('课程列表:', response.data);
  })
  .catch(error => {
    console.error('获取课程失败', error);
  });
```

## 目录结构

```
src/
├── assets/               # 静态资源
├── components/           # 公共组件
├── views/                # 页面视图
├── router/               # 路由配置
├── store/                # Vuex状态管理
├── api/                  # API接口封装
├── App.vue               # 根组件
├── main.js               # 项目的入口文件
```

## 贡献

如果您希望为该项目做出贡献，请遵循以下步骤：

1. Fork本仓库
2. 创建您的功能分支（`git checkout -b feature/your-feature`）
3. 提交您的更改（`git commit -am 'Add new feature'`）
4. 推送到您的分支（`git push origin feature/your-feature`）
5. 提交一个Pull Request

## 许可证

本项目采用MIT许可证，具体内容请参见`LICENSE`文件。


### 主要更新内容：
1. **技术栈**：详细描述了前端部分使用的技术。
2. **项目结构**：列出了前端文件和目录的结构，便于开发者快速了解项目架构。
3. **与后端交互**：通过Axios示例展示了如何与后端进行数据交互。
