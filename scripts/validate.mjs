#!/usr/bin/env node
/** Structure checks for this Cursor kit. No dependencies: node scripts/validate.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const SECRET = /(sk_live_|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+[A-Za-z0-9._-]{20,})/;
const LOCAL_PATH = /(\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|C:\\Users\\)/;
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const json = (f) => {
  try { return JSON.parse(read(f)); } catch (e) { errors.push(`${f}: ${e.message}`); return null; }
};
const frontmatter = (text) => {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text.replace(/\r\n/g, '\n'));
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) { const k = /^([A-Za-z-]+):\s*(.*)$/.exec(line); if (k) out[k[1]] = k[2]; }
  return out;
};

const plugin = json('.cursor-plugin/plugin.json');
if (plugin) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(plugin.name ?? '')) errors.push('plugin.json: name must be lowercase with dashes');
  if (!/^\d+\.\d+\.\d+/.test(plugin.version ?? '')) errors.push('plugin.json: version must be semver');
  for (const k of ['description', 'homepage', 'repository', 'license', 'logo']) if (!plugin[k]) errors.push(`plugin.json: ${k} is required`);
  if (plugin.logo && !fs.existsSync(path.join(root, plugin.logo))) errors.push(`plugin.json: logo ${plugin.logo} not found`);
}
for (const f of ['mcp.json', '.mcp.json']) {
  const cfg = json(f);
  if (!cfg) continue;
  const servers = cfg.mcpServers ?? {};
  if (Object.keys(servers).length === 0) errors.push(`${f}: mcpServers must list a server`);
  for (const [name, s] of Object.entries(servers)) {
    try { if (new URL(s.url).protocol !== 'https:') errors.push(`${f}: ${name}.url must be https`); } catch { errors.push(`${f}: ${name}.url is not a URL`); }
    for (const [h, v] of Object.entries(s.headers ?? {})) {
      if (/^authorization$/i.test(h) && !/\$\{(env:)?[A-Z_]+\}/.test(v)) errors.push(`${f}: ${name}.headers.${h} must read the key from an environment variable`);
    }
  }
}
const rulesDir = path.join(root, 'rules');
for (const f of fs.readdirSync(rulesDir)) {
  if (!f.endsWith('.mdc')) { errors.push(`rules/${f}: rules must be .mdc`); continue; }
  const fm = frontmatter(read(`rules/${f}`));
  if (!fm || !fm.description) errors.push(`rules/${f}: frontmatter with description is required`);
}
const skillsDir = path.join(root, 'skills');
for (const d of fs.readdirSync(skillsDir)) {
  const file = path.join('skills', d, 'SKILL.md');
  if (!fs.existsSync(path.join(root, file))) { errors.push(`${file}: missing`); continue; }
  const fm = frontmatter(read(file));
  if (!fm) { errors.push(`${file}: frontmatter required`); continue; }
  if (fm.name !== d) errors.push(`${file}: name "${fm.name}" must equal the folder name "${d}"`);
  if (!fm.description) errors.push(`${file}: description is required`);
}
for (const f of ['README.md', 'LICENSE', 'examples/prompts.md']) if (!fs.existsSync(path.join(root, f))) errors.push(`${f}: missing`);

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.name === '.git' ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
for (const file of walk(root)) {
  const rel = path.relative(root, file);
  if (/(^|\/)(\.env.*|.*\.(pem|key)|\.DS_Store)$/.test(rel)) errors.push(`${rel}: should not be committed`);
  if (/\.(md|mdc|json|mjs)$/.test(rel) || rel === 'LICENSE') {
    const text = fs.readFileSync(file, 'utf8');
    if (rel !== 'scripts/validate.mjs' && SECRET.test(text)) errors.push(`${rel}: looks like a credential`);
    if (rel !== 'scripts/validate.mjs' && LOCAL_PATH.test(text)) errors.push(`${rel}: contains a local filesystem path`);
  }
}
for (const e of errors) console.error(`error: ${e}`);
if (errors.length === 0) console.log('ok: plugin.json, mcp.json, .mcp.json, rules, skills');
process.exit(errors.length ? 1 : 0);
