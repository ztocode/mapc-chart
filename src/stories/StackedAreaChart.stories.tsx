import type { Meta, StoryObj } from '@storybook/react';
import { StackedAreaChart } from '../components/StackedAreaChart/StackedAreaChart';

const meta: Meta<typeof StackedAreaChart> = {
  title: 'Charts/StackedAreaChart',
  component: StackedAreaChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StackedAreaChart>;

const sampleData = [
  {
    x: 1,
    values: [
      { category: 'Category A', value: 10 },
      { category: 'Category B', value: 20 },
      { category: 'Category C', value: 15 },
    ],
  },
  {
    x: 2,
    values: [
      { category: 'Category A', value: 15 },
      { category: 'Category B', value: 25 },
      { category: 'Category C', value: 20 },
    ],
  },
  {
    x: 3,
    values: [
      { category: 'Category A', value: 20 },
      { category: 'Category B', value: 30 },
      { category: 'Category C', value: 25 },
    ],
  },
  {
    x: 4,
    values: [
      { category: 'Category A', value: 25 },
      { category: 'Category B', value: 35 },
      { category: 'Category C', value: 30 },
    ],
  },
  {
    x: 5,
    values: [
      { category: 'Category A', value: 30 },
      { category: 'Category B', value: 40 },
      { category: 'Category C', value: 35 },
    ],
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    title: 'Sample Stacked Area Chart',
    ariaLabel: 'Sample Stacked Area Chart',
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    colors: ['#2196f3', '#4caf50', '#f44336'],
    title: 'Stacked Area Chart with Custom Colors',
    ariaLabel: 'Stacked Area Chart with Custom Colors',
  },
};

export const WithAxisLabels: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    title: 'Stacked Area Chart with Axis Labels',
    xAxisLabel: 'Time',
    yAxisLabel: 'Value',
    ariaLabel: 'Stacked Area Chart with Axis Labels',
  },
};

export const CustomSize: Story = {
  args: {
    data: sampleData,
    width: 800,
    height: 500,
    title: 'Large Stacked Area Chart',
    ariaLabel: 'Large Stacked Area Chart',
  },
}; 