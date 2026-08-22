(function (root) {
  "use strict";

  const REPORT_VALUES = Object.freeze({
    f1: "fiction_collective",
    f2: "composited_later",
    f3: "asked_to_stop",
    f4: "knew_and_profited",
    f5: "recovery_mislabel",
    number: "contact_37",
    owner: "hunan",
    privacy: "fully_redacted",
    consent: "limited_consent",
    strategy: "bounded_publish"
  });

  const clean = (value = "") => String(value).trim();
  const sourceSet = value => new Set(Array.isArray(value) ? value.map(clean) : clean(value).split(/[\s,，、;；]+/).filter(Boolean));

  function evaluateReport(form = {}, context = {}) {
    const routes = new Set(context.routes || []);
    const ever = new Set(context.routesEver || []);
    const sources = sourceSet(form.sources);
    const factKeys = ["f1", "f2", "f3", "f4", "f5"];
    const uncertainCount = factKeys.filter(key => clean(form[key]).endsWith("_uncertain")).length;
    const factsOk = factKeys.every(key => clean(form[key]) === REPORT_VALUES[key]);
    const sourcesOk = ["A-22", "E-FWD", "E-VS"].every(id => sources.has(id));
    const privacyOk = clean(form.privacy) === REPORT_VALUES.privacy;
    const consentOk = clean(form.consent) === REPORT_VALUES.consent;
    const strategyOk = clean(form.strategy) === REPORT_VALUES.strategy;
    const summaryLength = clean(form.summary).replace(/\s/g, "").length;
    const summaryOk = summaryLength >= 20 && summaryLength <= 120;
    const routePairOk = (routes.has("R2") && routes.has("R4")) || (ever.has("R2") && ever.has("R4"));

    return { routes, ever, sources, uncertainCount, factsOk, sourcesOk, privacyOk, consentOk, strategyOk, summaryOk, routePairOk };
  }

  function calculateEnding(form, context = {}) {
    const check = evaluateReport(form, context);

    if (clean(form.strategy) === "seal_all") return "B1";
    if (check.uncertainCount >= 4) return "B2";
    if (clean(form.f1) === "real_missing" || clean(form.privacy) === "identify_person") return "A1";
    if (clean(form.number) === "hotline_37") return "A2";
    if (clean(form.owner) === "qinhe") return "C1";
    if (clean(form.owner) === "hunan" && !check.sourcesOk) return "C2";
    if (check.factsOk && check.sourcesOk && check.privacyOk && check.consentOk && check.strategyOk && check.summaryOk && check.routePairOk) {
      return check.ever.size === 4 ? "S+" : "S";
    }
    return clean(form.owner) === "hunan" ? "C2" : "B2";
  }

  const api = { REPORT_VALUES, evaluateReport, calculateEnding };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.WUQIAO_LOGIC = api;
})(typeof window !== "undefined" ? window : globalThis);
