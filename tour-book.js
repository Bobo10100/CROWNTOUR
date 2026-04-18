(function() {
    function initTourBookWidgets() {
        document.querySelectorAll('.tour-book-widget').forEach(function(widget) {
            var price4 = parseInt(widget.getAttribute('data-price-4'), 10) || 0;
            var price6 = parseInt(widget.getAttribute('data-price-6'), 10) || 0;
            var price8 = parseInt(widget.getAttribute('data-price-8'), 10) || 0;
            var price1 = parseInt(widget.getAttribute('data-price-1'), 10) || 0;
            var discount2to4 = parseInt(widget.getAttribute('data-discount-2to4'), 10) || 0;
            var discount5plus = parseInt(widget.getAttribute('data-discount-5plus'), 10) || 0;
            var maxPax = parseInt(widget.getAttribute('data-max'), 10) || 12;

            var priceEl = widget.querySelector('.tour-book-price-main');
            var unitEl = widget.querySelector('.tour-book-price-unit');
            var stepperSpan = widget.querySelector('.tour-book-stepper span');
            var btnMinus = widget.querySelector('.tour-book-stepper button[aria-label="Минус"], .tour-book-stepper button:first-child');
            var btnPlus = widget.querySelector('.tour-book-stepper button[aria-label="Плюс"], .tour-book-stepper button:last-child');

            if (!priceEl || !unitEl || !stepperSpan) return;

            function getPricePerPerson(n) {
                if (price1 > 0) {
                    if (n === 1) return price1;
                    if (n >= 2 && n <= 4 && discount2to4 > 0) return Math.round(price1 * (1 - discount2to4 / 100));
                    if (n >= 5 && discount5plus > 0) return Math.round(price1 * (1 - discount5plus / 100));
                    return price1;
                }
                if (n <= 5) return price4;
                if (n <= 7) return price6;
                return price8;
            }

            var minPax = 1;
            function updateDisplay() {
                var n = parseInt(stepperSpan.textContent, 10) || minPax;
                n = Math.min(Math.max(n, minPax), maxPax);
                stepperSpan.textContent = n;

                var perPerson = getPricePerPerson(n);
                var total = n * perPerson;

                priceEl.textContent = total + ' $';
                var ppVal = widget.querySelector('.tour-book-pp-value');
                if (ppVal) ppVal.textContent = perPerson;
            }

            btnMinus.addEventListener('click', function() {
                var n = parseInt(stepperSpan.textContent, 10) || minPax;
                if (n > minPax) {
                    stepperSpan.textContent = n - 1;
                    updateDisplay();
                }
            });

            btnPlus.addEventListener('click', function() {
                var n = parseInt(stepperSpan.textContent, 10) || minPax;
                if (n < maxPax) {
                    stepperSpan.textContent = n + 1;
                    updateDisplay();
                }
            });

            updateDisplay();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTourBookWidgets);
    } else {
        initTourBookWidgets();
    }
})();
