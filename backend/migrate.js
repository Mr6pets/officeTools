const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_FILE = path.join(__dirname, 'users.db');

function migrateDatabase() {
  console.log('开始数据库迁移...');
  const db = new sqlite3.Database(DB_FILE);
  
  // 检查表结构
  db.all("PRAGMA table_info(users)", [], (err, columns) => {
    if (err) {
      console.error('检查表结构失败:', err);
      db.close();
      return;
    }
    
    console.log('当前表结构:', columns.map(col => col.name));
    
    const hasEmailColumn = columns.some(col => col.name === 'email');
    
    if (!hasEmailColumn) {
      console.log('添加email列...');
      db.run('ALTER TABLE users ADD COLUMN email TEXT', (err) => {
        if (err) {
          console.error('添加email列失败:', err);
        } else {
          console.log('email列添加成功');
          
          // 为现有用户添加默认邮箱
          db.run('UPDATE users SET email = username || "@example.com" WHERE email IS NULL', (err) => {
            if (err) {
              console.error('更新默认邮箱失败:', err);
            } else {
              console.log('默认邮箱更新完成');
            }
            db.close();
            console.log('迁移完成');
          });
        }
      });
    } else {
      console.log('email列已存在，无需迁移');
      db.close();
    }
  });
}

migrateDatabase();

const JSON_FILE = path.join(__dirname, 'users.json');

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