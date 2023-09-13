import { Home } from "../pages/Home";
import { render, screen } from "@testing-library/react";
import mockData from "../mocks/data.json";
import userEvent from "@testing-library/user-event";
import { highlightBarColor } from "../providers/ChartProvider";
import { delay } from "../utils";

describe("Home", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("초기화 버튼 렌더링", () => {
    const initBtn = screen.getByRole("button", { name: /초기화/ });
    expect(initBtn).toBeInTheDocument();
  });
  it("지역 버튼의 갯수가 데이터의 지역수만큼 렌더링", () => {
    const regionLength: number = [
      ...new Set(Object.values(mockData.response).map((value) => value.id)),
    ].length;
    const regionBtn = screen.getAllByRole("button", { name: /[^초기화]/ });

    expect(regionBtn).toHaveLength(regionLength);
  });
  it("특정 지역 버튼 클릭 시 해당 버튼과 지역의 bar 하이라이팅", async () => {
    const mockDataIndex = 3;
    const regionName = Object.values(mockData.response)[mockDataIndex].id;
    const btn = screen.getByRole("button", { name: regionName });

    userEvent.click(btn);

    await delay(200);

    const highlightedBtn = screen.getByRole("button", {
      name: regionName,
    });
    const bars = screen.getAllByRole("bar");

    bars.forEach((bar) => {
      return bar.textContent === regionName
        ? expect(bar.getAttribute("fill")).toEqual(highlightBarColor)
        : undefined;
    });
    expect(highlightedBtn.getAttribute("class")).toContain("color-primary");
  });
  it("특정 지역 bar 클릭 시 해당 버튼과 지역의 bar 하이라이팅", async () => {
    const toClickBarIndex = 7;
    const bars = screen.getAllByRole("bar");
    const clickedMockData = Object.values(mockData.response)[toClickBarIndex];

    userEvent.click(bars[toClickBarIndex]);

    await delay(200);

    const highlightedBtn = screen.getByRole("button", {
      name: clickedMockData.id,
    });

    bars.forEach((bar) => {
      return bar.textContent === clickedMockData.id
        ? expect(bar.getAttribute("fill")).toEqual(highlightBarColor)
        : undefined;
    });
    expect(highlightedBtn.getAttribute("class")).toContain("color-primary");
  });
});
