// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { renderDemoBoard, initDemo, stopDemoLoop } from "./demo";

describe("demo board", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="demoBoard"></div>
      <button id="demoTab1"></button>
      <button id="demoTab2"></button>
    `;
  });

  it("renders 25 cells for 5x5 demo grid", () => {
    renderDemoBoard(0, false);
    const board = document.getElementById("demoBoard");
    expect(board?.children.length).toBe(25);
  });

  it("highlights green and yellow cells for guess 1", () => {
    renderDemoBoard(0, false);
    const revealedCells = document.querySelectorAll("#demoBoard .cell.revealed");
    expect(revealedCells.length).toBeGreaterThan(0);
  });

  it("shows row 2 completely green for guess 2 ('least')", () => {
    renderDemoBoard(1, false);
    const cells = document.querySelectorAll("#demoBoard .cell");
    // Row 2 is indices 10, 11, 12, 13, 14
    expect(cells[10].classList.contains("revealed")).toBe(true);
    expect(cells[11].classList.contains("revealed")).toBe(true);
    expect(cells[12].classList.contains("revealed")).toBe(true);
    expect(cells[13].classList.contains("revealed")).toBe(true);
    expect(cells[14].classList.contains("revealed")).toBe(true);
    expect(cells[10].textContent).toBe("l");
    expect(cells[11].textContent).toBe("e");
    expect(cells[12].textContent).toBe("a");
    expect(cells[13].textContent).toBe("s");
    expect(cells[14].textContent).toBe("t");
  });

  it("allows switching tabs manually", () => {
    initDemo();
    const tab2 = document.getElementById("demoTab2") as HTMLButtonElement;
    tab2.click();
    expect(tab2.classList.contains("current")).toBe(true);
    stopDemoLoop();
  });
});
