// Loads the app logic from the fragments in src/manifest.json, so tests run against source, not a stale build.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SRC = path.join(__dirname, '..', 'src');
const EXPORTS = ['hsBox', 'hsClear', 'hsLayoutBest', 'hsLayerStatus', 'HS_SURFACES', 'hsLeftOff', 'hsFitSuggest',
  'hsWorship', 'hsCabin', 'hsAnalyze', 'Component', 'hsStoryScene', 'hsTellSchedule', 'hsLifePoem', 'hsSceneMoment',
  'hsGenerate', 'hsChecks', 'HS_SAMPLE', 'hsLayout', 'hsContentFrom'];

function loadApp() {
  const run = (py) => spawnSync(py, [path.join(SRC, 'build.py'), '--emit-script'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  let res = run('python3');
  if (res.error) res = run('python');
  if (res.status !== 0) throw new Error('build.py --emit-script failed: ' + (res.stderr || res.error));
  const js = res.stdout;
  const stub = 'class DCLogic{constructor(){this.state={};this.props={}} setState(p){Object.assign(this.state,typeof p==="function"?p(this.state):p)}}\n';
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', stub + js + '\nmodule.exports={' + EXPORTS.join(',') + '};')(mod, mod.exports, require);
  return mod.exports;
}

function builtTemplate() {
  const html = fs.readFileSync(path.join(SRC, '..', 'app', 'index.html'), 'utf8');
  return html.split('<script type="text/x-dc"')[0];
}

module.exports = { loadApp, builtTemplate };
