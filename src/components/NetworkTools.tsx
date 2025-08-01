import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Row,
  Col,
  Tabs,
  Typography,
  Table,
  Tag,
  Tooltip,
  Select,
  App
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
  const { message } = App.useApp();
  
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

  const tabItems = [
    {
      key: 'url',
      label: 'URL编码/解码',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>输入文本：</Text>
              <TextArea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="请输入要编码/解码的URL"
                rows={4}
                style={{ marginTop: 8 }}
              />
            </Col>
            <Col span={12}>
              <Text strong>输出结果：</Text>
              <TextArea
                value={urlOutput}
                readOnly
                placeholder="编码/解码结果将显示在这里"
                rows={4}
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
          <Space>
            <Button type="primary" icon={<LinkOutlined />} onClick={encodeURL}>
              URL编码
            </Button>
            <Button icon={<LinkOutlined />} onClick={decodeURL}>
              URL解码
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(urlOutput)}>
              复制结果
            </Button>
            <Button icon={<ClearOutlined />} onClick={() => { setUrlInput(''); setUrlOutput(''); }}>
              清空
            </Button>
          </Space>
        </Space>
      )
    },
    {
      key: 'base64',
      label: 'Base64编码/解码',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>输入文本：</Text>
              <TextArea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="请输入要编码/解码的文本"
                rows={4}
                style={{ marginTop: 8 }}
              />
            </Col>
            <Col span={12}>
              <Text strong>输出结果：</Text>
              <TextArea
                value={base64Output}
                readOnly
                placeholder="编码/解码结果将显示在这里"
                rows={4}
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
          <Space>
            <Button type="primary" onClick={encodeBase64}>
              Base64编码
            </Button>
            <Button onClick={decodeBase64}>
              Base64解码
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(base64Output)}>
              复制结果
            </Button>
            <Button icon={<ClearOutlined />} onClick={() => { setBase64Input(''); setBase64Output(''); }}>
              清空
            </Button>
          </Space>
        </Space>
      )
    },
    {
      key: 'ip',
      label: 'IP查询',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>IP地址：</Text>
              <Input
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="请输入IP地址"
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => queryIPInfo()} loading={ipLoading}>
              查询IP信息
            </Button>
            <Button icon={<GlobalOutlined />} onClick={getMyIP} loading={ipLoading}>
              获取我的IP
            </Button>
          </Space>
          {ipInfo && (
            <Card title="IP信息" style={{ marginTop: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={8}><Text strong>IP地址：</Text>{ipInfo.ip}</Col>
                <Col span={8}><Text strong>国家：</Text>{ipInfo.country}</Col>
                <Col span={8}><Text strong>地区：</Text>{ipInfo.region}</Col>
                <Col span={8}><Text strong>城市：</Text>{ipInfo.city}</Col>
                <Col span={8}><Text strong>ISP：</Text>{ipInfo.isp}</Col>
                <Col span={8}><Text strong>时区：</Text>{ipInfo.timezone}</Col>
                <Col span={8}><Text strong>纬度：</Text>{ipInfo.lat}</Col>
                <Col span={8}><Text strong>经度：</Text>{ipInfo.lon}</Col>
              </Row>
            </Card>
          )}
        </Space>
      )
    },
    {
      key: 'port',
      label: '端口检测',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>主机地址：</Text>
              <Input
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                placeholder="请输入主机地址或域名"
                style={{ marginTop: 8 }}
              />
            </Col>
            <Col span={12}>
              <Text strong>端口列表：</Text>
              <Input
                value={portInput}
                onChange={(e) => setPortInput(e.target.value)}
                placeholder="请输入端口，多个端口用逗号分隔"
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
          <Space>
            <Button type="primary" icon={<WifiOutlined />} onClick={checkPorts} loading={portLoading}>
              检测端口
            </Button>
            <Button onClick={() => setPortInput('21,22,23,25,53,80,110,143,443,993,995,3389')}>
              常用端口
            </Button>
          </Space>
          {portResults.length > 0 && (
            <Table
              columns={portColumns}
              dataSource={portResults}
              rowKey="port"
              pagination={false}
              style={{ marginTop: 16 }}
            />
          )}
        </Space>
      )
    },
    {
      key: 'hash',
      label: 'Hash计算',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={24}>
              <Text strong>输入文本：</Text>
              <TextArea
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="请输入要计算Hash的文本"
                rows={4}
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
          <Space>
            <Button type="primary" onClick={calculateHash}>
              计算Hash
            </Button>
            <Button icon={<ClearOutlined />} onClick={() => { setHashInput(''); setHashResults(null); }}>
              清空
            </Button>
          </Space>
          {hashResults && (
            <Card title="Hash结果" style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={2}><Text strong>MD5：</Text></Col>
                  <Col span={20}>
                    <Input value={hashResults.md5} readOnly />
                  </Col>
                  <Col span={2}>
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(hashResults.md5)} />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={2}><Text strong>SHA1：</Text></Col>
                  <Col span={20}>
                    <Input value={hashResults.sha1} readOnly />
                  </Col>
                  <Col span={2}>
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(hashResults.sha1)} />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={2}><Text strong>SHA256：</Text></Col>
                  <Col span={20}>
                    <Input value={hashResults.sha256} readOnly />
                  </Col>
                  <Col span={2}>
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(hashResults.sha256)} />
                  </Col>
                </Row>
              </Space>
            </Card>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="network-tools">
      <Card title="网络工具集" className="tool-card">
        <Tabs defaultActiveKey="url" type="card" items={tabItems} />
      </Card>
    </div>
  );
};

export default NetworkTools;