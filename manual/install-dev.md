# Instalación para desarrollo

Si ya seguiste la [guía fácil](install-easy.md), podés saltar esta sección. Acá se describe copiar el código desde GitHub y usar Composer en tu entorno (no en el hosting si no podés).

## Instalación manual (carpeta + Composer)

1. Clonar o descargar desde [OsintDeck/OsintDeck](https://github.com/OsintDeck/OsintDeck).
2. `composer install` dentro de la carpeta del plugin.
3. Copiar a `wp-content/plugins/osint-deck`.
4. **Plugins → OSINT Deck → Activar** (se aplican migraciones de base de datos).

*Opcional:* importar plantillas JSON o datos desde el panel.

## WP-CLI

```bash
wp plugin activate osint-deck
```

!> Sin `vendor/autoload.php` el plugin fallará. Revisá permisos de escritura para iconos y cachés.
