# -*- coding: utf-8 -*-
"""AI PriceHub 自动化数据抓取脚本

每日从开源数据库 icexun/ai-token-price 拉取最新数据，生成本地快照
static/aiprice/data.json，供 AI PriceHub.html 直接读取（避免跨域、可离线）。

数据来源（GitHub raw）：
  - prices.json       模型价格（顶层可能为数组，或为 {data:[...]}）
  - plans.json        订阅计划（顶层 {plans:[...]}）
  - active_deals.json 活跃优惠（顶层 {deals:[...]}）

生成的 data.json 结构：
  {
    "fetched_at":      "2026-08-19 12:00:00"   # 本机抓取时间（北京时间）
    "source_repo":     "github.com/icexun/ai-token-price"
    "prices":  { "source_updated_at": ..., "data": [...] },
    "plans":   { "source_updated_at": ..., "data": [...] },
    "deals":   { "source_updated_at": ..., "data": [...] }
  }
页面据此在顶部标注「数据更新时间」。

用法：
  python _gen_aiprice_data.py            # 从 GitHub raw 拉取并生成
  python _gen_aiprice_data.py --local    # 仅使用已缓存到 ./_cache 的文件（离线调试）
  python _gen_aiprice_data.py --force    # 强制重新生成（缓存命中也重新拉取）

依赖：仅标准库（urllib / json / os / datetime）。
"""
import argparse
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone, timedelta

BASE = os.path.dirname(os.path.abspath(__file__))
RAW_BASE = "https://raw.githubusercontent.com/icexun/ai-token-price/main"
OUT_DIR = os.path.join(BASE, "static", "aiprice")
OUT_FILE = os.path.join(OUT_DIR, "data.json")
CACHE_DIR = os.path.join(BASE, "_cache")

# 各数据源在 JSON 中的数组候选键（按顺序尝试，最后自动探测首个数组值）
FILES = {
    "prices": ("prices.json", ["data", "prices"]),
    "plans": ("plans.json", ["plans", "data"]),
    "deals": ("active_deals.json", ["deals", "data"]),
}


def log(msg):
    print("[gen] " + msg, flush=True)


def fetch_json(name, fname, use_local):
    if use_local:
        path = os.path.join(CACHE_DIR, fname)
        if not os.path.exists(path):
            raise FileNotFoundError("本地缓存缺失: " + path)
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    url = "{}/{}".format(RAW_BASE, fname)
    last_err = None
    for attempt in range(1, 4):  # 失败重试最多 3 次
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"},
            )
            # 设置更长的超时（连接 30s，读取 120s），应对大文件 / 慢速网络
            import socket
            socket.setdefaulttimeout(120)
            with urllib.request.urlopen(req, timeout=120) as resp:
                raw = resp.read()
            data = json.loads(raw.decode("utf-8"))
            socket.setdefaulttimeout(None)
            # 写缓存，便于离线调试 / 断网兜底
            try:
                os.makedirs(CACHE_DIR, exist_ok=True)
                with open(os.path.join(CACHE_DIR, fname), "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
            except Exception as e:  # noqa
                log("写入缓存失败（可忽略）: " + str(e))
            return data
        except Exception as e:  # noqa
            last_err = e
            log("拉取 {} 第 {} 次失败：{}".format(fname, attempt, e))
    raise last_err


def extract_array(obj, *candidate_keys):
    """从对象中提取数组：依次尝试候选键，最后自动探测顶层首个数组值。"""
    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict):
        for k in candidate_keys:
            if isinstance(obj.get(k), list):
                return obj[k]
        for v in obj.values():
            if isinstance(v, list):
                return v
    return []


def best_updated_at(obj, items):
    """优先取顶层 updated_at；否则从条目内的 updated_at 取最新时间。"""
    if isinstance(obj, dict) and obj.get("updated_at"):
        return obj["updated_at"]
    latest = None
    for it in items or []:
        if isinstance(it, dict) and it.get("updated_at"):
            ts = it["updated_at"]
            if latest is None or ts > latest:
                latest = ts
    return latest


def meta(obj, key, default=None):
    return obj.get(key) if isinstance(obj, dict) else default


def main():
    ap = argparse.ArgumentParser(description="AI PriceHub 数据自动化抓取")
    ap.add_argument("--local", action="store_true", help="使用本地缓存 _cache 下的文件")
    ap.add_argument("--force", action="store_true", help="忽略已生成文件，强制重新拉取")
    args = ap.parse_args()

    if os.path.exists(OUT_FILE) and not args.force and not args.local:
        log("data.json 已存在，使用 --force 可强制重新生成（自动化任务每次都会重新拉取）。")

    # 拉取三份原始数据，分别保存原始对象与解析出的数组
    raw = {}
    for name, (fname, keys) in FILES.items():
        try:
            obj = fetch_json(name, fname, args.local)
        except Exception as e:
            log("拉取 {} 失败：{}".format(name, e))
            raise SystemExit(1)
        arr = extract_array(obj, *keys)
        raw[name] = {
            "obj": obj,
            "data": arr,
            "source_updated_at": best_updated_at(obj, arr),
            "total_plans": meta(obj, "total_plans"),
            "category_counts": meta(obj, "category_counts"),
            "total_deals": meta(obj, "total_deals"),
            "featured_deals": meta(obj, "featured_deals"),
        }
        log("{}: {} 条".format(name, len(arr)))

    # 抓取时间（北京时间）
    tz_cn = timezone(timedelta(hours=8))
    fetched_at = datetime.now(tz_cn).strftime("%Y-%m-%d %H:%M:%S")

    out = {
        "fetched_at": fetched_at,
        "source_repo": "github.com/icexun/ai-token-price",
        "prices": {
            "source_updated_at": raw["prices"]["source_updated_at"],
            "data": raw["prices"]["data"],
        },
        "plans": {
            "source_updated_at": raw["plans"]["source_updated_at"],
            "total_plans": raw["plans"]["total_plans"],
            "category_counts": raw["plans"]["category_counts"],
            "data": raw["plans"]["data"],
        },
        "deals": {
            "source_updated_at": raw["deals"]["source_updated_at"],
            "total_deals": raw["deals"]["total_deals"],
            "featured_deals": raw["deals"]["featured_deals"],
            "data": raw["deals"]["data"],
        },
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    log("已生成 {} （本机抓取时间 {}）".format(OUT_FILE, fetched_at))
    log("价格模型 {} / 订阅计划 {} / 活跃优惠 {}".format(
        len(out["prices"]["data"]), len(out["plans"]["data"]), len(out["deals"]["data"])))


if __name__ == "__main__":
    main()
