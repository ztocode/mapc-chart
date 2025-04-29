import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StackedBarChart } from './StackedBarChart';

describe('StackedBarChart', () => {
  const mockData = [
    {
      label: 'A',
      values: [
        { category: 'Category 1', value: 10 },
        { category: 'Category 2', value: 20 },
      ],
    },
    {
      label: 'B',
      values: [
        { category: 'Category 1', value: 15 },
        { category: 'Category 2', value: 25 },
      ],
    },
  ];

  it('renders with correct accessibility attributes', () => {
    render(<StackedBarChart data={mockData} ariaLabel="Test Stacked Bar Chart" />);
    const chart = screen.getByRole('img', { name: 'Test Stacked Bar Chart' });
    expect(chart).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    render(<StackedBarChart data={mockData} width={800} height={500} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('width', '800');
    expect(chart).toHaveAttribute('height', '500');
  });

  it('renders with empty data', () => {
    render(<StackedBarChart data={[]} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with single category', () => {
    const singleCategoryData = [
      {
        label: 'A',
        values: [{ category: 'Category 1', value: 10 }],
      },
      {
        label: 'B',
        values: [{ category: 'Category 1', value: 15 }],
      },
    ];
    render(<StackedBarChart data={singleCategoryData} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with legend disabled', () => {
    render(<StackedBarChart data={mockData} showLegend={false} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with different legend positions', () => {
    render(<StackedBarChart data={mockData} legendPosition="bottom" />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with tooltips disabled', () => {
    render(<StackedBarChart data={mockData} showTooltip={false} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('shows tooltip on hover', () => {
    render(<StackedBarChart data={mockData} />);
    const chart = screen.getByRole('img');
    const bars = chart.querySelectorAll('rect');
    
    // Simulate mouseover on first bar
    fireEvent.mouseOver(bars[0]);
    
    // Tooltip should be visible
    const tooltip = document.querySelector('div[style*="position: absolute"]');
    expect(tooltip).toBeInTheDocument();
    
    // Simulate mouseout
    fireEvent.mouseOut(bars[0]);
    
    // Tooltip should not be visible
    expect(tooltip).not.toBeVisible();
  });
}); 