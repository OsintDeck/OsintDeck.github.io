/**
 * Pantalla de entrada solo en docs.html: cortina, copy y logo que vuela al header.
 * Requiere clase html.od-docs-entry-pending (set en <head> si no hay reduced-motion).
 */
(function () {
    'use strict';

    function finalizeDocsEntryUi() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        if (typeof feather !== 'undefined') {
            try {
                feather.replace();
            } catch (e) {
                /* ignore */
            }
        }
        window.dispatchEvent(new CustomEvent('od-docs-entry-done'));
    }

    /**
     * Tras el logo en el header (pos. 1): sacudida → “clon” → vuelo al hero (pos. 2).
     */
    function runDocsHeroLogoClone(headerLogo) {
        const heroLogo = document.querySelector('.docs-hero-logo img');
        const docsHeaderEls = document.querySelectorAll('.docs-header > *');

        if (!heroLogo) {
            if (docsHeaderEls.length) {
                gsap.to(docsHeaderEls, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.48,
                    stagger: 0.09,
                    ease: 'power2.out',
                    onComplete: finalizeDocsEntryUi,
                });
            } else {
                finalizeDocsEntryUi();
            }
            return;
        }

        const src = headerLogo.currentSrc || headerLogo.src;
        const clone = document.createElement('img');
        clone.className = 'docs-hero-logo-clone';
        clone.src = src;
        clone.alt = '';
        clone.decoding = 'async';
        document.body.appendChild(clone);

        const hr = headerLogo.getBoundingClientRect();
        gsap.set(clone, {
            position: 'fixed',
            left: hr.left + hr.width / 2,
            top: hr.top + hr.height / 2,
            xPercent: -50,
            yPercent: -50,
            width: hr.width,
            height: 'auto',
            autoAlpha: 0,
            zIndex: 10070,
            force3D: true,
        });

        const flight = { dx: 0, dy: 0, sc: 1 };

        const tl = gsap.timeline({
            onComplete: () => {
                if (clone.parentNode) {
                    clone.remove();
                }
                finalizeDocsEntryUi();
            },
        });

        /* Sacudida amortiguada: golpe inicial + oscilaciones que van perdiendo fuerza (más “física” que yoyo mecánico) */
        tl.to(headerLogo, {
            force3D: true,
            keyframes: [
                { x: -12, y: 5, rotation: -2.5, duration: 0.058, ease: 'power3.out' },
                { x: 14, y: -4, rotation: 3, duration: 0.068, ease: 'power2.inOut' },
                { x: -9, y: 3, rotation: -2, duration: 0.056, ease: 'power2.inOut' },
                { x: 7, y: -2.5, rotation: 1.5, duration: 0.052, ease: 'power2.inOut' },
                { x: -5, y: 1.5, rotation: -0.95, duration: 0.048, ease: 'power2.inOut' },
                { x: 3.5, y: -1, rotation: 0.65, duration: 0.045, ease: 'power2.inOut' },
                { x: -2, y: 0.6, rotation: -0.38, duration: 0.042, ease: 'power2.out' },
                { x: 1, y: -0.35, rotation: 0.18, duration: 0.038, ease: 'power2.inOut' },
                { x: 0, y: 0, rotation: 0, duration: 0.15, ease: 'power3.out' },
            ],
        })
            .set(headerLogo, { clearProps: 'x,y,rotation' })
            .set(clone, { autoAlpha: 1 }, '-=0.2')
            .fromTo(
                clone,
                { scale: 0.86 },
                { scale: 1.06, duration: 0.22, ease: 'back.out(1.45)' },
                '<'
            )
            .add('dash', '+=0.14')
            .call(() => {
                const cr = clone.getBoundingClientRect();
                const tr = heroLogo.getBoundingClientRect();
                flight.sc = tr.width / cr.width;
                flight.dx = tr.left + tr.width / 2 - (cr.left + cr.width / 2);
                flight.dy = tr.top + tr.height / 2 - (cr.top + cr.height / 2);
            }, null, 'dash')
            .to(
                clone,
                {
                    x: () => flight.dx,
                    y: () => flight.dy,
                    scale: () => flight.sc,
                    duration: 0.92,
                    ease: 'power3.inOut',
                },
                'dash'
            )
            .set(heroLogo, { autoAlpha: 1 }, 'dash+=0.78')
            .set(clone, { autoAlpha: 0 }, 'dash+=0.78')
            .call(() => {
                if (clone.parentNode) {
                    clone.remove();
                }
            }, null, 'dash+=0.8')
            .fromTo(
                heroLogo,
                { scale: 0.94 },
                { scale: 1, duration: 0.32, ease: 'power2.out', clearProps: 'scale' },
                'dash+=0.78'
            );

        if (docsHeaderEls.length) {
            tl.fromTo(
                docsHeaderEls,
                { autoAlpha: 0, y: 16 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.52,
                    stagger: 0.095,
                    ease: 'power2.out',
                },
                'dash+=0.55'
            );
        }
    }

    function finishEntry(headerLogo) {
        document.documentElement.classList.remove('od-docs-entry-pending');
        document.body.classList.remove('docs-page--entry-running');
        gsap.set(headerLogo, { autoAlpha: 1, clearProps: 'transform' });
        gsap.to('header .nav-links a', {
            y: 0,
            autoAlpha: 1,
            duration: 0.48,
            stagger: 0.042,
            ease: 'power2.out',
            onComplete: () => runDocsHeroLogoClone(headerLogo),
        });
    }

    function boot() {
        if (!document.documentElement.classList.contains('od-docs-entry-pending')) {
            return;
        }
        if (!document.body.classList.contains('docs-page')) {
            document.documentElement.classList.remove('od-docs-entry-pending');
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.remove('od-docs-entry-pending');
            return;
        }
        if (typeof gsap === 'undefined') {
            document.documentElement.classList.remove('od-docs-entry-pending');
            return;
        }

        const headerLogo = document.querySelector('header .logo img');
        if (!headerLogo) {
            document.documentElement.classList.remove('od-docs-entry-pending');
            return;
        }

        const LOGO_SRC = headerLogo.currentSrc || headerLogo.src || 'assets/img/osintdeck-logo-light.png';
        document.body.classList.add('docs-page--entry-running');

        const root = document.createElement('div');
        root.className = 'docs-entry-root';
        root.setAttribute('aria-hidden', 'true');

        const curtain = document.createElement('div');
        curtain.className = 'docs-entry-curtain';

        const vignette = document.createElement('div');
        vignette.className = 'docs-entry-vignette';

        const grid = document.createElement('div');
        grid.className = 'docs-entry-grid';
        grid.setAttribute('aria-hidden', 'true');

        const ui = document.createElement('div');
        ui.className = 'docs-entry-ui';

        const kicker = document.createElement('p');
        kicker.className = 'docs-entry-kicker';
        kicker.textContent = 'OSINT DECK';

        const title = document.createElement('h2');
        title.className = 'docs-entry-title';
        title.textContent = 'Cargando documentación';

        const barWrap = document.createElement('div');
        barWrap.className = 'docs-entry-bar-wrap';
        const bar = document.createElement('div');
        bar.className = 'docs-entry-bar';
        const barShine = document.createElement('div');
        barShine.className = 'docs-entry-bar-shine';
        bar.appendChild(barShine);
        barWrap.appendChild(bar);

        const hint = document.createElement('p');
        hint.className = 'docs-entry-hint';
        hint.textContent = 'Preparando el manual interactivo…';

        ui.append(kicker, title, barWrap, hint);

        const fly = document.createElement('img');
        fly.className = 'docs-entry-fly';
        fly.src = LOGO_SRC;
        fly.alt = '';
        fly.decoding = 'async';
        fly.width = 640;
        fly.height = 200;

        root.append(curtain, vignette, grid, ui);
        document.body.appendChild(root);
        document.body.appendChild(fly);

        const flyW = Math.min(window.innerWidth * 0.65, 480);
        gsap.set(fly, {
            position: 'fixed',
            left: '50%',
            top: '58%',
            xPercent: -50,
            yPercent: -50,
            width: flyW,
            height: 'auto',
            opacity: 0,
            scale: 0.84,
            zIndex: 10063,
            force3D: true,
        });

        const flight = { dx: 0, dy: 0, sc: 1 };

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        tl.fromTo(curtain, { opacity: 0 }, { opacity: 1, duration: 0.68, ease: 'power2.inOut' }, 0)
            .fromTo(vignette, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power3.out' }, 0.08)
            .fromTo(grid, { opacity: 0 }, { opacity: 0.22, duration: 0.9 }, 0.12)
            .fromTo(ui, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.58, ease: 'power3.out' }, 0.22)
            .fromTo(
                kicker,
                { opacity: 0, letterSpacing: '0.42em' },
                { opacity: 1, letterSpacing: '0.22em', duration: 0.75, ease: 'power2.out' },
                0.32
            )
            .fromTo(
                title,
                { opacity: 0, y: 18, filter: 'blur(12px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.72, ease: 'power3.out' },
                0.42
            )
            .fromTo(barWrap, { opacity: 0, scaleX: 0.88 }, { opacity: 1, scaleX: 1, duration: 0.52, ease: 'power2.out' }, 0.52)
            .fromTo(hint, { opacity: 0, y: 8 }, { opacity: 0.82, y: 0, duration: 0.5 }, 0.58)
            .to(barShine, { xPercent: 220, duration: 1.35, ease: 'none', repeat: 1 }, 0.55)
            .fromTo(
                fly,
                { opacity: 0, scale: 0.82 },
                { opacity: 1, scale: 1, duration: 0.78, ease: 'back.out(1.12)' },
                0.72
            )
            .add('merge', '+=0.48')
            .call(() => {
                const fr = fly.getBoundingClientRect();
                const tr = headerLogo.getBoundingClientRect();
                flight.sc = tr.width / fr.width;
                flight.dx = tr.left + tr.width / 2 - (fr.left + fr.width / 2);
                flight.dy = tr.top + tr.height / 2 - (fr.top + fr.height / 2);
            }, null, 'merge')
            .to(
                fly,
                {
                    x: () => flight.dx,
                    y: () => flight.dy,
                    scale: () => flight.sc,
                    duration: 1.22,
                    ease: 'power3.inOut',
                },
                'merge'
            )
            .to([kicker, title, barWrap, hint], { autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, 'merge+=0.18')
            .to(grid, { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 'merge+=0.28')
            .to(vignette, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 'merge+=0.32')
            .to(curtain, { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut' }, 'merge+=0.42')
            .set(headerLogo, { autoAlpha: 1 }, 'merge+=1.08')
            .set(fly, { autoAlpha: 0 }, 'merge+=1.08')
            .call(() => {
                root.remove();
                fly.remove();
                finishEntry(headerLogo);
            }, null, 'merge+=1.1');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
