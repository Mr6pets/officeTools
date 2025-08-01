import React, { useState, useMemo } from 'react';
import { Card, Input, Button, Space, Typography, Row, Col, message, Switch, Select } from 'antd';
import { CopyOutlined, SwapOutlined, ClearOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface DiffResult {
  type: 'equal' | 'insert' | 'delete';
  content: string;
  lineNumber?: number;
}

const TextDiff: React.FC = () => {
  const [leftText, setLeftText] = useState<string>('');
  const [rightText, setRightText] = useState<string>('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [diffMode, setDiffMode] = useState<'char' | 'word' | 'line'>('line');

  // 简单的差异算法实现
  const computeDiff = (text1: string, text2: string): DiffResult[] => {
    let processedText1 = text1;
    let processedText2 = text2;

    // 预处理文本
    if (ignoreCase) {
      processedText1 = processedText1.toLowerCase();
      processedText2 = processedText2.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      processedText1 = processedText1.replace(/\s+/g, ' ').trim();
      processedText2 = processedText2.replace(/\s+/g, ' ').trim();
    }

    const results: DiffResult[] = [];

    if (diffMode === 'line') {
      const lines1 = processedText1.split('\n');
      const lines2 = processedText2.split('\n');
      const originalLines1 = text1.split('\n');
      const originalLines2 = text2.split('\n');
      
      const maxLines = Math.max(lines1.length, lines2.length);
      
      for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        const originalLine1 = originalLines1[i] || '';
        const originalLine2 = originalLines2[i] || '';
        
        if (line1 === line2) {
          if (originalLine1) {
            results.push({ type: 'equal', content: originalLine1, lineNumber: i + 1 });
          }
        } else {
          if (originalLine1 && !originalLine2) {
            results.push({ type: 'delete', content: originalLine1, lineNumber: i + 1 });
          } else if (!originalLine1 && originalLine2) {
            results.push({ type: 'insert', content: originalLine2, lineNumber: i + 1 });
          } else if (originalLine1 && originalLine2) {
            results.push({ type: 'delete', content: originalLine1, lineNumber: i + 1 });
            results.push({ type: 'insert', content: originalLine2, lineNumber: i + 1 });
          }
        }
      }
    } else if (diffMode === 'word') {
      const words1 = processedText1.split(/\s+/);
      const words2 = processedText2.split(/\s+/);
      const originalWords1 = text1.split(/\s+/);
      const originalWords2 = text2.split(/\s+/);
      
      const maxWords = Math.max(words1.length, words2.length);
      
      for (let i = 0; i < maxWords; i++) {
        const word1 = words1[i] || '';
        const word2 = words2[i] || '';
        const originalWord1 = originalWords1[i] || '';
        const originalWord2 = originalWords2[i] || '';
        
        if (word1 === word2) {
          if (originalWord1) {
            results.push({ type: 'equal', content: originalWord1 + ' ' });
          }
        } else {
          if (originalWord1 && !originalWord2) {
            results.push({ type: 'delete', content: originalWord1 + ' ' });
          } else if (!originalWord1 && originalWord2) {
            results.push({ type: 'insert', content: originalWord2 + ' ' });
          } else if (originalWord1 && originalWord2) {
            results.push({ type: 'delete', content: originalWord1 + ' ' });
            results.push({ type: 'insert', content: originalWord2 + ' ' });
          }
        }
      }
    } else {
      // 字符级别比较
      const maxLength = Math.max(processedText1.length, processedText2.length);
      
      for (let i = 0; i < maxLength; i++) {
        const char1 = processedText1[i] || '';
        const char2 = processedText2[i] || '';
        const originalChar1 = text1[i] || '';
        const originalChar2 = text2[i] || '';
        
        if (char1 === char2) {
          if (originalChar1) {
            results.push({ type: 'equal', content: originalChar1 });
          }
        } else {
          if (originalChar1 && !originalChar2) {
            results.push({ type: 'delete', content: originalChar1 });
          } else if (!originalChar1 && originalChar2) {
            results.push({ type: 'insert', content: originalChar2 });
          } else if (originalChar1 && originalChar2) {
            results.push({ type: 'delete', content: originalChar1 });
            results.push({ type: 'insert', content: originalChar2 });
          }
        }
      }
    }

    return results;
  };

  // 计算差异结果
  const diffResults = useMemo(() => {
    if (!leftText && !rightText) return [];
    return computeDiff(leftText, rightText);
  }, [leftText, rightText, ignoreWhitespace, ignoreCase, diffMode]);

  // 获取统计信息
  const getStats = () => {
    const insertions = diffResults.filter(r => r.type === 'insert').length;
    const deletions = diffResults.filter(r => r.type === 'delete').length;
    const unchanged = diffResults.filter(r => r.type === 'equal').length;
    
    return { insertions, deletions, unchanged };
  };

  const stats = getStats();

  // 渲染差异内容
  const renderDiffContent = () => {
    if (diffResults.length === 0) return null;

    if (viewMode === 'unified') {
      return (
        <div style={{ 
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          backgroundColor: '#f5f5f5',
          padding: '16px',
          borderRadius: '6px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {diffResults.map((result, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 
                  result.type === 'insert' ? '#e6ffed' :
                  result.type === 'delete' ? '#ffebee' : 'transparent',
                color:
                  result.type === 'insert' ? '#28a745' :
                  result.type === 'delete' ? '#dc3545' : '#333',
                padding: '2px 4px',
                borderLeft: 
                  result.type === 'insert' ? '3px solid #28a745' :
                  result.type === 'delete' ? '3px solid #dc3545' : 'none',
                marginLeft: result.type !== 'equal' ? '0' : '3px'
              }}
            >
              <span style={{ marginRight: '8px', color: '#666', fontSize: '12px' }}>
                {result.lineNumber || ''}
              </span>
              <span style={{ marginRight: '8px' }}>
                {result.type === 'insert' ? '+' : result.type === 'delete' ? '-' : ' '}
              </span>
              {result.content}
            </div>
          ))}
        </div>
      );
    }

    // 并排显示模式
    const leftResults = diffResults.filter(r => r.type === 'equal' || r.type === 'delete');
    const rightResults = diffResults.filter(r => r.type === 'equal' || r.type === 'insert');

    return (
      <Row gutter={16}>
        <Col span={12}>
          <Card title="原文本" size="small">
            <div style={{ 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              {leftResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: result.type === 'delete' ? '#ffebee' : 'transparent',
                    color: result.type === 'delete' ? '#dc3545' : '#333',
                    padding: '2px 4px',
                    textDecoration: result.type === 'delete' ? 'line-through' : 'none'
                  }}
                >
                  {result.content}
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="新文本" size="small">
            <div style={{ 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              {rightResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: result.type === 'insert' ? '#e6ffed' : 'transparent',
                    color: result.type === 'insert' ? '#28a745' : '#333',
                    padding: '2px 4px'
                  }}
                >
                  {result.content}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  // 交换文本
  const swapTexts = () => {
    const temp = leftText;
    setLeftText(rightText);
    setRightText(temp);
  };

  // 清空所有文本
  const clearAll = () => {
    setLeftText('');
    setRightText('');
  };

  // 复制差异报告
  const copyDiffReport = () => {
    const report = `文本差异对比报告\n\n统计信息:\n- 新增: ${stats.insertions} 项\n- 删除: ${stats.deletions} 项\n- 未变更: ${stats.unchanged} 项\n\n差异详情:\n${diffResults.map(r => `${r.type === 'insert' ? '+' : r.type === 'delete' ? '-' : ' '} ${r.content}`).join('\n')}`;
    
    navigator.clipboard.writeText(report).then(() => {
      message.success('差异报告已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>文本差异对比工具</Title>
      
      <Card>
        {/* 配置选项 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Text strong>对比模式：</Text>
            <Select 
              value={diffMode} 
              onChange={setDiffMode}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="line">按行对比</Option>
              <Option value="word">按词对比</Option>
              <Option value="char">按字符对比</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <Text strong>显示模式：</Text>
            <Select 
              value={viewMode} 
              onChange={setViewMode}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="side-by-side">并排显示</Option>
              <Option value="unified">统一显示</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <Text strong>忽略选项：</Text>
            <div style={{ marginTop: '8px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Switch 
                  checked={ignoreWhitespace} 
                  onChange={setIgnoreWhitespace}
                  size="small"
                />
                <Text style={{ marginLeft: '8px' }}>忽略空白字符</Text>
              </div>
              <div>
                <Switch 
                  checked={ignoreCase} 
                  onChange={setIgnoreCase}
                  size="small"
                />
                <Text style={{ marginLeft: '8px' }}>忽略大小写</Text>
              </div>
            </div>
          </Col>
          
          <Col span={6}>
            <Text strong>操作：</Text>
            <div style={{ marginTop: '8px' }}>
              <Space direction="vertical" size="small">
                <Button 
                  icon={<SwapOutlined />} 
                  onClick={swapTexts}
                  size="small"
                  disabled={!leftText && !rightText}
                >
                  交换文本
                </Button>
                <Button 
                  icon={<ClearOutlined />} 
                  onClick={clearAll}
                  size="small"
                >
                  清空所有
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        {/* 文本输入区域 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Text strong>原文本：</Text>
            <TextArea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="请输入原文本内容"
              rows={10}
              style={{ 
                marginTop: '8px',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px'
              }}
            />
          </Col>
          <Col span={12}>
            <Text strong>新文本：</Text>
            <TextArea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="请输入新文本内容"
              rows={10}
              style={{ 
                marginTop: '8px',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px'
              }}
            />
          </Col>
        </Row>

        {/* 统计信息 */}
        {(leftText || rightText) && (
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Text strong>统计信息：</Text>
                  </Col>
                  <Col span={4}>
                    <Text type="success">新增: {stats.insertions}</Text>
                  </Col>
                  <Col span={4}>
                    <Text type="danger">删除: {stats.deletions}</Text>
                  </Col>
                  <Col span={4}>
                    <Text>未变更: {stats.unchanged}</Text>
                  </Col>
                  <Col span={6}>
                    <Button 
                      type="link" 
                      icon={<CopyOutlined />}
                      onClick={copyDiffReport}
                      size="small"
                    >
                      复制差异报告
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {/* 差异显示区域 */}
        {diffResults.length > 0 && (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={4}>差异对比结果</Title>
              {renderDiffContent()}
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
};

export default TextDiff;