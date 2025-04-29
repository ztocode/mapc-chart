import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BarChart } from './BarChart';

describe('BarChart', () => {
  const mockData = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 15 },
  ];

  it('renders with correct accessibility attributes', () => {
    render(<BarChart data={mockData} ariaLabel="Test Chart" />);
    const chart = screen.getByRole('img', { name: 'Test Chart' });
    expect(chart).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    render(<BarChart data={mockData} width={800} height={500} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('width', '800');
    expect(chart).toHaveAttribute('height', '500');
  });

  it('renders with empty data', () => {
    render(<BarChart data={[]} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });
}); 