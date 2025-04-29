import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '../components/BarChart/BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BarChart>;

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
    color: '#2196f3',
    ariaLabel: 'Sample Bar Chart',
  },
};

export const CustomSize: Story = {
  args: {
    data: sampleData,
    width: 800,
    height: 500,
    color: '#4caf50',
    ariaLabel: 'Large Bar Chart',
  },
};

export const CustomMargin: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    margin: { top: 40, right: 40, bottom: 50, left: 60 },
    color: '#f44336',
    ariaLabel: 'Bar Chart with Custom Margins',
  },
}; 