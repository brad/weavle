import { ShareStyle } from './types';
import { summary, stateAt } from './game';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export function header(puzzleNumber: number, won: boolean, guessCount: number): string {
  return "Weavle " + puzzleNumber + " " + (won ? guessCount : "X") + "/10";
}

export function waffle(puzzleNumber: number, won: boolean, guesses: string[], answers: string[]): string {
  let x = header(puzzleNumber, won, guesses.length) + "\n";
  guesses.forEach((g, i) => {
    const s = summary(g, answers);
    x += (s.green ? "🟩" : "⬛") + (s.yellow ? "🟨" : "⬛") + ((i + 1) % 5 === 0 ? "\n" : " ");
  });
  return x.trim();
}

export function trail(puzzleNumber: number, won: boolean, guesses: string[], answers: string[]): string {
  return header(puzzleNumber, won, guesses.length) + "\n" + guesses.map(g => {
    const s = summary(g, answers);
    return "🟩".repeat(Math.min(5, s.green)) +
      "🟨".repeat(Math.min(5 - s.green, s.yellow)) +
      "⬛".repeat(Math.max(0, 5 - Math.min(5, s.green + s.yellow)));
  }).join("\n");
}

export function cards(puzzleNumber: number, won: boolean, guesses: string[], answers: string[]): string {
  return header(puzzleNumber, won, guesses.length) + "\n" + guesses.map(g => {
    const s = summary(g, answers);
    return (s.green ? "🟩" : "⬛") +
      (s.yellow ? "🟨" : "⬛") +
      (s.green >= 2 ? "🟩" : "⬛") +
      (s.yellow >= 2 ? "🟨" : "⬛") +
      (s.green >= 3 ? "🟩" : "⬛");
  }).join("\n");
}

export function share(style: ShareStyle, puzzleNumber: number, won: boolean, guesses: string[], answers: string[]): string {
  return style === "trail" ? trail(puzzleNumber, won, guesses, answers) :
         style === "cards" ? cards(puzzleNumber, won, guesses, answers) :
         waffle(puzzleNumber, won, guesses, answers);
}

export function replaySvg(puzzleNumber: number, won: boolean, guesses: string[], answers: string[]): string {
  const frames = [];
  for (let i = -1; i < guesses.length; i++) {
    frames.push(stateAt(i, guesses, answers));
  }
  const last = stateAt(guesses.length - 1, guesses, answers);
  frames.push(last);

  let rects = "";
  const x0 = 52, y0 = 145, size = 43, gap = 7;
  const shape = [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1]
  ];

  for (let f = 0; f < frames.length; f++) {
    let group = "";
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (shape[r][c]) {
          const st = frames[f];
          const fill = st.green[r][c] ? "#3aa35a" : st.yellow[r][c] ? "#c9a227" : "#243044";
          group += `<rect x="${x0 + c * (size + gap)}" y="${y0 + r * (size + gap)}" width="${size}" height="${size}" rx="8" fill="${fill}" stroke="#718098" stroke-width="2"/>`;
        }
      }
    }
    rects += `<g opacity="0"><set attributeName="opacity" to="1" begin="${f * 0.8}s" dur=".8s" fill="freeze"/><set attributeName="opacity" to="0" begin="${(f + 1) * 0.8}s" dur=".01s" fill="freeze"/>${group}</g>`;
  }

  const hdr = header(puzzleNumber, won, guesses.length);
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="360" height="520" viewBox="0 0 360 520"><rect width="360" height="520" fill="#0f1419"/><style>text{font-family:Arial,sans-serif;text-anchor:middle}</style><text x="180" y="45" fill="#e8eef7" font-size="27" font-weight="800">WEAVLE</text><text x="180" y="72" fill="#8b9bb4" font-size="15">${hdr}</text>${rects}<text x="180" y="465" fill="#8b9bb4" font-size="14">Spoiler-free replay</text></svg>`;
}

export function replayGif(puzzleNumber: number, won: boolean, guesses: string[], answers: string[]): Blob {
  const canvas = document.createElement("canvas");
  canvas.width = 360;
  canvas.height = 520;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  const frames = [];
  for (let i = -1; i < guesses.length; i++) {
    frames.push(stateAt(i, guesses, answers));
  }
  const last = stateAt(guesses.length - 1, guesses, answers);
  frames.push(last);

  const gif = GIFEncoder();
  const x0 = 52, y0 = 145, size = 43, gap = 7;
  const shape = [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1]
  ];
  const hdr = header(puzzleNumber, won, guesses.length);

  for (let f = 0; f < frames.length; f++) {
    ctx.fillStyle = "#0f1419";
    ctx.fillRect(0, 0, 360, 520);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "800 27px Arial, sans-serif";
    ctx.fillStyle = "#e8eef7";
    ctx.fillText("WEAVLE", 180, 45);

    ctx.font = "15px Arial, sans-serif";
    ctx.fillStyle = "#8b9bb4";
    ctx.fillText(hdr, 180, 72);

    const st = frames[f];
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#718098";

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (shape[r][c]) {
          const fill = st.green[r][c] ? "#3aa35a" : st.yellow[r][c] ? "#c9a227" : "#243044";
          const x = x0 + c * (size + gap);
          const y = y0 + r * (size + gap);

          ctx.fillStyle = fill;
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x, y, size, size, 8);
          } else {
            const radius = 8;
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + size, y, x + size, y + size, radius);
            ctx.arcTo(x + size, y + size, x, y + size, radius);
            ctx.arcTo(x, y + size, x, y, radius);
            ctx.arcTo(x, y, x + size, y, radius);
            ctx.closePath();
          }
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    ctx.font = "14px Arial, sans-serif";
    ctx.fillStyle = "#8b9bb4";
    ctx.fillText("Spoiler-free replay", 180, 465);

    const imgData = ctx.getImageData(0, 0, 360, 520);
    const palette = quantize(imgData.data, 256);
    const index = applyPalette(imgData.data, palette);
    gif.writeFrame(index, 360, 520, { palette, delay: 800 });
  }

  gif.finish();
  const bytes = gif.bytes();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "image/gif" });
}
