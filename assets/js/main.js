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
