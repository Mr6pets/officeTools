import { ToolCategory } from '../types/tools';
import FileCompressor from '../components/FileCompressor';
import ImageOCR from '../components/ImageOCR';
import ImageCompressor from '../components/ImageCompressor';
import PDFTools from '../components/PDFTools';
import TextTools from '../components/TextTools';
import QRCodeTools from '../components/QRCodeTools';
import Calculator from '../components/Calculator';
import Generator from '../components/Generator';

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