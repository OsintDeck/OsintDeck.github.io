import re
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "docs.html"
want = {"intro", "doc-reading-paths", "guia-rapida", "install-updates", "architecture", "auth-google"}
for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
    for wid in want:
        if f'id="{wid}"' in line and "<section" in line:
            print(i, wid)
            break
