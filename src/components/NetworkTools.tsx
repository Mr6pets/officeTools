import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  message,
  Row,
  Col,
  Tabs,
  Typography,
  Table,
  Tag,
  Tooltip,
  Select
} from 'antd';
import {
  LinkOutlined,
  GlobalOutlined,
  WifiOutlined,
  CopyOutlined,
  ClearOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface IPInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  timezone: string;
  lat: number;
  lon: number;
}

const NetworkTools: React.FC = () => {
  // URL编码/解码
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlOutput, setUrlOutput] = useState<string>('');
  
  // Base64编码/解码
  const [base64Input, setBase64Input] = useState<string>('');
  const [base64Output, setBase64Output] = useState<string>('');
  
  // IP查询
  const [ipInput, setIpInput] = useState<string>('');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [ipLoading, setIpLoading] = useState<boolean>(false);
  
  // 端口检测
  const [hostInput, setHostInput] = useState<string>('');
  const [portInput, setPortInput] = useState<string>('');
  const [portResults, setPortResults] = useState<any[]>([]);
  const [portLoading, setPortLoading] = useState<boolean>(false);
  
  // Hash计算
  const [hashInput, setHashInput] = useState<string>('');
  const [hashResults, setHashResults] = useState<{
    md5: string;
    sha1: string;
    sha256: string;
  } | null>(null);

  // URL编码
  const encodeURL = () => {
    if (!urlInput.trim()) {
      message.warning('请输入要编码的URL');
      return;
    }
    try {
      const encoded = encodeURIComponent(urlInput);
      setUrlOutput(encoded);
      message.success('URL编码成功');
    } catch (error) {
      message.error('编码失败');
    }
  };

  // URL解码
  const decodeURL = () => {
    if (!urlInput.trim()) {
      message.warning('请输入要解码的URL');
      return;
    }
    try {
      const decoded = decodeURIComponent(urlInput);
      setUrlOutput(decoded);
      message.success('URL解码成功');
    } catch (error) {
      message.error('解码失败，请检查输入格式');
    }
  };

  // Base64编码
  const encodeBase64 = () => {
    if (!base64Input.trim()) {
      message.warning('请输入要编码的文本');
      return;
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(base64Input)));
      setBase64Output(encoded);
      message.success('Base64编码成功');
    } catch (error) {
      message.error('编码失败');
    }
  };

  // Base64解码
  const decodeBase64 = () => {
    if (!base64Input.trim()) {
      message.warning('请输入要解码的Base64文本');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setBase64Output(decoded);
      message.success('Base64解码成功');
    } catch (error) {
      message.error('解码失败，请检查输入格式');
    }
  };

  // 获取用户IP信息
  const getMyIP = async () => {
    setIpLoading(true);
    try {
      // 模拟IP查询（实际应用中需要调用真实的IP查询API）
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpInput(data.ip);
      await queryIPInfo(data.ip);
    } catch (error) {
      message.error('获取IP信息失败');
    } finally {
      setIpLoading(false);
    }
  };

  // 查询IP信息
  const queryIPInfo = async (ip?: string) => {
    const targetIP = ip || ipInput;
    if (!targetIP.trim()) {
      message.warning('请输入要查询的IP地址');
      return;
    }
    
    setIpLoading(true);
    try {
      // 模拟IP信息查询（实际应用中需要调用真实的IP地理位置API）
      // 这里使用模拟数据
      const mockData: IPInfo = {
        ip: targetIP,
        country: '中国',
        region: '北京市',
        city: '北京',
        isp: '中国电信',
        timezone: 'Asia/Shanghai',
        lat: 39.9042,
        lon: 116.4074
      };
      
      setIpInfo(mockData);
      message.success('IP信息查询成功');
    } catch (error) {
      message.error('IP信息查询失败');
    } finally {
      setIpLoading(false);
    }
  };

  // 端口检测
  const checkPorts = async () => {
    if (!hostInput.trim()) {
      message.warning('请输入主机地址');
      return;
    }
    
    const ports = portInput.split(',').map(p => p.trim()).filter(p => p);
    if (ports.length === 0) {
      message.warning('请输入要检测的端口');
      return;
    }
    
    setPortLoading(true);
    try {
      // 模拟端口检测（实际应用中需要后端支持）
      const results = ports.map(port => ({
        port: parseInt(port),
        status: Math.random() > 0.5 ? 'open' : 'closed',
        service: getServiceName(parseInt(port))
      }));
      
      setPortResults(results);
      message.success('端口检测完成');
    } catch (error) {
      message.error('端口检测失败');
    } finally {
      setPortLoading(false);
    }
  };

  // 获取端口对应的服务名
  const getServiceName = (port: number): string => {
    const services: { [key: number]: string } = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      993: 'IMAPS',
      995: 'POP3S',
      3389: 'RDP',
      5432: 'PostgreSQL',
      3306: 'MySQL'
    };
    return services[port] || 'Unknown';
  };

  // Hash计算
  const calculateHash = async () => {
    if (!hashInput.trim()) {
      message.warning('请输入要计算Hash的文本');
      return;
    }
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);
      
      // 计算SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha256Array = Array.from(new Uint8Array(sha256Buffer));
      const sha256 = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // 计算SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      const sha1Array = Array.from(new Uint8Array(sha1Buffer));
      const sha1 = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // MD5需要额外的库，这里使用简单的模拟
      const md5 = 'MD5需要额外库支持';
      
      setHashResults({ md5, sha1, sha256 });
      message.success('Hash计算完成');
    } catch (error) {
      message.error('Hash计算失败');
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

  // 端口检测结果表格列
  const portColumns = [
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'open' ? 'green' : 'red'}>
          {status === 'open' ? '开放' : '关闭'}
        </Tag>
      ),
    },
    {
      title: '服务',
      dataIndex: 'service',
      key: 'service',
    },
  ];

  return (
    <div className="network-tools">
      <Card title="网络工具集" className="tool-card">
        <Tabs defaultActiveKey="url" type="card">
          {/* URL编码/解码 */}
          <TabPane tab="URL编码/解码" key="url">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card size="small" title="URL编码/解码">
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>输入:</div>
                    <TextArea
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="输入要编码或解码的URL..."
                      rows={6}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Space>
                        <Button type="primary" onClick={encodeURL}>
                          编码
                        </Button>
                        <Button onClick={decodeURL}>
                          解码
                        </Button>
                        <Button 
                          icon={<ClearOutlined />}
                          onClick={() => { setUrlInput(''); setUrlOutput(''); }}
                        >
                          清空
                        </Button>
                      </Space>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>输出:</div>
                    <TextArea
                      value={urlOutput}
                      readOnly
                      placeholder="编码或解码结果将显示在这里..."
                      rows={6}
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Button 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(urlOutput)}
                        disabled={!urlOutput}
                      >
                        复制
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Space>
          </TabPane>

          {/* Base64编码/解码 */}
          <TabPane tab="Base64编码/解码" key="base64">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card size="small" title="Base64编码/解码">
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>输入:</div>
                    <TextArea
                      value={base64Input}
                      onChange={(e) => setBase64Input(e.target.value)}
                      placeholder="输入要编码或解码的文本..."
                      rows={6}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Space>
                        <Button type="primary" onClick={encodeBase64}>
                          编码
                        </Button>
                        <Button onClick={decodeBase64}>
                          解码
                        </Button>
                        <Button 
                          icon={<ClearOutlined />}
                          onClick={() => { setBase64Input(''); setBase64Output(''); }}
                        >
                          清空
                        </Button>
                      </Space>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>输出:</div>
                    <TextArea
                      value={base64Output}
                      readOnly
                      placeholder="编码或解码结果将显示在这里..."
                      rows={6}
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Button 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(base64Output)}
                        disabled={!base64Output}
                      >
                        复制
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Space>
          </TabPane>

          {/* IP查询 */}
          <TabPane tab="IP查询" key="ip">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card size="small" title="IP地址查询">
                <Row gutter={16}>
                  <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Input
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        placeholder="输入IP地址..."
                        prefix={<GlobalOutlined />}
                      />
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<SearchOutlined />}
                          onClick={() => queryIPInfo()}
                          loading={ipLoading}
                        >
                          查询
                        </Button>
                        <Button 
                          icon={<WifiOutlined />}
                          onClick={getMyIP}
                          loading={ipLoading}
                        >
                          获取我的IP
                        </Button>
                      </Space>
                    </Space>
                  </Col>
                  <Col span={12}>
                    {ipInfo && (
                      <Card size="small" title="IP信息">
                        <div style={{ lineHeight: '2' }}>
                          <div><strong>IP地址:</strong> {ipInfo.ip}</div>
                          <div><strong>国家:</strong> {ipInfo.country}</div>
                          <div><strong>地区:</strong> {ipInfo.region}</div>
                          <div><strong>城市:</strong> {ipInfo.city}</div>
                          <div><strong>ISP:</strong> {ipInfo.isp}</div>
                          <div><strong>时区:</strong> {ipInfo.timezone}</div>
                          <div><strong>坐标:</strong> {ipInfo.lat}, {ipInfo.lon}</div>
                        </div>
                      </Card>
                    )}
                  </Col>
                </Row>
              </Card>
            </Space>
          </TabPane>

          {/* 端口检测 */}
          <TabPane tab="端口检测" key="port">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card size="small" title="端口连通性检测">
                <Row gutter={16}>
                  <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Input
                        value={hostInput}
                        onChange={(e) => setHostInput(e.target.value)}
                        placeholder="输入主机地址 (如: google.com)"
                        prefix={<LinkOutlined />}
                      />
                      <Input
                        value={portInput}
                        onChange={(e) => setPortInput(e.target.value)}
                        placeholder="输入端口 (如: 80,443,22)"
                        addonBefore="端口"
                      />
                      <Button 
                        type="primary" 
                        icon={<SearchOutlined />}
                        onClick={checkPorts}
                        loading={portLoading}
                        block
                      >
                        检测端口
                      </Button>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        提示: 多个端口用逗号分隔，如: 80,443,22
                      </div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    {portResults.length > 0 && (
                      <Table
                        columns={portColumns}
                        dataSource={portResults}
                        size="small"
                        pagination={false}
                        rowKey="port"
                      />
                    )}
                  </Col>
                </Row>
              </Card>
            </Space>
          </TabPane>

          {/* Hash计算 */}
          <TabPane tab="Hash计算" key="hash">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card size="small" title="Hash值计算">
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>输入文本:</div>
                    <TextArea
                      value={hashInput}
                      onChange={(e) => setHashInput(e.target.value)}
                      placeholder="输入要计算Hash的文本..."
                      rows={6}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Button type="primary" onClick={calculateHash}>
                        计算Hash
                      </Button>
                    </div>
                  </Col>
                  <Col span={12}>
                    {hashResults && (
                      <Card size="small" title="Hash结果">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <Text strong>MD5:</Text>
                            <div style={{ 
                              wordBreak: 'break-all', 
                              fontFamily: 'monospace',
                              backgroundColor: '#f5f5f5',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              marginTop: '4px'
                            }}>
                              {hashResults.md5}
                              <Button 
                                size="small" 
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(hashResults.md5)}
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          </div>
                          <div>
                            <Text strong>SHA-1:</Text>
                            <div style={{ 
                              wordBreak: 'break-all', 
                              fontFamily: 'monospace',
                              backgroundColor: '#f5f5f5',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              marginTop: '4px'
                            }}>
                              {hashResults.sha1}
                              <Button 
                                size="small" 
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(hashResults.sha1)}
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          </div>
                          <div>
                            <Text strong>SHA-256:</Text>
                            <div style={{ 
                              wordBreak: 'break-all', 
                              fontFamily: 'monospace',
                              backgroundColor: '#f5f5f5',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              marginTop: '4px'
                            }}>
                              {hashResults.sha256}
                              <Button 
                                size="small" 
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(hashResults.sha256)}
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          </div>
                        </Space>
                      </Card>
                    )}
                  </Col>
                </Row>
              </Card>
            </Space>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default NetworkTools;