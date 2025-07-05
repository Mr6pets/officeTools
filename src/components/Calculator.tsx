import React, { useState } from 'react';
import { Card, Input, Button, Space, Tabs, Select, Typography, Row, Col } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;

const Calculator: React.FC = () => {
  return (
    <Tabs defaultActiveKey="unit">
      <TabPane tab="单位转换" key="unit">
        <UnitConverter />
      </TabPane>
      <TabPane tab="个税计算" key="tax">
        <TaxCalculator />
      </TabPane>
      <TabPane tab="房贷计算" key="loan">
        <LoanCalculator />
      </TabPane>
    </Tabs>
  );
};

const UnitConverter: React.FC = () => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [result, setResult] = useState('');
  const [category, setCategory] = useState('length');

  const units = {
    length: {
      m: { name: '米', factor: 1 },
      cm: { name: '厘米', factor: 100 },
      mm: { name: '毫米', factor: 1000 },
      km: { name: '千米', factor: 0.001 },
      inch: { name: '英寸', factor: 39.3701 },
      ft: { name: '英尺', factor: 3.28084 }
    },
    weight: {
      kg: { name: '千克', factor: 1 },
      g: { name: '克', factor: 1000 },
      lb: { name: '磅', factor: 2.20462 },
      oz: { name: '盎司', factor: 35.274 }
    },
    temperature: {
      c: { name: '摄氏度', factor: 1 },
      f: { name: '华氏度', factor: 1 },
      k: { name: '开尔文', factor: 1 }
    }
  };

  const convert = () => {
    const inputValue = parseFloat(value);
    if (isNaN(inputValue)) {
      setResult('请输入有效数字');
      return;
    }

    const currentUnits = units[category as keyof typeof units];
    
    if (category === 'temperature') {
      // 温度转换需要特殊处理
      let celsius = inputValue;
      if (fromUnit === 'f') celsius = (inputValue - 32) * 5/9;
      if (fromUnit === 'k') celsius = inputValue - 273.15;
      
      let resultValue = celsius;
      if (toUnit === 'f') resultValue = celsius * 9/5 + 32;
      if (toUnit === 'k') resultValue = celsius + 273.15;
      
      setResult(resultValue.toFixed(2));
    } else {
      // 其他单位转换
      const fromFactor = currentUnits[fromUnit as keyof typeof currentUnits]?.factor || 1;
      const toFactor = currentUnits[toUnit as keyof typeof currentUnits]?.factor || 1;
      const resultValue = inputValue * toFactor / fromFactor;
      setResult(resultValue.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const currentUnits = units[category as keyof typeof units];

  return (
    <Card title="单位转换">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text>转换类型:</Text>
          <Select 
            value={category} 
            onChange={(val) => {
              setCategory(val);
              setFromUnit(Object.keys(units[val as keyof typeof units])[0]);
              setToUnit(Object.keys(units[val as keyof typeof units])[1]);
            }}
            style={{ width: 120, marginLeft: 8 }}
          >
            <Option value="length">长度</Option>
            <Option value="weight">重量</Option>
            <Option value="temperature">温度</Option>
          </Select>
        </div>
        
        <Row gutter={16}>
          <Col span={8}>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="输入数值"
              type="number"
            />
          </Col>
          <Col span={6}>
            <Select value={fromUnit} onChange={setFromUnit} style={{ width: '100%' }}>
              {Object.entries(currentUnits).map(([key, unit]) => (
                <Option key={key} value={key}>{unit.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={2} style={{ textAlign: 'center', lineHeight: '32px' }}>
            →
          </Col>
          <Col span={6}>
            <Select value={toUnit} onChange={setToUnit} style={{ width: '100%' }}>
              {Object.entries(currentUnits).map(([key, unit]) => (
                <Option key={key} value={key}>{unit.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={convert} icon={<CalculatorOutlined />} />
          </Col>
        </Row>
        
        {result && (
          <div style={{ padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
            <Text strong>转换结果: {result} {currentUnits[toUnit as keyof typeof currentUnits]?.name}</Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

const TaxCalculator: React.FC = () => {
  const [salary, setSalary] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateTax = () => {
    const monthlySalary = parseFloat(salary);
    if (isNaN(monthlySalary) || monthlySalary <= 0) {
      return;
    }

    const annualSalary = monthlySalary * 12;
    const threshold = 60000; // 起征点
    const taxableIncome = Math.max(0, annualSalary - threshold);
    
    // 个税税率表
    const taxBrackets = [
      { min: 0, max: 36000, rate: 0.03, deduction: 0 },
      { min: 36000, max: 144000, rate: 0.1, deduction: 2520 },
      { min: 144000, max: 300000, rate: 0.2, deduction: 16920 },
      { min: 300000, max: 420000, rate: 0.25, deduction: 31920 },
      { min: 420000, max: 660000, rate: 0.3, deduction: 52920 },
      { min: 660000, max: 960000, rate: 0.35, deduction: 85920 },
      { min: 960000, max: Infinity, rate: 0.45, deduction: 181920 }
    ];
    
    let annualTax = 0;
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        annualTax = taxableIncome * bracket.rate - bracket.deduction;
        break;
      }
    }
    
    const monthlyTax = annualTax / 12;
    const afterTaxSalary = monthlySalary - monthlyTax;
    
    setResult({
      monthlySalary,
      annualSalary,
      taxableIncome,
      annualTax,
      monthlyTax,
      afterTaxSalary
    });
  };

  return (
    <Card title="个人所得税计算">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text>月薪 (元):</Text>
          <Input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="输入月薪"
            type="number"
            style={{ width: 200, marginLeft: 8 }}
          />
          <Button type="primary" onClick={calculateTax} style={{ marginLeft: 8 }}>
            计算
          </Button>
        </div>
        
        {result && (
          <div style={{ padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
            <Row gutter={[16, 8]}>
              <Col span={12}><Text>月薪: ¥{result.monthlySalary.toFixed(2)}</Text></Col>
              <Col span={12}><Text>年薪: ¥{result.annualSalary.toFixed(2)}</Text></Col>
              <Col span={12}><Text>应纳税所得额: ¥{result.taxableIncome.toFixed(2)}</Text></Col>
              <Col span={12}><Text>年度个税: ¥{result.annualTax.toFixed(2)}</Text></Col>
              <Col span={12}><Text strong type="danger">月度个税: ¥{result.monthlyTax.toFixed(2)}</Text></Col>
              <Col span={12}><Text strong type="success">税后月薪: ¥{result.afterTaxSalary.toFixed(2)}</Text></Col>
            </Row>
          </div>
        )}
      </Space>
    </Card>
  );
};

const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateLoan = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12; // 月利率
    const n = parseFloat(years) * 12; // 总月数
    
    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
      return;
    }
    
    // 等额本息计算
    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;
    
    setResult({
      principal: p,
      monthlyPayment,
      totalPayment,
      totalInterest
    });
  };

  return (
    <Card title="房贷计算器">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Text>贷款金额 (万元):</Text>
            <Input
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="如: 100"
              type="number"
              style={{ marginTop: 4 }}
            />
          </Col>
          <Col span={8}>
            <Text>年利率 (%):</Text>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="如: 4.9"
              type="number"
              step="0.1"
              style={{ marginTop: 4 }}
            />
          </Col>
          <Col span={8}>
            <Text>贷款年限:</Text>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="如: 30"
              type="number"
              style={{ marginTop: 4 }}
            />
          </Col>
        </Row>
        
        <Button type="primary" onClick={calculateLoan} block>
          计算房贷
        </Button>
        
        {result && (
          <div style={{ padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
            <Row gutter={[16, 8]}>
              <Col span={12}><Text>贷款本金: ¥{(result.principal * 10000).toLocaleString()}</Text></Col>
              <Col span={12}><Text strong type="danger">月供: ¥{result.monthlyPayment.toFixed(2)}</Text></Col>
              <Col span={12}><Text>还款总额: ¥{result.totalPayment.toFixed(2)}</Text></Col>
              <Col span={12}><Text>利息总额: ¥{result.totalInterest.toFixed(2)}</Text></Col>
            </Row>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default Calculator;