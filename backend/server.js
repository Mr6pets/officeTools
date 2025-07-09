const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// 数据库文件路径
const DB_FILE = path.join(__dirname, 'users.db');

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
function initDatabase() {
  const db = new sqlite3.Database(DB_FILE);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
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
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名和密码不能为空' 
      });
    }

    const db = new sqlite3.Database(DB_FILE);
    
    // 检查用户是否已存在
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        db.close();
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      if (row) {
        db.close();
        return res.status(400).json({ success: false, message: '用户名已存在' });
      }
      
      // 加密密码并插入用户
      const hashedPassword = await bcrypt.hash(password, 10);
      
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function(err) {
          db.close();
          
          if (err) {
            return res.status(500).json({ success: false, message: '注册失败' });
          }
          
          res.json({ 
            success: true, 
            message: '注册成功',
            user: { id: this.lastID, username }
          });
        }
      );
    });
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

    const db = new sqlite3.Database(DB_FILE);
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      if (!row) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }
      
      // 验证密码
      const isValidPassword = await bcrypt.compare(password, row.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }
      
      res.json({ 
        success: true, 
        message: '登录成功',
        user: { id: row.id, username: row.username }
      });
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取用户列表接口
app.get('/api/users', (req, res) => {
  const db = new sqlite3.Database(DB_FILE);
  
  db.all('SELECT id, username, created_at FROM users', [], (err, rows) => {
    db.close();
    
    if (err) {
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    res.json({ success: true, users: rows });
  });
});

// 启动服务器
initDatabase();
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('数据库文件:', DB_FILE);
});