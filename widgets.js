// Currency and Weather Widgets - Live Data
(function() {
    'use strict';

    // Currency Widget
    const updateCurrency = async () => {
        const currencyUpdate = document.getElementById('currencyUpdate');
        const usdRate = document.getElementById('usdRate');
        const eurRate = document.getElementById('eurRate');
        const rubRate = document.getElementById('rubRate');

        if (!currencyUpdate || !usdRate || !eurRate || !rubRate) return;

        try {
            currencyUpdate.textContent = 'Обновление...';
            
            // Using exchangerate-api.com (free, no API key needed for basic usage)
            // Alternative: using a free currency API
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            
            if (!response.ok) throw new Error('Currency API error');
            
            const data = await response.json();
            const rates = data.rates;
            
            // TJS (Tajikistani Somoni) rate
            const tjsRate = rates.TJS || 10.5; // Fallback if TJS not available
            
            // Calculate rates
            const usdToTjs = tjsRate.toFixed(2);
            const eurToTjs = ((tjsRate / rates.EUR) || 11.5).toFixed(2);
            const rubToTjs = ((tjsRate / rates.RUB) || 0.12).toFixed(2);
            
            usdRate.textContent = usdToTjs;
            eurRate.textContent = eurToTjs;
            rubRate.textContent = rubToTjs;
            
            const now = new Date();
            currencyUpdate.textContent = `Обновлено: ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
            
        } catch (error) {
            console.error('Currency fetch error:', error);
            currencyUpdate.textContent = 'Ошибка загрузки';
            
            // Fallback values (approximate rates)
            usdRate.textContent = '10.50';
            eurRate.textContent = '11.50';
            rubRate.textContent = '0.12';
        }
    };

    // Weather Widget
    const updateWeather = async () => {
        const weatherUpdate = document.getElementById('weatherUpdate');
        const weatherIcon = document.getElementById('weatherIcon');
        const weatherTemp = document.getElementById('weatherTemp');
        const weatherDesc = document.getElementById('weatherDesc');
        const weatherFeels = document.getElementById('weatherFeels');
        const weatherHumidity = document.getElementById('weatherHumidity');
        const weatherWind = document.getElementById('weatherWind');

        if (!weatherUpdate || !weatherIcon || !weatherTemp) return;

        try {
            weatherUpdate.textContent = 'Обновление...';
            
            // Using wttr.in (free, no API key needed)
            // Dushanbe, Tajikistan coordinates: 38.5358, 68.7791
            const response = await fetch('https://wttr.in/Dushanbe?format=j1&lang=ru');
            
            if (!response.ok) throw new Error('Weather API error');
            
            const data = await response.json();
            const current = data.current_condition[0];
            
            const temp = current.temp_C;
            const feelsLike = current.FeelsLikeC;
            const humidity = current.humidity;
            const windSpeed = current.windspeedKmph;
            const windDir = current.winddir16Point;
            const desc = current.lang_ru ? current.lang_ru[0].value : current.weatherDesc[0].value;
            const iconCode = current.weatherCode;
            
            // Map weather codes to emojis
            const iconMap = {
                '113': '☀️', // Clear
                '116': '⛅', // Partly cloudy
                '119': '☁️', // Cloudy
                '122': '☁️', // Overcast
                '143': '🌫️', // Mist
                '176': '🌦️', // Patchy rain
                '179': '🌨️', // Patchy snow
                '182': '🌨️', // Patchy sleet
                '185': '🌨️', // Patchy freezing drizzle
                '200': '⛈️', // Thundery outbreaks
                '227': '🌨️', // Blowing snow
                '230': '❄️', // Blizzard
                '248': '🌫️', // Fog
                '260': '🌫️', // Freezing fog
                '263': '🌦️', // Patchy light drizzle
                '266': '🌦️', // Light drizzle
                '281': '🌨️', // Freezing drizzle
                '284': '🌨️', // Heavy freezing drizzle
                '293': '🌦️', // Patchy light rain
                '296': '🌦️', // Light rain
                '299': '🌧️', // Moderate rain
                '302': '🌧️', // Heavy rain
                '305': '🌧️', // Heavy rain
                '308': '🌧️', // Heavy rain
                '311': '🌨️', // Light freezing rain
                '314': '🌨️', // Moderate or heavy freezing rain
                '317': '🌨️', // Light sleet
                '320': '🌨️', // Moderate or heavy sleet
                '323': '🌨️', // Patchy light snow
                '326': '🌨️', // Patchy moderate snow
                '329': '❄️', // Patchy heavy snow
                '332': '❄️', // Moderate snow
                '335': '❄️', // Patchy heavy snow
                '338': '❄️', // Heavy snow
                '350': '🌨️', // Ice pellets
                '353': '🌦️', // Light rain shower
                '356': '🌧️', // Moderate or heavy rain shower
                '359': '🌧️', // Torrential rain shower
                '362': '🌨️', // Light sleet showers
                '365': '🌨️', // Moderate or heavy sleet showers
                '368': '🌨️', // Light snow showers
                '371': '❄️', // Moderate or heavy snow showers
                '374': '🌨️', // Light showers of ice pellets
                '377': '🌨️', // Moderate or heavy showers of ice pellets
                '386': '⛈️', // Patchy light rain with thunder
                '389': '⛈️', // Moderate or heavy rain with thunder
                '392': '⛈️', // Patchy light snow with thunder
                '395': '❄️'  // Moderate or heavy snow with thunder
            };
            
            weatherIcon.textContent = iconMap[iconCode] || '☀️';
            weatherTemp.textContent = `${temp}°C`;
            weatherDesc.textContent = desc || 'Ясно';
            weatherFeels.textContent = `${feelsLike}°C`;
            weatherHumidity.textContent = `${humidity}%`;
            weatherWind.textContent = `${windSpeed} км/ч ${windDir || ''}`;
            
            const now = new Date();
            weatherUpdate.textContent = `Обновлено: ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            weatherUpdate.textContent = 'Ошибка загрузки';
            
            // Fallback values
            weatherIcon.textContent = '☀️';
            weatherTemp.textContent = '—';
            weatherDesc.textContent = 'Данные недоступны';
            weatherFeels.textContent = '—';
            weatherHumidity.textContent = '—';
            weatherWind.textContent = '—';
        }
    };

    // Initialize widgets on page load
    const initWidgets = () => {
        // Load immediately
        updateCurrency();
        updateWeather();
        
        // Update every 5 minutes (300000 ms)
        setInterval(updateCurrency, 300000);
        setInterval(updateWeather, 300000);
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidgets);
    } else {
        initWidgets();
    }
})();
