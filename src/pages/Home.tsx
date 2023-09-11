import React, { useState } from "react";
import styled from "styled-components";
import { Chart } from "./Chart";
import { Button } from "../components/Button";
import chartData from "../mocks/data.json";
import { IChartVal } from "../types/chart";

const dateData: string[] = Object.keys(chartData.response);
const valueData: IChartVal[] = Object.values(chartData.response);

export const Home = () => {
  const regionList: string[] = [...new Set(valueData.map((value) => value.id))];
  const [highlightedRegion, setHighlightedRegion] = useState<string>("");
  const changeRegion = (clickedRegion: string): void =>
    setHighlightedRegion(clickedRegion);
  const initRegion = () => setHighlightedRegion("");

  return (
    <StyledHome>
      <div className="btn-wrapper">
        <Button label="초기화" onClick={initRegion} />
        {regionList.map((value: string) => (
          <Button
            key={value}
            label={value}
            primary={highlightedRegion === value}
            onClick={() => changeRegion(value)}
          />
        ))}
      </div>
      <Chart
        xAxisData={dateData}
        yAxisData={valueData}
        highlightedBar={highlightedRegion}
        onClickBar={(_, data) => changeRegion(data.id)}
      />
    </StyledHome>
  );
};

const StyledHome = styled.main`
  width: fit-content;
  margin: 0 auto;
  .btn-wrapper {
    margin: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
