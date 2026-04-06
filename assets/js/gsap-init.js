/**
 * Animaciones con GSAP + ScrollTrigger (CDN).
 * Respeta prefers-reduced-motion; si GSAP no carga, el reveal sigue en main.js.
 */
(function () {
    'use strict';

    const reducedMotion = () =>
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initReducedMotionReveals() {
        document.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('reveal-visible');
        });
        document.documentElement.classList.add('od-gsap-reveal');
    }

    function init() {
        if (typeof feather !== 'undefined') {
            try {
                feather.replace();
            } catch (e) {
                /* sin íconos vectoriales */
            }
        }

        const rm = reducedMotion();

        if (rm) {
            initReducedMotionReveals();
            return;
        }

        const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
        if (!hasGSAP) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const softIn = {
            duration: 0.55,
            ease: 'power2.out',
        };

        /* —— Barra superior (fromTo: estado final explícito, íconos ya SVG) —— */
        gsap.fromTo(
            'header',
            { y: -14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.52, ease: 'power3.out' }
        );

        gsap.fromTo(
            'header .logo img',
            { scale: 0.94, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'power2.out', delay: 0.06 }
        );

        gsap.fromTo(
            'header .nav-links a',
            { y: -8, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                stagger: 0.038,
                duration: 0.42,
                ease: 'power2.out',
                delay: 0.1,
            }
        );

        /* —— Inicio / hero —— */
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroLogoEl = hero.querySelector('.hero-logo');
            const headlineChunks = hero.querySelectorAll('.hero-headline__chunk');
            const leadLines = hero.querySelectorAll('.hero-lead__line');
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            if (heroLogoEl) {
                tl.fromTo(
                    heroLogoEl,
                    { autoAlpha: 0, scale: 0.94, y: 22 },
                    { autoAlpha: 1, scale: 1, y: 0, duration: 0.66 }
                );
            }

            const headlineLabel = '-=0.34';
            if (headlineChunks.length) {
                tl.fromTo(
                    headlineChunks,
                    { autoAlpha: 0, y: 26 },
                    { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.085, ease: 'power2.out' },
                    heroLogoEl ? headlineLabel : 0
                );
            } else {
                tl.fromTo(
                    '.hero .hero-headline, .hero h1',
                    { autoAlpha: 0, y: 26 },
                    { autoAlpha: 1, y: 0, duration: 0.6 },
                    heroLogoEl ? headlineLabel : 0
                );
            }

            if (leadLines.length) {
                tl.fromTo(
                    leadLines,
                    { autoAlpha: 0, y: 14 },
                    { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.11, ease: 'power2.out' },
                    '-=0.28'
                );
            } else {
                tl.fromTo(
                    '.hero .hero-lead, .hero p',
                    { autoAlpha: 0, y: 16 },
                    { autoAlpha: 1, y: 0, duration: 0.48 },
                    '-=0.28'
                );
            }

            tl.fromTo(
                '.hero-btns .btn',
                { autoAlpha: 0, y: 14 },
                { autoAlpha: 1, y: 0, duration: 0.44, stagger: 0.1, ease: 'power2.out' },
                '-=0.22'
            );

            const parallax = hero.querySelector('.hero-bg-parallax');
            const shift = hero.querySelector('.hero-bg-shift');

            if (parallax && shift && window.innerWidth > 768) {
                gsap.set(parallax, { x: 0, y: 0 });
                const xTo = gsap.quickTo(parallax, 'x', { duration: 0.68, ease: 'power3.out' });
                const yTo = gsap.quickTo(parallax, 'y', { duration: 0.68, ease: 'power3.out' });
                hero.style.pointerEvents = 'auto';
                hero.addEventListener('mousemove', (e) => {
                    const fx = (e.clientX / hero.offsetWidth - 0.5) * 20;
                    const fy = (e.clientY / hero.offsetHeight - 0.5) * 14;
                    xTo(fx);
                    yTo(fy);
                });
                hero.addEventListener('mouseleave', () => {
                    xTo(0);
                    yTo(0);
                });

                gsap.to(shift, {
                    scale: 1.03,
                    duration: 16,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                });
            } else if (parallax && window.innerWidth > 768) {
                gsap.set(parallax, { x: 0, y: 0 });
                const xTo = gsap.quickTo(parallax, 'x', { duration: 0.68, ease: 'power3.out' });
                const yTo = gsap.quickTo(parallax, 'y', { duration: 0.68, ease: 'power3.out' });
                hero.addEventListener('mousemove', (e) => {
                    const fx = (e.clientX / hero.offsetWidth - 0.5) * 20;
                    const fy = (e.clientY / hero.offsetHeight - 0.5) * 14;
                    xTo(fx);
                    yTo(fy);
                });
                hero.addEventListener('mouseleave', () => {
                    xTo(0);
                    yTo(0);
                });
            }
        }

        /* —— Docs hero (logo + cabecera, misma lógica que index: fromTo) —— */
        const docsHeroInner = document.querySelector('.docs-hero-inner');
        const docsLogoImg = document.querySelector('.docs-hero-logo img');
        const docsHeaderEls = document.querySelectorAll('.docs-header > *');
        if (docsHeroInner && (docsLogoImg || docsHeaderEls.length)) {
            const dtl = gsap.timeline({ defaults: { ease: 'power2.out' } });
            if (docsLogoImg) {
                dtl.fromTo(
                    docsLogoImg,
                    { autoAlpha: 0, scale: 0.92, y: 14 },
                    { autoAlpha: 1, scale: 1, y: 0, duration: 0.54 }
                );
            }
            if (docsHeaderEls.length) {
                dtl.fromTo(
                    docsHeaderEls,
                    { autoAlpha: 0, y: 18 },
                    { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.1 },
                    docsLogoImg ? '-=0.22' : 0
                );
            }
        }

        /* —— Sección “Ecosistema” / títulos —— */
        document.querySelectorAll('.quick-links .section-title').forEach((block) => {
            gsap.from(block.children, {
                scrollTrigger: {
                    trigger: block,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 14,
                stagger: 0.09,
                ...softIn,
            });
        });

        gsap.from('.features .section-title > *', {
            scrollTrigger: {
                trigger: '.features .section-title',
                start: 'top 86%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 16,
            stagger: 0.11,
            duration: 0.58,
            ease: 'power2.out',
        });

        const featSection = document.querySelector('.features');
        if (featSection) {
            gsap.to(featSection, {
                '--od-line-scale': 1,
                scrollTrigger: {
                    trigger: featSection,
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
                duration: 1.05,
                ease: 'power2.out',
            });
        }

        /* —— Tarjetas al scroll —— */
        const scrollCards = gsap.utils.toArray(
            '.quick-links .grid a.card, .features .grid .card'
        );
        scrollCards.forEach((card) => {
            const icon = card.querySelector('.card-icon');
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 91%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 22,
                duration: 0.58,
                ease: 'power2.out',
            });
            if (icon) {
                gsap.from(icon, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 91%',
                        toggleActions: 'play none none none',
                    },
                    scale: 0.9,
                    opacity: 0.65,
                    duration: 0.48,
                    ease: 'back.out(1.35)',
                    delay: 0.06,
                });
            }
        });

        /* —— CTA hero: halo muy suave —— */
        const primaryCta = document.querySelector('.hero-btns .btn-primary');
        if (primaryCta) {
            gsap.fromTo(
                primaryCta,
                { boxShadow: '0 0 22px rgba(0, 177, 255, 0.12)' },
                {
                    boxShadow: '0 0 36px rgba(0, 177, 255, 0.24)',
                    duration: 3.2,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut',
                    delay: 1,
                }
            );
        }

        /* —— Páginas comunidad —— */
        const discussions = document.querySelector('.discussions-container');
        const issues = document.querySelector('.issues-container');
        [discussions, issues].forEach((root) => {
            if (root) {
                gsap.from(root, {
                    opacity: 0,
                    y: 18,
                    duration: 0.52,
                    ease: 'power2.out',
                    delay: 0.06,
                });
            }
        });

        /* —— Reveal: sin panel apilado; con #docs-panel solo transición al cambiar sección —— */
        const docsBlocks = document.querySelectorAll('.docs-section.reveal');
        const docsPanelMount = document.getElementById('docs-panel');
        const otherReveals = document.querySelectorAll('.reveal:not(.docs-section)');
        const hasDocLayout = !!document.querySelector('.docs-layout');

        if (docsBlocks.length || otherReveals.length) {
            document.documentElement.classList.add('od-gsap-reveal');
        }

        if (docsBlocks.length && !docsPanelMount) {
            gsap.set(docsBlocks, { autoAlpha: 0, y: hasDocLayout ? 40 : 28 });
            ScrollTrigger.batch(docsBlocks, {
                start: 'top 87%',
                once: true,
                onEnter: (batch) => {
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.58,
                        stagger: 0.085,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                },
            });
        } else if (docsBlocks.length && docsPanelMount) {
            const firstActive = docsPanelMount.querySelector('.docs-section.is-active');
            if (firstActive) {
                gsap.fromTo(
                    firstActive,
                    { autoAlpha: 0.35, y: 22 },
                    { autoAlpha: 1, y: 0, duration: 0.48, ease: 'power3.out', clearProps: 'y' }
                );
            }
        }

        if (otherReveals.length) {
            gsap.set(otherReveals, { autoAlpha: 0, y: 22 });
            ScrollTrigger.batch(otherReveals, {
                start: 'top 90%',
                once: true,
                onEnter: (batch) => {
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.48,
                        stagger: 0.05,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                },
            });
        }

        const footerEl = document.querySelector('body > footer');
        if (footerEl) {
            gsap.from(footerEl.querySelectorAll('.footer-content > *'), {
                scrollTrigger: {
                    trigger: footerEl,
                    start: 'top 96%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 12,
                stagger: 0.07,
                duration: 0.5,
                ease: 'power2.out',
            });
        }

        window.addEventListener(
            'load',
            () => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            },
            { once: true }
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
