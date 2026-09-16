// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Layout and Keyboard HTML/CSS structure', () => {
  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    document.documentElement.innerHTML = html;
  });

  it('contains overflow: hidden on html and body in styles', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    expect(html).toContain('overflow:hidden');
    expect(html).toContain('height:100dvh');
  });

  it('has key-spacer CSS defined for keyboard alignment', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    expect(html).toContain('.key-spacer{flex:0.5;pointer-events:none}');
    expect(html).toContain('.key{flex:1;min-width:0;max-width:44px');
  });
});
