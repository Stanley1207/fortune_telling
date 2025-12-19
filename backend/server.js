require('dotenv').config();
const express = require('express');
const cors = require('cors');
const baziRouter = require('./routes/bazi');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    credentials: true
}));
app.use(express.json());

// 路由
app.use('/api', baziRouter);

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ 
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('=================================');
    console.log('✅ 后端服务器启动成功！');
    console.log(`📡 运行在：http://localhost:${PORT}`);
    console.log(`🔧 健康检查：http://localhost:${PORT}/health`);
    console.log(`🎯 API接口：http://localhost:${PORT}/api/calculate`);
    console.log('=================================');
});

module.exports = app;