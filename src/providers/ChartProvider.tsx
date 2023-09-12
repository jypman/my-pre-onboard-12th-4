import React, {
  useContext,
  createContext,
  useRef,
  useState,
  useMemo,
  RefObject,
} from "react";
import {
  area,
  axisBottom,
  axisLeft,
  axisRight,
  max,
  scaleBand,
  scaleLinear,
  select,
} from "d3";
import { IChartVal } from "../types/chart";
import color from "../styles/color";

const width: number = 1440;
const height: number = 700;
const [chartMT, chartMR, chartMB, chartML] = [70, 70, 70, 70];
const chartWidth: number = width - chartML - chartMR;
const chartHeight: number = height - chartMT - chartMB;
const axisFontSize = 30;
const barPadding = 0.2;
const doubleAreaExtent = 2;
export const barColor = color.green;
export const highlightBarColor = color.blue;
export const areaColor = color.orange;

interface IChartValCtx {
  canvasRef: RefObject<HTMLDivElement> | null;
  xAxisData: string[];
  yAxisData: IChartVal[];
  highlightedBarVal: string;
  tooltipRef: RefObject<HTMLDivElement> | null;
  tooltipData: IChartVal | null;
}

interface IChartActionsCtx {
  pointerMoved: (e: PointerEvent, data: IChartVal) => void;
  pointerEnter: (e: PointerEvent, data: IChartVal) => void;
  hiddenTooltip: (e: PointerEvent, data: IChartVal) => void;
  drawChart: () => void;
  initChart: () => void;
}

interface ChartProviderProps {
  children: React.ReactElement;
  chartData: { [key: string]: IChartVal };
  highlightedBarVal?: string;
  onClickBar?: (event: React.MouseEvent, barVal: IChartVal) => void;
}

const ChartVal = createContext<IChartValCtx>({
  canvasRef: null,
  xAxisData: [],
  yAxisData: [],
  highlightedBarVal: "",
  tooltipRef: null,
  tooltipData: null,
});

const ChartActions = createContext<IChartActionsCtx>({
  initChart: () => {},
  pointerMoved: () => {},
  pointerEnter: () => {},
  hiddenTooltip: () => {},
  drawChart: () => {},
});

export const useChartVal = () => {
  const val = useContext(ChartVal);
  if (val === undefined) {
    throw new Error("useChartVal should be used within ChartProvider");
  }
  return val;
};

export const useChartActions = () => {
  const val = useContext(ChartActions);
  if (val === undefined) {
    throw new Error("useChartActions should be used within ChartProvider");
  }
  return val;
};

export const ChartProvider = ({
  children,
  chartData,
  highlightedBarVal = "",
  onClickBar,
}: ChartProviderProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = useState<IChartVal | null>(null);
  const xAxisData: string[] = Object.keys(chartData);
  const yAxisData: IChartVal[] = Object.values(chartData);

  const initChart = (): void => {
    select("svg").remove();
  };

  const pointerMoved = (event: PointerEvent) => {
    select(tooltipRef.current)
      .style("display", "block")
      .style("left", `${event.clientX - 20}px`)
      .style("top", `${event.clientY - 110}px`);
  };

  const pointerEnter = (_: PointerEvent, data: IChartVal) => {
    setTooltipData(data);
  };

  const hiddenTooltip = () => {
    select(tooltipRef.current).style("display", "none");
    setTooltipData(null);
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
          return d.id === highlightedBarVal ? highlightBarColor : barColor;
        })
        .attr("x", (_, index: number) => xTimeScale(xAxisData[index]) as number)
        .attr("y", (barValue) => yBarScale(barValue.value_bar))
        .style("cursor", "pointer")
        .on("click", (event: React.MouseEvent, data: IChartVal) => {
          if (onClickBar) onClickBar(event, data);
        })
        .on("pointerenter", pointerEnter)
        .on("pointermove", pointerMoved)
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

  const chartVal = useMemo<IChartValCtx>(
    () => ({
      canvasRef,
      xAxisData,
      yAxisData,
      tooltipRef,
      tooltipData,
      highlightedBarVal,
    }),
    [tooltipData, xAxisData, yAxisData],
  );

  const chartActions = useMemo<IChartActionsCtx>(
    () => ({
      initChart,
      pointerMoved,
      pointerEnter,
      hiddenTooltip,
      drawChart,
    }),
    [xAxisData, yAxisData],
  );

  return (
    <ChartActions.Provider value={chartActions}>
      <ChartVal.Provider value={chartVal}>{children}</ChartVal.Provider>
    </ChartActions.Provider>
  );
};
