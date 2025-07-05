import React, { useState } from 'react';
import { Card, Input, Button, Space, Tabs, message, Row, Col, Statistic, Select } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const TextTools: React.FC = () => {
  const items = [
    {
      key: 'counter',
      label: '字符统计',
      children: <TextCounter />
    },
    {
      key: 'format',
      label: '格式转换',
      children: <TextFormatter />
    },
    {
      key: 'encode',
      label: '编码转换',
      children: <CustomTextEncoder />
    },
    {
      key: 'hash',
      label: '哈希计算',
      children: <TextHasher />
    }
  ];

  return <Tabs defaultActiveKey="counter" items={items} />;
};

const TextCounter: React.FC = () => {
  const [text, setText] = useState('');
  
  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.split('\n').length
  };

  return (
    <Card title="文本统计">
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入要统计的文本"
          rows={8}
        />
        
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Statistic title="字符数" value={stats.characters} />
          </Col>
          <Col span={6}>
            <Statistic title="字符数(无空格)" value={stats.charactersNoSpaces} />
          </Col>
          <Col span={6}>
            <Statistic title="单词数" value={stats.words} />
          </Col>
          <Col span={6}>
            <Statistic title="行数" value={stats.lines} />
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

const TextFormatter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const formatText = (type: string) => {
    switch (type) {
      case 'upper':
        setOutputText(inputText.toUpperCase());
        break;
      case 'lower':
        setOutputText(inputText.toLowerCase());
        break;
      case 'title':
        setOutputText(inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
        break;
      default:
        break;
    }
  };

  return (
    <Card title="格式转换">
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入要转换的文本"
          rows={4}
        />
        
        <Space>
          <Button onClick={() => formatText('upper')}>转大写</Button>
          <Button onClick={() => formatText('lower')}>转小写</Button>
          <Button onClick={() => formatText('title')}>首字母大写</Button>
        </Space>
        
        <TextArea
          value={outputText}
          placeholder="转换结果"
          rows={4}
          readOnly
        />
        
        <Button 
          icon={<CopyOutlined />} 
          onClick={() => {
            navigator.clipboard.writeText(outputText);
            message.success('已复制到剪贴板');
          }}
        >
          复制结果
        </Button>
      </Space>
    </Card>
  );
};

const CustomTextEncoder: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [encodeType, setEncodeType] = useState('base64');

  const encodeText = () => {
    try {
      switch (encodeType) {
        case 'base64':
          setOutputText(btoa(unescape(encodeURIComponent(inputText))));
          break;
        case 'url':
          setOutputText(encodeURIComponent(inputText));
          break;
        default:
          break;
      }
    } catch (error) {
      message.error('编码失败');
    }
  };

  return (
    <Card title="编码转换">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Select value={encodeType} onChange={setEncodeType} style={{ width: 120 }}>
            <Option value="base64">Base64</Option>
            <Option value="url">URL编码</Option>
          </Select>
        </div>
        
        <TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入要编码的文本"
          rows={4}
        />
        
        <Button type="primary" onClick={encodeText}>编码</Button>
        
        <TextArea
          value={outputText}
          placeholder="编码结果"
          rows={4}
          readOnly
        />
      </Space>
    </Card>
  );
};

const TextHasher: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [hashResult, setHashResult] = useState('');

  const generateHash = async () => {
    if (!inputText) {
      message.warning('请输入要计算哈希的文本');
      return;
    }
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashResult(hashHex);
    } catch (error) {
      message.error('哈希计算失败');
    }
  };

  return (
    <Card title="哈希计算">
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入要计算哈希的文本"
          rows={4}
        />
        
        <Button type="primary" onClick={generateHash}>计算SHA-256</Button>
        
        <Input
          value={hashResult}
          placeholder="哈希结果"
          readOnly
        />
        
        <Button 
          icon={<CopyOutlined />} 
          onClick={() => {
            navigator.clipboard.writeText(hashResult);
            message.success('已复制到剪贴板');
          }}
          disabled={!hashResult}
        >
          复制哈希值
        </Button>
      </Space>
    </Card>
  );
};

export default TextTools;