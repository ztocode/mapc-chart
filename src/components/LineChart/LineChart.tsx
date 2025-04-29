import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Tooltip } from '../common/Tooltip';

export interface LineChartDataPoint {
  x: number;
  y: number;
}

export interface LineChartSeries {
  name: string;
  data: LineChartDataPoint[];
}

export interface LineChartProps {
  data: LineChartSeries[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: string[];
  colorScheme?: string;
  ariaLabel?: string;
  showPoints?: boolean;
  showArea?: boolean;
  title?: string;
  showTooltip?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface TooltipData {
  x: number;
  y: number;
  content: React.ReactNode;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 600,
  margin = { top: 40, right: 20, bottom: 70, left: 60 },
  colors,
  colorScheme,
  ariaLabel = 'Line Chart',
  showPoints = true,
  showArea = false,
  title,
  showTooltip = true,
  xAxisLabel,
  yAxisLabel,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, content: null });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Reset tooltip when data changes
  useEffect(() => {
    setTooltipVisible(false);
  }, [data]);

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

    // Get all x and y values for scales
    const allXValues = data.flatMap(series => series.data.map(d => d.x));
    const allYValues = data.flatMap(series => series.data.map(d => d.y));

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(allXValues) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(allYValues) || 0])
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3
      .line<LineChartDataPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear);

    // Create area generator
    const area = d3
      .area<LineChartDataPoint>()
      .x((d) => xScale(d.x))
      .y0(innerHeight)
      .y1((d) => yScale(d.y))
      .curve(d3.curveLinear);

    // Create container group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get color scale
    let colorScale: d3.ScaleOrdinal<string, string>;
    if (colors) {
      colorScale = d3.scaleOrdinal<string, string>().domain(data.map(d => d.name)).range(colors);
    } else if (colorScheme) {
      const scheme = (d3 as any)[colorScheme] as string[];
      colorScale = d3.scaleOrdinal<string, string>().domain(data.map(d => d.name)).range(scheme);
    } else {
      colorScale = d3.scaleOrdinal<string, string>().domain(data.map(d => d.name)).range(d3.schemeCategory10);
    }

    // Add areas if enabled
    if (showArea) {
      data.forEach((series, i) => {
        g.append('path')
          .datum(series.data)
          .attr('fill', colorScale(series.name))
          .attr('fill-opacity', 0.1)
          .attr('d', area)
          .attr('role', 'presentation');
      });
    }

    // Add lines
    data.forEach((series, i) => {
      g.append('path')
        .datum(series.data)
        .attr('fill', 'none')
        .attr('stroke', colorScale(series.name))
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('role', 'presentation');
    });

    // Add points if enabled
    if (showPoints) {
      data.forEach((series, i) => {
        g.selectAll(`circle.${series.name.replace(/\s+/g, '-').toLowerCase()}`)
          .data(series.data)
          .enter()
          .append('circle')
          .attr('class', series.name.replace(/\s+/g, '-').toLowerCase())
          .attr('cx', (d) => xScale(d.x))
          .attr('cy', (d) => yScale(d.y))
          .attr('r', 4)
          .attr('fill', colorScale(series.name))
          .attr('role', 'img')
          .attr('aria-label', (d) => `${series.name} point at x: ${d.x}, y: ${d.y}`)
          .on('mouseover', (event: React.MouseEvent<SVGCircleElement>, d) => {
            if (!showTooltip) return;
            const circle = event.target as SVGCircleElement;
            
            // Find all points at this x position
            const xValue = d.x;
            const allPointsAtX = data.map(series => {
              const point = series.data.find(p => p.x === xValue);
              return point ? { name: series.name, value: point.y } : null;
            }).filter((point): point is { name: string; value: number } => point !== null);
            
            // Get the SVG element's bounding rectangle
            const svgRect = svgRef.current?.getBoundingClientRect();
            if (!svgRect) return;
            
            // Calculate position relative to the SVG
            const pointX = xScale(d.x) + margin.left;
            const pointY = yScale(d.y) + margin.top;
            
            // Set tooltip position and content
            setTooltip({
              x: pointX + 10, // Offset from the point
              y: pointY - 10, // Offset from the point
              content: (
                <div>
                  <div><strong>X:</strong> {xValue}</div>
                  {allPointsAtX.map((point, i) => (
                    <div key={i} style={{ color: colorScale(point.name) }}>
                      <strong>{point.name}:</strong> {point.value}
                    </div>
                  ))}
                </div>
              ),
            });
            setTooltipVisible(true);
          })
          .on('mousemove', (event: React.MouseEvent<SVGCircleElement>, d) => {
            if (!showTooltip) return;
            
            // Get the SVG element's bounding rectangle
            const svgRect = svgRef.current?.getBoundingClientRect();
            if (!svgRect) return;
            
            // Calculate position relative to the SVG
            const pointX = xScale(d.x) + margin.left;
            const pointY = yScale(d.y) + margin.top;
            
            setTooltip(prev => ({
              ...prev,
              x: pointX + 10, // Offset from the point
              y: pointY - 10, // Offset from the point
            }));
          })
          .on('mouseleave', () => {
            setTooltipVisible(false);
          });
      });
    }

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
        .attr('y', innerHeight + margin.bottom)
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

  }, [data, width, height, margin, colors, colorScheme, showPoints, showArea, title, showTooltip, xAxisLabel, yAxisLabel]);

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