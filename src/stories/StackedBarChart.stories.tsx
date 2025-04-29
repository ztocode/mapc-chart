import type { Meta, StoryObj } from '@storybook/react';
import { StackedBarChart } from '../components/StackedBarChart/StackedBarChart';

const meta: Meta<typeof StackedBarChart> = {
  title: 'Charts/StackedBarChart',
  component: StackedBarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StackedBarChart>;

const sampleData = [
  {
    label: 'Category A',
    values: [
      { category: 'Series 1', value: 30 },
      { category: 'Series 2', value: 20 },
      { category: 'Series 3', value: 10 },
    ],
  },
  {
    label: 'Category B',
    values: [
      { category: 'Series 1', value: 25 },
      { category: 'Series 2', value: 15 },
      { category: 'Series 3', value: 20 },
    ],
  },
  {
    label: 'Category C',
    values: [
      { category: 'Series 1', value: 15 },
      { category: 'Series 2', value: 30 },
      { category: 'Series 3', value: 25 },
    ],
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
    title: 'Stacked Bar Chart',
    ariaLabel: 'Stacked Bar Chart Example',
  },
};

export const WithRoundedCorners: Story = {
  args: {
    ...Default.args,
    roundedCorners: true,
    cornerRadius: 6,
    title: 'Stacked Bar Chart with Rounded Corners',
    ariaLabel: 'Stacked Bar Chart with Rounded Corners',
  },
};

export const WithValueLabels: Story = {
  args: {
    ...Default.args,
    showValues: true,
    valueFormat: (value) => `${value}%`,
    title: 'Stacked Bar Chart with Value Labels',
    ariaLabel: 'Stacked Bar Chart with Value Labels',
  },
};

export const CustomBarSpacing: Story = {
  args: {
    ...Default.args,
    barPadding: 0.5,
    title: 'Stacked Bar Chart with Custom Bar Spacing',
    ariaLabel: 'Stacked Bar Chart with Custom Bar Spacing',
  },
};

export const Horizontal: Story = {
  args: {
    ...Default.args,
    orientation: 'horizontal',
    title: 'Horizontal Stacked Bar Chart',
    ariaLabel: 'Horizontal Stacked Bar Chart',
  },
};

export const CustomColors: Story = {
  args: {
    ...Default.args,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    title: 'Stacked Bar Chart with Custom Colors',
    ariaLabel: 'Stacked Bar Chart with Custom Colors',
  },
};

export const WithAxisLabels: Story = {
  args: {
    ...Default.args,
    xAxisLabel: 'Categories',
    yAxisLabel: 'Values',
    title: 'Stacked Bar Chart with Axis Labels',
    ariaLabel: 'Stacked Bar Chart with Axis Labels',
  },
};

export const NoLegend: Story = {
  args: {
    ...Default.args,
    showLegend: false,
    title: 'Stacked Bar Chart without Legend',
    ariaLabel: 'Stacked Bar Chart without Legend',
  },
}; 