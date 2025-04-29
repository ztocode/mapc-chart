import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Tooltip } from '../common/Tooltip';

export interface StackedAreaChartProps {
  data: Array<{
    x: number;
    values: Array<{
      category: string;
      value: number;
    }>;
  }>;
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: string[];
  colorScheme?: 'schemeCategory10' | 'schemeSet1' | 'schemeSet2' | 'schemeSet3' | 'schemePaired' | 'schemePastel1' | 'schemePastel2' | 'schemeDark2' | 'schemeAccent';
  ariaLabel?: string;
  showTooltip?: boolean;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface TooltipData {
  x: number;
  y: number;
  content: React.ReactNode;
}

export const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  data,
  width = 600,
  height = 600,
  margin = { top: 40, right: 20, bottom: 60, left: 70 },
  colors,
  colorScheme = 'schemePastel2',
  ariaLabel = 'Stacked Area Chart',
  showTooltip = true,
  title,
  xAxisLabel,
  yAxisLabel,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, content: null });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Add title if provided
    if (title) {
      svg
        .append('text')
        .attr('x', margin.left)
        .attr('y', 25)
        .attr('text-anchor', 'start')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
        .text(title);
    }

    // Get unique categories
    const categories = Array.from(
      new Set(
        data.flatMap((d) => d.values.map((v) => v.category))
      )
    );

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.sum(d.values.map((v) => v.value))) || 0])
      .range([innerHeight, 0]);

    // Create color scale using D3 color schemes if no colors provided
    let colorScale;
    if (colors && colors.length > 0) {
      colorScale = d3.scaleOrdinal<string>().domain(categories).range(colors);
    } else {
      // Use D3 color schemes
      const schemeColors = d3[colorScheme];
      colorScale = d3.scaleOrdinal<string>().domain(categories).range(schemeColors);
    }

    // Create stack generator
    const stack = d3
      .stack<typeof data[0], string>()
      .keys(categories)
      .value((d, key) => {
        const value = d.values.find((v) => v.category === key);
        return value ? value.value : 0;
      });

    // Create area generator
    const area = d3
      .area<any>()
      .x((d) => xScale(d.data.x))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Create container group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add stacked areas
    g.selectAll('path')
      .data(stack(data))
      .enter()
      .append('path')
      .attr('fill', (d) => colorScale(d.key))
      .attr('d', area)
      .attr('role', 'presentation')
      .on('mouseover', (event: React.MouseEvent<SVGPathElement>, d) => {
        if (!showTooltip) return;
        const total = d3.sum(d, (d) => d[1] - d[0]);
        
        // Get the SVG element's bounding rectangle
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return;
        
        // Calculate position relative to the SVG
        const mouseX = event.clientX - svgRect.left;
        const mouseY = event.clientY - svgRect.top;
        
        setTooltip({
          x: mouseX + 10,
          y: mouseY - 10,
          content: (
            <div>
              <strong>{d.key}</strong>
              <br />
              Value: {total.toFixed(2)}
            </div>
          ),
        });
        setTooltipVisible(true);
      })
      .on('mousemove', (event: React.MouseEvent<SVGPathElement>) => {
        if (!showTooltip) return;
        
        // Get the SVG element's bounding rectangle
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return;
        
        // Calculate position relative to the SVG
        const mouseX = event.clientX - svgRect.left;
        const mouseY = event.clientY - svgRect.top;
        
        setTooltip(prev => ({
          ...prev,
          x: mouseX + 10,
          y: mouseY - 10,
        }));
      })
      .on('mouseleave', () => {
        setTooltipVisible(false);
      });

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickFormat((d) => d.toString())
        .tickPadding(10))
      .attr('role', 'presentation')
      .selectAll('.tick line')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale)
        .tickFormat((d) => d.toString())
        .tickPadding(10))
      .attr('role', 'presentation')
      .selectAll('.tick line')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .filter((_, i, nodes) => i === nodes.length - 1)
      .remove();

    // Add X-axis label
    if (xAxisLabel) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom - 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
        .text(xAxisLabel);
    }

    // Add Y-axis label
    if (yAxisLabel) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left + 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
        .text(yAxisLabel);
    }

  }, [data, width, height, margin, colors, colorScheme, showTooltip, title, xAxisLabel, yAxisLabel]);

  return (
    <div 
      style={{ position: 'relative' }}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
      />
      {tooltipVisible && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          content={tooltip.content}
          visible={tooltipVisible}
        />
      )}
    </div>
  );
}; 