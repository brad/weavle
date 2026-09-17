import { Puzzle } from "./types";
import { stateAt, gridLetters } from "./game";

const DEMO_PUZZLE: Puzzle = {
  h: ["snake", "least", "every"],
  v: ["solve", "aware", "entry"]
};

const DEMO_ANSWERS = [...DEMO_PUZZLE.h, ...DEMO_PUZZLE.v];
const DEMO_GUESSES = ["stare", "least"];

let currentDemoBoardIndex = 1;
let autoLoopTimer: ReturnType<typeof setTimeout> | null = null;
let userInteracted = false;

export function renderDemoBoard(index: number, animateSlide = false): void {
  const tab1 = document.getElementById("demoTab1");
  const tab2 = document.getElementById("demoTab2");
  const timelineLabel = document.getElementById("demoTimelineLabel");

  if (!tab1 || !tab2 || !timelineLabel) return;

  const state = stateAt(index, DEMO_GUESSES, DEMO_ANSWERS);
  const letters = gridLetters(DEMO_PUZZLE);

  const nextBoardIndex = currentDemoBoardIndex === 1 ? 2 : 1;
  const currentBoard = document.getElementById("demoBoard" + currentDemoBoardIndex);
  const nextBoard = document.getElementById("demoBoard" + nextBoardIndex);
  const track = document.getElementById("demoBoardTrack");

  if (!currentBoard || !nextBoard || !track) return;

  nextBoard.innerHTML = "";
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
      nextBoard.appendChild(cell);
    }
  }

  tab1.className = "guess-tab demo-tab" + (index === 0 ? " current" : "");
  tab2.className = "guess-tab demo-tab" + (index === 1 ? " current" : "");
  timelineLabel.textContent = "Showing board after guess " + (index + 1) + ": " + DEMO_GUESSES[index].toUpperCase();

  if (animateSlide && index > 0) {
    const targetTransform = nextBoardIndex === 2 ? "translateX(-50%)" : "translateX(0)";

    track.style.transition = "transform .25s ease-out";
    track.style.transform = targetTransform;

    setTimeout(() => {
      track.style.transition = "";
      currentDemoBoardIndex = nextBoardIndex;
    }, 250);
  } else {
    track.style.transform = nextBoardIndex === 1 ? "translateX(0)" : "translateX(-50%)";
    currentDemoBoardIndex = nextBoardIndex;
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

export function resetDemoState(): void {
  currentDemoBoardIndex = 1;
  userInteracted = false;
  if (autoLoopTimer) {
    clearTimeout(autoLoopTimer);
    autoLoopTimer = null;
  }
}

function runLoopStep(): void {
  if (userInteracted) return;

  // Alternate between guess 1 (index 0) and guess 2 (index 1)
  const nextIndex = currentDemoBoardIndex === 1 ? 1 : 0;
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
