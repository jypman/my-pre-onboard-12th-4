import React, { useEffect, useRef, useState } from "react";
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
import color from "../styles/color";

interface ChartProps {
  xAxisData: string[];
  yAxisData: IChartVal[];
  highlightedBar?: string;
  onClickBar?: (event: React.MouseEvent, barVal: IChartVal) => void;
}

const width: number = 1800;
const height: number = 760;
const [chartMT, chartMR, chartMB, chartML] = [70, 70, 70, 70];
const chartWidth: number = width - chartML - chartMR;
const chartHeight: number = height - chartMT - chartMB;
const axisFontSize = 30;
const barPadding = 0.2;
const doubleAreaExtent = 2;
const barColor = color.green;
const highlightBarColor = color.blue;
const areaColor = color.orange;

export const Chart = ({
  xAxisData,
  yAxisData,
  highlightedBar,
  onClickBar,
}: ChartProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = useState<IChartVal | null>(null);

  const initChart = (): void => {
    select("svg").remove();
  };

  const drawChart = (): void => {
    const canvas = select(canvasRef.current)
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
        .attr("transform", `translate(0, ${chartHeight})`)
        .attr("font-weight", "bold");
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
        .attr("fill", areaColor)
        .attr("font-size", axisFontSize)
        .text("area");

      const yBarAxisG = chart
        .append("g")
        .attr("font-size", 40)
        .attr("transform", `translate(${chartWidth}, 0)`);
      const yBarAxis = axisRight(yBarScale);
      yBarAxisG
        .call(yBarAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 70)
        .attr("text-anchor", "end")
        .attr("fill", barColor)
        .attr("font-size", axisFontSize)
        .text("bar");
    };

    const drawBarChart = (): void => {
      const pointerMoved = (event: PointerEvent, data: IChartVal) => {
        setTooltipData(data);
        select(tooltipRef.current)
          .style("display", "block")
          .style("left", `${event.clientX - 20}px`)
          .style("top", `${event.clientY - 110}px`);
      };

      const hiddenTooltip = () => {
        select(tooltipRef.current).style("display", "none");
      };

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
        .attr("fill", (d: IChartVal, index: number) => {
          return d.id === highlightedBar ? highlightBarColor : barColor;
        })
        .attr("x", (_, index: number) => xTimeScale(xAxisData[index]) as number)
        .attr("y", (barValue) => yBarScale(barValue.value_bar))
        .style("cursor", "pointer")
        .on("click", (event: React.MouseEvent, data: IChartVal) => {
          if (onClickBar) onClickBar(event, data);
        })
        .on("pointerenter pointermove", pointerMoved)
        .on("pointerleave", hiddenTooltip)
        .on("touchstart", (event) => event.preventDefault());
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
      <div ref={canvasRef} />
      {tooltipData && (
        <div className="tooltip" ref={tooltipRef}>
          <div className="content-wrapper">
            <div className="title">id: {tooltipData?.id}</div>
            <div className="bar-data">bar: {tooltipData?.value_bar}</div>
            <div className="area-data">area: {tooltipData?.value_area}</div>
          </div>
        </div>
      )}
    </StyledChart>
  );
};

const StyledChart = styled.section`
  width: ${width}px;

  .tooltip {
    padding: 10px;
    position: absolute;
    background-color: ${color.white};
    border: 3px solid black;
    border-radius: 14px;
    display: none;
    .content-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .title {
        font-weight: bold;
      }
      .bar-data {
        color: ${barColor};
      }
      .area-data {
        color: ${areaColor};
      }
    }
  }
`;
