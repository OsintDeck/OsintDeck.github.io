/**
 * Panel de documentación: una sección visible, navegación por sidebar, hash y botones Anterior/Siguiente.
 * Eventos: `od-docs-navigate` { id }, `od-docs-step` { delta: ±1 }, `od-docs-section-meta` (emisión).
 */
(function () {
    'use strict';

    let panel;
    let sections = [];
    const idToIndex = {};
    let activeIdx = 0;
    let ready = false;

    function reducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function emitSectionMeta() {
        if (!sections.length) {
            return;
        }
        document.dispatchEvent(
            new CustomEvent('od-docs-section-meta', {
                detail: {
                    id: sections[activeIdx].id,
                    index: activeIdx,
                    total: sections.length,
                    hasPrev: activeIdx > 0,
                    hasNext: activeIdx < sections.length - 1,
                },
            })
        );
    }

    function setActiveNav(id) {
        document.querySelectorAll('.sidebar a[href^="#"]').forEach((a) => {
            const on = a.getAttribute('href') === '#' + id;
            a.classList.toggle('active', on);
        });
    }

    function showSection(id, options) {
        if (!ready) return;
        const opts = options || {};
        const idx = idToIndex[id];
        if (idx === undefined) return;

        const prevIdx = activeIdx;
        if (idx === prevIdx) {
            sections[idx].scrollTop = 0;
            emitSectionMeta();
            return;
        }

        const nextEl = sections[idx];
        activeIdx = idx;

        sections.forEach((s, i) => s.classList.toggle('is-active', i === idx));

        nextEl.scrollTop = 0;
        setActiveNav(id);

        try {
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', '#' + id);
            }
        } catch (e) {
            /* ignore */
        }

        const useGsap =
            opts.animate !== false && !reducedMotion() && typeof gsap !== 'undefined';

        if (useGsap) {
            gsap.killTweensOf(nextEl);
            gsap.fromTo(
                nextEl,
                { autoAlpha: 0.15, y: 28 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.44,
                    ease: 'power3.out',
                    clearProps: 'y',
                }
            );
        }

        emitSectionMeta();
    }

    function goByDelta(delta) {
        const next = activeIdx + delta;
        if (next < 0 || next >= sections.length) return;
        showSection(sections[next].id);
    }

    function init() {
        panel = document.getElementById('docs-panel');
        if (!panel) return;

        sections = Array.from(panel.querySelectorAll('.docs-section'));
        if (!sections.length) return;

        sections.forEach((s, i) => {
            idToIndex[s.id] = i;
        });

        let startId = window.location.hash ? window.location.hash.slice(1) : sections[0].id;
        if (idToIndex[startId] === undefined) {
            startId = sections[0].id;
        }
        activeIdx = idToIndex[startId];

        sections.forEach((s, i) => s.classList.toggle('is-active', i === activeIdx));
        sections[activeIdx].scrollTop = 0;
        setActiveNav(startId);

        ready = true;

        setTimeout(emitSectionMeta, 0);

        document.addEventListener('od-docs-step', (ev) => {
            if (!ready) {
                return;
            }
            const d = ev.detail && ev.detail.delta;
            if (d === -1) {
                goByDelta(-1);
            } else if (d === 1) {
                goByDelta(1);
            }
        });

        document.addEventListener('od-docs-navigate', (ev) => {
            const id = ev.detail && ev.detail.id;
            if (id && idToIndex[id] !== undefined) {
                showSection(id);
            }
        });

        window.addEventListener('hashchange', () => {
            const id = window.location.hash.slice(1);
            if (id && idToIndex[id] !== undefined) {
                activeIdx = idToIndex[id];
                sections.forEach((s, i) => s.classList.toggle('is-active', i === activeIdx));
                sections[activeIdx].scrollTop = 0;
                setActiveNav(id);
                emitSectionMeta();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
