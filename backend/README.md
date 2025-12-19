# AI八字算命 - 后端服务

基于 Node.js + Express 的后端API服务。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
ANTHROPIC_API_KEY=sk-ant-api03-你的密钥
PORT=3000
FRONTEND_URL=http://localhost:5500
```

> 获取API密钥：https://console.anthropic.com

### 3. 启动服务

```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

### 4. 测试API

访问健康检查：http://localhost:3000/health

或使用curl测试：

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "birthdate": "1990-01-01",
    "calendarType": "solar",
    "birthTime": "09-11",
    "gender": "male",
    "city": "北京"
  }'
```

## API文档

### POST /api/calculate

计算八字并获取AI解读。

**请求体：**

```json
{
  "birthdate": "1990-01-01",      // 必填，出生日期
  "calendarType": "solar",         // 必填，历法类型（solar/lunar）
  "birthTime": "09-11",            // 必填，时辰
  "gender": "male",                // 必填，性别（male/female）
  "city": "北京"                   // 可选，城市
}
```

**响应：**

```json
{
  "success": true,
  "pillars": {
    "year": { "heavenly": "庚", "earthly": "午" },
    "month": { "heavenly": "戊", "earthly": "子" },
    "day": { "heavenly": "甲", "earthly": "寅" },
    "hour": { "heavenly": "己", "earthly": "巳" }
  },
  "elements": {
    "木": 2,
    "火": 2,
    "土": 2,
    "金": 1,
    "水": 1
  },
  "interpretation": {
    "overview": "...",
    "personality": "...",
    "love": "...",
    "career": "...",
    "wealth": "...",
    "health": "..."
  }
}
```

## 项目结构

```
backend/
├── server.js              # 主服务器
├── routes/
│   └── bazi.js           # API路由
├── utils/
│   ├── bazi-calculator.js # 八字计算
│   └── ai-service.js      # AI服务
├── package.json
├── .env.example
└── README.md
```

## 开发说明

### 排盘算法

当前使用简化版算法，生产环境建议使用：

```bash
npm install lunar-javascript
```

### 错误处理

所有API错误都会返回以下格式：

```json
{
  "error": "错误描述",
  "message": "详细信息（仅开发环境）"
}
```

### CORS配置

默认允许 `http://localhost:5500`，可通过 `FRONTEND_URL` 修改。

生产环境请设置为实际前端域名。

## 部署

### 使用PM2

```bash
npm install -g pm2
pm2 start server.js --name bazi-backend
pm2 save
pm2 startup
```

### 使用Docker

```bash
docker build -t bazi-backend .
docker run -p 3000:3000 --env-file .env bazi-backend
```

## 许可证

MIT