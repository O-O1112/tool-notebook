import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import spacesRoutes from './routes/spaces.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化 SQLite 資料庫綱要與示範帳號
initDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spacesRoutes);

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'class-tool-notebook',
    time: new Date().toISOString(),
  });
});

// 生產環境靜態頁面服務
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[ClassTool Notebook] 伺服器已啟動於 http://localhost:${PORT}`);
});
