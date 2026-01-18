// ============= HISTORY MODULE =============
// Управление историей транзакций, фильтрация по периодам

// Зависимости: app_utils.js, app_auth.js (должны быть загружены первыми)

// ============= HISTORY STATE =============
let historyListVisible, historyListHidden, historyAccordionBtn;
let historyPeriod = 'today'; // По умолчанию показываем сегодня

// ============= HELPER FUNCTIONS =============
// Используем getElementInApp из core/dom.js для устранения дублирования
function getHistoryElements() {
    historyListVisible = getElementInApp("history-list-visible");
    historyListHidden = getElementInApp("history-list-hidden");
    historyAccordionBtn = getElementInApp("history-accordion-btn");
}

function filterHistoryByPeriod(data, period) {
    if (!data || data.length === 0) return [];

    // Получаем сегодняшнюю дату в Берлинском времени
    const berlinFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const now = new Date();
    const todayBerlinStr = berlinFormatter.format(now); // Формат YYYY-MM-DD

    // Для периода "today" просто сравниваем строки дат
    if (period === 'today') {
        const filtered = data.filter(item => {
            if (!item.date) return false;
            try {
                const itemDate = new Date(item.date);
                if (isNaN(itemDate.getTime())) {
                    console.warn('Invalid date:', item.date);
                    return false;
                }
                const itemBerlinStr = berlinFormatter.format(itemDate);
                const matches = itemBerlinStr === todayBerlinStr;
                return matches;
            } catch (e) {
                console.warn('Invalid date in history item:', item.date, e);
                return false;
            }
        });
        console.log('Today filter:', {
            period,
            todayBerlinStr,
            totalItems: data.length,
            filteredCount: filtered.length,
            sampleDates: data.slice(0, 3).map(item => ({
                date: item.date,
                formatted: item.date ? berlinFormatter.format(new Date(item.date)) : 'N/A'
            }))
        });
        return filtered;
    }

    // Для других периодов используем сравнение дат
    const [todayYear, todayMonth, todayDay] = todayBerlinStr.split('-').map(Number);
    const todayStart = new Date(todayYear, todayMonth - 1, todayDay, 0, 0, 0, 0);

    let startDate;

    switch (period) {
        case 'week':
            startDate = new Date(todayStart);
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(todayStart);
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case 'year':
            startDate = new Date(todayStart);
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        case 'all':
        default:
            return data; // Возвращаем все данные без фильтрации
    }

    return data.filter(item => {
        if (!item.date) return false;
        try {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        } catch (e) {
            console.warn('Invalid date in history item:', item.date, e);
            return false;
        }
    });
}

function renderHistoryItem(item) {
    const isEarn = item.type === 'earn';
    const date = new Date(item.date);

    const currentLanguage = typeof window !== 'undefined' && window.currentLanguage ? window.currentLanguage : localStorage.getItem('language') || 'ru';
    const localeMap = { 'ru': 'ru-RU', 'uk': 'uk-UA', 'de': 'de-DE', 'en': 'en-US' };
    const locale = localeMap[currentLanguage] || 'ru-RU';
    const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
    const dateStr = date.toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'Europe/Berlin' });

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    return `
        <div class="flex items-center justify-between p-2.5 rounded-lg ${isEarn ? 'bg-emerald-50' : 'bg-red-50'} transition-all hover:bg-opacity-80">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isEarn ? 'bg-emerald-500' : 'bg-red-500'}">
                    <i class="fas ${isEarn ? 'fa-arrow-up' : 'fa-arrow-down'} text-white text-xs"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="font-medium text-gray-800 text-sm break-words">${item.description}</div>
                    <div class="text-xs text-gray-500">${dateStr} ${t('at_time')} ${timeStr}${item.duration_minutes ? ` • ${Math.round(item.duration_minutes)} ${t('min_short')}` : ''}</div>
                </div>
            </div>
            <div class="font-bold ${isEarn ? 'text-emerald-600' : 'text-red-600'} flex-shrink-0 ml-2 text-center">
                ${isEarn ? '+' : '-'}${Math.round(item.amount)} XP
            </div>
        </div>
    `;
}

// ============= SET HISTORY PERIOD =============
function setHistoryPeriod(period) {
    console.log('Setting history period:', period);
    historyPeriod = period;

    // Обновляем стили кнопок
    document.querySelectorAll('.history-period-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });

    const activeBtn = document.getElementById(`history-period-${period}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-indigo-500', 'text-white');
    }

    // Перезагружаем историю с фильтром (принудительно, без кэша)
    loadHistory();
}

// ============= LOAD HISTORY =============
async function loadHistory() {
    try {
        getHistoryElements();

        if (!historyListVisible || !historyListHidden || !historyAccordionBtn) {
            await new Promise(resolve => setTimeout(resolve, 100));
            getHistoryElements();
        }

        if (!historyListVisible || !historyListHidden) {
            console.error("History elements not found", { historyListVisible, historyListHidden });
            return;
        }

        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) {
            console.error("No auth token available");
            if (historyListVisible) {
                historyListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            }
            if (historyAccordionBtn) historyAccordionBtn.classList.add('hidden');
            return;
        }

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const cacheBuster = Date.now();
        const res = await fetch(`${apiBase}/xp/full-history?limit=1000&_t=${cacheBuster}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load history:", res.status, res.statusText, errorText);
            if (historyListVisible) {
                historyListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки истории</div>';
            }
            if (historyAccordionBtn) historyAccordionBtn.classList.add('hidden');
            return;
        }

        const allData = await res.json();

        // Сначала сортируем все данные по дате (новые сверху) перед фильтрацией
        const sortedAllData = [...allData].sort((a, b) => {
            let timestampA = 0;
            let timestampB = 0;
            
            try {
                if (a.date) {
                    const dateA = new Date(a.date);
                    timestampA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                }
                if (b.date) {
                    const dateB = new Date(b.date);
                    timestampB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                }
            } catch (e) {
                // Игнорируем ошибки парсинга
            }
            
            // Сортируем по убыванию timestamp (новые сверху)
            if (timestampB !== timestampA) {
                return timestampB - timestampA;
            }
            // Если даты равны, используем ID для стабильности (более новые ID выше)
            const idA = a.id || a.log_id || a.purchase_id || 0;
            const idB = b.id || b.log_id || b.purchase_id || 0;
            return idB - idA;
        });

        // Фильтруем уже отсортированные данные по выбранному периоду
        console.log('Filtering history:', { period: historyPeriod, totalItems: sortedAllData.length });
        let filteredData = filterHistoryByPeriod(sortedAllData, historyPeriod);
        console.log('Filtered history:', { period: historyPeriod, filteredItems: filteredData.length });

        // Применяем сортировку еще раз после фильтрации для гарантии
        filteredData.sort((a, b) => {
            let timestampA = 0;
            let timestampB = 0;
            
            try {
                if (a.date) {
                    const dateA = new Date(a.date);
                    timestampA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                }
                if (b.date) {
                    const dateB = new Date(b.date);
                    timestampB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                }
            } catch (e) {
                // Игнорируем ошибки парсинга
            }
            
            // Сортируем по убыванию timestamp (новые сверху)
            if (timestampB !== timestampA) {
                return timestampB - timestampA;
            }
            // Если даты равны, используем ID для стабильности (более новые ID выше)
            const idA = a.id || a.log_id || a.purchase_id || 0;
            const idB = b.id || b.log_id || b.purchase_id || 0;
            return idB - idA;
        });
        
        // Логируем первые несколько элементов для отладки
        console.log('Final sorted history (first 10):', filteredData.slice(0, 10).map(item => ({
            description: item.description,
            date: item.date,
            timestamp: new Date(item.date).getTime(),
            formatted: new Date(item.date).toLocaleString('ru-RU', { timeZone: 'Europe/Berlin' })
        })));

        historyListVisible.innerHTML = '';
        historyListHidden.innerHTML = '';

        if (filteredData.length === 0) {
            historyListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">История пуста</div>';
            if (historyAccordionBtn) historyAccordionBtn.classList.add('hidden');
            return;
        }

        // Создаем копию отсортированного массива для безопасности
        const sortedHistory = [...filteredData];
        
        const visibleHistory = sortedHistory.slice(0, 4);
        const hiddenHistory = sortedHistory.slice(4);

        const historyContainer = document.getElementById('history-list-container');
        const historyBlock = document.getElementById('history');

        // Очищаем перед добавлением
        historyListVisible.innerHTML = '';
        visibleHistory.forEach(item => {
            const itemHtml = renderHistoryItem(item);
            historyListVisible.innerHTML += itemHtml;
        });

        // Применяем fixed позиционирование по умолчанию (если аккордеон закрыт)
        const isExpanded = localStorage.getItem('historyAccordionExpanded') === 'true';
        if (!isExpanded) {
            if (historyListVisible) {
                historyListVisible.classList.add('history-fixed');
            }
            if (historyContainer) {
                historyContainer.classList.remove('history-expanded');
            }
        } else {
            if (historyListVisible) {
                historyListVisible.classList.remove('history-fixed');
            }
            if (historyContainer) {
                historyContainer.classList.add('history-expanded');
            }
        }

        if (hiddenHistory.length > 0) {
            // Очищаем перед добавлением
            historyListHidden.innerHTML = '';
            hiddenHistory.forEach(item => {
                const itemHtml = renderHistoryItem(item);
                historyListHidden.innerHTML += itemHtml;
            });
            if (historyAccordionBtn) {
                historyAccordionBtn.classList.remove('hidden');
                // Загружаем состояние аккордеона из localStorage после добавления элементов
                setTimeout(() => {
                    updateHistoryAccordionButton();
                }, 0);
            }
        } else {
            if (historyAccordionBtn) {
                historyAccordionBtn.classList.add('hidden');
            }
            // Если нет скрытых элементов, убираем fixed позиционирование
            if (historyListVisible) {
                historyListVisible.classList.remove('history-fixed');
            }
            if (historyContainer) {
                historyContainer.classList.remove('history-expanded');
            }
        }
    } catch (e) {
        console.error("Error loading history", e);
    }
}

// ============= HISTORY ACCORDION =============
function toggleHistoryAccordion() {
    getHistoryElements();
    const historyContainer = document.getElementById('history-list-container');
    if (!historyListHidden || !historyAccordionBtn || !historyContainer) {
        console.error("History accordion elements not found");
        return;
    }

    const isExpanded = historyContainer.classList.contains('history-expanded');
    const icon = historyAccordionBtn.querySelector('.accordion-icon');
    const text = historyAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (!isExpanded) {
        // Открываем аккордеон
        while (historyListVisible && historyListVisible.firstChild) {
            historyListHidden.appendChild(historyListVisible.firstChild);
        }

        historyListHidden.classList.remove('hidden');
        historyContainer.classList.add('history-expanded');

        if (historyListVisible) {
            historyListVisible.classList.remove('history-fixed');
        }

        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.add('history-expanded');
        }

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_history');
        localStorage.setItem('historyAccordionExpanded', 'true');
    } else {
        // Закрываем аккордеон
        const allItems = Array.from(historyListHidden.children);

        if (historyListVisible) historyListVisible.innerHTML = "";
        historyListHidden.innerHTML = "";

        allItems.forEach((item, index) => {
            if (index < 4 && historyListVisible) {
                historyListVisible.appendChild(item);
            } else {
                historyListHidden.appendChild(item);
            }
        });

        historyContainer.classList.remove('history-expanded');
        historyContainer.style.maxHeight = '';
        historyListHidden.classList.add('hidden');

        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.remove('history-expanded');
        }

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_history');
        localStorage.setItem('historyAccordionExpanded', 'false');
    }
}

function updateHistoryAccordionButton() {
    getHistoryElements();
    const historyContainer = document.getElementById('history-list-container');
    if (!historyListHidden || !historyAccordionBtn || !historyContainer) return;

    const isExpanded = localStorage.getItem('historyAccordionExpanded') === 'true';
    const icon = historyAccordionBtn.querySelector('.accordion-icon');
    const text = historyAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (isExpanded) {
        while (historyListVisible && historyListVisible.firstChild) {
            historyListHidden.appendChild(historyListVisible.firstChild);
        }

        historyListHidden.classList.remove('hidden');
        historyContainer.classList.add('history-expanded');

        if (historyListVisible) {
            historyListVisible.classList.remove('history-fixed');
        }

        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.add('history-expanded');
        }

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_history');
    } else {
        const allItems = Array.from(historyListHidden.children);
        if (historyListVisible) historyListVisible.innerHTML = "";
        historyListHidden.innerHTML = "";

        allItems.forEach((item, index) => {
            if (index < 4 && historyListVisible) {
                historyListVisible.appendChild(item);
            } else {
                historyListHidden.appendChild(item);
            }
        });

        historyContainer.classList.remove('history-expanded');
        historyContainer.style.maxHeight = '';
        historyListHidden.classList.add('hidden');

        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.remove('history-expanded');
        }

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_history');
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.historyPeriod = historyPeriod;
    window.loadHistory = loadHistory;
    window.setHistoryPeriod = setHistoryPeriod;
    window.filterHistoryByPeriod = filterHistoryByPeriod;
    window.renderHistoryItem = renderHistoryItem;
    window.toggleHistoryAccordion = toggleHistoryAccordion;
    window.updateHistoryAccordionButton = updateHistoryAccordionButton;
    window.getHistoryElements = getHistoryElements;
}
