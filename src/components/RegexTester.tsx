import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  message,
  Row,
  Col,
  Table,
  Tag,
  Tooltip,
  Select,
  Checkbox,
  Typography,
  Collapse,
  Alert
} from 'antd';
import {
  PlayCircleOutlined,
  CopyOutlined,
  ClearOutlined,
  InfoCircleOutlined,
  BookOutlined,
  BugOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Panel } = Collapse;

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
  namedGroups: { [key: string]: string };
}

interface RegexFlag {
  key: string;
  label: string;
  description: string;
}

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('');
  const [testString, setTestString] = useState<string>('');
  const [flags, setFlags] = useState<string[]>(['g']);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [replaceResult, setReplaceResult] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // 正则表达式标志
  const regexFlags: RegexFlag[] = [
    { key: 'g', label: 'Global', description: '全局匹配，查找所有匹配项' },
    { key: 'i', label: 'Ignore Case', description: '忽略大小写' },
    { key: 'm', label: 'Multiline', description: '多行模式，^ 和 $ 匹配行的开始和结束' },
    { key: 's', label: 'Dot All', description: '. 匹配包括换行符在内的任何字符' },
    { key: 'u', label: 'Unicode', description: 'Unicode 模式' },
    { key: 'y', label: 'Sticky', description: '粘性匹配，从 lastIndex 开始匹配' }
  ];

  // 常用正则表达式预设
  const regexPresets = [
    {
      name: '邮箱地址',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      testString: 'user@example.com\ninvalid-email\ntest.email+tag@domain.co.uk',
      description: '匹配标准邮箱地址格式'
    },
    {
      name: '手机号码',
      pattern: '^1[3-9]\\d{9}$',
      testString: '13812345678\n12345678901\n1381234567',
      description: '匹配中国大陆手机号码'
    },
    {
      name: 'URL地址',
      pattern: 'https?:\\/\\/(?:[-\\w.])+(?:\\:[0-9]+)?(?:\\/(?:[\\w\\/_.])*(?:\\?(?:[\\w&=%.])*)?(?:\\#(?:[\\w.])*)?)?',
      testString: 'https://www.example.com\nhttp://localhost:3000/path?param=value#section\nftp://invalid.url',
      description: '匹配HTTP和HTTPS URL'
    },
    {
      name: 'IP地址',
      pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
      testString: '192.168.1.1\n255.255.255.255\n256.1.1.1\n192.168.1',
      description: '匹配IPv4地址'
    },
    {
      name: '身份证号',
      pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
      testString: '110101199003077777\n11010119900307777X\n123456789012345678',
      description: '匹配18位身份证号码'
    },
    {
      name: '日期格式',
      pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
      testString: '2024-01-15\n2024-13-01\n2024-01-32\n24-01-15',
      description: '匹配YYYY-MM-DD日期格式'
    },
    {
      name: '中文字符',
      pattern: '[\\u4e00-\\u9fa5]+',
      testString: '这是中文\nHello 世界\n123中文456\nEnglish only',
      description: '匹配中文字符'
    },
    {
      name: '数字提取',
      pattern: '\\d+(?:\\.\\d+)?',
      testString: 'Price: $123.45\nQuantity: 100\nDiscount: 15%\nNo numbers here',
      description: '提取整数和小数'
    }
  ];

  // 执行正则表达式测试
  const testRegex = () => {
    if (!pattern.trim()) {
      message.warning('请输入正则表达式');
      return;
    }

    try {
      const flagString = flags.join('');
      const regex = new RegExp(pattern, flagString);
      setIsValid(true);
      setErrorMessage('');

      const results: MatchResult[] = [];
      
      if (flags.includes('g')) {
        // 全局匹配
        let match;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
          
          // 防止无限循环
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // 单次匹配
        const match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
        }
      }

      setMatches(results);
      message.success(`找到 ${results.length} 个匹配项`);
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : '正则表达式错误');
      setMatches([]);
      message.error('正则表达式语法错误');
    }
  };

  // 执行替换
  const performReplace = () => {
    if (!pattern.trim()) {
      message.warning('请输入正则表达式');
      return;
    }

    try {
      const flagString = flags.join('');
      const regex = new RegExp(pattern, flagString);
      const result = testString.replace(regex, replaceText);
      setReplaceResult(result);
      message.success('替换完成');
    } catch (error) {
      message.error('替换失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 加载预设
  const loadPreset = (presetName: string) => {
    const preset = regexPresets.find(p => p.name === presetName);
    if (preset) {
      setPattern(preset.pattern);
      setTestString(preset.testString);
      setSelectedPreset(presetName);
      message.success(`已加载预设：${presetName}`);
    }
  };

  // 清空所有内容
  const clearAll = () => {
    setPattern('');
    setTestString('');
    setReplaceText('');
    setReplaceResult('');
    setMatches([]);
    setIsValid(true);
    setErrorMessage('');
    setSelectedPreset('');
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 高亮显示匹配项
  const highlightMatches = (text: string, matches: MatchResult[]): React.ReactNode => {
    if (matches.length === 0) return text;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      // 添加匹配前的文本
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // 添加高亮的匹配文本
      parts.push(
        <span 
          key={index}
          style={{ 
            backgroundColor: '#fff2e8', 
            border: '1px solid #ffbb96',
            borderRadius: '2px',
            padding: '0 2px'
          }}
        >
          {match.match}
        </span>
      );
      
      lastIndex = match.index + match.match.length;
    });

    // 添加最后剩余的文本
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // 匹配结果表格列
  const matchColumns = [
    {
      title: '匹配项',
      dataIndex: 'match',
      key: 'match',
      render: (text: string) => (
        <Text code style={{ backgroundColor: '#f6ffed' }}>{text}</Text>
      )
    },
    {
      title: '位置',
      dataIndex: 'index',
      key: 'index',
      width: 80
    },
    {
      title: '分组',
      dataIndex: 'groups',
      key: 'groups',
      render: (groups: string[]) => (
        <Space wrap>
          {groups.map((group, index) => (
            <Tag key={index} color="blue">
              ${index + 1}: {group || '(空)'}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (record: MatchResult) => (
        <Button 
          size="small" 
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(record.match)}
        />
      )
    }
  ];

  // 自动测试（当pattern或testString改变时）
  useEffect(() => {
    if (pattern && testString) {
      const timer = setTimeout(() => {
        testRegex();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pattern, testString, flags]);

  return (
    <div className="regex-tester">
      <Card title="正则表达式测试器" className="tool-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 预设选择 */}
          <Card size="small" title="常用预设">
            <Row gutter={16}>
              <Col span={18}>
                <Select
                  value={selectedPreset}
                  onChange={loadPreset}
                  placeholder="选择常用正则表达式预设"
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                >
                  {regexPresets.map(preset => (
                    <Select.Option key={preset.name} value={preset.name}>
                      {preset.name} - {preset.description}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Space>
                  <Button icon={<ClearOutlined />} onClick={clearAll}>
                    清空
                  </Button>
                  <Tooltip title="查看正则表达式语法帮助">
                    <Button icon={<BookOutlined />} />
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 正则表达式输入 */}
          <Card size="small" title="正则表达式">
            <Row gutter={16}>
              <Col span={18}>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="输入正则表达式..."
                  prefix="/"
                  suffix={`/${flags.join('')}`}
                  status={!isValid ? 'error' : ''}
                />
                {!isValid && errorMessage && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="danger" style={{ fontSize: '12px' }}>
                      <BugOutlined /> {errorMessage}
                    </Text>
                  </div>
                )}
              </Col>
              <Col span={6}>
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />}
                  onClick={testRegex}
                  block
                >
                  测试
                </Button>
              </Col>
            </Row>
            
            {/* 标志选择 */}
            <div style={{ marginTop: 12 }}>
              <Text strong>标志：</Text>
              <div style={{ marginTop: 8 }}>
                <Checkbox.Group
                  value={flags}
                  onChange={setFlags}
                >
                  <Row>
                    {regexFlags.map(flag => (
                      <Col span={8} key={flag.key}>
                        <Tooltip title={flag.description}>
                          <Checkbox value={flag.key}>
                            {flag.key} - {flag.label}
                          </Checkbox>
                        </Tooltip>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </div>
            </div>
          </Card>

          {/* 测试文本 */}
          <Card size="small" title="测试文本">
            <TextArea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="输入要测试的文本..."
              rows={8}
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
            
            {/* 高亮显示匹配项 */}
            {matches.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <Text strong>匹配高亮：</Text>
                <div style={{
                  marginTop: 8,
                  padding: 12,
                  backgroundColor: '#fafafa',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {highlightMatches(testString, matches)}
                </div>
              </div>
            )}
          </Card>

          {/* 匹配结果 */}
          {matches.length > 0 && (
            <Card 
              size="small" 
              title={`匹配结果 (${matches.length} 项)`}
              extra={
                <Button 
                  size="small" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(matches.map(m => m.match).join('\n'))}
                >
                  复制所有
                </Button>
              }
            >
              <Table
                columns={matchColumns}
                dataSource={matches.map((match, index) => ({ ...match, key: index }))}
                size="small"
                pagination={false}
                scroll={{ y: 300 }}
              />
            </Card>
          )}

          {/* 替换功能 */}
          <Card size="small" title="替换">
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>替换为：</div>
                <Input
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="输入替换文本..."
                />
                <div style={{ marginTop: 8 }}>
                  <Button onClick={performReplace} disabled={!pattern}>
                    执行替换
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>替换结果：</div>
                <TextArea
                  value={replaceResult}
                  readOnly
                  placeholder="替换结果将显示在这里..."
                  rows={4}
                  style={{ 
                    backgroundColor: '#f5f5f5',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                  }}
                />
                {replaceResult && (
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(replaceResult)}
                    >
                      复制结果
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Card>

          {/* 帮助信息 */}
          <Collapse>
            <Panel header="正则表达式语法帮助" key="help">
              <Row gutter={16}>
                <Col span={12}>
                  <Title level={5}>基本语法</Title>
                  <ul style={{ fontSize: '12px', lineHeight: '1.6' }}>
                    <li><code>.</code> - 匹配任意字符（除换行符）</li>
                    <li><code>*</code> - 匹配前面的字符0次或多次</li>
                    <li><code>+</code> - 匹配前面的字符1次或多次</li>
                    <li><code>?</code> - 匹配前面的字符0次或1次</li>
                    <li><code>^</code> - 匹配字符串开始</li>
                    <li><code>$</code> - 匹配字符串结束</li>
                    <li><code>\d</code> - 匹配数字</li>
                    <li><code>\w</code> - 匹配字母、数字、下划线</li>
                    <li><code>\s</code> - 匹配空白字符</li>
                  </ul>
                </Col>
                <Col span={12}>
                  <Title level={5}>分组和量词</Title>
                  <ul style={{ fontSize: '12px', lineHeight: '1.6' }}>
                    <li><code>()</code> - 分组</li>
                    <li><code>[]</code> - 字符类</li>
                    <li><code>{'{n}'}</code> - 匹配n次</li>
                    <li><code>{'{n,}'}</code> - 匹配n次或更多</li>
                    <li><code>{'{n,m}'}</code> - 匹配n到m次</li>
                    <li><code>|</code> - 或操作符</li>
                    <li><code>\</code> - 转义字符</li>
                    <li><code>(?:)</code> - 非捕获分组</li>
                    <li><code>(?=)</code> - 正向先行断言</li>
                  </ul>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Space>
      </Card>
    </div>
  );
};

export default RegexTester;