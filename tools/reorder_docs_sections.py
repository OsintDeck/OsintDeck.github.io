# -*- coding: utf-8 -*-
"""Reordena <section class='docs-section'> dentro de #docs-panel según flujo de manual."""
from pathlib import Path

from bs4 import BeautifulSoup

SECTION_ORDER = [
    "intro",
    "doc-reading-paths",
    "guia-rapida",
    "wordpress-base",
    "install-easy",
    "install-updates",
    "installation",
    "uso-admin",
    "uso-publico",
    "shortcodes",
    "theme-ui",
    "auth-google",
    "tool-reports",
    "github-issues-reparacion",
    "security-performance",
    "validation",
    "user-data",
    "metrics-dashboard",
    "admin",
    "architecture",
    "decision-engine",
    "hooks",
    "ajax",
    "about",
    "features",
    "docs-imagenes",
    "roadmap",
    "acknowledgments",
    "authors",
]

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs.html"


def main() -> None:
    html = DOCS.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    panel = soup.find("div", id="docs-panel")
    if not panel:
        raise SystemExit("No se encontró #docs-panel")

    pager = panel.find("div", class_="docs-section-pager")
    sections = panel.find_all("section", class_=lambda c: c and "docs-section" in c)
    by_id = {s.get("id"): s for s in sections}

    missing = [i for i in SECTION_ORDER if i not in by_id]
    if missing:
        raise SystemExit(f"Faltan secciones: {missing}")
    extra = set(by_id) - set(SECTION_ORDER)
    if extra:
        raise SystemExit(f"Secciones no listadas en ORDER: {extra}")

    for s in sections:
        s.extract()

    if pager:
        panel.append(pager)
    for sid in SECTION_ORDER:
        panel.append(by_id[sid])

    DOCS.write_text(str(soup), encoding="utf-8")
    print("OK: reordenadas", len(SECTION_ORDER), "secciones en", DOCS)


if __name__ == "__main__":
    main()
