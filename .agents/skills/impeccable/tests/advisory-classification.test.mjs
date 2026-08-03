import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { finding } from '../scripts/detector/findings.mjs';
import { isAdvisoryRule } from '../scripts/detector/registry/antipatterns.mjs';
import {
  DEFAULT_CONFIG,
  filterFindings,
  isAdvisoryFinding,
  runHook,
  runStopHook,
} from '../scripts/hook-lib.mjs';

const detectScript = fileURLToPath(new URL('../scripts/detect.mjs', import.meta.url));

async function withFixtureProject(run) {
  const root = await mkdtemp(path.join(tmpdir(), 'impeccable-advisory-'));
  try {
    await writeFile(path.join(root, 'PRODUCT.md'), '# Product\n\n## Platform\n\nweb\n');
    await writeFile(
      path.join(root, 'DESIGN.md'),
      '---\nname: Fixture\ndescription: Detector fixture\nrounded:\n  documented: "12px"\n---\n',
    );
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function runDetector(root, ...args) {
  return spawnSync(process.execPath, [detectScript, ...args], {
    cwd: root,
    encoding: 'utf8',
  });
}

function editEvent(root, file, sessionId) {
  return {
    hook_event_name: 'PostToolUse',
    tool_name: 'Edit',
    tool_input: { file_path: file },
    cwd: root,
    session_id: sessionId,
  };
}

test('severity-only advisory rules are canonical advisory findings', () => {
  const radius = finding('design-system-radius', 'fixture.css', '14px', 1);

  assert.equal(radius.severity, 'advisory');
  assert.equal(radius.advisory, true);
  assert.equal(isAdvisoryRule('design-system-radius'), true);
  assert.equal(isAdvisoryFinding(radius), true);
  assert.deepEqual(filterFindings([radius], '', '.css', DEFAULT_CONFIG), []);
  assert.deepEqual(
    filterFindings(
      [radius],
      '',
      '.css',
      { ...DEFAULT_CONFIG, advisoryRules: 'include' },
    ),
    [radius],
  );
});

test('advisory-only CLI scans exit cleanly while genuine failures still exit 2', async () => {
  await withFixtureProject(async (root) => {
    await writeFile(path.join(root, 'advisory.css'), '.fixture { border-radius: 14px; }\n');
    await writeFile(
      path.join(root, 'failure.css'),
      '.fixture { color: transparent; background: linear-gradient(#fff, #000); background-clip: text; }\n',
    );

    const advisory = runDetector(root, '--json', 'advisory.css');
    const advisoryFindings = JSON.parse(advisory.stdout);
    assert.equal(advisory.status, 0);
    assert.equal(advisoryFindings.length, 1);
    assert.equal(advisoryFindings[0].antipattern, 'design-system-radius');
    assert.equal(advisoryFindings[0].advisory, true);

    const failure = runDetector(root, '--json', '--no-design-system', 'failure.css');
    const failureFindings = JSON.parse(failure.stdout);
    assert.equal(failure.status, 2);
    assert.equal(failureFindings.some((item) => item.antipattern === 'gradient-text'), true);
  });
});

test('the hook suppresses advisory-only findings but still emits genuine failures', async () => {
  await withFixtureProject(async (root) => {
    const file = path.join(root, 'fixture.css');
    await writeFile(file, '.fixture {}\n');

    const advisory = await runHook({
      stdinJson: editEvent(root, file, 'advisory-session'),
      cwd: root,
      env: { IMPECCABLE_HOOK_QUIET: '1' },
      detector: {
        detectText: () => [{
          antipattern: 'design-system-radius',
          severity: 'advisory',
          file,
          line: 1,
          snippet: '14px',
        }],
      },
    });
    assert.equal(advisory.exitCode, 0);
    assert.equal(advisory.emission, undefined);
    assert.equal(advisory.audit.freshFindings, 0);

    const failure = await runHook({
      stdinJson: editEvent(root, file, 'failure-session'),
      cwd: root,
      env: { IMPECCABLE_HOOK_QUIET: '1' },
      detector: {
        detectText: () => [{
          antipattern: 'gradient-text',
          severity: 'warning',
          file,
          line: 1,
          snippet: 'background-clip: text + gradient',
        }],
      },
    });
    assert.equal(failure.exitCode, 0);
    assert.equal(failure.emission?.kind, 'fresh');
    assert.equal(failure.audit.freshFindings, 1);
  });
});

test('Stop-loop protection exits before scanning when re-entered', async () => {
  let scans = 0;
  const result = await runStopHook({
    stdinJson: {
      hook_event_name: 'Stop',
      stop_hook_active: true,
      cwd: process.cwd(),
      session_id: 'stop-loop-fixture',
    },
    detector: {
      detectText: () => {
        scans += 1;
        return [];
      },
    },
  });

  assert.equal(result.exitCode, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.audit.skipped, 'stop-hook-active');
  assert.equal(scans, 0);
});
