import type { Meta, StoryObj } from '@storybook/react';
import { PieChart } from '../components/PieChart/PieChart';

const meta: Meta<typeof PieChart> = {
  title: 'Charts/PieChart',
  component: PieChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PieChart>;

const sampleData = [
  { label: 'Category A', value: 30 },
  { label: 'Category B', value: 45 },
  { label: 'Category C', value: 25 },
  { label: 'Category D', value: 60 },
  { label: 'Category E', value: 35 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    title: 'Sample Pie Chart',
    ariaLabel: 'Sample Pie Chart',
  },
};

export const DonutChart: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    innerRadius: 100,
    title: 'Donut Chart',
    ariaLabel: 'Donut Chart',
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    colors: ['#2196f3', '#4caf50', '#f44336', '#ff9800', '#9c27b0'],
    title: 'Pie Chart with Custom Colors',
    ariaLabel: 'Pie Chart with Custom Colors',
  },
};

export const NoLegend: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    showLegend: false,
    title: 'Pie Chart without Legend',
    ariaLabel: 'Pie Chart without Legend',
  },
}; 