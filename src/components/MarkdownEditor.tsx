import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, message, Upload, Divider, Input } from 'antd';
import { 
  BoldOutlined, 
  ItalicOutlined, 
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  FullscreenOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import { marked } from 'marked';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Markdown预览样式
const markdownStyles = `
  .markdown-preview {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
  
  .markdown-preview h1,
  .markdown-preview h2,
  .markdown-preview h3,
  .markdown-preview h4,
  .markdown-preview h5,
  .markdown-preview h6 {
    color: var(--text-primary);
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }
  
  .markdown-preview h1 {
    font-size: 2em;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 8px;
  }
  
  .markdown-preview h2 {
    font-size: 1.5em;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 6px;
  }
  
  .markdown-preview h3 {
    font-size: 1.25em;
  }
  
  .markdown-preview p {
    margin-bottom: 16px;
    line-height: 1.7;
  }
  
  .markdown-preview code {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', 'Fira Code', Monaco, Menlo, 'Ubuntu Mono', monospace;
    font-size: 0.9em;
  }
  
  .markdown-preview pre {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
    margin: 16px 0;
  }
  
  .markdown-preview pre code {
    background: none;
    padding: 0;
    border-radius: 0;
  }
  
  .markdown-preview blockquote {
    border-left: 4px solid var(--primary-color);
    margin: 16px 0;
    padding: 0 16px;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    border-radius: 0 4px 4px 0;
  }
  
  .markdown-preview ul,
  .markdown-preview ol {
    margin: 16px 0;
    padding-left: 24px;
  }
  
  .markdown-preview li {
    margin: 4px 0;
  }
  
  .markdown-preview table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .markdown-preview th,
  .markdown-preview td {
    border: 1px solid var(--border-color);
    padding: 12px;
    text-align: left;
  }
  
  .markdown-preview th {
    background: var(--bg-tertiary);
    font-weight: 600;
  }
  
  .markdown-preview a {
    color: var(--primary-color);
    text-decoration: none;
  }
  
  .markdown-preview a:hover {
    text-decoration: underline;
  }
  
  .markdown-preview img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
  }
  
  .markdown-preview hr {
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 24px 0;
  }
`;

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Markdown编辑器

这是一个功能强大的Markdown编辑器，支持实时预览。

## 功能特性

- **粗体文本**
- *斜体文本*
- ~~删除线~~
- [链接](https://example.com)
- \`行内代码\`

### 代码块

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### 列表

1. 有序列表项1
2. 有序列表项2

- 无序列表项1
- 无序列表项2

### 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

### 引用

> 这是一个引用块
> 可以包含多行内容

---

**感谢使用Markdown编辑器！**`);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }, []);

  // 实时转换Markdown为HTML
  useEffect(() => {
    const convertToHtml = async () => {
      try {
        const html = await marked(markdown);
        setHtmlContent(html);
      } catch (error) {
        console.error('Markdown转换失败:', error);
      }
    };
    convertToHtml();
  }, [markdown]);

  // 插入文本到光标位置
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = markdown.substring(0, start) + before + textToInsert + after + markdown.substring(end);
    setMarkdown(newText);
    
    // 设置新的光标位置
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // 工具栏操作
  const toolbarActions = {
    bold: () => insertText('**', '**', '粗体文本'),
    italic: () => insertText('*', '*', '斜体文本'),
    underline: () => insertText('<u>', '</u>', '下划线文本'),
    code: () => insertText('`', '`', '代码'),
    codeBlock: () => insertText('\n```\n', '\n```\n', '代码块'),
    link: () => insertText('[', '](https://example.com)', '链接文本'),
    image: () => insertText('![', '](https://example.com/image.jpg)', '图片描述'),
    orderedList: () => insertText('\n1. ', '', '列表项'),
    unorderedList: () => insertText('\n- ', '', '列表项'),
    quote: () => insertText('\n> ', '', '引用内容'),
    heading1: () => insertText('\n# ', '', '一级标题'),
    heading2: () => insertText('\n## ', '', '二级标题'),
    heading3: () => insertText('\n### ', '', '三级标题'),
    table: () => insertText('\n| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| ', ' | | |\n', '数据'),
    hr: () => insertText('\n---\n', '', '')
  };

  // 导出Markdown文件
  const exportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Markdown文件已导出');
  };

  // 导出HTML文件
  const exportHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('HTML文件已导出');
  };

  // 导入文件
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
      message.success('文件导入成功');
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 生成目录
  const generateToc = () => {
    const lines = markdown.split('\n');
    const toc: string[] = [];
    
    lines.forEach(line => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2];
        const indent = '  '.repeat(level - 1);
        const anchor = title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-');
        toc.push(`${indent}- [${title}](#${anchor})`);
      }
    });
    
    if (toc.length > 0) {
      const tocContent = '## 目录\n\n' + toc.join('\n') + '\n\n';
      setMarkdown(tocContent + markdown);
      message.success('目录已生成');
    } else {
      message.info('未找到标题，无法生成目录');
    }
  };

  return (
    <div style={{ 
      padding: '24px', 
      height: isFullscreen ? '100vh' : 'auto',
      background: 'var(--bg-primary)'
    }}>
      <style>{markdownStyles}</style>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: 'var(--text-primary)' }}>
          Markdown编辑器
        </Title>
      </div>
      
      {/* 工具栏 */}
      <Card 
        style={{ 
          marginBottom: '20px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* 文本格式化 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', minWidth: '60px' }}>格式化</Text>
            <Space.Compact>
              <Button icon={<BoldOutlined />} onClick={toolbarActions.bold} title="粗体" size="small" />
              <Button icon={<ItalicOutlined />} onClick={toolbarActions.italic} title="斜体" size="small" />
              <Button icon={<UnderlineOutlined />} onClick={toolbarActions.underline} title="下划线" size="small" />
              <Button icon={<CodeOutlined />} onClick={toolbarActions.code} title="行内代码" size="small" />
            </Space.Compact>
          </div>
          
          <Divider type="vertical" style={{ height: '24px', margin: 0 }} />
          
          {/* 标题 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', minWidth: '40px' }}>标题</Text>
            <Space.Compact>
              <Button onClick={toolbarActions.heading1} title="一级标题" size="small">H1</Button>
              <Button onClick={toolbarActions.heading2} title="二级标题" size="small">H2</Button>
              <Button onClick={toolbarActions.heading3} title="三级标题" size="small">H3</Button>
            </Space.Compact>
          </div>
          
          <Divider type="vertical" style={{ height: '24px', margin: 0 }} />
          
          {/* 列表和链接 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', minWidth: '40px' }}>插入</Text>
            <Space.Compact>
              <Button icon={<OrderedListOutlined />} onClick={toolbarActions.orderedList} title="有序列表" size="small" />
              <Button icon={<UnorderedListOutlined />} onClick={toolbarActions.unorderedList} title="无序列表" size="small" />
              <Button icon={<LinkOutlined />} onClick={toolbarActions.link} title="链接" size="small" />
              <Button icon={<PictureOutlined />} onClick={toolbarActions.image} title="图片" size="small" />
            </Space.Compact>
          </div>
          
          <Divider type="vertical" style={{ height: '24px', margin: 0 }} />
          
          {/* 高级功能 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', minWidth: '40px' }}>高级</Text>
            <Space size="small">
              <Button onClick={toolbarActions.quote} title="引用" size="small">Quote</Button>
              <Button onClick={toolbarActions.table} title="表格" size="small">Table</Button>
              <Button onClick={toolbarActions.codeBlock} title="代码块" size="small">Code</Button>
              <Button onClick={toolbarActions.hr} title="分割线" size="small">HR</Button>
              <Button onClick={generateToc} title="生成目录" size="small">TOC</Button>
            </Space>
          </div>
          
          <Divider type="vertical" style={{ height: '24px', margin: 0 }} />
          
          {/* 文件操作 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', minWidth: '40px' }}>文件</Text>
            <Space size="small">
              <Upload 
                accept=".md,.txt"
                beforeUpload={handleFileUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} title="导入文件" size="small">导入</Button>
              </Upload>
              <Button icon={<DownloadOutlined />} onClick={exportMarkdown} title="导出Markdown" size="small">MD</Button>
              <Button icon={<DownloadOutlined />} onClick={exportHtml} title="导出HTML" size="small">HTML</Button>
            </Space>
          </div>
          
          <Divider type="vertical" style={{ height: '24px', margin: 0 }} />
          
          {/* 视图模式 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', minWidth: '40px' }}>视图</Text>
            <Space.Compact>
              <Button 
                type={viewMode === 'edit' ? 'primary' : 'default'}
                icon={<EditOutlined />} 
                onClick={() => setViewMode('edit')}
                title="编辑模式"
                size="small"
              />
              <Button 
                type={viewMode === 'split' ? 'primary' : 'default'}
                onClick={() => setViewMode('split')}
                title="分屏模式"
                size="small"
              >
                Split
              </Button>
              <Button 
                type={viewMode === 'preview' ? 'primary' : 'default'}
                icon={<EyeOutlined />} 
                onClick={() => setViewMode('preview')}
                title="预览模式"
                size="small"
              />
              <Button 
                icon={<FullscreenOutlined />} 
                onClick={() => setIsFullscreen(!isFullscreen)}
                title="全屏模式"
                size="small"
              />
            </Space.Compact>
          </div>
        </div>
      </Card>

      {/* 编辑器主体 */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        height: isFullscreen ? 'calc(100vh - 240px)' : '600px',
        marginBottom: '20px'
      }}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div style={{ 
            flex: viewMode === 'split' ? 1 : 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Card 
              title={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>编辑器</span>}
              style={{ 
                height: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)'
              }}
              bodyStyle={{ 
                padding: '16px',
                height: 'calc(100% - 57px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <TextArea
                id="markdown-textarea"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="在这里输入 Markdown 内容...\n\n支持的语法：\n# 标题\n**粗体** *斜体*\n- 列表项\n[链接](url)\n![图片](url)\n\`代码\`\n\n```\n代码块\n```"
                style={{ 
                  flex: 1,
                  resize: 'none',
                  fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              />
            </Card>
          </div>
        )}
        
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div style={{ 
            flex: viewMode === 'split' ? 1 : 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Card 
              title={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>预览</span>}
              style={{ 
                height: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)'
              }}
              bodyStyle={{ 
                padding: 0,
                height: 'calc(100% - 57px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div 
                className="markdown-preview"
                style={{ 
                  flex: 1,
                  overflow: 'auto',
                  padding: '24px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  borderRadius: '0 0 12px 12px',
                  lineHeight: '1.7'
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </Card>
          </div>
        )}
      </div>
      
      {/* 状态栏 */}
      <Card style={{ 
        background: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>字符数: <strong style={{ color: 'var(--text-primary)' }}>{markdown.length}</strong></span>
            <span>行数: <strong style={{ color: 'var(--text-primary)' }}>{markdown.split('\n').length}</strong></span>
            <span>字数: <strong style={{ color: 'var(--text-primary)' }}>{markdown.replace(/\s+/g, '').length}</strong></span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '4px 12px',
            background: 'var(--bg-tertiary)',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: viewMode === 'edit' ? '#52c41a' : viewMode === 'split' ? '#1890ff' : '#722ed1'
            }}></span>
            {viewMode === 'edit' ? '编辑模式' : viewMode === 'split' ? '分屏模式' : '预览模式'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MarkdownEditor;