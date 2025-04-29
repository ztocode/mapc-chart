import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Tooltip } from '../common/Tooltip';

export interface PieChartProps {
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
  colors?: string[];
  colorScheme?: 'schemeCategory10' | 'schemeSet1' | 'schemeSet2' | 'schemeSet3' | 'schemePaired' | 'schemePastel1' | 'schemePastel2' | 'schemeDark2' | 'schemeAccent';
  ariaLabel?: string;
  innerRadius?: number;
  padAngle?: number;
  title?: string;
  showTooltip?: boolean;
  showLegend?: boolean;
}

interface TooltipData {
  x: number;
  y: number;
  content: React.ReactNode;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 600,
  height = 400,
  margin = { top: 40, right: 20, bottom: 30, left: 40 },
  colors,
  colorScheme = 'schemePastel2',
  ariaLabel = 'Pie Chart',
  innerRadius = 0,
  padAngle = 0.02,
  title,
  showTooltip = true,
  showLegend = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, content: null });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    
    // Adjust margin to accommodate legend
    const adjustedMargin = { ...margin };
    if (showLegend) {
      adjustedMargin.bottom = margin.bottom + 60; // Increase space for legend
    }
    
    const innerWidth = width - adjustedMargin.left - adjustedMargin.right;
    const innerHeight = height - adjustedMargin.top - adjustedMargin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    // Create color scale using D3 color schemes if no colors provided
    let colorScale;
    if (colors && colors.length > 0) {
      colorScale = d3.scaleOrdinal<string>().domain(data.map(d => d.label)).range(colors);
    } else {
      // Use D3 color schemes
      const schemeColors = d3[colorScheme];
      colorScale = d3.scaleOrdinal<string>().domain(data.map(d => d.label)).range(schemeColors);
    }

    // Create pie generator
    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .padAngle(padAngle);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    // Create container group
    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate(${width / 2},${height / 2})`
      );

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

    // Add slices
    const slices = g
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(d.data.label))
      .attr('role', 'img')
      .attr('aria-label', (d) => `${d.data.label}: ${d.data.value}`)
      .on('mouseover', (event: React.MouseEvent<SVGPathElement>, d) => {
        if (!showTooltip) return;
        setTooltip({
          x: 10,
          y: 10,
          content: (
            <div>
              <strong>{d.data.label}</strong>
              <br />
              Value: {d.data.value}
              <br />
              Percentage: {((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(1)}%
            </div>
          ),
        });
        setTooltipVisible(true);
      })
      .on('mousemove', (event: React.MouseEvent<SVGPathElement>) => {
        if (!showTooltip) return;
        setTooltip(prev => ({
          ...prev,
          x: 10,
          y: 10,
        }));
      })
      .on('mouseleave', () => {
        setTooltipVisible(false);
      });

    // Add legend if enabled
    if (showLegend) {
      const legend = svg.append('g');
      const legendItemWidth = 120;
      const legendSpacing = 10;
      const totalLegendWidth = data.length * (legendItemWidth + legendSpacing);
      
      // Position legend below the chart
      const legendX = margin.left;
      const legendY = height - adjustedMargin.bottom + 50;

      data.forEach((item, i) => {
        const legendItem = legend.append('g');
        
        legendItem
          .append('rect')
          .attr('x', legendX + i * (legendItemWidth + legendSpacing))
          .attr('y', legendY)
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', colorScale(item.label))
          .attr('role', 'presentation');

        legendItem
          .append('text')
          .attr('x', legendX + i * (legendItemWidth + legendSpacing) + 20)
          .attr('y', legendY + 12)
          .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
          .text(item.label)
          .attr('role', 'presentation');
      });
    }

  }, [data, width, height, margin, colors, colorScheme, innerRadius, padAngle, title, showTooltip, showLegend]);

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
      <Tooltip
        x={tooltip.x}
        y={tooltip.y}
        content={tooltip.content}
        visible={tooltipVisible}
      />
    </div>
  );
}; 