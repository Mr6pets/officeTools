const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'users.json');

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据文件
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // 文件不存在，创建空的用户数组
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
    console.log('创建了新的用户数据文件');
  }
}

// 读取用户数据
async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取用户数据失败:', error);
    return [];
  }
}

// 写入用户数据
async function writeUsers(users) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('写入用户数据失败:', error);
    throw error;
  }
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

    const users = await readUsers();
    
    // 检查用户是否已存在
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名已存在' 
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 添加新用户
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    res.json({ 
      success: true, 
      message: '注册成功',
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
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

    const users = await readUsers();
    
    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    res.json({ 
      success: true, 
      message: '登录成功',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 获取用户列表接口（可选，用于测试）
app.get('/api/users', async (req, res) => {
  try {
    const users = await readUsers();
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    }));
    res.json({ success: true, users: safeUsers });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 启动服务器
async function startServer() {
  await initDataFile();
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('用户数据将保存在:', DATA_FILE);
  });
}

startServer().catch(console.error);