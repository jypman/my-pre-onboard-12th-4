import React, { useState } from "react";
import styled from "styled-components";
import { Chart } from "../components/Chart";
import { Button } from "../components/Button";
import { ChartProvider } from "../providers/ChartProvider";
import chartData from "../mocks/data.json";

export const Home = () => {
  const regionList: string[] = [
    ...new Set(Object.values(chartData.response).map((value) => value.id)),
  ];
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
      <ChartProvider
        chartData={chartData.response}
        onClickBar={(_, data) => changeRegion(data.id)}
        highlightedBarVal={highlightedRegion}
      >
        <Chart />
      </ChartProvider>
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
