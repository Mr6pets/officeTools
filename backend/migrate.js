const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 文件路径
const JSON_FILE = path.join(__dirname, 'users.json');
const DB_FILE = path.join(__dirname, 'users.db');

async function migrateData() {
  try {
    // 读取JSON数据
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    
    // 连接数据库
    const db = new sqlite3.Database(DB_FILE);
    
    // 创建表（如果不存在）
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 插入数据
    const stmt = db.prepare('INSERT OR REPLACE INTO users (username, password, created_at) VALUES (?, ?, ?)');
    
    jsonData.forEach(user => {
      stmt.run(user.username, user.password, user.createdAt);
      console.log(`导入用户: ${user.username}`);
    });
    
    stmt.finalize();
    
    db.close((err) => {
      if (err) {
        console.error('关闭数据库时出错:', err);
      } else {
        console.log('数据迁移完成！');
      }
    });
    
  } catch (error) {
    console.error('迁移失败:', error);
  }
}

migrateData();