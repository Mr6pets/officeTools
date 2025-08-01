import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Select, Space, Typography, Row, Col, Divider, message, Table } from 'antd';
import { CopyOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ConversionItem {
  id: string;
  timestamp: string;
  datetime: string;
  format: string;
}

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [datetime, setDatetime] = useState<string>('');
  const [timestampType, setTimestampType] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateFormat, setDateFormat] = useState<string>('YYYY-MM-DD HH:mm:ss');
  const [timezone, setTimezone] = useState<string>('Asia/Shanghai');
  const [batchInput, setBatchInput] = useState<string>('');
  const [batchResults, setBatchResults] = useState<ConversionItem[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期
  const timestampToDate = (ts: string): string => {
    try {
      const num = parseInt(ts);
      if (isNaN(num)) return '';
      
      const date = timestampType === 'seconds' ? new Date(num * 1000) : new Date(num);
      return formatDate(date, dateFormat);
    } catch (error) {
      return '';
    }
  };

  // 日期转时间戳
  const dateToTimestamp = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      
      const ts = date.getTime();
      return timestampType === 'seconds' ? Math.floor(ts / 1000).toString() : ts.toString();
    } catch (error) {
      return '';
    }
  };

  // 格式化日期
  const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('SSS', milliseconds);
  };

  // 获取相对时间
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    if (seconds > 0) return `${seconds}秒前`;
    return '刚刚';
  };

  // 处理时间戳输入
  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    const converted = timestampToDate(value);
    setDatetime(converted);
  };

  // 处理日期时间输入
  const handleDatetimeChange = (value: string) => {
    setDatetime(value);
    const converted = dateToTimestamp(value);
    setTimestamp(converted);
  };

  // 获取当前时间戳
  const getCurrentTimestamp = () => {
    const now = new Date();
    const ts = timestampType === 'seconds' ? Math.floor(now.getTime() / 1000) : now.getTime();
    setTimestamp(ts.toString());
    setDatetime(formatDate(now, dateFormat));
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 批量转换
  const handleBatchConvert = () => {
    const lines = batchInput.split('\n').filter(line => line.trim());
    const results: ConversionItem[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // 尝试作为时间戳解析
      const asTimestamp = timestampToDate(trimmed);
      if (asTimestamp) {
        results.push({
          id: `${index}-ts`,
          timestamp: trimmed,
          datetime: asTimestamp,
          format: '时间戳 → 日期'
        });
      } else {
        // 尝试作为日期解析
        const asDate = dateToTimestamp(trimmed);
        if (asDate) {
          results.push({
            id: `${index}-dt`,
            timestamp: asDate,
            datetime: trimmed,
            format: '日期 → 时间戳'
          });
        }
      }
    });

    setBatchResults(results);
  };

  // 清空批量结果
  const clearBatchResults = () => {
    setBatchResults([]);
    setBatchInput('');
  };

  const batchColumns = [
    {
      title: '原始输入',
      dataIndex: 'format',
      key: 'format',
      render: (text: string, record: ConversionItem) => (
        <Text>{text === '时间戳 → 日期' ? record.timestamp : record.datetime}</Text>
      )
    },
    {
      title: '转换结果',
      key: 'result',
      render: (record: ConversionItem) => (
        <Text>{record.format === '时间戳 → 日期' ? record.datetime : record.timestamp}</Text>
      )
    },
    {
      title: '转换类型',
      dataIndex: 'format',
      key: 'format'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ConversionItem) => (
        <Button 
          type="link" 
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(record.format === '时间戳 → 日期' ? record.datetime : record.timestamp)}
        >
          复制
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>时间戳转换工具</Title>
      
      {/* 当前时间显示 */}
      <Card style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text strong>当前时间：</Text>
            <br />
            <Text>{formatDate(currentTime, dateFormat)}</Text>
          </Col>
          <Col span={8}>
            <Text strong>当前时间戳（秒）：</Text>
            <br />
            <Text copyable>{Math.floor(currentTime.getTime() / 1000)}</Text>
          </Col>
          <Col span={8}>
            <Text strong>当前时间戳（毫秒）：</Text>
            <br />
            <Text copyable>{currentTime.getTime()}</Text>
          </Col>
        </Row>
      </Card>

      {/* 转换设置 */}
      <Card title="转换设置" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text strong>时间戳类型：</Text>
            <Select 
              value={timestampType} 
              onChange={setTimestampType}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="seconds">秒级时间戳</Option>
              <Option value="milliseconds">毫秒级时间戳</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Text strong>日期格式：</Text>
            <Select 
              value={dateFormat} 
              onChange={setDateFormat}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</Option>
              <Option value="YYYY/MM/DD HH:mm:ss">YYYY/MM/DD HH:mm:ss</Option>
              <Option value="MM/DD/YYYY HH:mm:ss">MM/DD/YYYY HH:mm:ss</Option>
              <Option value="DD/MM/YYYY HH:mm:ss">DD/MM/YYYY HH:mm:ss</Option>
              <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
              <Option value="HH:mm:ss">HH:mm:ss</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Text strong>时区：</Text>
            <Select 
              value={timezone} 
              onChange={setTimezone}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
              <Option value="UTC">UTC (UTC+0)</Option>
              <Option value="America/New_York">America/New_York (UTC-5)</Option>
              <Option value="Europe/London">Europe/London (UTC+0)</Option>
              <Option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 单个转换 */}
      <Card title="单个转换" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>时间戳：</Text>
            <Input
              value={timestamp}
              onChange={(e) => handleTimestampChange(e.target.value)}
              placeholder={`请输入${timestampType === 'seconds' ? '秒级' : '毫秒级'}时间戳`}
              style={{ marginTop: '8px' }}
              suffix={
                <Button 
                  type="link" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(timestamp)}
                  disabled={!timestamp}
                />
              }
            />
          </Col>
          <Col span={12}>
            <Text strong>日期时间：</Text>
            <Input
              value={datetime}
              onChange={(e) => handleDatetimeChange(e.target.value)}
              placeholder="请输入日期时间"
              style={{ marginTop: '8px' }}
              suffix={
                <Button 
                  type="link" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(datetime)}
                  disabled={!datetime}
                />
              }
            />
          </Col>
        </Row>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Space>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={getCurrentTimestamp}
            >
              获取当前时间戳
            </Button>
          </Space>
        </div>
        
        {/* 相对时间显示 */}
        {datetime && (
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">
              相对时间：{getRelativeTime(new Date(datetime))}
            </Text>
          </div>
        )}
      </Card>

      {/* 批量转换 */}
      <Card title="批量转换">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>批量输入（每行一个时间戳或日期）：</Text>
            <TextArea
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder={`请输入时间戳或日期，每行一个\n例如：\n1640995200\n2022-01-01 00:00:00\n1640995200000`}
              rows={6}
              style={{ marginTop: '8px' }}
            />
          </Col>
        </Row>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleBatchConvert}
              disabled={!batchInput.trim()}
            >
              批量转换
            </Button>
            <Button 
              icon={<DeleteOutlined />}
              onClick={clearBatchResults}
            >
              清空结果
            </Button>
          </Space>
        </div>

        {batchResults.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Divider>转换结果</Divider>
            <Table
              dataSource={batchResults}
              columns={batchColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default TimestampConverter;