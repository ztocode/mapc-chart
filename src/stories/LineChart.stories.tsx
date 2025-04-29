import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from '../components/LineChart/LineChart';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LineChart>;

const sampleData = [
  {
    name: 'Series A',
    data: [
      { x: 1, y: 10 },
      { x: 2, y: 15 },
      { x: 3, y: 8 },
      { x: 4, y: 20 },
      { x: 5, y: 12 },
    ],
  },
  {
    name: 'Series B',
    data: [
      { x: 1, y: 5 },
      { x: 2, y: 12 },
      { x: 3, y: 18 },
      { x: 4, y: 15 },
      { x: 5, y: 25 },
    ],
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    showPoints: true,
    showArea: false,
    title: 'Sample Line Chart',
    ariaLabel: 'Sample Line Chart',
  },
};

export const WithArea: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    showPoints: true,
    showArea: true,
    title: 'Line Chart with Area',
    ariaLabel: 'Line Chart with Area',
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    colors: ['#2196f3', '#4caf50'],
    showPoints: true,
    showArea: false,
    title: 'Line Chart with Custom Colors',
    ariaLabel: 'Line Chart with Custom Colors',
  },
};

export const WithAxisLabels: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    showPoints: true,
    showArea: false,
    title: 'Line Chart with Axis Labels',
    xAxisLabel: 'Time',
    yAxisLabel: 'Value',
    ariaLabel: 'Line Chart with Axis Labels',
  },
}; 