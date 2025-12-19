# ⚡ 快速启动指南

## 第一次使用？跟着这个来！

### 📋 前置要求

- Node.js 18+ （[下载](https://nodejs.org/)）
- 代码编辑器（推荐 VS Code）
- Anthropic API Key（[获取](https://console.anthropic.com/)）

---

## 🎯 5分钟快速启动

### 步骤1️⃣：启动后端（终端1）

```bash
# 进入后端目录
cd backend

npm install lunar-javascript

# 安装依赖
npm install

npm list lunar-javascript


# 复制配置文件
cp .env.example .env

# ⚠️ 重要：编辑 .env 文件
# 打开 .env，将 your_api_key_here 替换为你的真实API密钥
```

编辑 `backend/.env`：
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx  # 👈 改成你的密钥
PORT=3000
FRONTEND_URL=http://localhost:5500
```

```bash
# 启动后端服务
npm start
```

✅ 看到这个说明成功：
```
✅ 后端服务器启动成功！
📡 运行在：http://localhost:3000
```

### 步骤2️⃣：启动前端（终端2）

打开**新的终端窗口**：

```bash
# 进入前端目录
cd frontend

# 方式A：使用Python（推荐）
python -m http.server 5500

# 方式B：使用Node.js
npx http-server -p 5500

# 方式C：使用VS Code Live Server
# 右键 index.html → Open with Live Server
```

✅ 看到类似输出：
```
Serving HTTP on 0.0.0.0 port 5500
```

### 步骤3️⃣：打开浏览器

访问：**http://localhost:5500**

🎉 开始使用！

---

## 🔍 验证是否正常工作

### 测试后端
在浏览器访问：http://localhost:3000/health

应该看到：
```json
{"status":"ok","timestamp":"2024-..."}
```

### 测试前端
1. 打开 http://localhost:5500
2. 填写生日信息
3. 点击"开始解读"
4. 等待5-10秒
5. 查看结果

---

## ❌ 遇到问题？

### 问题1：后端启动失败

**错误**：`Cannot find module 'express'`
```bash
# 解决：重新安装依赖
cd backend
rm -rf node_modules
npm install
```

**错误**：`Port 3000 already in use`
```bash
# 解决：杀死占用端口的进程
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F
```

### 问题2：前端无法连接后端

**错误**：浏览器控制台显示 `Failed to fetch`

**检查清单**：
- [ ] 后端是否启动？访问 http://localhost:3000/health
- [ ] 前端配置是否正确？检查 `frontend/js/config.js`
- [ ] 端口是否正确？后端3000，前端5500

**解决**：
```bash
# 1. 确认后端运行
cd backend
npm start

# 2. 确认前端运行
cd frontend
python -m http.server 5500
```

### 问题3：API调用失败

**错误**：`API请求失败: 401`

**原因**：API密钥未配置或无效

**解决**：
1. 检查 `backend/.env` 文件
2. 确认 `ANTHROPIC_API_KEY` 已正确填写
3. 重启后端服务

### 问题4：结果页面空白

**原因**：AI返回的内容格式不对

**解决**：
1. 打开浏览器开发者工具（F12）
2. 查看Console标签的错误信息
3. 如果看到"未设置ANTHROPIC_API_KEY"，说明会返回模拟数据
4. 检查后端日志

---

## 📱 测试建议

### 基础测试
```
生日：1990-01-01
历法：公历
时辰：巳时 (09:00-11:00)
性别：男
城市：北京
```

点击"开始解读"，应该在5-10秒内看到结果。

### 压力测试
连续提交3-5次，确保每次都能正常返回。

---

## 🎓 下一步

成功启动后，你可以：

1. **自定义样式**
   - 编辑 `frontend/css/style.css`
   - 修改颜色变量

2. **优化排盘算法**
   - 安装 `lunar-javascript`
   - 修改 `backend/utils/bazi-calculator.js`

3. **添加新功能**
   - 参考 `README.md` 的扩展功能部分

4. **部署到生产环境**
   - 查看根目录 `README.md` 的部署方案

---

## 💡 小贴士

### 开发模式自动重启

后端开发时使用：
```bash
cd backend
npm run dev  # 使用nodemon自动重启
```

### 查看日志

后端日志：
- 终端输出
- 包含API调用信息

前端日志：
- 浏览器开发者工具（F12）
- Console标签

### 性能优化

首次API调用可能较慢（5-10秒），后续可以：
1. 添加缓存机制
2. 使用更快的模型
3. 优化Prompt

---

## 🆘 获取帮助

1. 查看各目录的 `README.md`
2. 检查浏览器Console错误
3. 查看后端终端日志
4. GitHub Issues

---

**祝使用愉快！** 🎉