// Arma evidence/metadata.json con procedencia y condiciones de la corrida.
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.env.EVIDENCE_DIR ?? 'evidence');
fs.mkdirSync(dir, { recursive: true });
const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
const before = read('before-state.json');
const after = read('after-state.json');
const env = process.env;

const meta = {
  repository: env.GITHUB_REPOSITORY ?? null,
  pullRequest: env.PR_NUMBER ? Number(env.PR_NUMBER) : null,
  baseSha: env.BASE_SHA ?? null,
  headSha: env.HEAD_SHA ?? null,
  run: env.GITHUB_RUN_ID ? {
    id: env.GITHUB_RUN_ID,
    attempt: env.GITHUB_RUN_ATTEMPT,
    url: `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`,
  } : null,
  testOutcome: env.TEST_OUTCOME ?? 'unknown',
  versions: {
    node: process.version,
    playwright: before?.playwright ?? after?.playwright ?? null,
    chromium: before?.browser?.version ?? after?.browser?.version ?? null,
    runnerOs: env.RUNNER_OS ?? process.platform,
    runnerImage: env.ImageOS ? `${env.ImageOS} ${env.ImageVersion ?? ''}`.trim() : null,
  },
  conditions: {
    viewport: '1280x720', deviceScaleFactor: 1, colorScheme: 'light', locale: 'es-AR',
    timezone: 'America/Argentina/Buenos_Aires', reducedMotion: 'reduce',
    animations: 'disabled', hoverFocus: 'mouse en (0,0) + blur', route: '/',
    harness: 'tests/ y config del commit base, usados para ambas versiones',
    servers: 'procesos separados: before en :4001 (base), after en :4002 (head)',
  },
  captures: {
    before: before ? { file: 'before.png', sha: before.sha, expected: before.expected, measured: before.measured } : 'missing',
    after: after ? { file: 'after.png', sha: after.sha, expected: after.expected, measured: after.measured } : 'missing',
  },
};
fs.writeFileSync(path.join(dir, 'metadata.json'), JSON.stringify(meta, null, 2));
console.log(JSON.stringify(meta, null, 2));
