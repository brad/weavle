import { Puzzle } from "./types";

export function validatePuzzle(puzzle: Puzzle, validWords?: Set<string>): string[] {
  const errors: string[] = [];
  if (!puzzle.h || puzzle.h.length !== 3) {
    errors.push("Horizontal word list must contain exactly 3 words.");
  }
  if (!puzzle.v || puzzle.v.length !== 3) {
    errors.push("Vertical word list must contain exactly 3 words.");
  }
  if (errors.length > 0) return errors;

  const words = [...puzzle.h, ...puzzle.v];
  for (const word of words) {
    if (typeof word !== "string" || word.length !== 5) {
      errors.push("Word " + word + " must be exactly 5 letters long.");
    } else if (validWords && !validWords.has(word.toLowerCase())) {
      errors.push("Word " + word + " is not in the valid dictionary.");
    }
  }

  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  if (uniqueWords.size !== words.length) {
    errors.push("Puzzle contains duplicate words.");
  }

  for (let hIdx = 0; hIdx < 3; hIdx++) {
    for (let vIdx = 0; vIdx < 3; vIdx++) {
      const hChar = puzzle.h[hIdx]?.[vIdx * 2];
      const vChar = puzzle.v[vIdx]?.[hIdx * 2];
      if (hChar !== vChar) {
        errors.push(
          "Mismatch at grid intersection (h[" + hIdx + "][" + (vIdx * 2) + "]='" + hChar + "' vs v[" + vIdx + "][" + (hIdx * 2) + "]='" + vChar + "')."
        );
      }
    }
  }

  return errors;
}

export function validateAllPuzzles(puzzles: Puzzle[], validWords?: Set<string>): void {
  puzzles.forEach((puzzle, idx) => {
    const errors = validatePuzzle(puzzle, validWords);
    if (errors.length > 0) {
      throw new Error("Puzzle " + (idx + 1) + " validation failed:\n  " + errors.join("\n  "));
    }
  });
}
