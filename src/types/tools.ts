import React from 'react';

export interface ToolConfig {
  id: string;
  name: string;
  icon: string;
  category: 'document' | 'image' | 'text' | 'utility' | 'calculator' | 'generator';
  description: string;
  component: React.ComponentType;
}

export interface ToolCategory {
  key: string;
  name: string;
  icon: string;
  tools: ToolConfig[];
}

export interface FileItem {
  uid: string;
  name: string;
  size: number;
  file: File;
}

export interface ImageProcessResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface QRCodeResult {
  text: string;
  format: string;
  timestamp: number;
}

export interface CalculatorHistory {
  expression: string;
  result: number;
  timestamp: number;
}

export interface GeneratedData {
  type: 'password' | 'uuid' | 'random' | 'fake';
  value: string;
  options?: Record<string, any>;
}

export interface TextProcessResult {
  original: string;
  processed: string;
  stats?: {
    characters: number;
    words: number;
    lines: number;
  };
}

## 📄 文档处理类

### 1. PDF工具集
- **PDF合并**: 将多个PDF文件合并为一个
- **PDF分割**: 将PDF按页数或书签分割
- **PDF转图片**: 将PDF页面转换为JPG/PNG
- **PDF加密/解密**: 为PDF添加密码保护
- **PDF水印**: 添加文字或图片水印

### 2. 文档格式转换
- **Markdown转HTML**: 支持实时预览
- **HTML转PDF**: 网页内容转PDF
- **CSV转Excel**: 数据格式转换
- **JSON格式化**: 美化和压缩JSON

## 🖼️ 图片处理类

### 3. 图片编辑工具
- **图片压缩**: 批量压缩图片大小
- **格式转换**: JPG/PNG/WebP互转
- **尺寸调整**: 批量修改图片尺寸
- **添加水印**: 文字或图片水印
- **图片拼接**: 多张图片合并

### 4. 图片优化
- **背景移除**: AI去除图片背景
- **图片增强**: 提高清晰度和对比度
- **二维码生成**: 文字转二维码
- **二维码识别**: 扫描二维码内容

## 🔧 实用工具类

### 5. 文本处理
- **文本对比**: 两个文本的差异对比
- **正则表达式测试**: 在线正则匹配
- **文本统计**: 字数、行数、词频统计
- **编码转换**: Base64、URL编码等
- **文本加密**: MD5、SHA256等哈希

### 6. 数据处理
- **Excel预览**: 在线查看Excel内容
- **数据可视化**: 简单图表生成
- **时间戳转换**: Unix时间戳转换
- **颜色工具**: 颜色代码转换

### 7. 网络工具
- **URL短链生成**: 长链接转短链接
- **IP地址查询**: 获取IP位置信息
- **域名检测**: 检查域名状态
- **网页截图**: 输入URL生成截图

## 📊 办公效率类

### 8. 计算工具
- **单位转换**: 长度、重量、温度等
- **汇率计算**: 实时汇率转换
- **个税计算**: 个人所得税计算器
- **房贷计算**: 贷款利息计算

### 9. 生成工具
- **密码生成**: 安全密码生成器
- **随机数生成**: 各种随机数据
- **UUID生成**: 唯一标识符生成
- **假数据生成**: 测试用假数据

## 🎨 创意工具类

### 10. 设计辅助
- **Logo生成**: 简单Logo制作
- **配色方案**: 颜色搭配建议
- **字体预览**: 不同字体效果
- **图标库**: 常用图标下载

## 实现建议

### 优先级排序（推荐实现顺序）

**第一阶段（核心扩展）**:
1. 图片压缩和格式转换
2. PDF基础操作（合并、分割）
3. 文本处理工具
4. 二维码生成/识别

**第二阶段（实用工具）**:
1. 单位转换计算器
2. 密码生成器
3. 编码转换工具
4. JSON格式化

**第三阶段（高级功能）**:
1. 背景移除（需要AI服务）
2. 网页截图
3. 数据可视化
4. 实时汇率查询

### 技术实现要点
```typescript
import React from 'react';

export interface ToolConfig {
  id: string;
  name: string;
  icon: string;
  category: 'document' | 'image' | 'text' | 'utility' | 'calculator' | 'generator';
  description: string;
  component: React.ComponentType;
}

export interface ToolCategory {
  key: string;
  name: string;
  icon: string;
  tools: ToolConfig[];
}

export interface FileItem {
  uid: string;
  name: string;
  size: number;
  file: File;
}

export interface ImageProcessResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface QRCodeResult {
  text: string;
  format: string;
  timestamp: number;
}

export interface CalculatorHistory {
  expression: string;
  result: number;
  timestamp: number;
}

export interface GeneratedData {
  type: 'password' | 'uuid' | 'random' | 'fake';
  value: string;
  options?: Record<string, any>;
}

export interface TextProcessResult {
  original: string;
  processed: string;
  stats?: {
    characters: number;
    words: number;
    lines: number;
  };
}

## 📄 文档处理类

### 1. PDF工具集
- **PDF合并**: 将多个PDF文件合并为一个
- **PDF分割**: 将PDF按页数或书签分割
- **PDF转图片**: 将PDF页面转换为JPG/PNG
- **PDF加密/解密**: 为PDF添加密码保护
- **PDF水印**: 添加文字或图片水印

### 2. 文档格式转换
- **Markdown转HTML**: 支持实时预览
- **HTML转PDF**: 网页内容转PDF
- **CSV转Excel**: 数据格式转换
- **JSON格式化**: 美化和压缩JSON

## 🖼️ 图片处理类

### 3. 图片编辑工具
- **图片压缩**: 批量压缩图片大小
- **格式转换**: JPG/PNG/WebP互转
- **尺寸调整**: 批量修改图片尺寸
- **添加水印**: 文字或图片水印
- **图片拼接**: 多张图片合并

### 4. 图片优化
- **背景移除**: AI去除图片背景
- **图片增强**: 提高清晰度和对比度
- **二维码生成**: 文字转二维码
- **二维码识别**: 扫描二维码内容

## 🔧 实用工具类

### 5. 文本处理
- **文本对比**: 两个文本的差异对比
- **正则表达式测试**: 在线正则匹配
- **文本统计**: 字数、行数、词频统计
- **编码转换**: Base64、URL编码等
- **文本加密**: MD5、SHA256等哈希

### 6. 数据处理
- **Excel预览**: 在线查看Excel内容
- **数据可视化**: 简单图表生成
- **时间戳转换**: Unix时间戳转换
- **颜色工具**: 颜色代码转换

### 7. 网络工具
- **URL短链生成**: 长链接转短链接
- **IP地址查询**: 获取IP位置信息
- **域名检测**: 检查域名状态
- **网页截图**: 输入URL生成截图

## 📊 办公效率类

### 8. 计算工具
- **单位转换**: 长度、重量、温度等
- **汇率计算**: 实时汇率转换
- **个税计算**: 个人所得税计算器
- **房贷计算**: 贷款利息计算

### 9. 生成工具
- **密码生成**: 安全密码生成器
- **随机数生成**: 各种随机数据
- **UUID生成**: 唯一标识符生成
- **假数据生成**: 测试用假数据

## 🎨 创意工具类

### 10. 设计辅助
- **Logo生成**: 简单Logo制作
- **配色方案**: 颜色搭配建议
- **字体预览**: 不同字体效果
- **图标库**: 常用图标下载

## 实现建议

### 优先级排序（推荐实现顺序）

**第一阶段（核心扩展）**:
1. 图片压缩和格式转换
2. PDF基础操作（合并、分割）
3. 文本处理工具
4. 二维码生成/识别

**第二阶段（实用工具）**:
1. 单位转换计算器
2. 密码生成器
3. 编码转换工具
4. JSON格式化

**第三阶段（高级功能）**:
1. 背景移除（需要AI服务）
2. 网页截图
3. 数据可视化
4. 实时汇率查询

### 技术实现要点