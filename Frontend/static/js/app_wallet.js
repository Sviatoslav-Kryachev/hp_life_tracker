// ============= WALLET MODULE =============
// Кошелек, статистика, календарь, streak, рекомендации

// Зависимости: app_utils.js, app_auth.js (должны быть загружены первыми)

// ============= WALLET STATE =============
let balanceSpan, levelSpan;
let currentCalendarPeriod = 'week';

// ============= WALLET =============
async function loadWallet() {
    try {
        if (!balanceSpan) {
            balanceSpan = document.getElementById("balance");
        }
        if (!levelSpan) {
            levelSpan = document.getElementById("level");
        }

        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) return;
        
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/xp/wallet`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (balanceSpan) balanceSpan.textContent = `${Math.round(data.balance)} XP`;
        if (levelSpan) levelSpan.textContent = data.level;

        // Обновляем прогресс уровня
        const nextLevel = data.level + 1;
        const xpForCurrentLevel = (data.level - 1) * 1000;
        const xpForNextLevel = data.level * 1000;
        const currentProgress = data.total_earned - xpForCurrentLevel;
        const progressPercent = Math.min((currentProgress / 1000) * 100, 100);

        const nextLevelEl = document.getElementById('next-level');
        const xpToNextEl = document.getElementById('xp-to-next');
        const levelProgressEl = document.getElementById('level-progress');
        const totalEarnedEl = document.getElementById('total-earned');

        if (nextLevelEl) nextLevelEl.textContent = nextLevel;
        if (xpToNextEl) xpToNextEl.textContent = `${Math.round(currentProgress)}/${1000} XP`;
        if (levelProgressEl) levelProgressEl.style.width = `${progressPercent}%`;
        if (totalEarnedEl) totalEarnedEl.textContent = Math.round(data.total_earned);

    } catch (e) {
        console.error("Error loading wallet", e);
    }
}

// ============= TODAY STATS =============
async function loadTodayStats() {
    try {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) return;
        
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/xp/today`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();

        const earnedEl = document.getElementById('today-earned');
        const spentEl = document.getElementById('today-spent');
        const sessionsEl = document.getElementById('today-sessions');
        const timeEl = document.getElementById('today-time');

        if (earnedEl) earnedEl.textContent = Math.round(data.earned_today);
        if (spentEl) spentEl.textContent = Math.round(data.spent_today);
        if (sessionsEl) sessionsEl.textContent = data.sessions_today;
        if (timeEl) {
            const hours = Math.floor(data.time_today_minutes / 60);
            const mins = Math.round(data.time_today_minutes % 60);
            const currentLanguage = typeof window !== 'undefined' && window.currentLanguage ? window.currentLanguage : localStorage.getItem('language') || 'ru';
            const hourLabel = currentLanguage === 'uk' ? 'год' : currentLanguage === 'de' ? 'Std.' : currentLanguage === 'en' ? 'h' : 'ч';
            const minLabel = currentLanguage === 'uk' ? 'хв' : currentLanguage === 'de' ? 'Min.' : currentLanguage === 'en' ? 'm' : 'м';
            timeEl.textContent = hours > 0 ? `${hours}${hourLabel} ${mins}${minLabel}` : `${mins}${minLabel}`;
        }
    } catch (e) {
        console.error("Error loading today stats", e);
    }
}

// ============= CATEGORY STATS =============
async function loadCategoryStats() {
    try {
        console.log('[loadCategoryStats] Starting...');
        const categoryStatsEl = document.getElementById('category-stats');
        if (!categoryStatsEl) {
            console.warn("[loadCategoryStats] Category stats element not found");
            return;
        }

        const getToken = typeof getAuthToken === 'function' ? getAuthToken : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken : () => localStorage.getItem('token') || '';
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        const formatActivitiesCount = typeof window !== 'undefined' && window.formatActivitiesCount ? window.formatActivitiesCount : (count) => count;
        
        const token = getToken();
        console.log('[loadCategoryStats] Token available:', !!token, 'API_BASE:', apiBase);
        
        if (!token) {
            console.error("[loadCategoryStats] No auth token available");
            categoryStatsEl.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">Требуется авторизация</div>';
            return;
        }

        console.log('[loadCategoryStats] Fetching from:', `${apiBase}/xp/category-stats?period=week`);
        const res = await fetch(`${apiBase}/xp/category-stats?period=week`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log('[loadCategoryStats] Response status:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load category stats:", res.status, res.statusText, errorText);
            categoryStatsEl.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">Ошибка загрузки</div>';
            return;
        }

        const data = await res.json();

        if (!data.categories || data.categories.length === 0) {
            categoryStatsEl.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">Нет данных по категориям</div>';
            return;
        }

        const categoryNames = {
            "general": t('category_general'),
            "study": t('category_study'),
            "sport": t('category_sport'),
            "hobby": t('category_hobby'),
            "work": t('category_work'),
            "health": t('category_health')
        };

        const allCategories = typeof window !== 'undefined' && window.allCategories ? window.allCategories : { custom: [] };
        if (allCategories.custom) {
            allCategories.custom.forEach(customCat => {
                categoryNames[customCat.id] = customCat.name;
            });
        }

        categoryStatsEl.innerHTML = data.categories.map(cat => {
            const catName = categoryNames[cat.category] || cat.category;
            const percentage = data.total_xp > 0 ? (cat.total_xp / data.total_xp * 100) : 0;
            return `
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-gray-800 text-sm">${catName}</span>
                        <span class="font-bold text-blue-600 text-sm">${Math.round(cat.total_xp)} XP</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all" style="width: ${percentage}%"></div>
                    </div>
                    <div class="text-xs text-gray-500">${Math.round(cat.total_time)} ${t('min_short')} • ${formatActivitiesCount(cat.activity_count)}</div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading category stats", e);
        const categoryStatsEl = document.getElementById('category-stats');
        if (categoryStatsEl) {
            categoryStatsEl.innerHTML = '<div class="text-center text-red-400 py-4 text-sm">Ошибка загрузки</div>';
        }
    }
}

// ============= CALENDAR =============
function changeCalendarPeriod(period) {
    currentCalendarPeriod = period;

    // Обновляем активную кнопку
    document.querySelectorAll('[id^="period-"]').forEach(btn => {
        btn.classList.remove('bg-indigo-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    const activeBtn = document.getElementById(`period-${period}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-indigo-500', 'text-white');
    }

    // Загружаем календарь для выбранного периода
    loadCalendar(period);
}

async function loadCalendar(period = currentCalendarPeriod) {
    try {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) return;
        
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const endpoint = period === 'week' ? '/xp/week' : period === 'month' ? '/xp/month' : '/xp/year';
        const res = await fetch(`${apiBase}${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();

        const containerEl = document.getElementById('calendar-container');
        if (!containerEl) return;

        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

        if (period === 'week') {
            // Маппинг дней недели на ключи переводов
            const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            
            // Маппинг русских сокращений на индексы (Пн=0, Вт=1, ..., Вс=6)
            const dayNameToIndex = {
                'Пн': 0, 'Вт': 1, 'Ср': 2, 'Чт': 3, 'Пт': 4, 'Сб': 5, 'Вс': 6
            };

            containerEl.innerHTML = `
                <div class="flex justify-between gap-0.5 md:gap-1" id="week-calendar">
                    ${data.map((day, index) => {
                        const hasActivity = day.earned > 0 || day.spent > 0;
                        const intensity = Math.min(day.earned / 100, 1);
                        const todayDate = new Date();
                        const [year, month, dayNum] = day.date.split('-').map(Number);
                        const dayDate = new Date(year, month - 1, dayNum, 12, 0, 0);
                        const isTodayDate = dayDate.toDateString() === todayDate.toDateString();

                        let dayIndex = dayNameToIndex[day.day_name];
                        if (dayIndex === undefined) {
                            const jsDay = dayDate.getDay();
                            dayIndex = jsDay === 0 ? 6 : jsDay - 1;
                        }
                        
                        const dayKey = dayKeys[dayIndex];
                        const localizedDayName = dayKey ? t(dayKey) : day.day_name;

                        return `
                            <div class="flex flex-col items-center cursor-pointer ${isTodayDate ? 'scale-110' : ''}"
                                 onclick="showDayDetails('${day.date}')"
                                 title="${t('click_for_details')}: ${day.earned} ${t('earned_xp')}, ${day.spent} ${t('spent_xp')}">
                                <span class="text-xs text-gray-500 mb-1">${localizedDayName}</span>
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110
                                    ${isTodayDate ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' :
                                      hasActivity ? `bg-emerald-${Math.round(intensity * 4 + 1)}00 text-emerald-800` : 'bg-gray-100 text-gray-400'}">
                                    ${Math.round(day.earned)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else if (period === 'month') {
            // Календарь месяца в виде сетки
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

            const dayDataMap = {};
            data.forEach(day => {
                dayDataMap[day.day_number] = day;
            });

            let calendarHTML = `
                <div class="grid grid-cols-7 gap-1 mb-2">
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('mon')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('tue')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('wed')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('thu')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('fri')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('sat')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('sun')}</div>
                </div>
                <div class="grid grid-cols-7 gap-1">
            `;

            for (let i = 0; i < startDayOfWeek; i++) {
                calendarHTML += '<div class="aspect-square"></div>';
            }

            for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
                const day = dayDataMap[dayNum] || { day_number: dayNum, earned: 0, spent: 0, date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` };
                const dayDate = new Date(day.date);
                const todayDate = new Date();
                const isTodayDate = dayDate.toDateString() === todayDate.toDateString();
                const hasActivity = day.earned > 0 || day.spent > 0;
                const intensity = Math.min(day.earned / 200, 1);

                calendarHTML += `
                    <div class="aspect-square flex flex-col items-center justify-center rounded-lg transition-all hover:bg-gray-50 cursor-pointer ${isTodayDate ? 'ring-2 ring-indigo-400 scale-105 bg-indigo-50' : ''}"
                         onclick="showDayDetails('${day.date}')"
                         title="${t('click_for_details')}: ${day.earned} ${t('earned_xp')}, ${day.spent} ${t('spent_xp')}">
                        <span class="text-[10px] font-medium ${isTodayDate ? 'text-indigo-600 font-bold' : 'text-gray-600'}">${dayNum}</span>
                        ${hasActivity ? `
                            <div class="w-2 h-2 rounded-full mt-0.5 ${isTodayDate ? 'bg-indigo-500' : intensity > 0.5 ? 'bg-emerald-500' : intensity > 0.25 ? 'bg-emerald-400' : 'bg-emerald-300'}"></div>
                        ` : ''}
                    </div>
                `;
            }

            calendarHTML += '</div>';
            containerEl.innerHTML = calendarHTML;
        } else if (period === 'year') {
            // Календарь года - по месяцам
            const today = new Date();
            const currentYear = today.getFullYear();

            const monthKeys = [
                'month_jan', 'month_feb', 'month_mar', 'month_apr', 'month_may', 'month_jun',
                'month_jul', 'month_aug', 'month_sep', 'month_oct', 'month_nov', 'month_dec'
            ];

            containerEl.innerHTML = `
                <div class="text-center mb-3">
                    <h4 class="text-sm font-bold text-gray-700">${currentYear}</h4>
                </div>
                <div class="grid grid-cols-4 gap-2">
                    ${data.map(month => {
                        const hasActivity = month.earned > 0 || month.spent > 0;
                        const intensity = Math.min(month.earned / 2000, 1);
                        const today = new Date();
                        const isCurrentMonth = today.getMonth() + 1 === month.month;

                        const monthKey = monthKeys[month.month - 1];
                        const localizedMonthName = t(monthKey);

                        let bgColor = 'bg-gray-100';
                        let textColor = 'text-gray-400';
                        if (hasActivity) {
                            if (intensity > 0.75) {
                                bgColor = 'bg-emerald-500';
                                textColor = 'text-white';
                            } else if (intensity > 0.5) {
                                bgColor = 'bg-emerald-400';
                                textColor = 'text-white';
                            } else if (intensity > 0.25) {
                                bgColor = 'bg-emerald-300';
                                textColor = 'text-emerald-800';
                            } else {
                                bgColor = 'bg-emerald-200';
                                textColor = 'text-emerald-800';
                            }
                        }

                        return `
                            <div class="flex flex-col items-center p-2 rounded-lg transition-all hover:shadow-md cursor-pointer ${isCurrentMonth ? 'ring-2 ring-indigo-300' : ''}"
                                 onclick="showMonthDetails(${month.month})"
                                 title="${t('click_for_details')}: ${localizedMonthName} - ${month.earned} ${t('earned_xp')}, ${month.spent} ${t('spent_xp')}">
                                <span class="text-xs font-semibold ${isCurrentMonth ? 'text-indigo-600' : 'text-gray-600'} mb-1">${localizedMonthName}</span>
                                <div class="w-full h-8 rounded flex items-center justify-center text-[10px] font-bold ${bgColor} ${textColor}">
                                    ${Math.round(month.earned)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    } catch (e) {
        console.error("Error loading calendar", e);
    }
}

// Старая функция для обратной совместимости
async function loadWeekCalendar() {
    await loadCalendar('week');
}

// ============= DAY DETAILS =============
async function showDayDetails(date) {
    try {
        const modal = document.getElementById('day-details-modal');
        const titleEl = document.getElementById('day-details-title');
        const contentEl = document.getElementById('day-details-content');

        if (!modal || !titleEl || !contentEl) {
            console.error("Day details modal elements not found");
            return;
        }

        modal.classList.remove('hidden');
        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        contentEl.innerHTML = `<div class="text-center text-gray-400 py-4">${t('loading')}</div>`;

        let formattedDate = date;
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        } else if (typeof date === 'string') {
            const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (!dateMatch) {
                console.error("Invalid date format:", date);
                contentEl.innerHTML = `<div class="text-center text-red-400 py-4">Неверный формат даты: ${date}</div>`;
                return;
            }
            formattedDate = dateMatch[0];
        }

        console.log("Loading day details for date:", formattedDate);

        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) {
            contentEl.innerHTML = `<div class="text-center text-red-400 py-4">${t('auth_required')}</div>`;
            return;
        }

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/xp/day/${formattedDate}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load day details:", res.status, res.statusText, errorText, "Date:", formattedDate);
            let errorMessage = t('error_loading_data');
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.detail) {
                    errorMessage = errorJson.detail;
                }
            } catch (e) {
                // Если не JSON, используем стандартное сообщение
            }
            contentEl.innerHTML = `<div class="text-center text-red-400 py-4">${errorMessage}</div>`;
            return;
        }

        const data = await res.json();

        const dateToDisplay = formattedDate;
        const [year, month, day] = dateToDisplay.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day, 12, 0, 0);
        
        if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
            console.warn("Date parsing mismatch:", { year, month, day, parsed: dateObj });
        }

        const currentLanguage = typeof window !== 'undefined' && window.currentLanguage ? window.currentLanguage : localStorage.getItem('language') || 'ru';
        let formattedDateDisplay;
        if (currentLanguage === 'uk') {
            const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'];
            const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
                           'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
            const weekday = weekdays[dateObj.getDay()];
            const monthName = months[dateObj.getMonth()];
            formattedDateDisplay = `${weekday}, ${day} ${monthName} ${year}`;
        } else {
            const localeMap = { 'ru': 'ru-RU', 'de': 'de-DE', 'en': 'en-US' };
            const locale = localeMap[currentLanguage] || 'ru-RU';
            formattedDateDisplay = dateObj.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        titleEl.textContent = `📅 ${formattedDateDisplay}`;
        
        console.log("Displaying day details:", {
            receivedDate: formattedDate,
            serverDate: data.date,
            dateToDisplay: dateToDisplay,
            parsedDate: { year, month, day },
            dateObj: dateObj,
            dayOfWeek: dateObj.getDay(),
            formattedDisplay: formattedDateDisplay
        });

        const formatTime = (timeStr) => {
            if (!timeStr) return '';
            const time = new Date(timeStr);
            const localeMap = { 'ru': 'ru-RU', 'uk': 'uk-UA', 'de': 'de-DE', 'en': 'en-US' };
            const locale = localeMap[currentLanguage] || 'ru-RU';
            return time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        };

        const formatDuration = (minutes) => {
            if (!minutes || minutes === 0) return '0м';
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            if (hours > 0) {
                return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
            }
            return `${mins}м`;
        };

        let html = `
            <div class="space-y-4">
                <!-- Общая статистика -->
                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('earned')}</div>
                            <div class="text-xl font-bold text-green-600">+${data.total_earned} XP</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('spent')}</div>
                            <div class="text-xl font-bold text-red-600">-${data.total_spent} XP</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('activity_time')}</div>
                            <div class="text-lg font-semibold text-indigo-600">${formatDuration(data.total_time)}</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('total')}</div>
                            <div class="text-lg font-semibold ${data.net >= 0 ? 'text-green-600' : 'text-red-600'}">${data.net >= 0 ? '+' : ''}${data.net} XP</div>
                        </div>
                    </div>
                </div>
        `;

        // Заработки
        if (data.earnings && data.earnings.length > 0) {
            html += `
                <div>
                    <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <i class="fas fa-arrow-up text-green-500"></i>
                        ${t('earnings')} (${data.sessions_count} ${t('sessions')})
                    </h4>
                    <div class="space-y-2">
                        ${data.earnings.map(earning => `
                            <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="font-semibold text-gray-800">${earning.activity_name}</div>
                                        <div class="text-xs text-gray-600 mt-1">
                                            <i class="fas fa-clock text-xs"></i> ${formatDuration(earning.duration_minutes)}
                                            ${earning.time ? ` • ${formatTime(earning.time)}` : ''}
                                        </div>
                                    </div>
                                    <div class="text-green-600 font-bold">+${earning.xp_earned} XP</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="text-center text-gray-400 py-4 bg-gray-50 rounded-lg">
                    <i class="fas fa-info-circle mb-2"></i>
                    <div>${t('no_activity_today')}</div>
                </div>
            `;
        }

        // Расходы
        if (data.spendings && data.spendings.length > 0) {
            html += `
                <div>
                    <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <i class="fas fa-arrow-down text-red-500"></i>
                        ${t('spendings')} (${data.purchases_count} ${t('purchases')})
                    </h4>
                    <div class="space-y-2">
                        ${data.spendings.map(spending => `
                            <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="font-semibold text-gray-800">${spending.reward_name}</div>
                                        ${spending.time ? `
                                            <div class="text-xs text-gray-600 mt-1">
                                                <i class="fas fa-clock text-xs"></i> ${formatTime(spending.time)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="text-red-600 font-bold">-${Math.abs(spending.xp_spent)} XP</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Кнопка создания цели
        html += `
            <div class="mt-4 pt-4 border-t border-gray-200">
                <button onclick="if(typeof window.showCreateGoalModal === 'function') window.showCreateGoalModal(); if(typeof window.closeDayDetailsModal === 'function') window.closeDayDetailsModal();"
                        class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    <i class="fas fa-bullseye"></i>
                    <span>${t('create_goal')}</span>
                </button>
            </div>
        `;

        html += '</div>';
        contentEl.innerHTML = html;

    } catch (e) {
        console.error("Error loading day details:", e);
        const contentEl = document.getElementById('day-details-content');
        if (contentEl) {
            const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
            contentEl.innerHTML = `<div class="text-center text-red-400 py-4">${t('error_loading_data')}</div>`;
        }
    }
}

function closeDayDetailsModal() {
    const modal = document.getElementById('day-details-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Показать детали месяца (переключаемся на календарь месяца)
function showMonthDetails(month) {
    changeCalendarPeriod('month');
    // Можно добавить логику для выделения конкретного месяца
}

// ============= STREAK =============
async function loadStreak() {
    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/streak/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();

        const countEl = document.getElementById('streak-count');
        const recordEl = document.getElementById('streak-record');
        const messageEl = document.getElementById('streak-message');

        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

        if (countEl) countEl.textContent = data.current_streak;
        if (recordEl) {
            const daysText = t('days');
            recordEl.innerHTML = `${data.longest_streak} <span data-i18n="days">${daysText}</span>`;
        }

        if (messageEl) {
            if (data.current_streak === 0) {
                messageEl.textContent = t('start_streak_message');
            } else if (data.current_streak === 1) {
                messageEl.textContent = t('streak_1_day');
            } else if (data.current_streak < 7) {
                messageEl.textContent = t('streak_days_in_row').replace('{days}', data.current_streak);
            } else if (data.current_streak < 30) {
                messageEl.textContent = t('streak_week');
            } else {
                messageEl.textContent = t('streak_month');
            }
        }
    } catch (e) {
        console.error("Error loading streak", e);
    }
}

// ============= RECOMMENDATIONS =============
async function loadRecommendations() {
    try {
        console.log('[loadRecommendations] Starting...');
        const listVisible = document.getElementById('recommendations-list-visible');
        const listHidden = document.getElementById('recommendations-list-hidden');

        if (!listVisible || !listHidden) {
            console.warn("[loadRecommendations] Recommendations list elements not found");
            return;
        }

        const getToken = typeof getAuthToken === 'function' ? getAuthToken : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken : () => localStorage.getItem('token') || '';
        const translate = typeof t === 'function' ? t : (typeof window !== 'undefined' && window.t) ? window.t : (key) => key;
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        
        const token = getToken();
        console.log('[loadRecommendations] Token available:', !!token, 'API_BASE:', apiBase);
        
        if (!token) {
            console.error("[loadRecommendations] No auth token available");
            listVisible.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${translate('auth_required') || 'Требуется авторизация'}</div>`;
            return;
        }

        console.log('[loadRecommendations] Fetching from:', `${apiBase}/recommendations/`);
        const res = await fetch(`${apiBase}/recommendations/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log('[loadRecommendations] Response status:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load recommendations:", res.status, res.statusText, errorText);
            listVisible.innerHTML = `<div class="text-center text-red-400 py-4 text-xs">${translate('error_loading_recommendations')}</div>`;
            return;
        }

        const data = await res.json();

        if (!data.recommendations || data.recommendations.length === 0) {
            listVisible.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${translate('no_recommendations')}</div>`;
            return;
        }

        // Сортируем рекомендации: сначала те, которые еще не делались сегодня
        const sortedRecommendations = [...data.recommendations].sort((a, b) => {
            const aMinutes = a.minutes_today !== undefined && a.minutes_today !== null ? Number(a.minutes_today) : null;
            const bMinutes = b.minutes_today !== undefined && b.minutes_today !== null ? Number(b.minutes_today) : null;

            const aDidToday = aMinutes !== null && aMinutes > 0;
            const bDidToday = bMinutes !== null && bMinutes > 0;

            if (!aDidToday && bDidToday) return -1;
            if (aDidToday && !bDidToday) return 1;

            return 0;
        });

        console.log('Рекомендации после сортировки:', sortedRecommendations.map(r => ({
            name: r.activity_name,
            minutes_today: r.minutes_today,
            type: r.type,
            didToday: r.minutes_today !== undefined && r.minutes_today !== null && Number(r.minutes_today) > 0
        })));

        const visibleRecommendations = sortedRecommendations.slice(0, 3);
        const hiddenRecommendations = sortedRecommendations.slice(3);

        listVisible.innerHTML = '';
        listHidden.innerHTML = '';

        const activeTimers = typeof window !== 'undefined' && window.activeTimers ? window.activeTimers : new Map();

        const renderRecommendation = (rec) => {
            let icon = "fas fa-lightbulb";
            let bgColor = "bg-blue-50";
            let borderColor = "border-blue-200";
            let textColor = "text-blue-700";
            let iconBgColor = "bg-blue-100";

            if (rec.priority === "high") {
                icon = "fas fa-fire";
                bgColor = "bg-orange-50";
                borderColor = "border-orange-300";
                textColor = "text-orange-700";
                iconBgColor = "bg-orange-100";
            } else if (rec.priority === "medium") {
                icon = "fas fa-exclamation-circle";
                bgColor = "bg-amber-50";
                borderColor = "border-amber-200";
                textColor = "text-amber-700";
                iconBgColor = "bg-amber-100";
            }

            let localizedMessage = rec.message;
            if (rec.type === "continue" && rec.activity_name) {
                localizedMessage = translate('rec_continue').replace('{activity}', rec.activity_name);
            } else if (rec.type === "reminder" && rec.activity_name && rec.days_since) {
                localizedMessage = translate('rec_reminder')
                    .replace('{activity}', rec.activity_name)
                    .replace('{days}', rec.days_since);
            } else if (rec.type === "more" && rec.activity_name && rec.minutes_today !== undefined) {
                localizedMessage = translate('rec_more')
                    .replace('{activity}', rec.activity_name)
                    .replace('{minutes}', rec.minutes_today);
            } else if (rec.type === "new" && rec.activity_name) {
                localizedMessage = translate('rec_new').replace('{activity}', rec.activity_name);
            } else if (rec.type === "info") {
                localizedMessage = translate('rec_info');
            }

            const isNotStarted = rec.activity_id && !activeTimers.has(rec.activity_id);
            const notStartedStyles = isNotStarted
                ? "border-2 border-dashed border-emerald-400 bg-gradient-to-r from-emerald-50/50 to-green-50/50 shadow-sm"
                : "";

            let actionBtn = '';
            if (rec.activity_id) {
                actionBtn = `<button onclick="if(typeof window.startActivityFromRecommendation === 'function') window.startActivityFromRecommendation(${rec.activity_id})" class="ml-auto w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all flex-shrink-0" title="${translate('start_tracking')}">
                    <i class="fas fa-play text-[10px] md:text-xs"></i>
                </button>`;
            }

            return `
                <div class="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl ${bgColor} border ${borderColor} ${notStartedStyles} transition-all hover:shadow-md hover:border-opacity-80 group">
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <i class="fas fa-caret-right text-emerald-500 text-sm md:text-base"></i>
                        <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg ${iconBgColor} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <i class="${icon} ${textColor} text-xs md:text-sm"></i>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium ${textColor} text-xs md:text-sm leading-tight">${localizedMessage}</div>
                    </div>
                    ${actionBtn}
                </div>
            `;
        };

        visibleRecommendations.forEach(rec => {
            listVisible.innerHTML += renderRecommendation(rec);
        });

        hiddenRecommendations.forEach(rec => {
            listHidden.innerHTML += renderRecommendation(rec);
        });
    } catch (e) {
        console.error("Error loading recommendations", e);
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.currentCalendarPeriod = currentCalendarPeriod;
    window.loadWallet = loadWallet;
    window.loadTodayStats = loadTodayStats;
    window.loadCategoryStats = loadCategoryStats;
    window.loadCalendar = loadCalendar;
    window.loadWeekCalendar = loadWeekCalendar;
    window.changeCalendarPeriod = changeCalendarPeriod;
    window.showDayDetails = showDayDetails;
    window.closeDayDetailsModal = closeDayDetailsModal;
    window.showMonthDetails = showMonthDetails;
    window.loadStreak = loadStreak;
    window.loadRecommendations = loadRecommendations;
}
