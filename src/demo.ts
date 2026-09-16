import { Puzzle } from "./types";
import { stateAt, gridLetters } from "./game";

const DEMO_PUZZLE: Puzzle = {
  h: ["snake", "least", "every"],
  v: ["solve", "aware", "entry"]
};

const DEMO_ANSWERS = [...DEMO_PUZZLE.h, ...DEMO_PUZZLE.v];
const DEMO_GUESSES = ["stare", "least"];

let currentDemoIndex = 0;
let autoLoopTimer: ReturnType<typeof setTimeout> | null = null;
let userInteracted = false;

export function renderDemoBoard(index: number, animateSlide = false): void {
  currentDemoIndex = index;
  const boardEl = document.getElementById("demoBoard");
  const tab1 = document.getElementById("demoTab1");
  const tab2 = document.getElementById("demoTab2");

  if (!boardEl) return;

  const state = stateAt(index, DEMO_GUESSES, DEMO_ANSWERS);
  const letters = gridLetters(DEMO_PUZZLE);

  boardEl.innerHTML = "";
  if (animateSlide) {
    boardEl.classList.remove("sliding");
    void boardEl.offsetWidth; // trigger reflow
    boardEl.classList.add("sliding");
  }

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement("div");
      if (!letters[r][c]) {
        cell.className = "cell gap";
      } else {
        const isGreen = state.green[r][c];
        const hintChar = state.yellow[r][c];
        cell.className = "cell" + (isGreen ? " revealed" : hintChar ? " hint" : "");
        cell.textContent = isGreen ? letters[r][c] : (hintChar || "");
      }
      boardEl.appendChild(cell);
    }
  }

  if (tab1 && tab2) {
    tab1.className = "guess-tab demo-tab" + (index === 0 ? " current" : "");
    tab2.className = "guess-tab demo-tab" + (index === 1 ? " current" : "");
  }
}

export function stopDemoLoop(): void {
  userInteracted = true;
  if (autoLoopTimer) {
    clearTimeout(autoLoopTimer);
    autoLoopTimer = null;
  }
  const tab1 = document.getElementById("demoTab1");
  const tab2 = document.getElementById("demoTab2");
  tab1?.classList.remove("tapped");
  tab2?.classList.remove("tapped");
}

function runLoopStep(): void {
  if (userInteracted) return;

  const nextIndex = currentDemoIndex === 0 ? 1 : 0;
  const targetTab = document.getElementById(nextIndex === 1 ? "demoTab2" : "demoTab1");

  if (targetTab) {
    targetTab.classList.add("tapped");
  }

  autoLoopTimer = setTimeout(() => {
    if (userInteracted) return;
    targetTab?.classList.remove("tapped");
    renderDemoBoard(nextIndex, true);

    autoLoopTimer = setTimeout(() => {
      if (!userInteracted) {
        runLoopStep();
      }
    }, 2000);
  }, 450);
}

export function startDemoLoop(): void {
  userInteracted = false;
  if (autoLoopTimer) clearTimeout(autoLoopTimer);
  renderDemoBoard(0, false);
  autoLoopTimer = setTimeout(() => {
    if (!userInteracted) {
      runLoopStep();
    }
  }, 2000);
}

export function initDemo(): void {
  const tab1 = document.getElementById("demoTab1");
  const tab2 = document.getElementById("demoTab2");

  if (tab1) {
    tab1.onclick = () => {
      stopDemoLoop();
      renderDemoBoard(0, true);
    };
  }

  if (tab2) {
    tab2.onclick = () => {
      stopDemoLoop();
      renderDemoBoard(1, true);
    };
  }

  startDemoLoop();
}
