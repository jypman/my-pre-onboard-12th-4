import { Home } from "../pages/Home";
import { render, screen } from "@testing-library/react";
import mockData from "../mocks/data.json";
import userEvent from "@testing-library/user-event";
import { highlightBarColor } from "../providers/ChartProvider";
import { delay } from "../utils";

describe("Home", () => {
  it("초기화 버튼 렌더링", () => {
    render(<Home />);

    const initBtn = screen.getByRole("button", { name: /초기화/ });
    expect(initBtn).toBeInTheDocument();
  });

  it("지역 필터 버튼의 갯수가 데이터의 지역수만큼 렌더링", () => {
    render(<Home />);

    const regionLength: number = [
      ...new Set(Object.values(mockData.response).map((value) => value.id)),
    ].length;
    const regionBtn = screen.getAllByRole("button", { name: /[^초기화]/ });

    expect(regionBtn).toHaveLength(regionLength);
  });

  it("특정 지역 버튼 클릭 시 해당 지역 필터 버튼과 지역의 bar 하이라이팅", async () => {
    render(<Home />);

    const mockDataIndex = 3;
    const regionName = Object.values(mockData.response)[mockDataIndex].id;
    const btn = screen.getByRole("button", { name: regionName });

    userEvent.click(btn);

    await delay(200);

    const highlightedBtn = screen.getByRole("button", {
      name: regionName,
    });
    const bars = screen.getAllByRole("bar");
    const highlightedBars = bars.filter((bar) => {
      return bar.getAttribute("fill") === highlightBarColor;
    });

    expect(highlightedBars.length).toBeGreaterThanOrEqual(1);
    expect(highlightedBtn.getAttribute("class")).toContain("color-primary");
  });
});
