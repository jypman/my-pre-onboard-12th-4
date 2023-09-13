import React, { useEffect } from "react";
import styled from "styled-components";
import color from "../styles/color";
import { barColor, areaColor, useChartVal } from "../providers/ChartProvider";
import { getThousandUnit } from "../utils";

export const Chart = () => {
  const {
    canvasRef,
    tooltipRef,
    tooltipData,
    xAxisData,
    yAxisData,
    highlightedBarVal,
    initChart,
    drawChart,
  } = useChartVal();

  useEffect(() => {
    initChart();
    drawChart();
  }, [highlightedBarVal, yAxisData, xAxisData]);

  return (
    <StyledChart>
      <div ref={canvasRef} />
      {tooltipData && (
        <div role="tooltip" className="tooltip" ref={tooltipRef}>
          <div className="content-wrapper">
            <div className="title">id: {tooltipData.id}</div>
            <div className="bar-data">
              bar: {getThousandUnit(tooltipData.value_bar)}
            </div>
            <div className="area-data">
              area: {getThousandUnit(tooltipData.value_area)}
            </div>
          </div>
        </div>
      )}
    </StyledChart>
  );
};

const StyledChart = styled.section`
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
