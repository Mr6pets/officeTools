// Remove unused imports
import React, { useState } from 'react';
import { Card, Button, Input, Space, Checkbox, Typography, Tabs, message, Select } from 'antd';
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

  // 兼容性更好的UUID生成函数
  const generateUUIDv4 = (): string => {
    // 如果支持crypto.randomUUID，优先使用
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // 备用方案：手动生成UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateUUID = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUIDv4());
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
  const [generatedData, setGeneratedData] = useState('');
  const [customSurname, setCustomSurname] = useState(''); // 姓氏输入
  const [emailDomain, setEmailDomain] = useState(''); // 邮箱域名选择
  const [addressType, setAddressType] = useState('random'); // 地址类型选择

  const generateRandomData = () => {
    switch (dataType) {
      case 'name':
        // 常见姓氏
        const surnames = [
          '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
          '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
          '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
          '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
          '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
          '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
          '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
          '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
          '顾', '侯', '邵', '孟', '龙', '万', '段', '漕', '钱', '汤',
          // 复姓
          '欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫',
          '万俟', '闻人', '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台',
          '皇甫', '宗政', '濮阳', '公冶', '太叔', '申屠', '公孙', '慕容',
          '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于', '司空', '闾丘',
          '子车', '亓官', '司寇', '巫马', '公西', '颛孙', '壤驷', '公良',
          '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐',
          '段干', '百里', '呼延', '东郭', '南门', '羊舌', '微生', '公户',
          '公玉', '公仪', '梁丘', '公仲', '公上', '公门', '公山', '公坚'
        ];
        
        // 名字字库（按音韵和寓意分类）
        const givenNames = {
          // 单字名（适合男女通用）
          single: [
            '轩', '涵', '萱', '豪', '欣', '泽', '琪', '晨', '妤', '远',
            '桐', '雅', '宇', '若', '梓', '思', '雨', '诗', '瑾', '清',
            '明', '星', '月', '风', '云', '山', '水', '花', '草', '木',
            '金', '玉', '珠', '宝', '光', '辉', '亮', '美', '丽', '秀',
            '慧', '智', '贤', '德', '仁', '义', '礼', '信', '忠', '孝'
          ],
          // 双字名第一个字
          first: [
            '雨', '思', '梓', '子', '一', '艺', '可', '欣', '心', '小',
            '佳', '若', '语', '文', '安', '乐', '天', '志', '建', '国',
            '家', '世', '永', '长', '大', '伟', '宏', '广', '深', '高',
            '远', '明', '亮', '清', '白', '红', '绿', '蓝', '紫', '金',
            '银', '玉', '珍', '宝', '贵', '富', '康', '健', '强', '勇'
          ],
          // 双字名第二个字
          second: [
            '萱', '涵', '轩', '豪', '欣', '泽', '琪', '晨', '妤', '桐',
            '雅', '宇', '汐', '诺', '然', '凡', '希', '悦', '乐', '怡',
            '静', '雯', '慧', '敏', '聪', '颖', '秀', '美', '丽', '娟',
            '芳', '香', '兰', '梅', '竹', '菊', '莲', '荷', '桂', '松',
            '柏', '杨', '柳', '槐', '梧', '桐', '枫', '橘', '桃', '李'
          ]
        };
        
        // 使用用户输入的姓氏，如果没有输入则随机选择
        const selectedSurname = customSurname.trim() || surnames[Math.floor(Math.random() * surnames.length)];
        
        // 随机决定是单字名还是双字名（70%概率双字名）
        const isDoubleChar = Math.random() > 0.3;
        
        let randomGivenName;
        if (isDoubleChar) {
          // 生成双字名
          const firstChar = givenNames.first[Math.floor(Math.random() * givenNames.first.length)];
          const secondChar = givenNames.second[Math.floor(Math.random() * givenNames.second.length)];
          randomGivenName = firstChar + secondChar;
        } else {
          // 生成单字名
          randomGivenName = givenNames.single[Math.floor(Math.random() * givenNames.single.length)];
        }
        
        setGeneratedData(selectedSurname + randomGivenName);
        break;
      case 'email':
        // 邮箱域名选项
        const domains = {
          'gmail.com': 'Gmail',
          '163.com': '网易163',
          'qq.com': 'QQ邮箱',
          'hotmail.com': 'Hotmail',
          'outlook.com': 'Outlook',
          'yahoo.com': 'Yahoo',
          'sina.com': '新浪',
          'sohu.com': '搜狐',
          '126.com': '网易126',
          'foxmail.com': 'Foxmail',
          'aliyun.com': '阿里云',
          'icloud.com': 'iCloud'
        };
        
        // 用户名生成策略
        const usernameStrategies = [
          () => Math.random().toString(36).substring(2, 8), // 随机字符
          () => `user${Math.floor(Math.random() * 10000)}`, // user+数字
          () => {
            const prefixes = ['happy', 'lucky', 'smart', 'cool', 'super', 'nice', 'good', 'best'];
            const suffixes = ['123', '456', '789', '2023', '2024', 'x', 'y', 'z'];
            return prefixes[Math.floor(Math.random() * prefixes.length)] + 
                   suffixes[Math.floor(Math.random() * suffixes.length)];
          }, // 前缀+后缀
          () => {
            const names = ['zhang', 'wang', 'li', 'zhao', 'chen', 'liu', 'yang', 'huang'];
            return names[Math.floor(Math.random() * names.length)] + 
                   Math.floor(Math.random() * 100);
          } // 拼音+数字
        ];
        
        const username = usernameStrategies[Math.floor(Math.random() * usernameStrategies.length)]();
        const domainKeys = Object.keys(domains);
        const selectedDomain = emailDomain || domainKeys[Math.floor(Math.random() * domainKeys.length)];
        setGeneratedData(`${username}@${selectedDomain}`);
        break;
      case 'phone':
        const phoneNumber = Math.floor(Math.random() * 900000000) + 100000000;
        setGeneratedData(`1${phoneNumber}`);
        break;
      case 'address':
        // 地址生成数据库
        // 在文件顶部添加接口定义
        interface StreetNamesType {
          [key: string]: string[];
          '路': string[];
          '街': string[];
          '大道': string[];
          '巷': string[];
          '弄': string[];
          '胡同': string[];
          '广场': string[];
          '花园': string[];
          '公园': string[];
          '中心': string[];
        }
        
        // 然后在addressData中使用这个类型
        const addressData = {
          provinces: ['北京市', '上海市', '广东省', '浙江省', '江苏省', '山东省', '河南省', '四川省', '湖北省', '湖南省', '河北省', '福建省', '安徽省', '江西省', '云南省', '贵州省', '山西省', '陕西省', '重庆市', '天津市'],
          cities: ['市区', '新区', '开发区', '高新区', '经济区', '工业区', '商务区', '科技城', '新城', '老城区'],
          districts: ['东城区', '西城区', '南城区', '北城区', '中心区', '新华区', '建设区', '发展区', '繁华区', '和谐区'],
          streetTypes: ['路', '街', '大道', '巷', '弄', '胡同', '广场', '花园', '公园', '中心'],
          streetNames: {
            '路': ['中山路', '人民路', '解放路', '建设路', '文化路', '教育路', '科技路', '发展路', '繁荣路', '和平路', '友谊路', '团结路', '胜利路', '光明路', '幸福路'],
            '街': ['商业街', '步行街', '美食街', '文化街', '古玩街', '服装街', '电子街', '花鸟街', '书店街', '咖啡街'],
            '大道': ['迎宾大道', '滨江大道', '环城大道', '科技大道', '文化大道', '教育大道', '商务大道', '金融大道', '创新大道', '发展大道'],
            '巷': ['梧桐巷', '丁香巷', '玫瑰巷', '茉莉巷', '桂花巷', '荷花巷', '牡丹巷', '菊花巷', '兰花巷', '竹子巷'],
            '弄': ['书香弄', '墨香弄', '花香弄', '茶香弄', '酒香弄', '果香弄', '草香弄', '木香弄', '石香弄', '水香弄'],
            '胡同': ['老槐胡同', '青砖胡同', '红墙胡同', '石板胡同', '柳树胡同', '枣树胡同', '梧桐胡同', '银杏胡同', '松树胡同', '柏树胡同'],
            '广场': ['中心广场', '人民广场', '文化广场', '音乐广场', '艺术广场', '体育广场', '休闲广场', '商业广场', '时尚广场', '青春广场'],
            '花园': ['玫瑰花园', '牡丹花园', '荷花花园', '桂花花园', '茉莉花园', '丁香花园', '樱花花园', '梅花花园', '兰花花园', '菊花花园'],
            '公园': ['中央公园', '森林公园', '湿地公园', '文化公园', '体育公园', '儿童公园', '老年公园', '生态公园', '科技公园', '艺术公园'],
            '中心': ['商务中心', '金融中心', '文化中心', '体育中心', '会展中心', '购物中心', '娱乐中心', '科技中心', '教育中心', '医疗中心']
          } as StreetNamesType,
          buildingTypes: ['号', '号楼', '号院', '号大厦', '号广场', '号中心', '号大楼', '号商厦', '号写字楼', '号综合楼'],
          roomTypes: ['室', '房', '单元', '户', '间']
        };
        
        let address = '';
        
        if (addressType === 'detailed' || addressType === 'random') {
          // 生成详细地址
          const province = addressData.provinces[Math.floor(Math.random() * addressData.provinces.length)];
          const city = addressData.cities[Math.floor(Math.random() * addressData.cities.length)];
          const district = addressData.districts[Math.floor(Math.random() * addressData.districts.length)];
          
          const streetTypeKeys = Object.keys(addressData.streetNames) as (keyof typeof addressData.streetNames)[];
          const streetType = streetTypeKeys[Math.floor(Math.random() * streetTypeKeys.length)];
          const streetName = addressData.streetNames[streetType][Math.floor(Math.random() * addressData.streetNames[streetType].length)];
          
          const buildingNumber = Math.floor(Math.random() * 999) + 1;
          const buildingType = addressData.buildingTypes[Math.floor(Math.random() * addressData.buildingTypes.length)];
          
          // 随机决定是否添加楼层和房间号
          const hasRoom = Math.random() > 0.3;
          let roomInfo = '';
          if (hasRoom) {
            const floor = Math.floor(Math.random() * 30) + 1;
            const roomNumber = Math.floor(Math.random() * 20) + 1;
            const roomType = addressData.roomTypes[Math.floor(Math.random() * addressData.roomTypes.length)];
            roomInfo = `${floor}楼${roomNumber}${roomType}`;
          }
          
          address = `${province}${city}${district}${streetName}${buildingNumber}${buildingType}${roomInfo}`;
        } else {
          // 生成简单地址
          const streetTypeKeys = Object.keys(addressData.streetNames) as (keyof typeof addressData.streetNames)[];
          const streetType = streetTypeKeys[Math.floor(Math.random() * streetTypeKeys.length)];
          const streetName = addressData.streetNames[streetType][Math.floor(Math.random() * addressData.streetNames[streetType].length)];
          const buildingNumber = Math.floor(Math.random() * 999) + 1;
          address = `${streetName}${buildingNumber}号`;
        }
        
        setGeneratedData(address);
        break;
      default:
        break;
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
        
        {/* 姓名选项 */}
        {dataType === 'name' && (
          <div>
            <Text>指定姓氏（可选）:</Text>
            <Input 
              placeholder="输入姓氏，留空则随机生成"
              value={customSurname}
              onChange={(e) => setCustomSurname(e.target.value)}
              style={{ marginLeft: 8, width: 200 }}
              maxLength={4}
            />
          </div>
        )}
        
        {/* 邮箱选项 */}
        {dataType === 'email' && (
          <div>
            <Text>邮箱域名（可选）:</Text>
            <Select
              placeholder="选择邮箱域名，留空则随机生成"
              value={emailDomain}
              onChange={setEmailDomain}
              style={{ marginLeft: 8, width: 200 }}
              allowClear
            >
              <Select.Option value="gmail.com">Gmail</Select.Option>
              <Select.Option value="163.com">网易163</Select.Option>
              <Select.Option value="qq.com">QQ邮箱</Select.Option>
              <Select.Option value="hotmail.com">Hotmail</Select.Option>
              <Select.Option value="outlook.com">Outlook</Select.Option>
              <Select.Option value="yahoo.com">Yahoo</Select.Option>
              <Select.Option value="sina.com">新浪</Select.Option>
              <Select.Option value="sohu.com">搜狐</Select.Option>
              <Select.Option value="126.com">网易126</Select.Option>
              <Select.Option value="foxmail.com">Foxmail</Select.Option>
              <Select.Option value="aliyun.com">阿里云</Select.Option>
              <Select.Option value="icloud.com">iCloud</Select.Option>
            </Select>
          </div>
        )}
        
        {/* 地址选项 */}
        {dataType === 'address' && (
          <div>
            <Text>地址类型:</Text>
            <Space style={{ marginLeft: 16 }}>
              <Button 
                type={addressType === 'simple' ? 'primary' : 'default'}
                onClick={() => setAddressType('simple')}
                size="small"
              >
                简单地址
              </Button>
              <Button 
                type={addressType === 'detailed' ? 'primary' : 'default'}
                onClick={() => setAddressType('detailed')}
                size="small"
              >
                详细地址
              </Button>
              <Button 
                type={addressType === 'random' ? 'primary' : 'default'}
                onClick={() => setAddressType('random')}
                size="small"
              >
                随机
              </Button>
            </Space>
          </div>
        )}
        
        <Button type="primary" onClick={generateRandomData} block>
          生成随机数据
        </Button>
        
        {generatedData && (
          <Input.Group compact>
            <Input 
              value={generatedData} 
              readOnly 
              style={{ width: 'calc(100% - 80px)' }}
            />
            <Button 
              icon={<CopyOutlined />} 
              onClick={() => {
                navigator.clipboard.writeText(generatedData);
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