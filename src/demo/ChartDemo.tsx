import React from 'react';
import { StackedBarChart } from '../components/StackedBarChart/StackedBarChart';
import { PieChart } from '../components/PieChart/PieChart';
import { LineChart } from '../components/LineChart/LineChart';
import { StackedAreaChart } from '../components/StackedAreaChart/StackedAreaChart';

const sampleData = [
  {
    label: 'Q1',
    values: [
      { category: 'Revenue', value: 10000 },
      { category: 'Expenses', value: 60000 },
      { category: 'Profit', value: 40000   },
    ],
  },
  {
    label: 'Q2',
    values: [
      { category: 'Revenue', value: 120000 },
      { category: 'Expenses', value: 70000 },
      { category: 'Profit', value: 50000 },
    ],
  },
  {
    label: 'Q3',
    values: [
      { category: 'Revenue', value: 150000 },
      { category: 'Expenses', value: 80000 },
      { category: 'Profit', value: 70000 },
    ],
  },
  {
    label: 'Q4',
    values: [
      { category: 'Revenue', value: 180000 },
      { category: 'Expenses', value: 90000 },
      { category: 'Profit', value: 90000 },
    ],
  },
];

const pieChartData = [
  { label: 'Revenue', value: 550000 },
  { label: 'Expenses', value: 3000000 },
  { label: 'Profit', value: 25000000 },
];

const lineChartData = [
  {
    name: 'Single Series',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 15 },
      { x: 3, y: 30 },
      { x: 4, y: 20 },
      { x: 5, y: 35 },
      { x: 6, y: 25 },
      { x: 7, y: 40 },
      { x: 8, y: 30 },
      { x: 9, y: 45 },
    ],
  },
];

const straightLineData = [
  {
    name: 'Straight Line',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 30 },
      { x: 3, y: 40 },
      { x: 4, y: 50 },
      { x: 5, y: 60 },
      { x: 6, y: 70 },
      { x: 7, y: 80 },
      { x: 8, y: 90 },
      { x: 9, y: 100 },
    ],
  },
];

const stackedAreaData = [
  {
    x: 0,
    values: [
      { category: 'Category A', value: 10 },
      { category: 'Category B', value: 20 },
      { category: 'Category C', value: 15 },
    ],
  },
  {
    x: 1,
    values: [
      { category: 'Category A', value: 15 },
      { category: 'Category B', value: 25 },
      { category: 'Category C', value: 20 },
    ],
  },
  {
    x: 2,
    values: [
      { category: 'Category A', value: 20 },
      { category: 'Category B', value: 30 },
      { category: 'Category C', value: 25 },
    ],
  },
  {
    x: 3,
    values: [
      { category: 'Category A', value: 25 },
      { category: 'Category B', value: 35 },
      { category: 'Category C', value: 30 },
    ],
  },
  {
    x: 4,
    values: [
      { category: 'Category A', value: 30 },
      { category: 'Category B', value: 40 },
      { category: 'Category C', value: 35 },
    ],
  },
];

const multiLineChartData = [
  {
    name: 'Series A',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 15 },
      { x: 3, y: 30 },
      { x: 4, y: 20 },
    ],
  },
  {
    name: 'Series B',
    data: [
      { x: 0, y: 15 },
      { x: 1, y: 20 },
      { x: 2, y: 25 },
      { x: 3, y: 20 },
      { x: 4, y: 30 },
    ],
  },
  {
    name: 'Series C',
    data: [
      { x: 0, y: 20 },
      { x: 1, y: 15 },
      { x: 2, y: 30 },
      { x: 3, y: 25 },
      { x: 4, y: 35 },
    ],
  },
];

export const ChartDemo: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Chart Library Demo</h1>
      
      <div style={{ marginBottom: '60px' }}>
        <h2>Pie Chart</h2>
        <PieChart
          data={pieChartData}
          width={800}
          height={480}
          colors={['#4CAF50', '#F44336', '#2196F3']}
          title="Financial Distribution"
          showTooltip={true}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Pie Chart with Pastel Colors</h2>
        <PieChart
          data={pieChartData}
          width={800}
          height={480}
          colorScheme="schemePastel1"
          title="Financial Distribution (Pastel)"
          showTooltip={true}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Pie Chart with Dark Colors</h2>
        <PieChart
          data={pieChartData}
          width={800}
          height={480}
          colorScheme="schemeDark2"
          title="Financial Distribution (Dark)"
          showTooltip={true}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Line Chart</h2>
        <LineChart
          data={lineChartData}
          width={800}
          height={480}
          colors={['#2196F3']}
          title="Sample Line Chart"
          showPoints={true}
          showArea={false}
          showTooltip={true}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Line Chart with Area</h2>
        <LineChart
          data={lineChartData}
          width={800}
          height={480}
          colors={['#4CAF50']}
          title="Line Chart with Area Fill"
          showPoints={true}
          showArea={true}
          showTooltip={true}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Line Chart without Points</h2>
        <LineChart
          data={lineChartData}
          width={800}
          height={480}
          colors={['#F44336']}
          title="Line Chart without Data Points"
          showPoints={false}
          showArea={false}
          showTooltip={true}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Straight Line Chart</h2>
        <LineChart
          data={straightLineData}
          width={800}
          height={480}
          colors={['#9C27B0']}
          title="Straight Line Chart"
          showPoints={true}
          showArea={false}
          showTooltip={true}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Vertical Stacked Bar Chart</h2>
        <StackedBarChart
          data={sampleData}
          title="Vertical Orientation"
          width={800}
          height={480}
          orientation="vertical"
          xAxisLabel="Quarter"
          yAxisLabel="Amount"
          
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Horizontal Stacked Bar Chart</h2>
        <StackedBarChart
          data={sampleData}
          title="Horizontal Orientation"
          width={800}
          height={600}
          orientation="horizontal"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Custom Colors</h2>
        <StackedBarChart
          data={sampleData}
          colors={['#4CAF50', '#F44336', '#2196F3']}
          title="Custom Colors Example"
          width={800}
          height={600}
          orientation="vertical"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Pastel Color Scheme</h2>
        <StackedBarChart
          data={sampleData}
          colorScheme="schemePastel1"
          title="Pastel Color Scheme"
          width={800}
          height={480}
          orientation="vertical"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Dark Color Scheme</h2>
        <StackedBarChart
          data={sampleData}
          colorScheme="schemeDark2"
          title="Dark Color Scheme"
          width={800}
          height={600}
          orientation="vertical"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Paired Color Scheme</h2>
        <StackedBarChart
          data={sampleData}
          colorScheme="schemePaired"
          title="Paired Color Scheme"
          width={800}
          height={600}
          orientation="vertical"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Stacked Area Chart</h2>
        <StackedAreaChart
          data={stackedAreaData}
          width={800}
          height={480}
          colors={['#4CAF50', '#F44336', '#2196F3']}
          title="Stacked Area Chart Example"
          xAxisLabel="Time"
          yAxisLabel="Value"
          showTooltip={true}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Stacked Area Chart with Pastel Colors</h2>
        <StackedAreaChart
          data={stackedAreaData}
          width={800}
          height={480}
          colorScheme="schemePastel1"
          title="Stacked Area Chart (Pastel)"
          xAxisLabel="Time"
          yAxisLabel="Value"
          showTooltip={true}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Stacked Area Chart with Dark Colors</h2>
        <StackedAreaChart
          data={stackedAreaData}
          width={800}
          height={480}
          colorScheme="schemeDark2"
          title="Stacked Area Chart (Dark)"
          xAxisLabel="Time"
          yAxisLabel="Value"
          showTooltip={true}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Multi-Line Chart</h2>
        <LineChart
          data={multiLineChartData}
          width={800}
          height={480}
          colors={['#4CAF50', '#F44336', '#2196F3']}
          title="Multi-Line Chart Example"
          showPoints={true}
          showArea={false}
          showTooltip={true}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Multi-Line Chart with Area</h2>
        <LineChart
          data={multiLineChartData}
          width={800}
          height={480}
          colorScheme="schemePastel1"
          title="Multi-Line Chart with Area Fill"
          showPoints={true}
          showArea={true}
          showTooltip={true}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>Multi-Line Chart without Points</h2>
        <LineChart
          data={multiLineChartData}
          width={800}
          height={480}
          colorScheme="schemeDark2"
          title="Multi-Line Chart without Data Points"
          showPoints={false}
          showArea={false}
          showTooltip={true}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        />
      </div>
    </div>
  );
}; 