"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = __dirname;
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const game = read("game.js");
const html = read("wu-qiao-jiu-wang.html");
const css = read("styles.css");

function loadBrowserData(file, globalName) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(file), sandbox, { filename: file });
  return sandbox.window[globalName];
}

const data = loadBrowserData("data.js", "WUQIAO_DATA");
const apps = loadBrowserData("apps.js", "WUQIAO_APPS");
const logic = require(path.join(root, "logic.js"));

assert(data && apps && logic, "核心数据未能加载");
assert.strictEqual(data.stages.length, 11, "章节数量异常");
assert.strictEqual(Object.keys(data.routeData).length, 4, "路线数量异常");

for (const [routeId, route] of Object.entries(data.routeData)) {
  assert.strictEqual(route.challenges.length, 3, `${routeId}应有3个场景`);
  assert.strictEqual(route.images.length, 3, `${routeId}场景图片数量异常`);
  for (const challenge of route.challenges) {
    assert(challenge.options.some(([value]) => value === challenge.answer), `${routeId}证据答案不在候选项中`);
    assert.strictEqual(challenge.fills.length, 2, `${routeId}每题应有2个关键词填空`);
    for (const [, answer, options] of challenge.fills) {
      assert(options.some(([value]) => value === answer), `${routeId}关键词答案不在候选项中`);
    }
  }
}

for (const [name, table] of Object.entries(apps.backend.tables)) {
  assert(table.guide && table.takeaway, `${name}缺少小白判读说明`);
  assert(Array.isArray(table.columnHelp) && table.columnHelp.length >= 3, `${name}缺少列名翻译`);
  assert(Array.isArray(table.focusRows) && table.focusRows.every(index => table.rows[index]), `${name}关键行配置无效`);
}

assert(!game.includes('name="reason_'), "仍存在路线自由文本理由");
assert(!game.includes('name="summary"'), "终章仍存在自由摘要输入");
assert(!game.includes("reasonGroups"), "仍使用模糊自由文本关键词判定");
assert(game.includes("小白判读卡") && css.includes(".beginner-card"), "小白判读卡未完整接入");
assert(html.includes("styles.css?v=2.1.0") && html.includes("game.js?v=2.1.0"), "发布缓存版本号未更新");

const refs = new Set();
for (const source of [html, css, read("data.js"), read("apps.js"), game]) {
  for (const match of source.matchAll(/assets\/[A-Za-z0-9._/-]+/g)) refs.add(match[0]);
}
for (const ref of refs) assert(fs.existsSync(path.join(root, ref)), `资源不存在：${ref}`);

const good = {
  f1: "fiction_collective", f2: "composited_later", f3: "asked_to_stop",
  f4: "knew_and_profited", f5: "recovery_mislabel", number: "contact_37",
  owner: "hunan", privacy: "fully_redacted", consent: "limited_consent",
  strategy: "bounded_publish", sources: ["A-22", "E-FWD", "E-VS"],
  summary: "调查保留原帖改写、删帖与收费结算的来源链，说明胡南的相关责任，并隐去当事人的全部可识别信息。"
};
assert.strictEqual(logic.calculateEnding(good, { routes: ["R2", "R4"], routesEver: ["R2", "R4"] }), "S");
assert.strictEqual(logic.calculateEnding(good, { routes: ["R1", "R3"], routesEver: ["R1", "R2", "R3", "R4"] }), "S+");
assert.strictEqual(logic.calculateEnding({ ...good, f1: "real_missing" }, { routes: ["R2", "R4"] }), "A1");
assert.strictEqual(logic.calculateEnding({ ...good, number: "hotline_37" }, { routes: ["R2", "R4"] }), "A2");
assert.strictEqual(logic.calculateEnding({ ...good, strategy: "seal_all" }, { routes: ["R2", "R4"] }), "B1");
assert.strictEqual(logic.calculateEnding({ ...good, f1: "identity_uncertain", f2: "photo_uncertain", f3: "attitude_uncertain", f4: "profit_uncertain" }, { routes: ["R2", "R4"] }), "B2");
assert.strictEqual(logic.calculateEnding({ ...good, owner: "qinhe" }, { routes: ["R2", "R4"] }), "C1");
assert.strictEqual(logic.calculateEnding({ ...good, sources: ["A-22"] }, { routes: ["R2", "R4"] }), "C2");

console.log(`发布校验通过：11章、4路线、12场景、${refs.size}个资源引用、8种结局。`);
