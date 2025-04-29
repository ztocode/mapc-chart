import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { StackedAreaChart } from './StackedAreaChart';

describe('StackedAreaChart', () => {
  const mockData = [
    {
      x: 0,
      values: [
        { category: 'Category A', value: 10 },
        { category: 'Category B', value: 20 },
      ],
    },
    {
      x: 1,
      values: [
        { category: 'Category A', value: 15 },
        { category: 'Category B', value: 25 },
      ],
    },
  ];

  it('renders with correct accessibility attributes', () => {
    render(<StackedAreaChart data={mockData} ariaLabel="Test Stacked Area Chart" />);
    const chart = screen.getByRole('img', { name: 'Test Stacked Area Chart' });
    expect(chart).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    render(<StackedAreaChart data={mockData} width={800} height={500} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('width', '800');
    expect(chart).toHaveAttribute('height', '500');
  });

  it('renders with empty data', () => {
    render(<StackedAreaChart data={[]} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<StackedAreaChart data={mockData} title="Test Title" />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });
}); 