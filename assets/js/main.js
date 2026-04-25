function showOdDownloadFallback(openUrl) {
    const wrap = document.createElement('div');
    wrap.className = 'od-download-fallback';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'od-download-fallback-title');

    const card = document.createElement('div');
    card.className = 'od-download-fallback__card';

    const title = document.createElement('p');
    title.id = 'od-download-fallback-title';
    title.className = 'od-download-fallback__title';
    title.textContent = 'No se abrió la pestaña automáticamente';

    const text = document.createElement('p');
    text.className = 'od-download-fallback__text';
    text.textContent =
        'Tu navegador suele bloquear ventanas si no fueron abiertas en el mismo instante del clic. Pulsa el botón de abajo o permite ventanas emergentes para este sitio.';

    const cta = document.createElement('a');
    cta.className = 'od-download-fallback__cta btn btn-primary';
    cta.href = openUrl;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.textContent = 'Abrir releases en GitHub';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'od-download-fallback__close btn btn-secondary';
    closeBtn.textContent = 'Cerrar';

    card.append(title, text, cta, closeBtn);
    wrap.appendChild(card);
    document.body.appendChild(wrap);

    const close = () => wrap.remove();
    closeBtn.addEventListener('click', close);
    wrap.addEventListener('click', (ev) => {
        if (ev.target === wrap) {
            close();
        }
    });
}

const OD_DOWNLOAD_FX_PALETTE = ['#06eace', '#00b1ff', '#6922e7', '#c4dfff', '#0073ff'];

/**
 * Efecto al pulsar «Descargar plugin» (sin animación si no hay GSAP).
 * Elige uno:
 * - stardust: explosión de partículas + destellos + anillo (el original).
 * - nebula: manchas de color difuminadas que se expanden (más “épico” y suave).
 * - prism: haz cónico que barre la pantalla (estilo “arco iris / portal”).
 * - warp: rayos que se estiran como hipervelocidad.
 * - brand: cortina oscura → texto → logo con zoom in suave y cierre “sorprendente” (back.out).
 *
 * En HTML: data-od-download-fx="brand" en el <a id="od-hero-download">.
 * Si falta el atributo, se usa OD_DOWNLOAD_FX_DEFAULT.
 */
const OD_DOWNLOAD_FX_DEFAULT = 'brand';

const OD_DOWNLOAD_FX_PRESETS = ['stardust', 'nebula', 'prism', 'warp', 'brand'];

function resolveOdDownloadFxPreset(btn) {
    const raw = (btn.dataset && btn.dataset.odDownloadFx) || OD_DOWNLOAD_FX_DEFAULT;
    return OD_DOWNLOAD_FX_PRESETS.includes(raw) ? raw : OD_DOWNLOAD_FX_DEFAULT;
}

function odFxButtonPulse(tl, btn) {
    tl.to(
        btn,
        {
            boxShadow: '0 0 32px rgba(6, 234, 206, 0.65), 0 0 64px rgba(0, 177, 255, 0.35)',
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
        },
        0
    ).to(btn, { scale: 1.06, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' }, 0);
}

function odFxPlayStardust(ctx) {
    const { root, ox, oy, btn, palette } = ctx;
    const burst = document.createElement('div');
    burst.className = 'od-download-fx-burst';
    root.appendChild(burst);

    const ring = document.createElement('div');
    ring.className = 'od-download-fx-ring';
    ring.style.left = `${ox}px`;
    ring.style.top = `${oy}px`;
    root.appendChild(ring);

    const particleCount = 40;
    const sparks = ['✦', '✧', '⋆', '·'];

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('span');
        p.className = 'od-download-fx-particle';
        const size = 4 + Math.random() * 7;
        p.style.setProperty('--od-p-size', `${size}px`);
        p.style.background = `linear-gradient(145deg, ${palette[i % palette.length]}, ${palette[(i + 2) % palette.length]})`;
        root.appendChild(p);
        gsap.set(p, {
            left: ox,
            top: oy,
            xPercent: -50,
            yPercent: -50,
            opacity: 1,
            scale: 0.2,
        });
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.9;
        const dist = 140 + Math.random() * 220;
        gsap.to(p, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            opacity: 0,
            scale: 1,
            duration: 0.95 + Math.random() * 0.25,
            ease: 'power3.out',
            delay: Math.random() * 0.06,
        });
    }

    for (let s = 0; s < 12; s++) {
        const el = document.createElement('span');
        el.className = 'od-download-fx-spark';
        el.textContent = sparks[s % sparks.length];
        el.style.color = palette[s % palette.length];
        root.appendChild(el);
        gsap.set(el, {
            left: ox,
            top: oy,
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            rotation: Math.random() * 360,
        });
        const a = (s / 12) * Math.PI * 2 + 0.4;
        const d = 100 + Math.random() * 160;
        gsap.to(el, {
            x: Math.cos(a) * d,
            y: Math.sin(a) * d,
            scale: 1.15,
            rotation: `+=${180 + Math.random() * 120}`,
            opacity: 0,
            duration: 0.85,
            ease: 'power2.out',
            delay: 0.05 + s * 0.02,
        });
    }

    const tl = gsap.timeline();
    tl.fromTo(
        burst,
        { opacity: 0, scale: 0.45 },
        { opacity: 1, scale: 1.05, duration: 0.22, ease: 'power2.out' },
        0
    )
        .to(burst, { opacity: 0, scale: 1.35, duration: 0.55, ease: 'power2.in' }, 0.18)
        .fromTo(
            ring,
            { opacity: 0.95, scale: 0.15 },
            { opacity: 0, scale: 4.2, duration: 0.75, ease: 'power2.out' },
            0
        );
    odFxButtonPulse(tl, btn);
    return 1.32;
}

function odFxPlayNebula(ctx) {
    const { root, ox, oy, btn, palette } = ctx;
    const wash = document.createElement('div');
    wash.className = 'od-download-fx-burst';
    root.appendChild(wash);

    const ring = document.createElement('div');
    ring.className = 'od-download-fx-ring';
    ring.style.left = `${ox}px`;
    ring.style.top = `${oy}px`;
    root.appendChild(ring);

    const blobs = 7;
    for (let i = 0; i < blobs; i++) {
        const b = document.createElement('div');
        b.className = 'od-download-fx-nebula-blob';
        const c1 = palette[i % palette.length];
        const c2 = palette[(i + 2) % palette.length];
        b.style.background = `radial-gradient(circle, ${c1} 0%, ${c2} 45%, transparent 72%)`;
        root.appendChild(b);
        gsap.set(b, {
            left: ox,
            top: oy,
            xPercent: -50,
            yPercent: -50,
            scale: 0.2,
            opacity: 0.95,
        });
        gsap.to(b, {
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 80,
            scale: 3.2 + Math.random() * 2.2,
            opacity: 0,
            duration: 1.15 + Math.random() * 0.25,
            ease: 'power2.out',
            delay: i * 0.07,
            rotation: Math.random() * 50 - 25,
        });
    }

    const tl = gsap.timeline();
    tl.fromTo(
        wash,
        { opacity: 0, scale: 0.35 },
        { opacity: 0.85, scale: 1.08, duration: 0.35, ease: 'power2.out' },
        0
    )
        .to(wash, { opacity: 0, scale: 1.45, duration: 0.95, ease: 'power2.inOut' }, 0.22)
        .fromTo(
            ring,
            { opacity: 0.75, scale: 0.12 },
            { opacity: 0, scale: 5, duration: 1.05, ease: 'power3.out' },
            0
        );
    odFxButtonPulse(tl, btn);
    return 1.45;
}

function odFxPlayPrism(ctx) {
    const { root, ox, oy, btn } = ctx;
    const sweep = document.createElement('div');
    sweep.className = 'od-download-fx-prism-sweep';
    root.appendChild(sweep);

    const ring = document.createElement('div');
    ring.className = 'od-download-fx-ring';
    ring.style.left = `${ox}px`;
    ring.style.top = `${oy}px`;
    root.appendChild(ring);

    gsap.set(sweep, {
        left: ox,
        top: oy,
        xPercent: -50,
        yPercent: -50,
    });

    const sparks = ['✦', '✧', '⋆'];
    for (let s = 0; s < 16; s++) {
        const el = document.createElement('span');
        el.className = 'od-download-fx-spark';
        el.textContent = sparks[s % sparks.length];
        el.style.fontSize = `${12 + (s % 4) * 3}px`;
        el.style.color = OD_DOWNLOAD_FX_PALETTE[s % OD_DOWNLOAD_FX_PALETTE.length];
        root.appendChild(el);
        const a = (s / 16) * Math.PI * 2;
        const d = 90 + (s % 5) * 28;
        gsap.set(el, { left: ox, top: oy, xPercent: -50, yPercent: -50, scale: 0, opacity: 1 });
        gsap.to(el, {
            x: Math.cos(a) * d,
            y: Math.sin(a) * d,
            scale: 1.2,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.out',
            delay: 0.12 + s * 0.025,
            rotation: `+=${120 + s * 15}`,
        });
    }

    const tl = gsap.timeline();
    tl.fromTo(
        sweep,
        { opacity: 0, rotation: 0, scale: 0.35 },
        { opacity: 0.75, rotation: 95, scale: 1.25, duration: 0.85, ease: 'power2.inOut' },
        0
    )
        .to(sweep, { opacity: 0, rotation: '+=35', scale: 1.45, duration: 0.45, ease: 'power2.in' }, 0.72)
        .fromTo(
            ring,
            { opacity: 0.9, scale: 0.1 },
            { opacity: 0, scale: 4.5, duration: 0.85, ease: 'power2.out' },
            0.05
        );
    odFxButtonPulse(tl, btn);
    return 1.28;
}

function odFxPlayWarp(ctx) {
    const { root, ox, oy, btn, palette } = ctx;
    const n = 48;
    for (let i = 0; i < n; i++) {
        const el = document.createElement('span');
        el.className = 'od-download-fx-warp-streak';
        el.style.background = `linear-gradient(180deg, transparent, ${palette[i % palette.length]}, transparent)`;
        root.appendChild(el);
        const angle = (i / n) * Math.PI * 2 + Math.random() * 0.15;
        const deg = (angle * 180) / Math.PI - 90;
        gsap.set(el, {
            left: ox,
            top: oy,
            rotation: deg,
            scaleY: 0.12,
            opacity: 0.95,
        });
        gsap.to(el, {
            scaleY: 11 + Math.random() * 7,
            opacity: 0,
            duration: 0.58 + Math.random() * 0.2,
            ease: 'power3.in',
            delay: Math.random() * 0.14,
        });
    }

    const core = document.createElement('div');
    core.className = 'od-download-fx-burst';
    root.appendChild(core);
    const ring = document.createElement('div');
    ring.className = 'od-download-fx-ring';
    ring.style.left = `${ox}px`;
    ring.style.top = `${oy}px`;
    root.appendChild(ring);

    const tl = gsap.timeline();
    tl.fromTo(
        core,
        { opacity: 0, scale: 0.2 },
        { opacity: 0.55, scale: 0.95, duration: 0.12, ease: 'power2.out' },
        0
    ).to(core, { opacity: 0, scale: 1.2, duration: 0.5, ease: 'power2.in' }, 0.1);
    tl.fromTo(
        ring,
        { opacity: 1, scale: 0.08 },
        { opacity: 0, scale: 3.8, duration: 0.68, ease: 'power3.in' },
        0
    );
    odFxButtonPulse(tl, btn);
    return 1.18;
}

const OD_DOWNLOAD_BRAND_LOGO_SRC = 'assets/img/osintdeck-logo-light.png';

function odFxPlayBrand(ctx) {
    const { root, btn } = ctx;
    root.classList.add('od-download-fx-root--brand');

    const panel = document.createElement('div');
    panel.className = 'od-download-brand-screen';

    const curtain = document.createElement('div');
    curtain.className = 'od-download-brand-screen__curtain';
    panel.appendChild(curtain);

    const inner = document.createElement('div');
    inner.className = 'od-download-brand-screen__inner';

    const label = document.createElement('p');
    label.className = 'od-download-brand-screen__label';
    label.textContent = 'Redirigiendo a descarga …';

    const logoWrap = document.createElement('div');
    logoWrap.className = 'od-download-brand-screen__logo-wrap';

    const glow = document.createElement('div');
    glow.className = 'od-download-brand-screen__glow';

    const img = document.createElement('img');
    img.className = 'od-download-brand-screen__logo';
    img.src = OD_DOWNLOAD_BRAND_LOGO_SRC;
    img.alt = 'OSINT Deck';
    img.width = 640;
    img.height = 200;
    img.decoding = 'async';

    logoWrap.append(glow, img);
    inner.append(label, logoWrap);
    panel.appendChild(inner);
    root.appendChild(panel);

    gsap.set(glow, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        transformOrigin: '50% 50%',
    });
    gsap.set([label, img], { force3D: true });

    const tl = gsap.timeline();
    odFxButtonPulse(tl, btn);

    tl.fromTo(
        curtain,
        { opacity: 0 },
        { opacity: 1, duration: 0.58, ease: 'power2.inOut' },
        0
    )
        .to(inner, { opacity: 1, duration: 0.42, ease: 'power1.out' }, 0.4)
        .fromTo(
            label,
            {
                autoAlpha: 0,
                y: 28,
                filter: 'blur(10px)',
                letterSpacing: '0.18em',
            },
            {
                autoAlpha: 1,
                y: 0,
                filter: 'blur(0px)',
                letterSpacing: '0.06em',
                duration: 0.72,
                ease: 'power3.out',
            },
            0.46
        )
        .fromTo(
            glow,
            { scale: 0.45, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
            0.62
        )
        .to(glow, { autoAlpha: 0, duration: 0.62, ease: 'power2.inOut' }, 1.05)
        .fromTo(
            img,
            {
                scale: 0.34,
                autoAlpha: 0,
                y: 36,
            },
            {
                scale: 1,
                autoAlpha: 1,
                y: 0,
                duration: 1.14,
                ease: 'back.out(1.28)',
            },
            0.58
        );

    return 1.82;
}

const OD_DOWNLOAD_FX_RUNNERS = {
    stardust: odFxPlayStardust,
    nebula: odFxPlayNebula,
    prism: odFxPlayPrism,
    warp: odFxPlayWarp,
    brand: odFxPlayBrand,
};

function bootOdDownloadFantasy(btn) {
    const url = btn.getAttribute('href');
    if (!url) {
        return;
    }

    const reduced =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let fxBusy = false;

    btn.addEventListener(
        'click',
        (e) => {
            if (reduced) {
                return;
            }
            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
            }
            e.preventDefault();
            if (fxBusy) {
                return;
            }
            fxBusy = true;

            const rect = btn.getBoundingClientRect();
            const ox = rect.left + rect.width / 2;
            const oy = rect.top + rect.height / 2;
            const xPct = (ox / window.innerWidth) * 100;
            const yPct = (oy / window.innerHeight) * 100;

            const root = document.createElement('div');
            root.className = 'od-download-fx-root';
            root.setAttribute('aria-hidden', 'true');
            document.body.appendChild(root);
            root.style.setProperty('--od-fx-x', `${xPct}%`);
            root.style.setProperty('--od-fx-y', `${yPct}%`);

            const preset = resolveOdDownloadFxPreset(btn);
            const run = OD_DOWNLOAD_FX_RUNNERS[preset] || odFxPlayBrand;
            const fxEndSec = run({
                root,
                ox,
                oy,
                xPct,
                yPct,
                btn,
                palette: OD_DOWNLOAD_FX_PALETTE,
            });

            gsap.delayedCall(fxEndSec, () => {
                fxBusy = false;
                gsap.set(btn, { clearProps: 'scale,boxShadow,transform' });
                root.remove();

                const opened = window.open(url, '_blank');
                if (opened) {
                    opened.opener = null;
                } else {
                    showOdDownloadFallback(url);
                }
            });
        },
        { passive: false }
    );
}

function bootMain() {
    if (!document.body.classList.contains('docs-page')) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.scrollTop = 0;
        }
    }

    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('a[data-od-download-fx]').forEach((a) => bootOdDownloadFantasy(a));
    }

    // Smooth scrolling for anchor links with offset for fixed header
    const docsPanelEl = document.getElementById('docs-panel');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                return;
            }
            const targetId = href;
            const target = document.querySelector(targetId);

            if (
                docsPanelEl &&
                target &&
                target.classList.contains('docs-section') &&
                target.closest('#docs-panel')
            ) {
                e.preventDefault();
                document.dispatchEvent(
                    new CustomEvent('od-docs-navigate', { detail: { id: targetId.slice(1) } })
                );
                return;
            }

            if (!target) {
                return;
            }

            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Active state for sidebar links on scroll (for docs page)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar a');

    if (sections.length > 0 && navLinks.length > 0 && !docsPanelEl) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // docs-ux-upgrade: Sidebar Search Filter
    const sidebarSearch = document.getElementById('sidebar-search');
    const sidebarNav = document.getElementById('sidebar-nav');

    if (sidebarSearch && sidebarNav && !sidebarNav.classList.contains('sidebar-tree')) {
        sidebarSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const navItems = sidebarNav.querySelectorAll('li');

            navItems.forEach(item => {
                const link = item.querySelector('a');
                if (!link) {
                    item.style.display = searchTerm ? 'none' : '';
                    return;
                }
                const text = link.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // docs-ux-upgrade: Copy to Clipboard for Code Blocks
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
            const textToCopy = codeBlock.textContent;

            try {
                await navigator.clipboard.writeText(textToCopy);
                button.textContent = 'Copiado';
                button.classList.add('copied');

                setTimeout(() => {
                    button.textContent = 'Copiar';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Error al copiar:', err);
                button.textContent = 'Error';
                setTimeout(() => {
                    button.textContent = 'Copiar';
                }, 2000);
            }
        });
    });

    // Reveal: GSAP + ScrollTrigger en gsap-init.js cuando hay CDN; si no, observador aquí.
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0 && !document.documentElement.classList.contains('od-gsap-reveal')) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // docs-ux-upgrade: Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const isDesktop = window.innerWidth > 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // docs-parallax-upgrade: Parallax Effect for Documentation Hero
    const docsHeroBgLayer = document.querySelector('.docs-hero-bg-layer');
    const docsHeroContent = document.querySelector('.docs-hero-content');

    if (docsHeroBgLayer && docsHeroContent && isDesktop && !prefersReducedMotion) {
        let tickingDocs = false;
        const docsHero = document.querySelector('.docs-hero');
        const introSection = document.getElementById('intro');
        const useIntroScroll =
            docsHero &&
            introSection &&
            document.getElementById('docs-panel') &&
            introSection.contains(docsHero);

        const updateDocsParallax = () => {
            if (!docsHero) {
                tickingDocs = false;
                return;
            }
            const docsHeroHeight = docsHero.offsetHeight;
            const relativeScroll = useIntroScroll
                ? introSection.scrollTop
                : window.pageYOffset - docsHero.offsetTop + 100;

            if (relativeScroll > -100 && relativeScroll < docsHeroHeight + 200) {
                const bgOffset = relativeScroll * 0.2;
                docsHeroBgLayer.style.transform = `translateY(${bgOffset}px)`;

                const contentOffset = relativeScroll * 0.08;
                docsHeroContent.style.transform = `translateY(${contentOffset}px)`;
            }

            tickingDocs = false;
        };

        const scheduleDocsParallax = () => {
            if (!tickingDocs) {
                window.requestAnimationFrame(updateDocsParallax);
                tickingDocs = true;
            }
        };

        if (useIntroScroll) {
            introSection.addEventListener('scroll', scheduleDocsParallax, { passive: true });
        } else {
            window.addEventListener('scroll', scheduleDocsParallax, { passive: true });
        }
    }

    // Re-initialize Feather icons after dynamic content loads + refrescar triggers GSAP
    setTimeout(() => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootMain);
} else {
    bootMain();
}
