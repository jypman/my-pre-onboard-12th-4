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
import chartData from "../mocks/data.json";

interface IChartVal {
  id: string;
  value_area: number;
  value_bar: number;
}

export const Chart = () => {
  const width: number = 1440;
  const height: number = 760;
  const [chartMT, chartMR, chartMB, chartML] = [70, 70, 70, 70];
  const chartWidth: number = width - chartML - chartMR;
  const chartHeight: number = height - chartMT - chartMB;
  const axisFontSize = 20;
  const barPadding = 0.2;
  const doubleAreaExtent = 2;
  const barColor = "green";
  const areaColor = "aqua";
  const parsedDateData: string[] = Object.keys(chartData.response);
  const parsedValueData: IChartVal[] = Object.values(chartData.response);

  useEffect(() => {
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
      .domain(parsedDateData)
      .range([0, chartWidth])
      .padding(barPadding);
    const xTimeAxisG = chart
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`);
    const xTimeAxis = axisBottom(xTimeScale).tickValues(
      xTimeScale.domain().filter((_, index: number) => {
        const axisLabelSection = 10;
        return index > 0 && !(index % axisLabelSection);
      }),
    );
    xTimeAxisG.call(xTimeAxis);

    const yAreaExtent = [
      0,
      (max(parsedValueData, (d) => d.value_area) ?? 0) * doubleAreaExtent,
    ];
    const yAreaScale = scaleLinear()
      .domain(yAreaExtent)
      .range([chartHeight, 0]);
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

    const yBarExtent = [0, max(parsedValueData, (d) => d.value_bar) ?? 0];
    const yBarScale = scaleLinear().domain(yBarExtent).range([chartHeight, 0]);
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

    const bars = chart.selectAll("rect").data(parsedValueData);
    bars
      .enter()
      .append("rect")
      .attr("width", xTimeScale.bandwidth)
      .attr("height", (barValue) => chartHeight - yBarScale(barValue.value_bar))
      .attr("fill", barColor)
      .attr(
        "x",
        (_, index: number) => xTimeScale(parsedDateData[index]) as number,
      )
      .attr("y", (barValue) => yBarScale(barValue.value_bar));

    const drawArea = area<IChartVal>()
      .x((_: IChartVal, index: number): number => {
        const halfBarWidth = xTimeScale.bandwidth() / 2;
        return (
          halfBarWidth +
          barPadding +
          (xTimeScale(parsedDateData[index]) as number)
        );
      })
      .y0(yAreaScale(0))
      .y1((data: IChartVal): number => yAreaScale(data.value_area));

    chart
      .append("path")
      .attr("fill", areaColor)
      .attr("stroke", areaColor)
      .attr("opacity", "0.8")
      .attr("d", drawArea(parsedValueData));
  }, []);

  return (
    <StyledChart>
      <div className="canvas" />
    </StyledChart>
  );
};

const StyledChart = styled.div`
  //
`;