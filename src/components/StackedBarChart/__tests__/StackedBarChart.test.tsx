import { render, screen } from '@testing-library/react';
import { StackedBarChart } from '../StackedBarChart';

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

  it('renders without crashing', () => {
    render(<StackedBarChart data={mockData} />);
    const svg = screen.getByRole('img', { name: 'Stacked Bar Chart' });
    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('renders with title when provided', () => {
    const title = 'Test Chart Title';
    render(<StackedBarChart data={mockData} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    const ariaLabel = 'Custom Chart Label';
    render(<StackedBarChart data={mockData} ariaLabel={ariaLabel} />);
    const svg = screen.getByRole('img', { name: ariaLabel });
    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('renders with custom dimensions', () => {
    const width = 800;
    const height = 500;
    render(<StackedBarChart data={mockData} width={width} height={height} />);
    const svg = screen.getByRole('img', { name: 'Stacked Bar Chart' });
    expect(svg).toHaveAttribute('width', width.toString());
    expect(svg).toHaveAttribute('height', height.toString());
  });
}); 