// @vitest-environment happy-dom
import { describe, it, expect, beforeAll } from 'vitest';
import { header, share, replayGif } from './share';

beforeAll(() => {
  if (typeof HTMLCanvasElement !== 'undefined') {
    (HTMLCanvasElement.prototype.getContext as any) = function (contextId: string) {
      if (contextId === '2d') {
        return {
          fillRect: () => {},
          fillText: () => {},
          beginPath: () => {},
          moveTo: () => {},
          arcTo: () => {},
          closePath: () => {},
          fill: () => {},
          stroke: () => {},
          roundRect: () => {},
          getImageData: (_x: number, _y: number, w: number, h: number) => {
            return {
              data: new Uint8ClampedArray(w * h * 4),
              width: w,
              height: h,
            };
          },
        };
      }
      return null;
    };
  }
});

describe('share formatting', () => {
  it('formats header correctly', () => {
    expect(header(1, true, 4)).toBe('Weavle 1 4/10');
    expect(header(2, false, 10)).toBe('Weavle 2 X/10');
  });

  it('generates share text', () => {
    const guesses = ['crane'];
    const answers = ['crane', 'slate', 'audio', 'words', 'puzzl', 'weavl'];
    const result = share('waffle', 1, true, guesses, answers);
    expect(result).toContain('Weavle 1 1/10');
  });
});

describe('replayGif', () => {
  it('creates a valid GIF blob with GIF89a header', async () => {
    const guesses = ['crane'];
    const answers = ['crane', 'slate', 'audio', 'words', 'puzzl', 'weavl'];
    const blob = replayGif(1, true, guesses, answers);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/gif');
    expect(blob.size).toBeGreaterThan(0);

    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const magic = String.fromCharCode(...bytes.slice(0, 6));
    expect(magic).toBe('GIF89a');
  });
});
