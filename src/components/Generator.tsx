import React, { useState } from 'react';
import { Card, Button, Input, Space, Checkbox, Typography, Tabs, message, Row, Col } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TabPane } = Tabs;

const Generator: React.FC = () => {
  return (
    <Tabs defaultActiveKey="password">
      <TabPane tab="密码生成" key="password">
        <PasswordGenerator />
      </TabPane>
      <TabPane tab="UUID生成" key="uuid">
        <UUIDGenerator />
      </TabPane>
      <TabPane tab="随机数据" key="random">
        <RandomDataGenerator />
      </TabPane>
    </Tabs>
  );
};

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false
  });

  const generatePassword = () => {
    let charset = '';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) {
      message.warning('请至少选择一种字符类型');
      return;
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
  };

  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      message.success('密码已复制到剪贴板');
    }
  };

  return (
    <Card title="密码生成器">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text>密码长度: {length}</Text>
          <input 
            type="range" 
            min="4" 
            max="50" 
            value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))}
            style={{ width: '200px', marginLeft: '16px' }}
          />
        </div>
        
        <div>
          <Text>字符类型:</Text>
          <div style={{ marginTop: 8 }}>
            <Checkbox 
              checked={options.uppercase}
              onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
            >
              大写字母 (A-Z)
            </Checkbox>
            <br/>
            <Checkbox 
              checked={options.lowercase}
              onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
            >
              小写字母 (a-z)
            </Checkbox>
            <br/>
            <Checkbox 
              checked={options.numbers}
              onChange={(e) => setOptions({...options, numbers: e.target.checked})}
            >
              数字 (0-9)
            </Checkbox>
            <br/>
            <Checkbox 
              checked={options.symbols}
              onChange={(e) => setOptions({...options, symbols: e.target.checked})}
            >
              特殊符号 (!@#$%^&*)
            </Checkbox>
          </div>
        </div>
        
        <Button type="primary" icon={<ReloadOutlined />} onClick={generatePassword} block>
          生成密码
        </Button>
        
        {password && (
          <div>
            <Input.Group compact>
              <Input 
                value={password} 
                readOnly 
                style={{ width: 'calc(100% - 80px)' }}
              />
              <Button 
                icon={<CopyOutlined />} 
                onClick={copyPassword}
                style={{ width: '80px' }}
              >
                复制
              </Button>
            </Input.Group>
          </div>
        )}
      </Space>
    </Card>
  );
};

const UUIDGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generateUUID = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
  };

  const copyAllUUIDs = () => {
    const text = uuids.join('\n');
    navigator.clipboard.writeText(text);
    message.success('所有UUID已复制到剪贴板');
  };

  return (
    <Card title="UUID生成器">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text>生成数量:</Text>
          <Input 
            type="number" 
            value={count} 
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            style={{ width: 100, marginLeft: 8 }}
            min={1}
            max={100}
          />
        </div>
        
        <Button type="primary" onClick={generateUUID} block>
          生成UUID
        </Button>
        
        {uuids.length > 0 && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <Button size="small" onClick={copyAllUUIDs}>
                复制全部
              </Button>
            </div>
            {uuids.map((uuid, index) => (
              <Input.Group key={index} compact style={{ marginBottom: 4 }}>
                <Input 
                  value={uuid} 
                  readOnly 
                  style={{ width: 'calc(100% - 60px)' }}
                />
                <Button 
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(uuid);
                    message.success('UUID已复制');
                  }}
                  style={{ width: '60px' }}
                >
                  复制
                </Button>
              </Input.Group>
            ))}
          </div>
        )}
      </Space>
    </Card>
  );
};

const RandomDataGenerator: React.FC = () => {
  const [dataType, setDataType] = useState('name');
  const [result, setResult] = useState('');

  const generateRandomData = () => {
    switch (dataType) {
      case 'name':
        const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
        const lastNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋'];
        setResult(firstNames[Math.floor(Math.random() * firstNames.length)] + 
                 lastNames[Math.floor(Math.random() * lastNames.length)]);
        break;
      case 'email':
        const domains = ['gmail.com', '163.com', 'qq.com', 'hotmail.com'];
        const username = Math.random().toString(36).substring(2, 10);
        setResult(`${username}@${domains[Math.floor(Math.random() * domains.length)]}`);
        break;
      case 'phone':
        const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const phoneNumber = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        setResult(prefix + phoneNumber);
        break;
      case 'address':
        const cities = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市'];
        const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区'];
        const streets = ['中山路', '人民路', '解放路', '建设路', '和平路'];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const district = districts[Math.floor(Math.random() * districts.length)];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const houseNumber = Math.floor(Math.random() * 999) + 1;
        setResult(`${city}${district}${street}${houseNumber}号`);
        break;
      default:
        setResult('未知数据类型');
    }
  };

  return (
    <Card title="随机数据生成">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text>数据类型:</Text>
          <Space style={{ marginLeft: 16 }}>
            <Button 
              type={dataType === 'name' ? 'primary' : 'default'}
              onClick={() => setDataType('name')}
            >
              姓名
            </Button>
            <Button 
              type={dataType === 'email' ? 'primary' : 'default'}
              onClick={() => setDataType('email')}
            >
              邮箱
            </Button>
            <Button 
              type={dataType === 'phone' ? 'primary' : 'default'}
              onClick={() => setDataType('phone')}
            >
              手机号
            </Button>
            <Button 
              type={dataType === 'address' ? 'primary' : 'default'}
              onClick={() => setDataType('address')}
            >
              地址
            </Button>
          </Space>
        </div>
        
        <Button type="primary" onClick={generateRandomData} block>
          生成随机{dataType === 'name' ? '姓名' : dataType === 'email' ? '邮箱' : dataType === 'phone' ? '手机号' : '地址'}
        </Button>
        
        {result && (
          <Input.Group compact>
            <Input 
              value={result} 
              readOnly 
              style={{ width: 'calc(100% - 80px)' }}
            />
            <Button 
              icon={<CopyOutlined />} 
              onClick={() => {
                navigator.clipboard.writeText(result);
                message.success('已复制到剪贴板');
              }}
              style={{ width: '80px' }}
            >
              复制
            </Button>
          </Input.Group>
        )}
      </Space>
    </Card>
  );
};

export default Generator;