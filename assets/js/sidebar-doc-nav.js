/**
 * Pager estilo “blog”: Anterior / Siguiente en la sidebar de docs.
 * Usa od-docs-step → docs-panel.js; escucha od-docs-section-meta para disabled.
 */
(function () {
    'use strict';

    function replaceFeatherPager() {
        if (typeof feather === 'undefined') {
            return;
        }
        try {
            const root = document.querySelector('.docs-section-pager');
            if (root) {
                feather.replace();
            }
        } catch (e) {
            /* ignore */
        }
    }

    function bind() {
        const prev = document.getElementById('sidebar-pager-prev');
        const next = document.getElementById('sidebar-pager-next');
        if (!prev || !next) {
            return;
        }

        prev.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('od-docs-step', { detail: { delta: -1 } }));
        });
        next.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('od-docs-step', { detail: { delta: 1 } }));
        });

        document.addEventListener('od-docs-section-meta', (ev) => {
            const d = ev.detail;
            if (!d) {
                return;
            }
            prev.disabled = !d.hasPrev;
            next.disabled = !d.hasNext;
        });

        replaceFeatherPager();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();
