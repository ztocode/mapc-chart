import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  color?: string;
  ariaLabel?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 400,
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
  color = '#2196f3',
  ariaLabel = 'Bar Chart',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([innerHeight, 0]);

    // Create container group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.label) || 0)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => innerHeight - yScale(d.value))
      .attr('fill', color)
      .attr('role', 'img')
      .attr('aria-label', (d) => `${d.label}: ${d.value}`)
      .on('mouseover', (event: React.MouseEvent<SVGRectElement>, d) => {
        if (!showTooltip) return;
        setTooltip({
          x: 10,
          y: 10,
          content: (
            <div>
              <div><strong>Category:</strong> {d.label}</div>
              <div><strong>Value:</strong> {d.value}</div>
            </div>
          ),
        });
        setTooltipVisible(true);
      })
      .on('mousemove', (event: React.MouseEvent<SVGRectElement>) => {
        if (!showTooltip) return;
        setTooltip(prev => ({
          ...prev,
          x: 10,
          y: 10,
        }));
      });

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .attr('role', 'presentation');

    // Add y-axis
    g.append('g').call(d3.axisLeft(yScale)).attr('role', 'presentation');

  }, [data, width, height, margin, color]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    />
  );
}; 