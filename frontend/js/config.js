/**
 * 前端配置文件
 * 修改这里的API_BASE_URL来连接后端服务
 */

const CONFIG = {
    // 后端API地址
    API_BASE_URL: 'http://localhost:3000/api',
    
    // 是否启用调试模式
    DEBUG: true
};

// 如果需要在不同环境使用不同配置，可以这样写：
// const CONFIG = {
//     API_BASE_URL: window.location.hostname === 'localhost' 
//         ? 'http://localhost:3000/api'
//         : 'https://your-production-api.com/api',
//     DEBUG: window.location.hostname === 'localhost'
// };