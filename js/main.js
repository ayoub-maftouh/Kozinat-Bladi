/* ═══════════════════════════════════════════
   KOZINAT BLADI — JAVASCRIPT
   Interactivité & Animations
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Éléments DOM ───
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.getElementById('navToggle');
  const navLinks    = document.getElementById('navLinks');
  const backToTop   = document.getElementById('backToTop');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const recetteCards = document.querySelectorAll('.recette-card');
  let   mapRegions  = document.querySelectorAll('.map-region');
  const mapTooltip  = document.getElementById('mapTooltip');
  const navItems    = document.querySelectorAll('.nav-link');

  // ═══════════════════════════════════════════
  // 1. NAVBAR — Scroll Effect & Active State
  // ═══════════════════════════════════════════
  let lastScroll = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on current section
    const sections = document.querySelectorAll('section[id], header[id]');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ═══════════════════════════════════════════
  // 2. MOBILE NAV TOGGLE
  // ═══════════════════════════════════════════
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  // ═══════════════════════════════════════════
  // 3. SCROLL REVEAL ANIMATIONS
  // ═══════════════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ═══════════════════════════════════════════
  // 4. BACK TO TOP BUTTON
  // ═══════════════════════════════════════════
  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ═══════════════════════════════════════════
  // 5. FILTRES DE RECETTES
  // ═══════════════════════════════════════════
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      recetteCards.forEach(card => {
        const categories = card.dataset.categories;

        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ═══════════════════════════════════════════
  // 6. CARTE INTERACTIVE DU MAROC
  //    Source: github.com/yousfiSaad/morocco-map
  // ═══════════════════════════════════════════
  const carteContainer = document.querySelector('.carte-interactive');
  const mapWidth = 700;
  const mapHeight = 800;

  // Region metadata: name:en → { icon, plat, link, filter, arabicName }
  const regionMeta = {
    'Tanger-Tétouan-Al Hoceima':          { icon: '🐟', plat: 'Harira Chamalia & Briouates au poisson', link: 'recettes/harira.html',               filter: 'nord',      ar: 'طنجة تطوان الحسيمة' },
    "L'Oriental":                          { icon: '🍜', plat: 'Bissara & Berkoukes',                    link: 'recettes/bissara.html',              filter: 'oriental',  ar: 'الشرقية' },
    'Fès-Meknès':                          { icon: '🥧', plat: 'Poulet Mqualli & Seffa',                 link: 'recettes/poulet-mqualli.html',       filter: 'fes',       ar: 'فاس-مكناس' },
    'Rabat-Salé-Kénitra':                  { icon: '🍵', plat: 'Briouates au poisson & Thé à la menthe', link: 'recettes/briouates-poisson.html',    filter: 'rabat',     ar: 'الرباط-سلا-القنيطرة' },
    'Béni Mellal-Khénifra':                { icon: '🫕', plat: 'Tajine Kabab Maghdour',                  link: 'recettes/tajine-kabab-maghdour.html',filter: 'centre',    ar: 'بني ملال-خنيفرة' },
    'Casablanca-Settat':                   { icon: '🍆', plat: 'Zaalouk & Pommes de terre chermoula',    link: 'recettes/zaalouk.html',              filter: 'casa',      ar: 'الدار البيضاء-سطات' },
    'Marrakech-Safi':                      { icon: '🫕', plat: 'Tanjia de Marrakech',                    link: 'recettes/tanjia.html',               filter: 'marrakech', ar: 'مراكش-آسفي' },
    'Drâa-Tafilalet':                      { icon: '🫓', plat: 'Tajine de Boeuf aux Haricots Verts',     link: 'recettes/tajine-boeuf-haricots.html',filter: 'draa',      ar: 'درعة تافيلالت' },
    'Souss-Massa':                         { icon: '🥜', plat: "Zaalouk & Huile d'Argan",               link: 'recettes/zaalouk.html',              filter: 'souss',     ar: 'سوس-ماسة' },
    'Guelmim-Oued Noun (EH-partial)':      { icon: '🐑', plat: 'Baghrirs & Méchoui',                    link: 'recettes/baghrirs.html',             filter: 'guelmim',   ar: 'كلميم وادي نون' },
    'Laâyoune-Sakia El Hamra (EH-partial)':{ icon: '🌴', plat: 'Seffa & Dattes Medjool',                link: 'recettes/seffa.html',                filter: 'laayoune',  ar: 'العيون الساقية الحمراء' },
    'Dakhla-Oued Ed-Dahab (EH)':           { icon: '🏜️', plat: 'Chermoula & Thé sahraoui',              link: 'recettes/chermoula.html',            filter: 'dakhla',    ar: 'الداخلة-وادي الذهب' }
  };

  // Map region filter → data-region values on recipe cards
  const regionFilterMap = {
    'nord':      ['nord'],
    'oriental':  ['oriental'],
    'fes':       ['fes'],
    'rabat':     ['rabat'],
    'centre':    ['fes', 'rabat', 'national'],
    'casa':      ['doukkala', 'national'],
    'marrakech': ['marrakech'],
    'draa':      ['marrakech', 'national'],
    'souss':     ['marrakech', 'national'],
    'guelmim':   ['national'],
    'laayoune':  ['national'],
    'dakhla':    ['national']
  };

  // ─── Render map with D3 + TopoJSON ───
  const svg = d3.select('#moroccoMap')
    .attr('width', '100%')
    .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  d3.json('https://cdn.jsdelivr.net/npm/morocco-map/data/regions.json')
    .then(data => {
      const regions = topojson.feature(data, data.objects.regions);
      const projection = d3.geoMercator().fitSize([mapWidth, mapHeight], regions);
      const pathGenerator = d3.geoPath().projection(projection);

      // Draw region paths
      svg.selectAll('path')
        .data(regions.features)
        .enter()
        .append('path')
        .attr('class', 'map-region')
        .attr('d', pathGenerator)
        .each(function(d) {
          const nameEn = d.properties['name:en'];
          const meta = regionMeta[nameEn] || {};
          const el = d3.select(this);
          el.attr('data-region', nameEn)
            .attr('data-plat', meta.plat || '')
            .attr('data-icon', meta.icon || '🍽️')
            .attr('data-link', meta.link || '')
            .attr('data-filter', meta.filter || '')
            .attr('data-ar', meta.ar || d.properties['name:ar'] || '');
        });

      // Add region labels at centroid
      const shortNames = {
        'Tanger-Tétouan-Al Hoceima': 'Tanger',
        "L'Oriental": 'Oriental',
        'Fès-Meknès': 'Fès',
        'Rabat-Salé-Kénitra': 'Rabat',
        'Béni Mellal-Khénifra': 'Béni Mellal',
        'Casablanca-Settat': 'Casablanca',
        'Marrakech-Safi': 'Marrakech',
        'Drâa-Tafilalet': 'Drâa-Tafilalet',
        'Souss-Massa': 'Souss-Massa',
        'Guelmim-Oued Noun ': 'Guelmim',
        'Laâyoune-Sakia El Hamra': 'Laâyoune',
        'Dakhla-Oued Ed-Dahab': 'Dakhla'
      };

      svg.selectAll('.map-label')
        .data(regions.features)
        .enter()
        .append('text')
        .attr('class', 'map-label')
        .attr('x', d => pathGenerator.centroid(d)[0])
        .attr('y', d => pathGenerator.centroid(d)[1])
        .attr('font-size', '11')
        .text(d => shortNames[d.properties['name:en']] || d.properties['name:en']);

      // ─── Re-select rendered paths and bind interactivity ───
      mapRegions = document.querySelectorAll('.map-region');
      setupMapInteractivity();
    })
    .catch(err => {
      console.warn('Morocco map data could not be loaded:', err);
      document.getElementById('moroccoMap').innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="16">Carte indisponible</text>';
    });

  // ─── Map interactivity (called after D3 renders) ───
  function setupMapInteractivity() {
    mapRegions.forEach(region => {
      region.style.cursor = 'pointer';

      region.addEventListener('mouseenter', () => {
        const regionName = region.dataset.region;
        const plat = region.dataset.plat;
        const icon = region.dataset.icon;
        mapTooltip.querySelector('.tooltip-icon').textContent = icon;
        mapTooltip.querySelector('.tooltip-region').textContent = regionName;
        mapTooltip.querySelector('.tooltip-plat').textContent = plat;
        mapTooltip.classList.add('visible');
      });

      region.addEventListener('mousemove', (e) => {
        const rect = carteContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const tooltipWidth = mapTooltip.offsetWidth;
        const tooltipHeight = mapTooltip.offsetHeight;
        const containerWidth = rect.width;

        let tooltipX = x + 16;
        let tooltipY = y - tooltipHeight - 8;
        if (tooltipX + tooltipWidth > containerWidth) tooltipX = x - tooltipWidth - 16;
        if (tooltipY < 0) tooltipY = y + 20;

        mapTooltip.style.left = `${tooltipX}px`;
        mapTooltip.style.top = `${tooltipY}px`;
      });

      region.addEventListener('mouseleave', () => {
        mapTooltip.classList.remove('visible');
      });

      // ─── Click → filter recipes by region ───
      region.addEventListener('click', () => {
        const link = region.dataset.link;
        const filterKey = region.dataset.filter;

        mapRegions.forEach(r => r.classList.remove('active'));
        region.classList.add('active');

        const recettesSection = document.getElementById('recettes');
        const matchedRegions = regionFilterMap[filterKey] || ['national'];

        filterBtns.forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');

        let hasMatch = false;
        recetteCards.forEach(card => {
          const cardRegion = card.dataset.region;
          if (matchedRegions.includes(cardRegion)) {
            card.classList.remove('hidden');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.classList.add('region-highlight');
            hasMatch = true;
          } else {
            card.classList.add('hidden');
          }
        });

        if (!hasMatch && link) {
          window.location.href = link;
          return;
        }

        if (recettesSection) {
          recettesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
          recetteCards.forEach(card => card.classList.remove('region-highlight'));
        }, 3000);

        mapTooltip.classList.remove('visible');
      });
    });

    // Touch support
    let lastTouchedRegion = null;
    mapRegions.forEach(region => {
      region.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const regionName = region.dataset.region;
        const plat = region.dataset.plat;
        const icon = region.dataset.icon;

        mapTooltip.querySelector('.tooltip-icon').textContent = icon;
        mapTooltip.querySelector('.tooltip-region').textContent = regionName;
        mapTooltip.querySelector('.tooltip-plat').textContent = plat;

        const rect = carteContainer.getBoundingClientRect();
        const regionRect = region.getBoundingClientRect();
        const x = regionRect.left + regionRect.width / 2 - rect.left;
        const y = regionRect.top - rect.top - 10;
        mapTooltip.style.left = `${x - mapTooltip.offsetWidth / 2}px`;
        mapTooltip.style.top = `${y - mapTooltip.offsetHeight}px`;
        mapTooltip.classList.add('visible');

        if (lastTouchedRegion === region) {
          region.dispatchEvent(new Event('click'));
          lastTouchedRegion = null;
        } else {
          lastTouchedRegion = region;
        }

        setTimeout(() => mapTooltip.classList.remove('visible'), 3000);
      }, { passive: false });
    });
  }

  // ═══════════════════════════════════════════
  // 7. HERO PARTICLES (Floating spice particles)
  // ═══════════════════════════════════════════
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 8 + 8;
      const hue = Math.random() > 0.5 ? '36' : '15'; // Gold or terracotta

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        background: hsla(${hue}, 80%, 55%, ${Math.random() * 0.3 + 0.1});
      `;

      container.appendChild(particle);
    }
  }

  createParticles();

  // ═══════════════════════════════════════════
  // 8. SMOOTH SCROLL for anchor links
  // ═══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ═══════════════════════════════════════════
  // 9. PARALLAX subtle on hero
  // ═══════════════════════════════════════════
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const parallaxVal = window.scrollY * 0.3;
      hero.style.backgroundPositionY = `${parallaxVal}px`;

      // Fade out hero content on scroll
      const opacity = 1 - (window.scrollY / (window.innerHeight * 0.6));
      heroContent.style.opacity = Math.max(0, opacity);
      heroContent.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });

  // ═══════════════════════════════════════════
  // 10. TYPING EFFECT on hero tagline
  // ═══════════════════════════════════════════
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const originalText = tagline.textContent;
    tagline.textContent = '';
    tagline.style.borderRight = '2px solid rgba(255,255,255,0.7)';

    let i = 0;
    function typeWriter() {
      if (i < originalText.length) {
        tagline.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 60);
      } else {
        // Remove cursor after typing
        setTimeout(() => {
          tagline.style.borderRight = 'none';
        }, 1000);
      }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 800);
  }

  // ═══════════════════════════════════════════
  // 11. COUNTER ANIMATION for stats (if needed)
  // ═══════════════════════════════════════════
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // ═══════════════════════════════════════════
  // INIT — First scroll check
  // ═══════════════════════════════════════════
  handleNavbarScroll();
  handleBackToTop();

  console.log('%c🍲 Kozinat Bladi — Cuisiné avec ❤️ au Maroc', 
    'color: #C1440E; font-size: 16px; font-weight: bold; font-family: Georgia;');
});

