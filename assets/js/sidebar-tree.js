/**
 * Sidebar de docs: grupos colapsables (acordeón por nivel), búsqueda y sync con ítem activo.
 * En cada <ul> del árbol solo un <li.sidebar-tree__group> hermano permanece expandido.
 */
(function () {
    'use strict';

    const NavId = 'sidebar-nav';

    function getTreeRoot() {
        return document.getElementById(NavId);
    }

    function replaceFeatherInNav() {
        if (typeof feather === 'undefined') {
            return;
        }
        try {
            feather.replace();
        } catch (e) {
            /* ignore */
        }
    }

    function collapseOtherGroupsInParent(parentUl, keepGroup) {
        if (!parentUl) {
            return;
        }
        [...parentUl.children].forEach((li) => {
            if (!li.classList.contains('sidebar-tree__group') || li === keepGroup) {
                return;
            }
            li.classList.remove('is-expanded');
            const b = li.querySelector('.sidebar-tree__toggle');
            if (b) {
                b.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Abre la cadena de grupos que contienen el enlace activo y cierra hermanos (acordeón).
     */
    function syncExpandedFromActiveLink() {
        const tree = getTreeRoot();
        if (!tree) {
            return;
        }
        const active = tree.querySelector('a[href^="#"].active');
        if (!active) {
            return;
        }
        let g = active.closest('.sidebar-tree__group');
        while (g && tree.contains(g)) {
            collapseOtherGroupsInParent(g.parentElement, g);
            g.classList.add('is-expanded');
            const btn = g.querySelector('.sidebar-tree__toggle');
            if (btn) {
                btn.setAttribute('aria-expanded', 'true');
            }
            const parentUl = g.parentElement;
            const outerLi = parentUl && parentUl.parentElement;
            g =
                outerLi && outerLi.classList.contains('sidebar-tree__group') && tree.contains(outerLi)
                    ? outerLi
                    : null;
        }
    }

    function clearInlineDisplay(tree) {
        tree.querySelectorAll('li').forEach((li) => {
            li.style.removeProperty('display');
        });
    }

    function applySearchFilter(term) {
        const tree = getTreeRoot();
        if (!tree) {
            return;
        }
        const t = term.trim().toLowerCase();
        if (!t) {
            clearInlineDisplay(tree);
            syncExpandedFromActiveLink();
            return;
        }

        function filterRecursive(li) {
            if (li.classList.contains('sidebar-tree__group')) {
                const label =
                    (li.querySelector('.sidebar-tree__label') && li.querySelector('.sidebar-tree__label').textContent.toLowerCase()) ||
                    '';
                const ul = li.querySelector(':scope > .sidebar-tree__children');
                let childMatch = false;
                if (ul) {
                    [...ul.children].forEach((child) => {
                        if (filterRecursive(child)) {
                            childMatch = true;
                        }
                    });
                }
                const show = label.includes(t) || childMatch;
                li.style.display = show ? '' : 'none';
                if (show) {
                    li.classList.add('is-expanded');
                    const btn = li.querySelector('.sidebar-tree__toggle');
                    if (btn) {
                        btn.setAttribute('aria-expanded', 'true');
                    }
                }
                return show;
            }
            const a = li.querySelector('a[href^="#"]');
            const tx = a ? a.textContent.toLowerCase() : '';
            const show = tx.includes(t);
            li.style.display = show ? '' : 'none';
            return show;
        }

        [...tree.children].forEach((li) => filterRecursive(li));
    }

    function onToggleClick(ev) {
        const btn = ev.target.closest('.sidebar-tree__toggle');
        if (!btn) {
            return;
        }
        ev.preventDefault();
        const group = btn.closest('.sidebar-tree__group');
        if (!group) {
            return;
        }
        const willOpen = !group.classList.contains('is-expanded');
        if (willOpen) {
            collapseOtherGroupsInParent(group.parentElement, group);
            group.classList.add('is-expanded');
            btn.setAttribute('aria-expanded', 'true');
        } else {
            group.classList.remove('is-expanded');
            btn.setAttribute('aria-expanded', 'false');
        }
    }

    function watchActiveClass() {
        const tree = getTreeRoot();
        if (!tree || !window.MutationObserver) {
            return;
        }
        const obs = new MutationObserver(() => {
            syncExpandedFromActiveLink();
        });
        tree.querySelectorAll('a[href^="#"]').forEach((a) => {
            obs.observe(a, { attributes: true, attributeFilter: ['class'] });
        });
    }

    function bindSearch() {
        const input = document.getElementById('sidebar-search');
        if (!input) {
            return;
        }
        input.addEventListener('input', () => {
            applySearchFilter(input.value);
        });
    }

    function init() {
        const tree = getTreeRoot();
        if (!tree || !tree.classList.contains('sidebar-tree')) {
            return;
        }

        tree.addEventListener('click', onToggleClick);
        bindSearch();

        replaceFeatherInNav();
        syncExpandedFromActiveLink();
        watchActiveClass();

        requestAnimationFrame(() => {
            replaceFeatherInNav();
            syncExpandedFromActiveLink();
        });

        window.addEventListener(
            'hashchange',
            () => {
                syncExpandedFromActiveLink();
            },
            false
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
