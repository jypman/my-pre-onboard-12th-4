import React, { useEffect } from "react";
import styled from "styled-components";
import {
  scaleBand,
  scaleLinear,
  max,
  axisBottom,
  axisLeft,
  axisRight,
  select,
  area,
} from "d3";
import { IChartVal } from "../types/chart";

interface ChartProps {
  xAxisData: string[];
  yAxisData: IChartVal[];
  highlightedBar?: string;
  onClickBar?: (event: React.MouseEvent, barVal: IChartVal) => void;
}

const width: number = 1440;
const height: number = 760;
const [chartMT, chartMR, chartMB, chartML] = [70, 70, 70, 70];
const chartWidth: number = width - chartML - chartMR;
const chartHeight: number = height - chartMT - chartMB;
const axisFontSize = 20;
const barPadding = 0.2;
const doubleAreaExtent = 2;
const barColor = "green";
const highlightBarColor = "red";
const areaColor = "aqua";

export const Chart = ({
  xAxisData,
  yAxisData,
  highlightedBar,
  onClickBar,
}: ChartProps) => {
  const initChart = (): void => {
    select("svg").remove();
  };

  const drawChart = (): void => {
    const canvas = select(".canvas")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    const chart = canvas
      .append("g")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .attr("transform", `translate(${chartML}, ${chartMT})`);

    const xTimeScale = scaleBand()
      .domain(xAxisData)
      .range([0, chartWidth])
      .padding(barPadding);

    const yBarExtent = [0, max(yAxisData, (d) => d.value_bar) ?? 0];
    const yBarScale = scaleLinear().domain(yBarExtent).range([chartHeight, 0]);

    const yAreaExtent = [
      0,
      (max(yAxisData, (d) => d.value_area) ?? 0) * doubleAreaExtent,
    ];
    const yAreaScale = scaleLinear()
      .domain(yAreaExtent)
      .range([chartHeight, 0]);

    const drawAxis = (): void => {
      const xTimeAxisG = chart
        .append("g")
        .attr("transform", `translate(0, ${chartHeight})`);
      const xTimeAxis = axisBottom(xTimeScale).tickValues(
        xTimeScale.domain().filter((_, index: number) => {
          const axisTicksSection = 10;
          return index > 0 && !(index % axisTicksSection);
        }),
      );
      xTimeAxisG.call(xTimeAxis);

      const yAreaAxisG = chart.append("g");
      const yAreaAxis = axisLeft(yAreaScale);
      yAreaAxisG
        .call(yAreaAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .attr("font-size", axisFontSize)
        .text("area");

      const yBarAxisG = chart
        .append("g")
        .attr("transform", `translate(${chartWidth}, 0)`);
      const yBarAxis = axisRight(yBarScale);
      yBarAxisG
        .call(yBarAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 60)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .attr("font-size", axisFontSize)
        .text("bar");
    };

    const drawBarChart = (): void => {
      chart
        .selectAll("rect")
        .data(yAxisData)
        .enter()
        .append("rect")
        .attr("width", xTimeScale.bandwidth)
        .attr(
          "height",
          (barValue) => chartHeight - yBarScale(barValue.value_bar),
        )
        .attr("fill", (d: IChartVal) => {
          return d.id === highlightedBar ? highlightBarColor : barColor;
        })
        .attr("x", (_, index: number) => xTimeScale(xAxisData[index]) as number)
        .attr("y", (barValue) => yBarScale(barValue.value_bar))
        .style("cursor", "pointer")
        .on("click", (event: React.MouseEvent, data: IChartVal) => {
          if (onClickBar) onClickBar(event, data);
        });
    };

    const drawAreaChart = (): void => {
      const drawArea = area<IChartVal>()
        .x((_: IChartVal, index: number): number => {
          const halfBarWidth = xTimeScale.bandwidth() / 2;
          return (
            halfBarWidth + barPadding + (xTimeScale(xAxisData[index]) as number)
          );
        })
        .y0(yAreaScale(0))
        .y1((data: IChartVal): number => yAreaScale(data.value_area));

      chart
        .append("path")
        .attr("fill", areaColor)
        .attr("stroke", areaColor)
        .attr("opacity", "0.8")
        .attr("d", drawArea(yAxisData));
    };

    drawAxis();
    drawBarChart();
    drawAreaChart();
  };

  useEffect(() => {
    initChart();
    drawChart();
  }, [highlightedBar, yAxisData, xAxisData]);

  return (
    <StyledChart>
      <div className="canvas" />
    </StyledChart>
  );
};

const StyledChart = styled.section`
  width: ${width}px;
`;
