"""Generate the website update log from Git history."""

from __future__ import annotations

import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "static" / "update-log.json"
MAX_ENTRIES = 80
BOT_PREFIX = "chore: auto-update website update log"


def git_log() -> str:
    result = subprocess.run(
        [
            "git",
            "log",
            f"-n{MAX_ENTRIES + 20}",
            "--date=iso-strict",
            "--pretty=format:%H%x1f%ad%x1f%an%x1f%s",
        ],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return result.stdout


def build_entries() -> list[dict[str, str]]:
    entries = []
    for line in git_log().splitlines():
        commit, date, author, subject = line.split("\x1f", 3)
        if subject.startswith(BOT_PREFIX):
            continue
        parsed = datetime.fromisoformat(date)
        entries.append(
            {
                "commit": commit[:7],
                "date": parsed.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                "author": author,
                "message": subject,
                "url": f"https://github.com/xllgreen/xllgreen.github.io/commit/{commit}",
            }
        )
        if len(entries) >= MAX_ENTRIES:
            break
    return entries


def main() -> None:
    OUTPUT.write_text(
        json.dumps(
            {
                "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                "entries": build_entries(),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
