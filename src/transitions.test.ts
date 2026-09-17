// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { renderBoard } from "./main";

describe("directional board transitions & gesture handling", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="board-wrapper" id="boardWrapper">
        <div class="board-track" id="boardTrack">
          <div class="board" id="board1"></div>
          <div class="board" id="board2"></div>
        </div>
      </div>
      <p id="timelineLabel"></p>
      <div id="guessTabs"></div>
    `;
  });

  it("handles backward directional transition without throwing", () => {
    expect(() => renderBoard("backward")).not.toThrow();
    const track = document.getElementById("boardTrack");
    expect(track?.style.transform).toBe("translateX(0)");
  });

  it("handles forward directional transition without throwing", () => {
    expect(() => renderBoard("forward")).not.toThrow();
    const track = document.getElementById("boardTrack");
    expect(track?.style.transform).toBe("translateX(-50%)");
  });

  it("handles static 'none' transition without throwing", () => {
    expect(() => renderBoard("none")).not.toThrow();
    const track = document.getElementById("boardTrack");
    expect(track?.style.transform).toBe("translateX(0)");
  });
});
