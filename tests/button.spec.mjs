import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

test('botón Probar: visible, color esperado y captura', async ({ page, browser }, testInfo) => {
  const { dir, sha, expectedFile } = testInfo.project.metadata;
  const evidenceDir = testInfo.config.metadata.evidenceDir;
  const name = testInfo.project.name;
  const expected = JSON.parse(fs.readFileSync(expectedFile, 'utf8'));
  fs.mkdirSync(evidenceDir, { recursive: true });

  // 1) La URL sirve el checkout correcto
  const build = await (await page.request.get('/__build')).json();
  expect(build.sha, `el servidor de "${name}" debe servir ${sha}`).toBe(sha);

  // 2) Estado listo: carga, fuentes y botón
  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const btn = page.getByTestId(expected.buttonTestId);
  await expect(btn).toBeVisible();

  // Sin hover ni foco, scroll arriba
  await page.mouse.move(0, 0);
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });

  // 3) Verificaciones de estado
  await expect(btn).toHaveText(expected.text);
  await expect(btn).toHaveCSS('background-color', hexToRgb(expected.backgroundColor));
  await expect(btn).toHaveCSS('color', hexToRgb(expected.textColor));

  const state = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: el.textContent.trim(),
      type: el.getAttribute('type'),
      hasInlineHandler: el.hasAttribute('onclick'),
      box: { x: r.x, y: r.y, width: r.width, height: r.height },
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      borderRadius: cs.borderRadius,
    };
  });

  // 4) Captura: mismo procedimiento para ambas versiones
  const shot = path.join(evidenceDir, `${name}.png`);
  await page.screenshot({ path: shot, animations: 'disabled', caret: 'hide', fullPage: false });
  await testInfo.attach(`${name}.png`, { path: shot, contentType: 'image/png' });

  fs.writeFileSync(path.join(evidenceDir, `${name}-state.json`), JSON.stringify({
    project: name, sha, servedRoot: dir, expected, measured: state,
    browser: { name: 'chromium', version: browser.version() },
    playwright: testInfo.config.version,
    capturedAt: new Date().toISOString(),
  }, null, 2));

  // 5) En "after": texto, tamaño, posición y comportamiento iguales a "before"
  if (name === 'after') {
    const before = JSON.parse(fs.readFileSync(path.join(evidenceDir, 'before-state.json'), 'utf8')).measured;
    for (const k of ['text', 'type', 'hasInlineHandler', 'box', 'color', 'fontSize', 'fontWeight', 'borderRadius']) {
      expect(state[k], `"${k}" debe mantenerse entre before y after`).toEqual(before[k]);
    }
  }
});
