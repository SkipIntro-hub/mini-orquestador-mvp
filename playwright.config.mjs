// Dos modos:
//  - Local (por defecto): un proyecto "local" contra ./app, expectativas de ./expected-state.json.
//  - PR (CAPTURE_MODE=pr): proyectos "before" y "after", cada uno con su propio servidor
//    (procesos separados) sirviendo el checkout de base y de head respectivamente.
import { defineConfig } from '@playwright/test';
import path from 'node:path';

const PR = process.env.CAPTURE_MODE === 'pr';
const EVIDENCE_DIR = path.resolve(process.env.EVIDENCE_DIR ?? 'evidence');

const sharedUse = {
  browserName: 'chromium',
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
  locale: 'es-AR',
  timezoneId: 'America/Argentina/Buenos_Aires',
  reducedMotion: 'reduce',
  trace: 'retain-on-failure',
};

function target(name, port, dir, sha, expectedFile) {
  return {
    project: { name, use: { ...sharedUse, baseURL: `http://127.0.0.1:${port}` }, metadata: { dir, sha, expectedFile } },
    server: {
      command: `node scripts/serve.mjs "${dir}" ${port} ${sha}`,
      url: `http://127.0.0.1:${port}/__build`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
  };
}

const targets = PR
  ? [
      target('before', 4001, process.env.BEFORE_DIR, process.env.BASE_SHA, process.env.BEFORE_EXPECTED),
      target('after', 4002, process.env.AFTER_DIR, process.env.HEAD_SHA, process.env.AFTER_EXPECTED),
    ]
  : [target('local', 4000, path.resolve('app'), 'local', path.resolve('expected-state.json'))];

if (PR) targets[1].project.dependencies = ['before']; // after compara geometría contra before

export default defineConfig({
  testDir: 'tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { outputFolder: path.join(EVIDENCE_DIR, 'playwright-report'), open: 'never' }]],
  outputDir: 'test-results',
  metadata: { evidenceDir: EVIDENCE_DIR },
  projects: targets.map((t) => t.project),
  webServer: targets.map((t) => t.server),
});
