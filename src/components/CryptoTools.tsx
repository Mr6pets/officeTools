import React, { useState } from 'react';
import { Card, Input, Button, Select, Space, Typography, Row, Col, message, Upload, Tabs } from 'antd';
import { CopyOutlined, UploadOutlined, DownloadOutlined, KeyOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const CryptoTools: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<string>('AES');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [encoding, setEncoding] = useState<string>('Base64');
  const [hashInput, setHashInput] = useState<string>('');
  const [hashOutput, setHashOutput] = useState<string>('');
  const [hashAlgorithm, setHashAlgorithm] = useState<string>('MD5');

  // 生成随机密钥
  const generateKey = (length: number = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecretKey(result);
  };

  // AES 加密
  const aesEncrypt = (text: string, key: string): string => {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      return encrypted;
    } catch (error) {
      throw new Error('AES加密失败');
    }
  };

  // AES 解密
  const aesDecrypt = (encryptedText: string, key: string): string => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('AES解密失败');
    }
  };

  // DES 加密
  const desEncrypt = (text: string, key: string): string => {
    try {
      const encrypted = CryptoJS.DES.encrypt(text, key).toString();
      return encrypted;
    } catch (error) {
      throw new Error('DES加密失败');
    }
  };

  // DES 解密
  const desDecrypt = (encryptedText: string, key: string): string => {
    try {
      const decrypted = CryptoJS.DES.decrypt(encryptedText, key);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('DES解密失败');
    }
  };

  // Base64 编码
  const base64Encode = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      throw new Error('Base64编码失败');
    }
  };

  // Base64 解码
  const base64Decode = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      throw new Error('Base64解码失败');
    }
  };

  // 执行加密解密
  const handleCrypto = () => {
    if (!inputText.trim()) {
      message.error('请输入要处理的文本');
      return;
    }

    try {
      let result = '';

      if (algorithm === 'Base64') {
        result = mode === 'encrypt' ? base64Encode(inputText) : base64Decode(inputText);
      } else {
        if (!secretKey.trim()) {
          message.error('请输入密钥');
          return;
        }

        switch (algorithm) {
          case 'AES':
            result = mode === 'encrypt' ? aesEncrypt(inputText, secretKey) : aesDecrypt(inputText, secretKey);
            break;
          case 'DES':
            result = mode === 'encrypt' ? desEncrypt(inputText, secretKey) : desDecrypt(inputText, secretKey);
            break;
          default:
            throw new Error('不支持的算法');
        }
      }

      setOutputText(result);
      message.success(`${mode === 'encrypt' ? '加密' : '解密'}成功`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '操作失败');
      setOutputText('');
    }
  };

  // 计算哈希值
  const calculateHash = () => {
    if (!hashInput.trim()) {
      message.error('请输入要计算哈希的文本');
      return;
    }

    try {
      let result = '';
      switch (hashAlgorithm) {
        case 'MD5':
          result = CryptoJS.MD5(hashInput).toString();
          break;
        case 'SHA1':
          result = CryptoJS.SHA1(hashInput).toString();
          break;
        case 'SHA256':
          result = CryptoJS.SHA256(hashInput).toString();
          break;
        case 'SHA512':
          result = CryptoJS.SHA512(hashInput).toString();
          break;
        default:
          throw new Error('不支持的哈希算法');
      }
      setHashOutput(result);
      message.success('哈希计算成功');
    } catch (error) {
      message.error('哈希计算失败');
      setHashOutput('');
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

  // 清空所有输入
  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setSecretKey('');
    setHashInput('');
    setHashOutput('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>加密解密工具</Title>
      
      <Tabs defaultActiveKey="crypto">
        <TabPane tab="加密解密" key="crypto">
          <Card>
            {/* 算法和模式选择 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <Text strong>加密算法：</Text>
                <Select 
                  value={algorithm} 
                  onChange={setAlgorithm}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value="AES">AES</Option>
                  <Option value="DES">DES</Option>
                  <Option value="Base64">Base64</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Text strong>操作模式：</Text>
                <Select 
                  value={mode} 
                  onChange={setMode}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value="encrypt">加密</Option>
                  <Option value="decrypt">解密</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Text strong>编码格式：</Text>
                <Select 
                  value={encoding} 
                  onChange={setEncoding}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value="Base64">Base64</Option>
                  <Option value="Hex">Hex</Option>
                  <Option value="UTF8">UTF8</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Text strong>密钥操作：</Text>
                <div style={{ marginTop: '8px' }}>
                  <Button 
                    icon={<KeyOutlined />}
                    onClick={() => generateKey()}
                    size="small"
                  >
                    生成密钥
                  </Button>
                </div>
              </Col>
            </Row>

            {/* 密钥输入 */}
            {algorithm !== 'Base64' && (
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                  <Text strong>密钥：</Text>
                  <Input
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="请输入密钥或点击生成密钥"
                    style={{ marginTop: '8px' }}
                    suffix={
                      <Button 
                        type="link" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(secretKey)}
                        disabled={!secretKey}
                      />
                    }
                  />
                </Col>
              </Row>
            )}

            {/* 输入文本 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Text strong>输入文本：</Text>
                <TextArea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`请输入要${mode === 'encrypt' ? '加密' : '解密'}的文本`}
                  rows={6}
                  style={{ marginTop: '8px' }}
                />
              </Col>
            </Row>

            {/* 操作按钮 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={handleCrypto}
                    disabled={!inputText.trim()}
                  >
                    {mode === 'encrypt' ? '加密' : '解密'}
                  </Button>
                  <Button onClick={clearAll}>
                    清空
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* 输出文本 */}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>输出结果：</Text>
                <TextArea
                  value={outputText}
                  readOnly
                  rows={6}
                  style={{ marginTop: '8px' }}
                  suffix={
                    <Button 
                      type="link" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(outputText)}
                      disabled={!outputText}
                    />
                  }
                />
                {outputText && (
                  <div style={{ marginTop: '8px', textAlign: 'right' }}>
                    <Button 
                      type="link" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(outputText)}
                    >
                      复制结果
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="哈希计算" key="hash">
          <Card>
            {/* 哈希算法选择 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <Text strong>哈希算法：</Text>
                <Select 
                  value={hashAlgorithm} 
                  onChange={setHashAlgorithm}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Option value="MD5">MD5</Option>
                  <Option value="SHA1">SHA1</Option>
                  <Option value="SHA256">SHA256</Option>
                  <Option value="SHA512">SHA512</Option>
                </Select>
              </Col>
            </Row>

            {/* 输入文本 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Text strong>输入文本：</Text>
                <TextArea
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="请输入要计算哈希的文本"
                  rows={6}
                  style={{ marginTop: '8px' }}
                />
              </Col>
            </Row>

            {/* 操作按钮 */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={calculateHash}
                    disabled={!hashInput.trim()}
                  >
                    计算哈希
                  </Button>
                  <Button onClick={() => { setHashInput(''); setHashOutput(''); }}>
                    清空
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* 哈希结果 */}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>哈希结果：</Text>
                <Input
                  value={hashOutput}
                  readOnly
                  style={{ marginTop: '8px' }}
                  suffix={
                    <Button 
                      type="link" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(hashOutput)}
                      disabled={!hashOutput}
                    />
                  }
                />
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CryptoTools;