/**
 * CROWNTOUR Blog — отзывы клиентов
 * Хранение в localStorage, без бэкенда.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'crowntour_reviews';

    const DEMO_REVIEWS = [
        {
            name: 'Анна К.',
            email: 'anna@example.com',
            rating: 5,
            tour: 'Памирский тракт',
            text: 'Невероятное путешествие! Гиды — профессионалы, маршрут составлен идеально. Памир превзошёл все ожидания. Обязательно поедем с CROWNTOUR ещё.',
            date: '2025-01-15T12:00:00.000Z'
        },
        {
            name: 'Дмитрий М.',
            email: 'dmitry@example.com',
            rating: 5,
            tour: 'Искандеркуль',
            text: 'Озеро Искандеркуль — как из сказки. Организация на высоте, питание отличное. Спасибо команде за тёплый приём!',
            date: '2025-01-10T09:30:00.000Z'
        },
        {
            name: 'Елена С.',
            email: 'elena@example.com',
            rating: 4,
            tour: 'Древние города Согда',
            text: 'Пенджикент и Худжанд — must see. Узнали много нового об истории региона. Рекомендую всем любителям культуры.',
            date: '2025-01-05T14:20:00.000Z'
        }
    ];

    function getReviews() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const data = JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function saveReviews(reviews) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
            return true;
        } catch {
            return false;
        }
    }

    function ensureDemoReviews() {
        let reviews = getReviews();
        if (reviews.length === 0) {
            reviews = DEMO_REVIEWS.map(function (r) {
                return { ...r, id: 'demo-' + Math.random().toString(36).slice(2) };
            });
            saveReviews(reviews);
        }
        return reviews;
    }

    function formatDate(iso) {
        const d = new Date(iso);
        const now = new Date();
        const diff = now - d;
        if (diff < 86400000) return 'Сегодня';
        if (diff < 172800000) return 'Вчера';
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function renderStars(rating, interactive) {
        var html = '';
        for (var i = 1; i <= 5; i++) {
            var cls = i <= rating ? ' star-btn--active' : '';
            html += '<span class="review-stars__star' + cls + '" aria-hidden="true">★</span>';
        }
        return '<div class="review-stars" aria-label="Оценка: ' + rating + ' из 5">' + html + '</div>';
    }

    function renderReview(r) {
        var tourHtml = r.tour ? '<span class="review-card__tour">' + escapeHtml(r.tour) + '</span>' : '';
        return (
            '<article class="review-card">' +
            '  <div class="review-card__header">' +
            '    <div class="review-card__meta">' +
            '      <span class="review-card__name">' + escapeHtml(r.name) + '</span>' +
            '      ' + tourHtml +
            '    </div>' +
            '    <div class="review-card__rating">' + renderStars(r.rating, false) + '</div>' +
            '  </div>' +
            '  <p class="review-card__text">' + escapeHtml(r.text) + '</p>' +
            '  <time class="review-card__date" datetime="' + r.date + '">' + formatDate(r.date) + '</time>' +
            '</article>'
        );
    }

    function escapeHtml(s) {
        if (!s) return '';
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function renderReviewsList(reviews) {
        var list = document.getElementById('reviewsList');
        var empty = document.getElementById('reviewsEmpty');
        if (!list || !empty) return;

        if (reviews.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        list.innerHTML = reviews
            .slice()
            .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
            .map(renderReview)
            .join('');
    }

    function initStarRating() {
        var container = document.getElementById('starRating');
        var input = document.getElementById('reviewRating');
        if (!container || !input) return;

        var buttons = container.querySelectorAll('.star-btn');
        var current = 0;

        function setRating(n) {
            current = n;
            input.value = n;
            buttons.forEach(function (btn, i) {
                btn.classList.toggle('star-btn--active', i < n);
            });
        }

        buttons.forEach(function (btn, i) {
            var rating = i + 1;
            btn.addEventListener('click', function () { setRating(rating); });
            btn.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRating(rating);
                }
            });
        });
    }

    function initForm() {
        var form = document.getElementById('reviewForm');
        var message = document.getElementById('formMessage');
        if (!form || !message) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nameEl = document.getElementById('reviewName');
            var emailEl = document.getElementById('reviewEmail');
            var ratingEl = document.getElementById('reviewRating');
            var tourEl = document.getElementById('reviewTour');
            var textEl = document.getElementById('reviewText');

            var name = (nameEl && nameEl.value || '').trim();
            var email = (emailEl && emailEl.value || '').trim();
            var rating = parseInt(ratingEl && ratingEl.value, 10) || 0;
            var tour = (tourEl && tourEl.value || '').trim();
            var text = (textEl && textEl.value || '').trim();

            message.textContent = '';
            message.className = 'blog-form__message';

            if (!name) {
                message.textContent = 'Введите ваше имя.';
                message.classList.add('blog-form__message--error');
                if (nameEl) nameEl.focus();
                return;
            }
            if (!email) {
                message.textContent = 'Введите email.';
                message.classList.add('blog-form__message--error');
                if (emailEl) emailEl.focus();
                return;
            }
            if (rating < 1 || rating > 5) {
                message.textContent = 'Поставьте оценку от 1 до 5 звёзд.';
                message.classList.add('blog-form__message--error');
                return;
            }
            if (!text) {
                message.textContent = 'Напишите текст отзыва.';
                message.classList.add('blog-form__message--error');
                if (textEl) textEl.focus();
                return;
            }

            var review = {
                id: 'rev-' + Date.now() + '-' + Math.random().toString(36).slice(2),
                name: name,
                email: email,
                rating: rating,
                tour: tour || null,
                text: text,
                date: new Date().toISOString()
            };

            var reviews = getReviews();
            reviews.unshift(review);
            if (!saveReviews(reviews)) {
                message.textContent = 'Не удалось сохранить отзыв. Попробуйте ещё раз.';
                message.classList.add('blog-form__message--error');
                return;
            }

            renderReviewsList(reviews);

            message.textContent = 'Спасибо! Ваш отзыв опубликован.';
            message.classList.add('blog-form__message--success');

            form.reset();
            var starContainer = document.getElementById('starRating');
            if (starContainer) {
                starContainer.querySelectorAll('.star-btn').forEach(function (b) { b.classList.remove('star-btn--active'); });
            }
            if (ratingEl) ratingEl.value = '0';

            var listSection = document.getElementById('reviews');
            if (listSection) listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function init() {
        var reviews = ensureDemoReviews();
        renderReviewsList(reviews);
        initStarRating();
        initForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
