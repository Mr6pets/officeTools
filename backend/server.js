const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3088;

// 数据库文件路径
const DB_FILE = path.join(__dirname, 'users.db');

// 中间件
app.use(cors({
  origin: ['http://officetools.guluwater.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// 初始化数据库
function initDatabase() {
  const db = new Database(DB_FILE);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.close();
  console.log('数据库初始化完成');
}

// 注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名、邮箱和密码不能为空' 
      });
    }

    const db = new Database(DB_FILE);
    
    try {
      // 检查用户是否已存在
      const existingUser = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, email);
      
      if (existingUser) {
        const message = existingUser.username === username ? '用户名已存在' : '邮箱已存在';
        db.close();
        return res.status(400).json({ success: false, message });
      }
      
      // 加密密码并插入用户
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(username, email, hashedPassword);
      
      db.close();
      
      res.json({ 
        success: true, 
        message: '注册成功',
        user: { id: result.lastInsertRowid, username, email }
      });
    } catch (dbError) {
      db.close();
      console.error('数据库操作错误:', dbError);
      return res.status(500).json({ success: false, message: '注册失败' });
    }
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名和密码不能为空' 
      });
    }

    const db = new Database(DB_FILE);
    
    try {
      // 支持用户名或邮箱登录
      const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username);
      
      db.close();
      
      if (!user) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }
      
      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }
      
      res.json({ 
        success: true, 
        message: '登录成功',
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (dbError) {
      db.close();
      console.error('数据库操作错误:', dbError);
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取用户列表接口
app.get('/api/users', (req, res) => {
  try {
    console.log('收到获取用户列表请求');
    console.log('数据库文件路径:', DB_FILE);
    
    const db = new Database(DB_FILE);
    
    try {
      const users = db.prepare('SELECT id, username, email, created_at FROM users').all();
      db.close();
      
      console.log('查询成功，返回', users.length, '条记录');
      res.json({ success: true, users });
    } catch (dbError) {
      db.close();
      console.error('查询失败:', dbError);
      return res.status(500).json({ success: false, message: '查询失败: ' + dbError.message });
    }
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 启动服务器
initDatabase();
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('数据库文件:', DB_FILE);
});