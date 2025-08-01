import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Row,
  Col,
  Select,
  Tooltip,
  Typography,
  App
} from 'antd';
import {
  FormatPainterOutlined,
  CompressOutlined,
  CopyOutlined,
  ClearOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

interface JSONFormatterProps {}

const JSONFormatter: React.FC<JSONFormatterProps> = () => {
  const { message } = App.useApp();
  const [inputJson, setInputJson] = useState<string>('');
  const [outputJson, setOutputJson] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [jsonStats, setJsonStats] = useState<{
    keys: number;
    values: number;
    objects: number;
    arrays: number;
    size: string;
  } | null>(null);

  // 格式化JSON
  const formatJSON = () => {
    if (!inputJson.trim()) {
      message.warning('请输入JSON内容');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputJson(formatted);
      setIsValid(true);
      setErrorMessage('');
      
      // 计算统计信息
      calculateStats(parsed, formatted);
      message.success('JSON格式化成功');
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : '未知错误');
      setOutputJson('');
      setJsonStats(null);
      message.error('JSON格式错误');
    }
  };

  // 压缩JSON
  const compressJSON = () => {
    if (!inputJson.trim()) {
      message.warning('请输入JSON内容');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const compressed = JSON.stringify(parsed);
      setOutputJson(compressed);
      setIsValid(true);
      setErrorMessage('');
      
      // 计算统计信息
      calculateStats(parsed, compressed);
      message.success('JSON压缩成功');
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : '未知错误');
      setOutputJson('');
      setJsonStats(null);
      message.error('JSON格式错误');
    }
  };

  // 计算JSON统计信息
  const calculateStats = (parsed: any, formatted: string) => {
    const stats = {
      keys: 0,
      values: 0,
      objects: 0,
      arrays: 0,
      size: formatBytes(new Blob([formatted]).size)
    };

    const countElements = (obj: any) => {
      if (Array.isArray(obj)) {
        stats.arrays++;
        obj.forEach(item => countElements(item));
      } else if (obj !== null && typeof obj === 'object') {
        stats.objects++;
        Object.keys(obj).forEach(key => {
          stats.keys++;
          stats.values++;
          countElements(obj[key]);
        });
      } else {
        stats.values++;
      }
    };

    countElements(parsed);
    setJsonStats(stats);
  };

  // 格式化字节大小
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 验证JSON
  const validateJSON = () => {
    if (!inputJson.trim()) {
      message.warning('请输入JSON内容');
      return;
    }

    try {
      JSON.parse(inputJson);
      setIsValid(true);
      setErrorMessage('');
      message.success('JSON格式正确');
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : '未知错误');
      message.error('JSON格式错误');
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

  // 清空内容
  const clearAll = () => {
    setInputJson('');
    setOutputJson('');
    setIsValid(true);
    setErrorMessage('');
    setJsonStats(null);
  };

  // 从文件上传JSON
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputJson(content);
      };
      reader.readAsText(file);
    }
  };

  // 下载JSON文件
  const downloadJSON = () => {
    if (!outputJson) {
      message.warning('没有可下载的内容');
      return;
    }

    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    link.click();
    URL.revokeObjectURL(url);
    message.success('文件下载成功');
  };

  // 生成示例JSON
  const generateSampleJSON = () => {
    const sampleData = {
      "name": "张三",
      "age": 30,
      "city": "北京",
      "hobbies": ["阅读", "游泳", "编程"],
      "address": {
        "street": "中关村大街",
        "number": 123,
        "zipCode": "100080"
      },
      "isActive": true,
      "balance": 1234.56,
      "registeredAt": "2024-01-15T10:30:00Z"
    };
    setInputJson(JSON.stringify(sampleData));
  };

  return (
    <div className="json-formatter">
      <Card title="JSON格式化工具" className="tool-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 操作按钮区域 */}
          <Card size="small" title="操作">
            <Space wrap>
              <Button 
                type="primary" 
                icon={<FormatPainterOutlined />}
                onClick={formatJSON}
              >
                格式化
              </Button>
              <Button 
                icon={<CompressOutlined />}
                onClick={compressJSON}
              >
                压缩
              </Button>
              <Button 
                icon={<FileTextOutlined />}
                onClick={validateJSON}
              >
                验证
              </Button>
              <Button 
                icon={<ClearOutlined />}
                onClick={clearAll}
              >
                清空
              </Button>
              <Button onClick={generateSampleJSON}>
                示例数据
              </Button>
              
              <Select
                value={indentSize}
                onChange={setIndentSize}
                style={{ width: 120 }}
                placeholder="缩进大小"
              >
                <Select.Option value={2}>2个空格</Select.Option>
                <Select.Option value={4}>4个空格</Select.Option>
                <Select.Option value={8}>8个空格</Select.Option>
              </Select>
              
              <input
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="json-file-input"
              />
              <Button 
                icon={<UploadOutlined />}
                onClick={() => document.getElementById('json-file-input')?.click()}
              >
                上传文件
              </Button>
            </Space>
          </Card>

          {/* 输入输出区域 */}
          <Row gutter={16}>
            <Col span={12}>
              <Card 
                size="small" 
                title="输入JSON" 
                extra={
                  <Space>
                    <Tooltip title="复制">
                      <Button 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(inputJson)}
                        disabled={!inputJson}
                      />
                    </Tooltip>
                  </Space>
                }
              >
                <TextArea
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  placeholder="请输入或粘贴JSON内容..."
                  rows={20}
                  style={{ 
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '12px'
                  }}
                />
                
                {/* 错误信息显示 */}
                {!isValid && errorMessage && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="danger" style={{ fontSize: '12px' }}>
                      错误: {errorMessage}
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
            
            <Col span={12}>
              <Card 
                size="small" 
                title="输出结果" 
                extra={
                  <Space>
                    <Tooltip title="复制">
                      <Button 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(outputJson)}
                        disabled={!outputJson}
                      />
                    </Tooltip>
                    <Tooltip title="下载">
                      <Button 
                        size="small" 
                        icon={<DownloadOutlined />}
                        onClick={downloadJSON}
                        disabled={!outputJson}
                      />
                    </Tooltip>
                  </Space>
                }
              >
                <TextArea
                  value={outputJson}
                  readOnly
                  placeholder="格式化后的JSON将显示在这里..."
                  rows={20}
                  style={{ 
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '12px',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* 统计信息 */}
          {jsonStats && (
            <Card size="small" title="JSON统计信息">
              <Row gutter={16}>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {jsonStats.keys}
                    </div>
                    <div style={{ color: '#666' }}>键数量</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {jsonStats.values}
                    </div>
                    <div style={{ color: '#666' }}>值数量</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                      {jsonStats.objects}
                    </div>
                    <div style={{ color: '#666' }}>对象数量</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eb2f96' }}>
                      {jsonStats.arrays}
                    </div>
                    <div style={{ color: '#666' }}>数组数量</div>
                  </div>
                </Col>
              </Row>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Text strong>文件大小: {jsonStats.size}</Text>
              </div>
            </Card>
          )}

          {/* 使用说明 */}
          <Card size="small" title="使用说明">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li><strong>格式化</strong>：将压缩的JSON转换为易读的格式</li>
              <li><strong>压缩</strong>：移除所有不必要的空格和换行符</li>
              <li><strong>验证</strong>：检查JSON语法是否正确</li>
              <li><strong>统计</strong>：显示JSON结构的详细信息</li>
              <li><strong>文件操作</strong>：支持上传JSON文件和下载处理结果</li>
              <li><strong>示例数据</strong>：快速生成示例JSON用于测试</li>
            </ul>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default JSONFormatter;