# OsintDeck.github.io

Sitio estático de documentación del plugin **OSINT Deck** para GitHub Pages ([repositorio en GitHub](https://github.com/OsintDeck/OsintDeck.github.io)).

## Contenido

- `index.html` — Presentación y enlaces al ecosistema
- `docs.html` — Manual (instalación, shortcodes, AJAX, administración)
- `issues.html` / `discussions.html` — Integración con GitHub
- `assets/` — CSS, JS, imágenes

## Desarrollo local

Servir la carpeta con cualquier servidor estático, por ejemplo:

```bash
cd OsintDeck.github.io
npx serve .
```

## Licencia

GPL-3.0 (ver `LICENSE`). El plugin WordPress se distribuye bajo GPL-2.0+ según su cabecera; ambas son licencias copyleft GNU compatibles en espíritu.

## Sincronización con el plugin

La documentación en `docs.html` se intenta mantener alineada con la versión publicada en `OSINT_DECK_VERSION` del archivo principal del plugin (`osint-deck.php` del repo [OsintDeck/OsintDeck](https://github.com/OsintDeck/OsintDeck)).
