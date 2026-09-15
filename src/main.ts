import { Puzzle, ShareStyle } from './types';
import { PUZZLES, VALID, KEY_ROWS } from './data';
import { dayNumber, stateAt, gridLetters, keyState, complete } from './game';
import { header, share, replaySvg } from './share';

let puzzleNumber: number;
let puzzle: Puzzle;
let answers: string[];
let guesses: string[] = [];
let selected = -1;
let input = "";
let over = false;
let won = false;
let shareStyle: ShareStyle = "waffle";

function pickDaily(): void {
  puzzleNumber = dayNumber();
  puzzle = PUZZLES[(puzzleNumber - 1) % PUZZLES.length];
  answers = [...puzzle.h, ...puzzle.v];
  const puzzleNumEl = document.getElementById("puzzleNumber");
  if (puzzleNumEl) puzzleNumEl.textContent = String(puzzleNumber);
}

function renderBoard(): void {
  const s = stateAt(selected, guesses, answers);
  const letters = gridLetters(puzzle);
  const b = document.getElementById("board");
  if (!b) return;
  b.innerHTML = "";
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const d = document.createElement("div");
      if (!letters[r][c]) {
        d.className = "cell gap";
      } else {
        d.className = "cell" + (s.green[r][c] ? " revealed" : s.yellow[r][c] ? " hint" : "");
        d.textContent = s.green[r][c] ? letters[r][c] : (s.yellow[r][c] || "");
      }
      b.appendChild(d);
    }
  }
}

function renderTyped(): void {
  const p = document.getElementById("typed");
  if (!p) return;
  p.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const d = document.createElement("div");
    d.className = "typed-tile" + (input[i] ? " filled" : "");
    d.textContent = input[i] || "";
    p.appendChild(d);
  }
}

function renderTabs(): void {
  const t = document.getElementById("guessTabs");
  const l = document.getElementById("timelineLabel");
  if (!t || !l) return;
  t.innerHTML = "";
  if (selected < 0) {
    l.textContent = "Your guesses will appear here.";
    return;
  }
  l.textContent = "Showing board after guess " + (selected + 1) + ": " + guesses[selected].toUpperCase();
  guesses.forEach((g, i) => {
    const b = document.createElement("button");
    b.className = "guess-tab" + (i === selected ? " current" : "");
    b.textContent = String(i + 1);
    b.title = g.toUpperCase();
    b.onclick = () => {
      selected = i;
      renderBoard();
      renderTabs();
    };
    t.appendChild(b);
  });
}

function renderKeyboard(): void {
  const k = document.getElementById("keyboard");
  if (!k) return;
  const s = keyState(guesses, answers);
  k.innerHTML = "";
  KEY_ROWS.forEach(row => {
    const r = document.createElement("div");
    r.className = "key-row";
    for (const c of row) {
      const b = document.createElement("button");
      b.className = "key" + (c === "↵" || c === "⌫" ? " wide" : "") + (s[c] ? " " + s[c] : "");
      b.textContent = c === "↵" ? "Enter" : c === "⌫" ? "Delete" : c;
      b.onclick = () => press(c);
      r.appendChild(b);
    }
    k.appendChild(r);
  });
}

function message(text: string, bad = false): void {
  const e = document.getElementById("msg");
  if (!e) return;
  e.textContent = text;
  e.className = "msg" + (bad ? " bad" : "");
}

function press(c: string): void {
  if (over) return;
  if (c === "↵") return submit();
  if (c === "⌫") {
    input = input.slice(0, -1);
    return renderTyped();
  }
  if (/^[a-z]$/.test(c) && input.length < 5) {
    input += c.toUpperCase();
    renderTyped();
  }
}

function submit(): void {
  if (over) return;
  const g = input.toLowerCase();
  input = "";
  renderTyped();
  if (g.length !== 5) return message("Need a 5-letter word.", true);
  if (!VALID.has(g) && !answers.includes(g)) return message("Not in the built-in word list.", true);
  if (guesses.includes(g)) return message("Already guessed.", true);

  guesses.push(g);
  selected = guesses.length - 1;
  const s = stateAt(selected, guesses, answers);
  renderBoard();
  renderTabs();
  renderKeyboard();

  const guessCountEl = document.getElementById("guessCount");
  if (guessCountEl) guessCountEl.textContent = String(guesses.length);

  if (answers.every(w => guesses.includes(w)) || complete(s)) {
    over = true;
    won = true;
    message("Solved in " + guesses.length + " guesses.");
    setTimeout(() => showResults(), 250);
    return;
  }
  if (guesses.length === 10) {
    over = true;
    won = false;
    message("Bust. The words were " + answers.join(", ").toUpperCase() + ".", true);
    setTimeout(() => showResults(), 250);
    return;
  }
  message((10 - guesses.length) + " guesses left.");
}

function renderShare(): void {
  const shareTextEl = document.getElementById("shareText");
  if (shareTextEl) shareTextEl.textContent = share(shareStyle, puzzleNumber, won, guesses, answers);
  document.querySelectorAll<HTMLElement>("[data-style]").forEach(b => {
    b.classList.toggle("active", b.dataset.style === shareStyle);
  });
}

function showResults(): void {
  const resTitle = document.getElementById("resultTitle");
  if (resTitle) resTitle.textContent = won ? "Weavle solved!" : "Weavle — busted";
  const resMsg = document.getElementById("resultMessage");
  if (resMsg) {
    resMsg.textContent = won
      ? "You solved Weavle " + puzzleNumber + " in " + guesses.length + "/10 guesses."
      : "You used all 10 guesses.";
  }
  renderShare();
  document.getElementById("results")?.classList.add("show");
}

async function copyShare(): Promise<void> {
  const shareContent = share(shareStyle, puzzleNumber, won, guesses, answers);
  const copyBtn = document.getElementById("copyShare");
  try {
    await navigator.clipboard.writeText(shareContent);
    if (copyBtn) copyBtn.textContent = "Copied!";
    setTimeout(() => {
      if (copyBtn) copyBtn.textContent = "Copy results";
    }, 1200);
  } catch {
    prompt("Copy results:", shareContent);
  }
}

async function exportReplay(): Promise<void> {
  const b = document.getElementById("makeReplayGif") as HTMLButtonElement | null;
  if (!b) return;
  const old = b.textContent || "";
  b.disabled = true;
  b.textContent = "Making replay…";
  try {
    const svgStr = replaySvg(puzzleNumber, won, guesses, answers);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const name = "weavle-" + puzzleNumber + "-" + (won ? guesses.length : "x") + "-10.svg";
    const file = new File([blob], name, { type: "image/svg+xml" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: "Weavle", text: header(puzzleNumber, won, guesses.length), files: [file] });
    } else {
      const u = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: u, download: name });
      a.click();
      setTimeout(() => URL.revokeObjectURL(u), 1000);
    }
    b.textContent = "Replay saved";
  } catch (e: any) {
    b.textContent = "Replay unavailable";
    alert(e?.message || "Could not create replay.");
  } finally {
    b.disabled = false;
    setTimeout(() => {
      b.textContent = old;
    }, 1500);
  }
}

function reset(): void {
  pickDaily();
  guesses = [];
  selected = -1;
  input = "";
  over = false;
  won = false;
  const guessCountEl = document.getElementById("guessCount");
  if (guessCountEl) guessCountEl.textContent = "0";
  message("Use the keyboard to enter a guess.");
  renderBoard();
  renderTabs();
  renderTyped();
  renderKeyboard();
  document.getElementById("results")?.classList.remove("show");
}

// Event Listeners setup
function initUI(): void {
  const help = document.getElementById("help");
  const results = document.getElementById("results");

  const helpBtn = document.getElementById("helpBtn");
  if (helpBtn) helpBtn.onclick = () => help?.classList.add("show");

  const closeHelp = document.getElementById("closeHelp");
  if (closeHelp) {
    const hideHelp = (e?: Event) => {
      e?.preventDefault();
      help?.classList.remove("show");
    };
    closeHelp.onclick = hideHelp;
    closeHelp.addEventListener("touchstart", hideHelp, { passive: false });
  }

  const closeResults = document.getElementById("closeResults");
  if (closeResults) {
    const hideResults = (e?: Event) => {
      e?.preventDefault();
      results?.classList.remove("show");
    };
    closeResults.onclick = hideResults;
    closeResults.addEventListener("touchstart", hideResults, { passive: false });
  }

  const submitBtn = document.getElementById("submit");
  if (submitBtn) submitBtn.onclick = submit;

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.onclick = reset;

  const copyShareBtn = document.getElementById("copyShare");
  if (copyShareBtn) copyShareBtn.onclick = copyShare;

  const replayBtn = document.getElementById("makeReplayGif");
  if (replayBtn) replayBtn.onclick = exportReplay;

  document.querySelectorAll<HTMLElement>("[data-style]").forEach(b => {
    b.onclick = () => {
      if (b.dataset.style) {
        shareStyle = b.dataset.style as ShareStyle;
        renderShare();
      }
    };
  });

  document.onkeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      help?.classList.remove("show");
      results?.classList.remove("show");
    } else if (!help?.classList.contains("show") && !results?.classList.contains("show")) {
      if (e.key === "Enter") press("↵");
      else if (e.key === "Backspace") press("⌫");
      else if (/^[a-z]$/i.test(e.key)) press(e.key.toLowerCase());
    }
  };

  reset();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUI);
} else {
  initUI();
}
