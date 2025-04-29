import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LineChart } from './LineChart';

describe('LineChart', () => {
  const mockData = [
    { x: 0, y: 10 },
    { x: 1, y: 20 },
    { x: 2, y: 15 },
  ];

  it('renders with correct accessibility attributes', () => {
    render(<LineChart data={mockData} ariaLabel="Test Line Chart" />);
    const chart = screen.getByRole('img', { name: 'Test Line Chart' });
    expect(chart).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    render(<LineChart data={mockData} width={800} height={500} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('width', '800');
    expect(chart).toHaveAttribute('height', '500');
  });

  it('renders with empty data', () => {
    render(<LineChart data={[]} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('renders with points disabled', () => {
    render(<LineChart data={mockData} showPoints={false} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
    // Points should not be present
    expect(screen.queryByRole('img', { name: /Point at/ })).toBeNull();
  });

  it('renders with area enabled', () => {
    render(<LineChart data={mockData} showArea={true} />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });
}); 