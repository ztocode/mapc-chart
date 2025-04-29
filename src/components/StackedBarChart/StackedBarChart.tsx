import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Tooltip } from '../common/Tooltip';

// Add type declarations for d3
declare module 'd3' {
  export interface SeriesPoint<Datum> {
    data: Datum;
    index: number;
    value: number;
    stack: string;
  }
}

export interface StackedBarChartProps {
  data: Array<{
    label: string;
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
  showLegend?: boolean;
  showTooltip?: boolean;
  title?: string;
  orientation?: 'vertical' | 'horizontal';
  xAxisLabel?: string;
  yAxisLabel?: string;
  barPadding?: number;
  showValues?: boolean;
  valueFormat?: (value: number) => string;
  roundedCorners?: boolean;
  cornerRadius?: number;
}

interface TooltipData {
  x: number;
  y: number;
  content: React.ReactNode;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  width = 600,
  height = 600,
  margin = { top: 40, right: 20, bottom: 60, left: 70 },
  colors,
  colorScheme = 'schemePastel2',
  ariaLabel = 'Stacked Bar Chart',
  showLegend = true,
  showTooltip = true,
  title,
  orientation = 'vertical',
  xAxisLabel,
  yAxisLabel,
  barPadding = 0.3,
  showValues = false,
  valueFormat = (value) => value.toString(),
  roundedCorners = false,
  cornerRadius = 4,
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
      adjustedMargin.bottom = margin.bottom + 60; // Increase space for legend from 40 to 60
    }
    
    const innerWidth = width - adjustedMargin.left - adjustedMargin.right;
    const innerHeight = height - adjustedMargin.top - adjustedMargin.bottom;

    // Get unique categories
    const categories = Array.from(
      new Set(
        data.flatMap((d) => d.values.map((v) => v.category))
      )
    );

    // Create scales
    const xScale = orientation === 'vertical'
      ? d3.scaleBand<string>()
          .domain(data.map((d) => d.label))
          .range([0, innerWidth])
          .padding(barPadding)
      : d3.scaleLinear<number, number>()
          .domain([0, d3.max(data, (d) => d3.sum(d.values.map((v) => v.value))) || 0])
          .range([0, innerWidth]);

    const yScale = orientation === 'vertical'
      ? d3.scaleLinear<number, number>()
          .domain([0, d3.max(data, (d) => d3.sum(d.values.map((v) => v.value))) || 0])
          .range([innerHeight, 0])
      : d3.scaleBand<string>()
          .domain(data.map((d) => d.label))
          .range([0, innerHeight])
          .padding(barPadding);

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

    // Create container group
    const g = svg
      .append('g')
      .attr('transform', `translate(${adjustedMargin.left},${adjustedMargin.top})`);

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

    // Add stacked bars
    g.selectAll('g')
      .data(stack(data))
      .enter()
      .append('g')
      .attr('fill', (d) => colorScale(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => {
        if (orientation === 'vertical') {
          const bandScale = xScale as d3.ScaleBand<string>;
          return bandScale(d.data.label) || 0;
        } else {
          const linearScale = xScale as d3.ScaleLinear<number, number>;
          return linearScale(d[0]);
        }
      })
      .attr('y', (d) => {
        if (orientation === 'vertical') {
          const linearScale = yScale as d3.ScaleLinear<number, number>;
          return linearScale(d[1]);
        } else {
          const bandScale = yScale as d3.ScaleBand<string>;
          return bandScale(d.data.label) || 0;
        }
      })
      .attr('width', (d) => {
        if (orientation === 'vertical') {
          const bandScale = xScale as d3.ScaleBand<string>;
          return bandScale.bandwidth();
        } else {
          const linearScale = xScale as d3.ScaleLinear<number, number>;
          return linearScale(d[1]) - linearScale(d[0]);
        }
      })
      .attr('height', (d) => {
        if (orientation === 'vertical') {
          const linearScale = yScale as d3.ScaleLinear<number, number>;
          return linearScale(d[0]) - linearScale(d[1]);
        } else {
          const bandScale = yScale as d3.ScaleBand<string>;
          return bandScale.bandwidth();
        }
      })
      .attr('rx', roundedCorners ? cornerRadius : 0)
      .attr('ry', roundedCorners ? cornerRadius : 0)
      .attr('aria-label', (d) => {
        const value = d[1] - d[0];
        return `${d.data.label} - ${d.data.values[0].category}: ${value}`;
      })
      .on('mouseover', (event: React.MouseEvent<SVGRectElement>, d) => {
        if (!showTooltip) return;
        
        // Get the SVG element's bounding rectangle
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return;
        
        // Calculate position relative to the SVG
        const mouseX = event.clientX - svgRect.left;
        const mouseY = event.clientY - svgRect.top;
        
        // Calculate the value for this segment
        const value = d[1] - d[0];
        
        setTooltip({
          x: mouseX + 10,
          y: mouseY - 10,
          content: (
            <div>
              <div><strong>Category:</strong> {d.data.label}</div>
              <div><strong>Value:</strong> {valueFormat(value)}</div>
            </div>
          ),
        });
        setTooltipVisible(true);
      })
      .on('mousemove', (event: React.MouseEvent<SVGRectElement>) => {
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

    // Add values on bars if enabled
    if (showValues) {
      g.selectAll('g')
        .data(stack(data))
        .enter()
        .append('g')
        .selectAll('text')
        .data((d) => d)
        .enter()
        .append('text')
        .attr('x', (d) => {
          if (orientation === 'vertical') {
            const bandScale = xScale as d3.ScaleBand<string>;
            return (bandScale(d.data.label) || 0) + bandScale.bandwidth() / 2;
          } else {
            const linearScale = xScale as d3.ScaleLinear<number, number>;
            return linearScale((d[0] + d[1]) / 2);
          }
        })
        .attr('y', (d) => {
          if (orientation === 'vertical') {
            const linearScale = yScale as d3.ScaleLinear<number, number>;
            return linearScale((d[0] + d[1]) / 2);
          } else {
            const bandScale = yScale as d3.ScaleBand<string>;
            return (bandScale(d.data.label) || 0) + bandScale.bandwidth() / 2;
          }
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#fff')
        .text((d) => {
          const value = d[1] - d[0];
          return value > 0 ? valueFormat(value) : '';
        });
    }

    // Add axes
    if (orientation === 'vertical') {
      // X-axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale as d3.ScaleBand<string>))
        .attr('role', 'presentation');

      // Y-axis
      const yAxis = g.append('g')
        .call(d3.axisLeft(yScale as d3.ScaleLinear<number, number>)
          .tickFormat((d) => d.toString())
          .tickPadding(10))
        .attr('role', 'presentation')
        .selectAll('.tick line')
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .filter((_, i, nodes) => i === nodes.length - 1)
        .remove();

      // Calculate the maximum width of y-axis labels
      const yAxisLabels = yAxis.selectAll('.tick text');
      let maxLabelWidth = 0;
      yAxisLabels.each(function() {
        const bbox = (this as SVGTextElement).getBBox();
        maxLabelWidth = Math.max(maxLabelWidth, bbox.width);
      });

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

      // Add Y-axis label with dynamically adjusted position
      if (yAxisLabel) {
        svg.append('text')
          .attr('class', 'axis-label y-axis-label')
          .attr('transform', `translate(${margin.left - 60}, ${margin.top + innerHeight / 2}) rotate(-90)`)
          .attr('font-size', '12px')
          .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
          .style('text-anchor', 'middle')
          .text(yAxisLabel);
      }
    } else {
      // X-axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale as d3.ScaleLinear<number, number>))
        .attr('role', 'presentation');

      // Y-axis
      const yAxis = g.append('g')
        .call(d3.axisLeft(yScale as d3.ScaleBand<string>))
        .attr('role', 'presentation');

      // Calculate the maximum width of y-axis labels
      const yAxisLabels = yAxis.selectAll('.tick text');
      let maxLabelWidth = 0;
      yAxisLabels.each(function() {
        const bbox = (this as SVGTextElement).getBBox();
        maxLabelWidth = Math.max(maxLabelWidth, bbox.width);
      });

      // Add X-axis label
      if (xAxisLabel) {
        g.append('text')
          .attr('x', innerWidth / 2)
          .attr('y', innerHeight + margin.bottom - 40)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
          .text(xAxisLabel);
      }

      // Add Y-axis label with dynamically adjusted position
      if (yAxisLabel) {
        svg.append('text')
          .attr('class', 'axis-label y-axis-label')
          .attr('transform', `translate(${margin.left - 40}, ${margin.top + innerHeight / 2}) rotate(-90)`)
          .attr('font-size', '12px')
          .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
          .style('text-anchor', 'middle')
          .text(yAxisLabel);
      }
    }

    // Add legend if enabled
    if (showLegend) {
      const legend = svg.append('g');
      const legendItemWidth = 120;
      const legendSpacing = 10;
      const totalLegendWidth = categories.length * (legendItemWidth + legendSpacing);
      
      // Position legend below the chart with more space
      const legendX = margin.left;
      const legendY = height - adjustedMargin.bottom + (xAxisLabel ? 80 : 30); // Add extra space if x-axis label exists

      categories.forEach((category, i) => {
        const legendItem = legend.append('g');
        
        legendItem
          .append('rect')
          .attr('x', legendX + i * (legendItemWidth + legendSpacing))
          .attr('y', legendY)
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', colorScale(category))
          .attr('role', 'presentation');

        legendItem
          .append('text')
          .attr('x', legendX + i * (legendItemWidth + legendSpacing) + 20)
          .attr('y', legendY + 12)
          .attr('font-family', 'skolar-sans-latin, Helvetica, sans-serif')
          .text(category)
          .attr('role', 'presentation');
      });
    }

  }, [data, width, height, margin, colors, colorScheme, showLegend, showTooltip, title, orientation, xAxisLabel, yAxisLabel, barPadding, showValues, valueFormat, roundedCorners, cornerRadius]);

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