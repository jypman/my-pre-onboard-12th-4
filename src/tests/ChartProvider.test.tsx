import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChartProvider } from "../providers/ChartProvider";
import { Chart } from "../components/Chart";
import mockData from "../mocks/data.json";
import { getThousandUnit, delay } from "../utils";

describe("ChartProvider", () => {
  beforeEach(() => {
    render(
      <ChartProvider chartData={mockData.response}>
        <Chart />
      </ChartProvider>,
    );
  });

  it("bar 차트 갯수와 bar data 갯수 일치하도록 렌더링", () => {
    const bar = screen.getAllByRole("bar");
    const barDataLength = Object.values(mockData.response).length;
    expect(bar).toHaveLength(barDataLength);
  });
  it("area 차트 렌더링 완료", () => {
    const area = screen.getByRole("area");
    expect(area).toBeInTheDocument();
  });
  it("x축 수치 렌더링", () => {
    const xAxis = screen.getByRole("x-axis");
    expect(xAxis).toBeInTheDocument();
  });
  it("y축 bar 수치 렌더링", () => {
    const yBarAxis = screen.getByRole("y-axis-bar");
    expect(yBarAxis).toBeInTheDocument();
  });
  it("y축 area 수치 렌더링", () => {
    const yAreaAxis = screen.getByRole("y-axis-area");
    expect(yAreaAxis).toBeInTheDocument();
  });
  it("bar 차트 mouse enter 시 해당 bar 지역의 정보와 툴팁정보 매칭", async () => {
    const bars = screen.getAllByRole("bar");
    const toHoverBarIndex = 3;
    const hoveredMockData = Object.values(mockData.response)[toHoverBarIndex];

    userEvent.hover(bars[toHoverBarIndex]);

    const tooltip = await screen.findByRole("tooltip");
    const tooltipId = await screen.findByText(`id: ${hoveredMockData.id}`);
    const tooltipBar = await screen.findByText(
      `bar: ${getThousandUnit(hoveredMockData.value_bar)}`,
    );
    const tooltipArea = await screen.findByText(
      `area: ${getThousandUnit(hoveredMockData.value_area)}`,
    );

    expect(tooltip).toBeInTheDocument();
    expect(tooltipId).toBeInTheDocument();
    expect(tooltipBar).toBeInTheDocument();
    expect(tooltipArea).toBeInTheDocument();
  });
  it("bar 차트 mouse leave 시 툴팁 비활성화", async () => {
    const bars = screen.getAllByRole("bar");
    const toHoverBarIndex = 1;

    userEvent.hover(bars[toHoverBarIndex]);
    userEvent.unhover(bars[toHoverBarIndex]);

    await delay(200);

    const tooltip = screen.queryByRole("tooltip");
    expect(tooltip).not.toBeInTheDocument();
  });
});
