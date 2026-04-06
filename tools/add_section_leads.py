# -*- coding: utf-8 -*-
"""Inserta docs-section-lead tras h2 en secciones clave (docs.html ya reordenado por BS)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / "docs.html"
text = DOC.read_text(encoding="utf-8")

LEAD_GUIA = """<div class="docs-section-lead">
<p><strong>En esta sección.</strong> Secuencia mínima para pasar de “no tengo nada” a “el mazo visible en una página”.
<strong>Antes:</strong> leé <a href="#doc-reading-paths">Estructura del manual</a> si no sabés por dónde seguir.
<strong>Después:</strong> <a href="#wordpress-base">Tener WordPress</a> → <a href="#install-easy">ZIP</a> →
<a href="#uso-publico">Web pública</a>.</p>
</div>
"""

LEAD_INSTALL_UPDATES = """<div class="docs-section-lead">
<p><strong>En esta sección.</strong> Requisitos de servidor, Composer, ZIP con <code>vendor/</code> y actualizaciones remotas.
<strong>Audiencia:</strong> quien despliega el plugin (administrador o DevOps).
<strong>Después:</strong> <a href="#installation">Composer / WP-CLI</a> si trabajás desde el código, o saltá a
<a href="#uso-admin">Escritorio WP</a> si ya instalaste.</p>
</div>
"""

LEAD_ARCH = """<div class="docs-section-lead">
<p><strong>En esta sección.</strong> Mapa de carpetas bajo <code>src/</code> y separación de capas (Domain, Infrastructure,
Presentation).
<strong>Audiencia:</strong> desarrolladores y quienes mantienen el código.
<strong>Antes:</strong> conviene haber leído la puesta en marcha; <strong>después:</strong>
<a href="#decision-engine">Motor de decisiones</a> y <a href="#ajax">Referencia AJAX</a>.</p>
</div>
"""

LEAD_SECURITY = """<div class="docs-section-lead">
<p><strong>En esta sección.</strong> Turnstile, TLDs, logs y coste de las rutas públicas.
<strong>Audiencia:</strong> integradores y administradores preocupados por abuso y rendimiento.
<strong>Relacionado:</strong> <a href="#auth-google">Google</a>, <a href="#tool-reports">Reportes</a>,
<a href="#validation">Dominios / TLDs</a>.</p>
</div>
"""

LEAD_AUTH = """<div class="docs-section-lead">
<p><strong>En esta sección.</strong> OAuth de Google para visitantes del mazo (no usuarios wp-admin), flujo de token y datos
guardados en tablas del plugin.
<strong>Antes:</strong> <a href="#security-performance">Turnstile</a> si lo tenés activo (afecta el login AJAX).
<strong>Después:</strong> <a href="#user-data">Historial y favoritos</a>.</p>
</div>
"""


import re

m = re.search(
    r'(<section class="docs-section reveal" id="guia-rapida">\s*<h2>[^<]+</h2>)',
    text,
)
if m and LEAD_GUIA.strip() not in text:
    text = text[: m.end(1)] + "\n" + LEAD_GUIA + text[m.end(1) :]

m = re.search(
    r'(<section class="docs-section reveal" id="install-updates">\s*<h2>[^<]+</h2>)',
    text,
)
if m and "Requisitos de servidor" not in text:  # unique string in LEAD
    text = text[: m.end(1)] + "\n" + LEAD_INSTALL_UPDATES + text[m.end(1) :]

m = re.search(
    r'(<section class="docs-section reveal" id="architecture">\s*<h2>[^<]+</h2>)',
    text,
)
if m and "Mapa de carpetas" not in text:
    text = text[: m.end(1)] + "\n" + LEAD_ARCH + text[m.end(1) :]

m = re.search(
    r'(<section class="docs-section reveal" id="security-performance">\s*<h2>[^<]+</h2>)',
    text,
)
if m and "integradores y administradores" not in text:
    text = text[: m.end(1)] + "\n" + LEAD_SECURITY + text[m.end(1) :]

m = re.search(
    r'(<section class="docs-section reveal" id="auth-google">\s*<h2>[^<]+</h2>)',
    text,
)
if m and "OAuth de Google para visitantes" not in text:
    text = text[: m.end(1)] + "\n" + LEAD_AUTH + text[m.end(1) :]

DOC.write_text(text, encoding="utf-8")
print("OK leads")
