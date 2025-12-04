document.addEventListener('DOMContentLoaded', () => {
    // Reset sidebar scroll to top
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.scrollTop = 0;
    }

    // Initialize Feather Icons
    feather.replace();

    // Smooth scrolling for anchor links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active state for sidebar links on scroll (for docs page)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar a');

    if (sections.length > 0 && navLinks.length > 0) {
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

    if (sidebarSearch && sidebarNav) {
        sidebarSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const navItems = sidebarNav.querySelectorAll('li');

            navItems.forEach(item => {
                const link = item.querySelector('a');
                const text = link.textContent.toLowerCase();

                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
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

    // docs-ux-upgrade: Intersection Observer for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
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

    // hero-parallax-upgrade: Parallax Effect for Hero Section (SIMPLIFIED)
    const heroBgLayer = document.querySelector('.hero-bg-layer');
    const heroContent = document.querySelector('.hero-content');
    const isDesktop = window.innerWidth > 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroBgLayer && heroContent && isDesktop && !prefersReducedMotion) {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero');

            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;

                // Only apply parallax while in hero section
                if (scrolled < heroHeight) {
                    // Background moves at 0.3x speed (slower)
                    const bgOffset = scrolled * 0.3;
                    heroBgLayer.style.transform = `translateY(${bgOffset}px)`;

                    // Content moves at 0.1x speed (very subtle)
                    const contentOffset = scrolled * 0.1;
                    heroContent.style.transform = `translateY(${contentOffset}px)`;
                }
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // docs-parallax-upgrade: Parallax Effect for Documentation Hero
    const docsHeroBgLayer = document.querySelector('.docs-hero-bg-layer');
    const docsHeroContent = document.querySelector('.docs-hero-content');

    if (docsHeroBgLayer && docsHeroContent && isDesktop && !prefersReducedMotion) {
        let tickingDocs = false;

        const updateDocsParallax = () => {
            const scrolled = window.pageYOffset;
            const docsHero = document.querySelector('.docs-hero');

            if (docsHero) {
                const docsHeroTop = docsHero.offsetTop;
                const docsHeroHeight = docsHero.offsetHeight;
                const relativeScroll = scrolled - docsHeroTop + 100;

                if (relativeScroll > -100 && relativeScroll < docsHeroHeight + 200) {
                    const bgOffset = relativeScroll * 0.2;
                    docsHeroBgLayer.style.transform = `translateY(${bgOffset}px)`;

                    const contentOffset = relativeScroll * 0.08;
                    docsHeroContent.style.transform = `translateY(${contentOffset}px)`;
                }
            }

            tickingDocs = false;
        };

        window.addEventListener('scroll', () => {
            if (!tickingDocs) {
                window.requestAnimationFrame(updateDocsParallax);
                tickingDocs = true;
            }
        });
    }

    // Re-initialize Feather icons after dynamic content loads
    setTimeout(() => {
        feather.replace();
    }, 100);
});
