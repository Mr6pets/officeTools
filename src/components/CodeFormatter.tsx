import React, { useState } from 'react';
import { Card, Input, Button, Select, Space, Typography, Row, Col, message, Tabs } from 'antd';
import { CopyOutlined, FormatPainterOutlined, ClearOutlined } from '@ant-design/icons';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserMarkdown from 'prettier/parser-markdown';
import parserTypescript from 'prettier/parser-typescript';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface FormatOptions {
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  bracketSpacing: boolean;
  printWidth: number;
}

const CodeFormatter: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: 'es5',
    bracketSpacing: true,
    printWidth: 80
  });
  const [minifyCode, setMinifyCode] = useState<string>('');

  // 支持的语言配置
  const languageConfigs = {
    javascript: { parser: 'babel', plugins: [parserBabel] },
    typescript: { parser: 'typescript', plugins: [parserTypescript] },
    jsx: { parser: 'babel', plugins: [parserBabel] },
    tsx: { parser: 'typescript', plugins: [parserTypescript] },
    html: { parser: 'html', plugins: [parserHtml] },
    css: { parser: 'css', plugins: [parserCss] },
    scss: { parser: 'scss', plugins: [parserCss] },
    less: { parser: 'less', plugins: [parserCss] },
    json: { parser: 'json', plugins: [parserBabel] },
    markdown: { parser: 'markdown', plugins: [parserMarkdown] }
  };

  // 格式化代码
  const formatCode = () => {
    if (!inputCode.trim()) {
      message.error('请输入要格式化的代码');
      return;
    }

    try {
      const config = languageConfigs[language as keyof typeof languageConfigs];
      if (!config) {
        message.error('不支持的语言类型');
        return;
      }

      const formatted = prettier.format(inputCode, {
        parser: config.parser,
        plugins: config.plugins,
        ...formatOptions
      });

      setOutputCode(formatted);
      message.success('代码格式化成功');
    } catch (error) {
      message.error('代码格式化失败: ' + (error instanceof Error ? error.message : '未知错误'));
      console.error('格式化错误:', error);
    }
  };

  // 压缩代码（简单实现）
  const minifyCodeFunc = () => {
    if (!inputCode.trim()) {
      message.error('请输入要压缩的代码');
      return;
    }

    try {
      let minified = inputCode;
      
      if (language === 'javascript' || language === 'typescript') {
        // 简单的JS/TS压缩
        minified = inputCode
          .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
          .replace(/\/\/.*$/gm, '') // 移除行注释
          .replace(/\s+/g, ' ') // 压缩空白字符
          .replace(/;\s*}/g, '}') // 移除分号前的空格
          .replace(/\s*{\s*/g, '{') // 压缩大括号
          .replace(/\s*}\s*/g, '}') // 压缩大括号
          .replace(/\s*,\s*/g, ',') // 压缩逗号
          .replace(/\s*;\s*/g, ';') // 压缩分号
          .trim();
      } else if (language === 'css' || language === 'scss' || language === 'less') {
        // 简单的CSS压缩
        minified = inputCode
          .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
          .replace(/\s+/g, ' ') // 压缩空白字符
          .replace(/\s*{\s*/g, '{') // 压缩大括号
          .replace(/\s*}\s*/g, '}') // 压缩大括号
          .replace(/\s*;\s*/g, ';') // 压缩分号
          .replace(/\s*,\s*/g, ',') // 压缩逗号
          .replace(/\s*:\s*/g, ':') // 压缩冒号
          .trim();
      } else if (language === 'html') {
        // 简单的HTML压缩
        minified = inputCode
          .replace(/<!--[\s\S]*?-->/g, '') // 移除注释
          .replace(/\s+/g, ' ') // 压缩空白字符
          .replace(/> </g, '><') // 移除标签间空格
          .trim();
      } else if (language === 'json') {
        // JSON压缩
        try {
          const parsed = JSON.parse(inputCode);
          minified = JSON.stringify(parsed);
        } catch {
          message.error('无效的JSON格式');
          return;
        }
      }

      setMinifyCode(minified);
      message.success('代码压缩成功');
    } catch (error) {
      message.error('代码压缩失败');
      console.error('压缩错误:', error);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 清空所有内容
  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
    setMinifyCode('');
  };

  // 示例代码
  const getExampleCode = (lang: string): string => {
    const examples: Record<string, string> = {
      javascript: `function hello(name) {
if(name){console.log("Hello, " + name + "!");}else{console.log("Hello, World!");}
}
hello("JavaScript");`,
      typescript: `interface User {
name: string;
age: number;
}
function greet(user: User): string {
return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}
const user: User = { name: "TypeScript", age: 10 };
console.log(greet(user));`,
      html: `<!DOCTYPE html><html><head><title>Example</title></head><body><div class="container"><h1>Hello World</h1><p>This is an example.</p></div></body></html>`,
      css: `.container{margin:0 auto;padding:20px;max-width:800px;}.title{font-size:24px;color:#333;margin-bottom:16px;}`,
      json: `{"name":"John Doe","age":30,"city":"New York","hobbies":["reading","swimming","coding"],"address":{"street":"123 Main St","zipCode":"10001"}}`,
      markdown: `# Title\n\nThis is a **bold** text and this is *italic*.\n\n- List item 1\n- List item 2\n\n\`\`\`javascript\nconsole.log('Hello');\n\`\`\``
    };
    return examples[lang] || '';
  };

  // 加载示例代码
  const loadExample = () => {
    const example = getExampleCode(language);
    setInputCode(example);
    setOutputCode('');
    setMinifyCode('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>代码格式化工具</Title>
      
      <Tabs defaultActiveKey="formatter">
        <TabPane tab="代码格式化" key="formatter">
          <Card>
            {/* 配置选项 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <Text strong>语言类型：</Text>
                <Select 
                  value={language} 
                  onChange={setLanguage}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value="javascript">JavaScript</Option>
                  <Option value="typescript">TypeScript</Option>
                  <Option value="jsx">JSX</Option>
                  <Option value="tsx">TSX</Option>
                  <Option value="html">HTML</Option>
                  <Option value="css">CSS</Option>
                  <Option value="scss">SCSS</Option>
                  <Option value="less">Less</Option>
                  <Option value="json">JSON</Option>
                  <Option value="markdown">Markdown</Option>
                </Select>
              </Col>
              
              <Col span={6}>
                <Text strong>缩进大小：</Text>
                <Select 
                  value={formatOptions.tabWidth} 
                  onChange={(value) => setFormatOptions(prev => ({ ...prev, tabWidth: value }))}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value={2}>2 空格</Option>
                  <Option value={4}>4 空格</Option>
                  <Option value={8}>8 空格</Option>
                </Select>
              </Col>
              
              <Col span={6}>
                <Text strong>行宽限制：</Text>
                <Select 
                  value={formatOptions.printWidth} 
                  onChange={(value) => setFormatOptions(prev => ({ ...prev, printWidth: value }))}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value={80}>80 字符</Option>
                  <Option value={100}>100 字符</Option>
                  <Option value={120}>120 字符</Option>
                </Select>
              </Col>
              
              <Col span={6}>
                <Text strong>引号类型：</Text>
                <Select 
                  value={formatOptions.singleQuote ? 'single' : 'double'} 
                  onChange={(value) => setFormatOptions(prev => ({ ...prev, singleQuote: value === 'single' }))}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value="double">双引号</Option>
                  <Option value="single">单引号</Option>
                </Select>
              </Col>
            </Row>

            {/* 操作按钮 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<FormatPainterOutlined />}
                    onClick={formatCode}
                    disabled={!inputCode.trim()}
                  >
                    格式化代码
                  </Button>
                  <Button onClick={loadExample}>
                    加载示例
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={clearAll}>
                    清空
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* 输入区域 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Text strong>输入代码：</Text>
                <TextArea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="请输入要格式化的代码"
                  rows={12}
                  style={{ 
                    marginTop: '8px',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '14px'
                  }}
                />
              </Col>
            </Row>

            {/* 输出区域 */}
            {outputCode && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>格式化结果：</Text>
                    <Button 
                      type="link" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(outputCode)}
                    >
                      复制结果
                    </Button>
                  </div>
                  <TextArea
                    value={outputCode}
                    readOnly
                    rows={12}
                    style={{ 
                      marginTop: '8px',
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      fontSize: '14px',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </TabPane>

        <TabPane tab="代码压缩" key="minifier">
          <Card>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={minifyCodeFunc}
                    disabled={!inputCode.trim()}
                  >
                    压缩代码
                  </Button>
                  <Button onClick={loadExample}>
                    加载示例
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={clearAll}>
                    清空
                  </Button>
                </Space>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Text strong>输入代码：</Text>
                <TextArea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="请输入要压缩的代码"
                  rows={10}
                  style={{ 
                    marginTop: '8px',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '14px'
                  }}
                />
              </Col>
            </Row>

            {minifyCode && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>压缩结果：</Text>
                    <Space>
                      <Text type="secondary">
                        压缩率: {Math.round((1 - minifyCode.length / inputCode.length) * 100)}%
                      </Text>
                      <Button 
                        type="link" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(minifyCode)}
                      >
                        复制结果
                      </Button>
                    </Space>
                  </div>
                  <TextArea
                    value={minifyCode}
                    readOnly
                    rows={6}
                    style={{ 
                      marginTop: '8px',
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      fontSize: '14px',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CodeFormatter;