// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { KEY_ROWS } from './data';

describe('UI Layout and CSS Constraints', () => {
  it('index.html sets overflow hidden and height 100dvh on html and body', () => {
    const htmlPath = path.resolve(__dirname, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    expect(htmlContent).toContain('html,body{height:100%;height:100dvh;margin:0;padding:0;overflow:hidden}');
    expect(htmlContent).toContain('overflow:hidden');
  });

  it('index.html configures keyboard with flex layout and min-width 0', () => {
    const htmlPath = path.resolve(__dirname, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    expect(htmlContent).toContain('.keyboard{width:min(500px,100%);padding:4px 8px 8px;');
    expect(htmlContent).toContain('.key{height:clamp(');
    expect(htmlContent).toContain('flex:1;min-width:0');
    expect(htmlContent).toContain('.key.wide{flex:1.5;');
    expect(htmlContent).toContain('.key-spacer{flex:0.5}');
  });

  it('keyboard layout matches standard QWERTY structure', () => {
    expect(KEY_ROWS[0]).toEqual(["Q","W","E","R","T","Y","U","I","O","P"]);
    expect(KEY_ROWS[1]).toEqual(["A","S","D","F","G","H","J","K","L"]);
    expect(KEY_ROWS[2]).toEqual(["↵","Z","X","C","V","B","N","M","⌫"]);
  });
});
