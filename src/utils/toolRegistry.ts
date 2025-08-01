import { ToolCategory } from '../types/tools';
import FileCompressor from '../components/FileCompressor';
import FileConverter from '../components/FileConverter';
import ImageOCR from '../components/ImageOCR';
import ImageCompressor from '../components/ImageCompressor';
import ImageEditor from '../components/ImageEditor';
import PDFTools from '../components/PDFTools';
import TextTools from '../components/TextTools';
import QRCodeTools from '../components/QRCodeTools';
import CryptoTools from '../components/CryptoTools';
import ColorConverter from '../components/ColorConverter';
import Generator from '../components/Generator';
import JSONFormatter from '../components/JSONFormatter';
import NetworkTools from '../components/NetworkTools';
import RegexTester from '../components/RegexTester';
import TimestampConverter from '../components/TimestampConverter';
import MarkdownEditor from '../components/MarkdownEditor';
import CodeFormatter from '../components/CodeFormatter';
import TextDiff from '../components/TextDiff';

export const toolCategories: ToolCategory[] = [
  {
    key: 'file',
    name: '文件处理',
    icon: 'FileOutlined',
    tools: [
      {
        id: 'compress',
        name: '文件压缩',
        icon: 'FileZipOutlined',
        category: 'document',
        description: '批量压缩文件为ZIP格式',
        component: FileCompressor
      },
      {
        id: 'convert',
        name: '格式转换',
        icon: 'SwapOutlined',
        category: 'document',
        description: '文档、图片、数据文件格式互转',
        component: FileConverter
      },
      {
        id: 'pdf',
        name: 'PDF工具',
        icon: 'FilePdfOutlined',
        category: 'document',
        description: 'PDF合并、分割、转换等操作',
        component: PDFTools
      }
    ]
  },
  {
    key: 'image',
    name: '图片工具',
    icon: 'PictureOutlined',
    tools: [
      {
        id: 'ocr',
        name: '图片识字',
        icon: 'FileImageOutlined',
        category: 'image',
        description: '提取图片中的文字内容',
        component: ImageOCR
      },
      {
        id: 'imageCompress',
        name: '图片压缩',
        icon: 'CompressOutlined',
        category: 'image',
        description: '压缩图片大小，支持批量处理',
        component: ImageCompressor
      },
      {
        id: 'imageEditor',
        name: '图片编辑器',
        icon: 'EditOutlined',
        category: 'image',
        description: '图片滤镜、旋转、裁剪、文字添加等编辑功能',
        component: ImageEditor
      },
      {
        id: 'qrcode',
        name: '二维码工具',
        icon: 'QrcodeOutlined',
        category: 'utility',
        description: '生成和识别二维码',
        component: QRCodeTools
      }
    ]
  },
  {
    key: 'text',
    name: '文本工具',
    icon: 'EditOutlined',
    tools: [
      {
        id: 'textTools',
        name: '文本处理',
        icon: 'FontSizeOutlined',
        category: 'text',
        description: '文本格式化、编码转换、统计等',
        component: TextTools
      },
      {
        id: 'jsonFormatter',
        name: 'JSON格式化',
        icon: 'CodeOutlined',
        category: 'text',
        description: 'JSON格式化、压缩、验证和统计分析',
        component: JSONFormatter
      },
      {
        id: 'regexTester',
        name: '正则表达式测试器',
        icon: 'BugOutlined',
        category: 'text',
        description: '正则表达式测试、匹配、替换和语法验证',
        component: RegexTester
      },
      {
        id: 'timestamp-converter',
        name: '时间戳转换',
        description: '时间戳与日期时间的双向转换工具',
        icon: '🕐',
        category: '开发工具',
        component: TimestampConverter,
        keywords: ['时间戳', '日期', '转换', '时间', 'timestamp', 'datetime']
      },
      {
        id: 'markdown-editor',
        name: 'Markdown编辑器',
        description: '实时预览的Markdown编辑工具',
        icon: '📝',
        category: '文本工具',
        component: MarkdownEditor,
        keywords: ['markdown', '编辑器', '预览', '文档', 'md']
      },
      {
        id: 'code-formatter',
        name: '代码格式化工具',
        description: '支持多种编程语言的代码格式化',
        icon: '🎨',
        category: '开发工具',
        component: CodeFormatter,
        keywords: ['代码', '格式化', '美化', 'prettier', 'javascript', 'css']
      },
      {
        id: 'text-diff',
        name: '文本差异对比',
        description: '文本内容对比和差异显示工具',
        icon: '🔍',
        category: '文本工具',
        component: TextDiff,
        keywords: ['差异', '对比', '文本', 'diff', '比较']
      },
    ]
  },
  {
    key: 'network',
    name: '网络工具',
    icon: 'GlobalOutlined',
    tools: [
      {
        id: 'networkTools',
        name: '网络工具集',
        icon: 'WifiOutlined',
        category: 'network',
        description: 'URL编码、Base64编码、IP查询、端口检测、Hash计算',
        component: NetworkTools
      }
    ]
  },
  {
    key: 'calculator',
    name: '计算工具',
    icon: 'CalculatorOutlined',
    tools: [
      {
        id: 'calculator',
        name: '多功能计算器',
        icon: 'CalculatorOutlined',
        category: 'calculator',
        description: '单位转换、汇率计算、个税计算等',
        component: Calculator
      }
    ]
  },
  {
    key: 'generator',
    name: '生成工具',
    icon: 'ThunderboltOutlined',
    tools: [
      {
        id: 'generator',
        name: '数据生成器',
        icon: 'ThunderboltOutlined',
        category: 'generator',
        description: '密码生成、UUID生成、随机数据等',
        component: Generator
      }
    ]
  }
];

// 获取所有工具的扁平化列表
export const getAllTools = () => {
  return toolCategories.flatMap(category => category.tools);
};

// 根据ID查找工具
export const getToolById = (id: string) => {
  return getAllTools().find(tool => tool.id === id);
};

// 根据分类查找工具
export const getToolsByCategory = (category: string) => {
  return getAllTools().filter(tool => tool.category === category);
};

  {
    id: 'crypto-tools',
    name: '加密解密工具',
    description: '支持AES、DES、Base64等多种加密算法',
    icon: '🔐',
    category: '安全工具',
    component: CryptoTools,
    keywords: ['加密', '解密', 'AES', 'DES', 'Base64', 'MD5', 'SHA', '哈希']
  },
  {
    id: 'color-converter',
    name: '颜色转换工具',
    description: 'RGB、HEX、HSL等颜色格式转换',
    icon: '🎨',
    category: '设计工具',
    component: ColorConverter,
    keywords: ['颜色', '转换', 'RGB', 'HEX', 'HSL', 'HSV', 'CMYK']
  },