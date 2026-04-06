# Shortcodes

## `[osint_deck]` y `[osint_deck_search]`

Renderizan el buscador / mazo. El nombre `osint_deck` se mantiene por compatibilidad.

```php
[osint_deck_search]
[osint_deck]
[osint_deck category="dominios" access="gratuito" limit="20"]
```

**Atributos:** `category` (nombre o código), `access` (valor en metadatos), `limit` (si es > 0 recorta la lista; `-1` sin límite).

## `[osint_deck_cards]`

Rejilla estática de herramientas.

```php
[osint_deck_cards category="dns" limit="10" orderby="clicks" order="DESC"]
```

**Atributos:** `category`, `tag`, `limit`, `orderby` (`title` | `clicks`), `order` (`ASC` | `DESC`).

?> Usá `osint_deck_cards` cuando solo quieras listar herramientas sin el buscador completo.
