import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PieChart } from './PieChart';

describe('PieChart', () => {
  const mockData = [
    { label: 'A', value: 30 },
    { label: 'B', value: 40 },
    { label: 'C', value: 30 },
  ];

  it('renders with correct accessibility attributes', () => {
    render(<PieChart data={mockData} ariaLabel="Test Pie Chart" />);
    const chart = screen.getByRole('img', { name: 'Test Pie Chart' });
    expect(chart).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    render(<PieChart data={mockData} width={800} height={500} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('width', '800');
    expect(chart).toHaveAttribute('height', '500');
  });

  it('renders with empty data', () => {
    render(<PieChart data={[]} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    render(<PieChart data={mockData} colors={customColors} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with inner radius (donut chart)', () => {
    render(<PieChart data={mockData} innerRadius={50} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });
}); 