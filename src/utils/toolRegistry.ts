import { ToolCategory } from '../types/tools';
import FileCompressor from '../components/FileCompressor';
import FileConverter from '../components/FileConverter';
import ImageOCR from '../components/ImageOCR';
import ImageCompressor from '../components/ImageCompressor';
import ImageEditor from '../components/ImageEditor';
import PDFTools from '../components/PDFTools';
import QRCodeTools from '../components/QRCodeTools';
import CryptoTools from '../components/CryptoTools';
import ColorConverter from '../components/ColorConverter';
import Generator from '../components/Generator';
import Calculator from '../components/Calculator';
import NetworkTools from '../components/NetworkTools';
import RegexTester from '../components/RegexTester';
import MarkdownEditor from '../components/MarkdownEditor';
import CodeFormatter from '../components/CodeFormatter';
import TextDiff from '../components/TextDiff';

// 在相应的工具分类中添加Generator和Calculator
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
    key: 'utility',
    name: '实用工具',
    icon: 'tool',
    tools: [
      {
        id: 'generator',
        name: '生成器',
        description: '生成密码、UUID、随机数等',
        icon: 'tool',
        category: 'generator',
        component: Generator,
        keywords: ['生成', '密码', 'UUID', '随机']
      },
      {
        id: 'calculator',
        name: '计算器',
        description: '科学计算器',
        icon: 'calculator',
        category: 'calculator',
        component: Calculator,
        keywords: ['计算', '数学', '科学']
      }
    ]
  },
  {
    key: 'development',
    name: '开发工具',
    icon: 'code',
    tools: [
      {
        id: 'code-formatter',
        name: '代码格式化',
        description: '格式化和美化各种编程语言的代码',
        icon: 'code',
        category: 'development',
        component: CodeFormatter,
        keywords: ['代码', '格式化', '美化', 'prettier', 'format']
      },
      {
        id: 'regex-tester',
        name: '正则表达式测试',
        description: '测试和验证正则表达式',
        icon: 'code',
        category: 'development',
        component: RegexTester,
        keywords: ['正则', '表达式', '测试', 'regex']
      }
    ]
  },
  {
    key: 'text',
    name: '文本工具',
    icon: 'file-text',
    tools: [
      {
        id: 'text-diff',
        name: '文本对比',
        description: '对比两个文本的差异，支持逐行对比',
        icon: 'diff',
        category: 'text',
        component: TextDiff,
        keywords: ['文本', '对比', '差异', 'diff']
      },
      {
        id: 'markdown-editor',
        name: 'Markdown编辑器',
        description: '实时预览的Markdown编辑器',
        icon: 'edit',
        category: 'text',
        component: MarkdownEditor,
        keywords: ['markdown', '编辑器', '预览']
      }
    ]
  },
  {
    key: 'network',
    name: '网络工具',
    icon: 'global',
    tools: [
      {
        id: 'network-tools',
        name: '网络工具',
        description: 'URL编码、Base64编码、IP查询等网络相关工具',
        icon: 'global',
        category: 'network',
        component: NetworkTools,
        keywords: ['网络', 'URL', 'Base64', 'IP', '编码']
      }
    ]
  },
  {
    key: 'security',
    name: '安全工具',
    icon: 'safety',
    tools: [
      {
        id: 'crypto-tools',
        name: '加密工具',
        description: 'MD5、SHA、AES等加密解密工具',
        icon: 'safety',
        category: 'security',
        component: CryptoTools,
        keywords: ['加密', '解密', 'MD5', 'SHA', 'AES']
      }
    ]
  },
  {
    key: 'design',
    name: '设计工具',
    icon: 'bg-colors',
    tools: [
      {
        id: 'color-converter',
        name: '颜色转换',
        description: '在不同颜色格式之间转换',
        icon: 'bg-colors',
        category: 'design',
        component: ColorConverter,
        keywords: ['颜色', '转换', 'RGB', 'HEX', 'HSL']
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