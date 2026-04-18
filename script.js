// Language switching functionality
let currentLang = localStorage.getItem('language') || 'ru';

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Check if translations object exists
    if (typeof translations === 'undefined') {
        return;
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update optgroup labels
    document.querySelectorAll('optgroup[data-i18n-label]').forEach(optgroup => {
        const key = optgroup.getAttribute('data-i18n-label');
        if (translations[lang] && translations[lang][key]) {
            optgroup.label = translations[lang][key];
        }
    });
    
    // Update language button
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const langText = langBtn.querySelector('.language-switcher__current');
        if (lang === 'ru') langText.textContent = 'RU';
        else if (lang === 'en') langText.textContent = 'EN';
        else if (lang === 'tg') langText.textContent = 'TG';
    }
    
    // Update active state
    document.querySelectorAll('.language-switcher__option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Notify others (e.g. search suggestions) that language changed
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
    
    // Language switcher dropdown
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });
        
        // Handle language selection
        langDropdown.querySelectorAll('.language-switcher__option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                changeLanguage(lang);
                langDropdown.classList.remove('active');
            });
        });
    }

    // 3D tilt effect for cards (follow mouse)
    const tiltCards = document.querySelectorAll('.category-card, .region-card, .tour-card');
    const tiltStrength = 8;
    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.addEventListener('mousemove', handleTilt);
        });
        card.addEventListener('mouseleave', function() {
            this.removeEventListener('mousemove', handleTilt);
            this.style.transform = '';
        });
    });
    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 2 * tiltStrength;
        const rotX = (y - 0.5) * -2 * tiltStrength;
        card.style.transform = `translateY(-10px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    // Создай свой тур — расчёт итоговой суммы (цена за день за человека, простой тур)
    const TOUR_BUILDER_PRICES = {
        // Туры
        pamir: 85,
        penjikent: 70,
        cultural: 75,
        bike: 90,
        // Области
        gba: 90,
        rrp: 65,
        sogd: 72,
        khatlon: 68,
        // Категории
        lakes: 78,
        mountains: 82,
        ethno: 70,
        fan: 85,
        trekking: 88,
        'cat-pamir': 86,
        silk: 74,
        ancient: 71
    };
    const VIP_MULTIPLIER = 1.5;
    const formBuilder = document.getElementById('tourBuilderForm');
    const totalEl = document.getElementById('builderTotal');
    if (formBuilder && totalEl) {
        function updateBuilderTotal() {
            const direction = document.getElementById('builderDirection').value;
            const daysEl = document.getElementById('builderDays');
            const peopleEl = document.getElementById('builderPeople');
            const vipRadio = formBuilder.querySelector('input[name="type"][value="vip"]');
            const days = daysEl ? parseInt(daysEl.value, 10) : 5;
            const people = peopleEl ? parseInt(peopleEl.value, 10) : 2;
            const isVip = vipRadio && vipRadio.checked;
            if (!direction || !TOUR_BUILDER_PRICES[direction]) {
                totalEl.textContent = '0 $';
                return;
            }
            const pricePerDay = TOUR_BUILDER_PRICES[direction];
            const multiplier = isVip ? VIP_MULTIPLIER : 1;
            const total = Math.round(pricePerDay * days * people * multiplier);
            totalEl.textContent = total + ' $';
        }
        formBuilder.addEventListener('change', updateBuilderTotal);
        formBuilder.addEventListener('input', updateBuilderTotal);
        updateBuilderTotal();
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.header__nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('nav--open');
        mobileMenuBtn.classList.toggle('burger--active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('nav--open');
            mobileMenuBtn.classList.remove('burger--active');
        }
    });
}

// Smooth scroll for anchor links
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

// Search form handling
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    const input = searchForm.querySelector('.search-form__input');
    const toursSection = document.getElementById('tours');
    let categoryCards = Array.from(document.querySelectorAll('.category-card'));
    let regionCards = Array.from(document.querySelectorAll('.region-card'));
    let tourCards = Array.from(document.querySelectorAll('.tour-card'));
    const highlightClass = 'search-highlight';
    let highlightTimeoutId = null;

    const suggestionsId = 'tourSuggestions';
    let categoryTitleNorms = new Set();
    let tagTitleNorms = new Set();
    const ensureDatalist = () => {
        let datalist = document.getElementById(suggestionsId);
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = suggestionsId;
            document.body.appendChild(datalist);
        }
        if (input && !input.getAttribute('list')) {
            input.setAttribute('list', suggestionsId);
        }
        return datalist;
    };

    const getOrCreateInfoEl = () => {
        let infoEl = document.getElementById('searchResultsInfo');
        if (infoEl) return infoEl;

        infoEl = document.createElement('div');
        infoEl.id = 'searchResultsInfo';
        infoEl.className = 'search-results-info search-results-info--empty';
        infoEl.setAttribute('aria-live', 'polite');
        searchForm.insertAdjacentElement('afterend', infoEl);
        return infoEl;
    };

    const normalize = (value) => {
        return (value || '')
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ё/g, 'е')
            .trim();
    };

    const collapseSpaces = (value) => normalize(value).replace(/\s+/g, ' ').trim();

    const wordVariants = (word) => {
        const w = collapseSpaces(word);
        if (!w) return [];

        const variants = new Set([w]);

        // Common Russian endings (very lightweight "stem")
        const endings = [
            'иями','ями','ами','ями','иями',
            'ого','ему','ими','ыми','ому','ах','ях','ам','ям',
            'ой','ый','ая','ое','ее','ом','ем','ую','юю',
            'а','я','у','ю','е','и','ы','о'
        ];

        for (const end of endings) {
            if (w.length > 3 && w.endsWith(end)) {
                variants.add(w.slice(0, -end.length));
            }
        }

        if (w.length > 4) variants.add(w.slice(0, -1));
        if (w.length > 5) variants.add(w.slice(0, -2));

        return Array.from(variants).filter(Boolean);
    };

    const matchesQuery = (text, query) => {
        const q = collapseSpaces(query);
        if (!q) return true;
        const haystack = collapseSpaces(text);
        const words = q.split(/\s+/).filter(Boolean);
        return words.every((w) => {
            const vars = wordVariants(w);
            return vars.some((v) => v && haystack.includes(v));
        });
    };

    const getCardTitle = (card) => {
        if (!card) return '';
        const isTour = card.classList?.contains('tour-card');
        const isRegion = card.classList?.contains('region-card');
        const isCategory = card.classList?.contains('category-card');

        const selector = isTour
            ? '.tour-card__title'
            : isRegion
                ? '.region-card__title'
                : isCategory
                    ? '.category-card__title'
                    : null;

        const el = selector ? card.querySelector(selector) : null;
        return (el?.textContent || '').trim();
    };

    const refreshSearchIndex = () => {
        categoryCards = Array.from(document.querySelectorAll('.category-card'));
        regionCards = Array.from(document.querySelectorAll('.region-card'));
        tourCards = Array.from(document.querySelectorAll('.tour-card'));
        const datalist = ensureDatalist();
        datalist.innerHTML = '';

        // Build "archive" for suggestions:
        // - categories (Озера...Древние города)
        // - tags (#Озера, #Памир и т.д.)
        // - regions (Области Таджикистана)
        // - tour titles (до "Велотур по Памиру")
        const categoryTitles = Array.from(document.querySelectorAll('.category-card__title'))
            .map((el) => (el.textContent || '').trim())
            .filter(Boolean);

        const tagTitles = Array.from(document.querySelectorAll('.tour-card .tag'))
            .map((el) => (el.textContent || '').replace(/^#/, '').trim())
            .filter(Boolean);

        const regionTitles = Array.from(document.querySelectorAll('.region-card__title'))
            .map((el) => (el.textContent || '').trim())
            .filter(Boolean);

        const regionDescriptions = Array.from(document.querySelectorAll('.region-card__description'))
            .map((el) => (el.textContent || '').trim())
            .filter(Boolean);

        const tourTitles = tourCards
            .map(getCardTitle)
            .map((t) => t.trim())
            .filter(Boolean);

        // Deduplicate
        categoryTitleNorms = new Set(categoryTitles.map(collapseSpaces));
        tagTitleNorms = new Set(tagTitles.map(collapseSpaces));

        const uniq = Array.from(
            new Set([
                ...categoryTitles,
                ...tagTitles,
                ...regionTitles,
                ...regionDescriptions,
                ...tourTitles
            ])
        );
        uniq.forEach((title) => {
            const opt = document.createElement('option');
            opt.value = title;
            datalist.appendChild(opt);
        });
    };

    const setInfo = (message) => {
        const infoEl = getOrCreateInfoEl();
        const msg = (message || '').trim();
        infoEl.textContent = msg;
        infoEl.classList.toggle('search-results-info--empty', msg.length === 0);
    };

    const clearHighlights = () => {
        if (highlightTimeoutId) {
            window.clearTimeout(highlightTimeoutId);
            highlightTimeoutId = null;
        }
        document
            .querySelectorAll(`.${highlightClass}, .tour-card--highlight`)
            .forEach((el) => el.classList.remove(highlightClass, 'tour-card--highlight'));
    };

    const highlightCard = (card) => {
        if (!card) return;
        clearHighlights();
        card.classList.add(highlightClass);
        highlightTimeoutId = window.setTimeout(() => {
            card.classList.remove(highlightClass);
            highlightTimeoutId = null;
        }, 2500);
    };

    const applySearch = (query, options = {}) => {
        const { highlightFirst = false } = options;
        clearHighlights();

        const q = (query || '').trim();
        const qNorm = collapseSpaces(q);

        if (!qNorm) {
            [...categoryCards, ...regionCards, ...tourCards].forEach((card) => {
                card.hidden = false;
            });
            setInfo('');
            return { found: { categories: 0, regions: 0, tours: 0 }, firstMatch: null };
        }

        const typeWeight = (card) => {
            if (card.classList.contains('tour-card')) return 3;
            if (card.classList.contains('region-card')) return 2;
            if (card.classList.contains('category-card')) return 1;
            return 0;
        };

        const scoreCard = (card) => {
            const title = getCardTitle(card);
            const titleNorm = collapseSpaces(title);
            const textNorm = collapseSpaces(card.textContent || '');

            let base = 0;
            if (titleNorm === qNorm) base = 30;
            else if (titleNorm.includes(qNorm)) base = 20;
            else if (textNorm.includes(qNorm)) base = 10;

            return base + typeWeight(card);
        };

        const found = { categories: 0, regions: 0, tours: 0 };
        let bestMatch = null;
        let bestScore = -1;
        let bestTourMatch = null;
        let bestTourScore = -1;

        const processCards = (cards, key) => {
            cards.forEach((card) => {
                // Get title for better matching
                const title = getCardTitle(card);
                const titleNorm = collapseSpaces(title);
                const fullText = collapseSpaces(card.textContent || '');
                
                // Check if query matches title exactly or partially
                const titleMatch = titleNorm === qNorm || titleNorm.includes(qNorm);
                // Check if query matches full text
                const textMatch = matchesQuery(fullText, q);
                
                // Show card if title matches OR text matches
                const ok = titleMatch || textMatch;
                card.hidden = !ok;
                if (!ok) return;

                found[key] += 1;

                const s = scoreCard(card);
                if (s > bestScore) {
                    bestScore = s;
                    bestMatch = card;
                }
                if (card.classList.contains('tour-card') && s > bestTourScore) {
                    bestTourScore = s;
                    bestTourMatch = card;
                }
            });
        };

        processCards(categoryCards, 'categories');
        processCards(regionCards, 'regions');
        processCards(tourCards, 'tours');

        const total = found.categories + found.regions + found.tours;
        setInfo(
            total > 0
                ? `Найдено: туры ${found.tours} • области ${found.regions} • категории ${found.categories}`
                : 'Ничего не найдено'
        );

        // If query is exactly a category/tag name, prefer the category itself if found
        const isCategoryOrTagExact = categoryTitleNorms.has(qNorm) || tagTitleNorms.has(qNorm);
        
        // Find matching category card if query matches category name
        let matchingCategory = null;
        if (isCategoryOrTagExact) {
            matchingCategory = categoryCards.find(card => {
                const title = getCardTitle(card);
                return collapseSpaces(title) === qNorm;
            });
        }
        
        // Prefer category card if found, otherwise prefer tours, otherwise best match
        const target = matchingCategory || (isCategoryOrTagExact && bestTourMatch) || bestMatch;

        if (highlightFirst && target) {
            highlightCard(target);
        }

        return { found, firstMatch: target };
    };

    // Submit = search + scroll to match
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = (input?.value || '').trim();
        const { firstMatch } = applySearch(query, { highlightFirst: true });
        if (firstMatch) {
            // Scroll to the matched element (category, region, or tour)
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // If no match, scroll to categories section first, then tours
            const categoriesSection = document.querySelector('.categories');
            if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (toursSection) {
                toursSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // Live filtering while typing
    input?.addEventListener('input', () => {
        applySearch(input.value);
    });

    // ESC = clear search
    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            input.value = '';
            applySearch('');
            input.blur();
        }
    });

    // Init suggestions (archive of tours) on load
    refreshSearchIndex();

    // Rebuild suggestions after language switching (titles change)
    document.addEventListener('languageChanged', () => {
        refreshSearchIndex();
        applySearch(input?.value || '');
    });
}

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(220, 20, 60, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(220, 20, 60, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.tour-card, .category-card, .region-card, .advantage-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});