// ============= ACTIVITIES MODULE =============
// Управление активностями, таймерами, ручным вводом времени/количества

// Зависимости: app_utils.js, app_auth.js (должны быть загружены первыми)

// ============= ACTIVITIES STATE =============
const activeTimers = new Map();
let allActivities = [];
let activitiesFilterState = {
    sort: 'newest', // newest, oldest, name-asc, name-desc
    category: 'all'
};
let activitiesListVisible, activitiesListHidden, activitiesAccordionBtn;
let activityNameInput, xpPerHourInput;

// ============= HELPER FUNCTIONS =============
function getActivitiesElements() {
    if (!activitiesListVisible) {
        activitiesListVisible = document.getElementById("activities-list-visible");
    }
    if (!activitiesListHidden) {
        activitiesListHidden = document.getElementById("activities-list-hidden");
    }
    if (!activitiesAccordionBtn) {
        activitiesAccordionBtn = document.getElementById("activities-accordion-btn");
    }

    // Если элементы не найдены, пробуем через querySelector
    if (!activitiesListVisible) {
        activitiesListVisible = document.querySelector("#activities-list-visible");
    }
    if (!activitiesListHidden) {
        activitiesListHidden = document.querySelector("#activities-list-hidden");
    }
    if (!activitiesAccordionBtn) {
        activitiesAccordionBtn = document.querySelector("#activities-accordion-btn");
    }
}

function showActivityMessage(text, type) {
    const msgEl = document.getElementById("activity-message");
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.remove("hidden", "text-red-500", "text-green-600");
    if (type === "error") msgEl.classList.add("text-red-500");
    else if (type === "success") msgEl.classList.add("text-green-600");
    setTimeout(() => msgEl.classList.add("hidden"), 4000);
}

// ============= LOAD ACTIVITIES =============
async function loadActivities() {
    try {
        getActivitiesElements();

        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) {
            console.error("No auth token available");
            if (activitiesListVisible) {
                activitiesListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            }
            return;
        }

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/activities/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load activities:", res.status, res.statusText, errorText);
            if (activitiesListVisible) {
                activitiesListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки активностей</div>';
            }
            return;
        }

        const data = await res.json();
        allActivities = data;
        
        console.log("Activities loaded:", allActivities.length, allActivities);

        // Обновляем фильтр категорий
        updateActivitiesCategoryFilter();

        // Применяем фильтры и сортировку (это отобразит активности в правильных списках)
        applyActivitiesFilters();
        
        // Сразу после загрузки активностей загружаем активные таймеры
        // Это нужно сделать после applyActivitiesFilters, чтобы карточки активностей уже были созданы
        if (typeof loadActiveTimers === 'function') {
            loadActiveTimers().then(() => {
                // После загрузки таймеров обновляем отображение активностей
                // чтобы показать запущенные таймеры
                applyActivitiesFilters();
            }).catch(err => {
                console.error("Error loading active timers:", err);
            });
        } else if (typeof window.loadActiveTimers === 'function') {
            window.loadActiveTimers().then(() => {
                // После загрузки таймеров обновляем отображение активностей
                if (typeof window.applyActivitiesFilters === 'function') {
                    window.applyActivitiesFilters();
                }
            }).catch(err => {
                console.error("Error loading active timers:", err);
            });
        }
    } catch (e) {
        console.error("Error loading activities", e);
        getActivitiesElements();
        if (activitiesListVisible) {
            activitiesListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки активностей</div>';
        }
    }
}

// Обновление фильтра категорий
function updateActivitiesCategoryFilter() {
    const categoryFilter = document.getElementById('activities-category-filter');
    if (!categoryFilter) return;

    // Сохраняем текущее значение
    const currentValue = categoryFilter.value;

    // Очищаем опции (кроме "Все категории")
    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
    categoryFilter.innerHTML = `<option value="all">📂 ${t('all_categories')}</option>`;

    // Получаем уникальные категории из активностей
    const categories = new Set();
    allActivities.forEach(activity => {
        const category = activity.category || 'general';
        categories.add(category);
    });

    // Создаем объект с названиями категорий
    const categoryNames = {
        "general": t('category_general'),
        "study": t('category_study'),
        "sport": t('category_sport'),
        "hobby": t('category_hobby'),
        "work": t('category_work'),
        "health": t('category_health')
    };

    // Добавляем пользовательские категории
    const allCategories = typeof window !== 'undefined' && window.allCategories ? window.allCategories : { custom: [] };
    if (allCategories.custom) {
        allCategories.custom.forEach(customCat => {
            categoryNames[customCat.id] = customCat.name;
        });
    }

    // Сортируем категории по названию
    const sortedCategories = Array.from(categories).sort((a, b) => {
        const nameA = categoryNames[a] || a;
        const nameB = categoryNames[b] || b;
        return nameA.localeCompare(nameB);
    });

    // Добавляем опции
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = categoryNames[category] || category;
        categoryFilter.appendChild(option);
    });

    // Восстанавливаем значение, если оно все еще существует
    if (currentValue && Array.from(categoryFilter.options).some(opt => opt.value === currentValue)) {
        categoryFilter.value = currentValue;
    }
}

// Применение фильтров и сортировки
function applyActivitiesFilters() {
    getActivitiesElements();

    const activitiesContainer = document.getElementById('activities-list-container');
    if (!activitiesListVisible || !activitiesListHidden || !activitiesContainer) return;

    // Очищаем списки
    activitiesListVisible.innerHTML = "";
    activitiesListHidden.innerHTML = "";

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (allActivities.length === 0) {
        activitiesListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Нет активностей. Создайте первую активность!</div>';
        if (activitiesAccordionBtn) activitiesAccordionBtn.classList.add('hidden');
        return;
    }

    // Фильтруем по категории
    let filtered = allActivities;
    if (activitiesFilterState.category !== 'all') {
        filtered = allActivities.filter(activity => {
            const category = activity.category || 'general';
            return category === activitiesFilterState.category;
        });
    }

    // Сортируем
    filtered = [...filtered]; // Копируем массив
    switch (activitiesFilterState.sort) {
        case 'newest':
            filtered.sort((a, b) => {
                // Сначала пытаемся сортировать по created_at, если оно есть
                if (a.created_at && b.created_at) {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                        const diff = dateB.getTime() - dateA.getTime();
                        if (diff !== 0) return diff;
                    }
                } else if (a.created_at && !b.created_at) {
                    return -1;
                } else if (!a.created_at && b.created_at) {
                    return 1;
                }
                
                // Если даты нет или равны, сортируем по ID (больший ID = новее)
                const idA = a.id || 0;
                const idB = b.id || 0;
                return idB - idA; // Новые (с большим ID) сначала
            });
            break;
        case 'oldest':
            filtered.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
                const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
                return dateA - dateB; // Старые сначала
            });
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            filtered.sort((a, b) => {
                const idA = a.id || 0;
                const idB = b.id || 0;
                return idA - idB; // Сортировка по возрастанию ID (старые сверху)
            });
            break;
    }

    // Проверяем, открыт ли аккордеон (из localStorage или класса контейнера)
    const isAccordionExpanded = localStorage.getItem('activitiesAccordionExpanded') === 'true' ||
                                 (activitiesContainer && activitiesContainer.classList.contains('activities-expanded'));

    // Отрисовываем отфильтрованные активности
    filtered.forEach((activity, index) => {
        const card = renderActivityCard(activity);
        if (isAccordionExpanded) {
            // Если аккордеон открыт - все активности в hidden контейнер
            activitiesListHidden.appendChild(card);
        } else {
            // Если аккордеон закрыт - первые 5 в visible, остальные в hidden
            if (index < 5) {
                activitiesListVisible.appendChild(card);
            } else {
                activitiesListHidden.appendChild(card);
            }
        }
    });

    // Показываем/скрываем кнопку аккордеона
    if (activitiesAccordionBtn) {
        if (filtered.length > 5) {
            activitiesAccordionBtn.classList.remove('hidden');
            updateActivitiesAccordionButton();
        } else {
            activitiesAccordionBtn.classList.add('hidden');
        }
    }

    // Загружаем активные таймеры
    loadActiveTimers();
}

// Инициализация фильтров и аккордеона для активностей
function initActivitiesFilters() {
    // Аккордеон будет инициализирован динамически в applyActivitiesFilters

    // Сортировка
    const sortSelect = document.getElementById('activities-sort');
    if (sortSelect) {
        sortSelect.value = activitiesFilterState.sort;
        sortSelect.addEventListener('change', (e) => {
            activitiesFilterState.sort = e.target.value;
            applyActivitiesFilters();
        });
    }

    // Фильтр по категории
    const categoryFilter = document.getElementById('activities-category-filter');
    if (categoryFilter) {
        categoryFilter.value = activitiesFilterState.category;
        categoryFilter.addEventListener('change', (e) => {
            activitiesFilterState.category = e.target.value;
            applyActivitiesFilters();
        });
    }

    // Кнопка сброса фильтров
    const resetBtn = document.getElementById('activities-reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activitiesFilterState.sort = 'newest';
            activitiesFilterState.category = 'all';

            if (sortSelect) sortSelect.value = 'newest';
            if (categoryFilter) categoryFilter.value = 'all';

            applyActivitiesFilters();
        });
    }
}

// Функции аккордеона для активностей
function toggleActivitiesAccordion() {
    getActivitiesElements();
    const activitiesContainer = document.getElementById('activities-list-container');
    if (!activitiesListHidden || !activitiesAccordionBtn || !activitiesContainer) {
        console.error("Activities accordion elements not found");
        return;
    }

    const isExpanded = activitiesContainer.classList.contains('activities-expanded');
    const icon = activitiesAccordionBtn.querySelector('.accordion-icon');
    const text = activitiesAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (!isExpanded) {
        // Открываем аккордеон - перемещаем все активности в hidden и делаем контейнер скроллируемым
        while (activitiesListVisible.firstChild) {
            activitiesListHidden.appendChild(activitiesListVisible.firstChild);
        }

        activitiesListHidden.classList.remove('hidden');
        activitiesContainer.classList.add('activities-expanded');

        requestAnimationFrame(() => {
            if (activitiesContainer && activitiesListHidden.children.length > 0) {
                const firstCard = activitiesListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 16; // space-y-4 = 1rem = 16px
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    activitiesContainer.style.maxHeight = calculatedHeight + 'px';
                }
                activitiesContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_activities');
        localStorage.setItem('activitiesAccordionExpanded', 'true');

        setTimeout(() => {
            loadActiveTimers();
        }, 100);
    } else {
        // Закрываем аккордеон
        const allCards = Array.from(activitiesListHidden.children);

        activitiesListVisible.innerHTML = "";
        activitiesListHidden.innerHTML = "";

        allCards.forEach((card, index) => {
            if (index < 5) {
                activitiesListVisible.appendChild(card);
            } else {
                activitiesListHidden.appendChild(card);
            }
        });

        activitiesContainer.classList.remove('activities-expanded');
        activitiesContainer.style.maxHeight = '';
        activitiesListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_activities');
        localStorage.setItem('activitiesAccordionExpanded', 'false');

        setTimeout(() => {
            loadActiveTimers();
        }, 100);
    }
}

function updateActivitiesAccordionButton() {
    getActivitiesElements();
    const activitiesContainer = document.getElementById('activities-list-container');
    if (!activitiesListHidden || !activitiesAccordionBtn || !activitiesContainer) return;

    const isExpanded = localStorage.getItem('activitiesAccordionExpanded') === 'true';
    const icon = activitiesAccordionBtn.querySelector('.accordion-icon');
    const text = activitiesAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (isExpanded) {
        while (activitiesListVisible.firstChild) {
            activitiesListHidden.appendChild(activitiesListVisible.firstChild);
        }

        activitiesListHidden.classList.remove('hidden');
        activitiesContainer.classList.add('activities-expanded');

        requestAnimationFrame(() => {
            if (activitiesContainer && activitiesListHidden.children.length > 0) {
                const firstCard = activitiesListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 16;
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    activitiesContainer.style.maxHeight = calculatedHeight + 'px';
                }
                activitiesContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_activities');

        setTimeout(() => {
            loadActiveTimers();
        }, 100);
    } else {
        const allCards = Array.from(activitiesListHidden.children);

        activitiesListVisible.innerHTML = "";
        activitiesListHidden.innerHTML = "";

        allCards.forEach((card, index) => {
            if (index < 5) {
                activitiesListVisible.appendChild(card);
            } else {
                activitiesListHidden.appendChild(card);
            }
        });

        activitiesContainer.classList.remove('activities-expanded');
        activitiesContainer.style.maxHeight = '';
        activitiesListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_activities');
    }
}

// Загружает активные таймеры с сервера и восстанавливает их состояние
async function loadActiveTimers() {
    try {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) return;

        // Сохраняем текущие активные таймеры перед загрузкой с сервера
        const existingTimers = new Map();
        activeTimers.forEach((timerInfo, activityId) => {
            existingTimers.set(activityId, {
                logId: timerInfo.logId,
                startTime: timerInfo.startTime,
                intervalId: timerInfo.intervalId,
                activity: timerInfo.activity
            });
        });

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/timer/active`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.warn("Failed to load active timers:", res.status);
            return;
        }

        const activeTimersData = await res.json();

        // Очищаем старые интервалы перед восстановлением
        activeTimers.forEach((timerInfo) => {
            if (timerInfo.intervalId) {
                clearInterval(timerInfo.intervalId);
            }
        });
        activeTimers.clear();

        // Восстанавливаем активные таймеры
        activeTimersData.forEach(timerData => {
            const activity = allActivities.find(a => a.id === timerData.activity_id);
            if (!activity) return;

            const existingTimer = existingTimers.get(timerData.activity_id);

            let startTime;
            if (existingTimer && existingTimer.logId === timerData.log_id) {
                startTime = existingTimer.startTime;
            } else {
                const serverStartTime = new Date(timerData.start_time);
                startTime = serverStartTime.getTime();

                if (isNaN(startTime)) {
                    console.error("Invalid start_time from server:", timerData.start_time);
                    return;
                }
            }

            const timerInfo = {
                logId: timerData.log_id,
                startTime: startTime,
                intervalId: null,
                activity: activity
            };

            activeTimers.set(timerData.activity_id, timerInfo);

            const intervalId = setInterval(() => {
                const timerInfo = activeTimers.get(timerData.activity_id);
                if (timerInfo) {
                    updateTimerDisplay(timerData.activity_id, timerInfo.startTime, activity);
                }
            }, 1000);
            timerInfo.intervalId = intervalId;
            
            // Сразу обновляем отображение таймера после создания
            updateTimerDisplay(timerData.activity_id, startTime, activity);
        });
        
        // Обновляем отображение всех активностей, чтобы показать запущенные таймеры
        if (activeTimers.size > 0) {
            // Применяем фильтры заново, чтобы обновить карточки с таймерами
            if (typeof applyActivitiesFilters === 'function') {
                applyActivitiesFilters();
            } else if (typeof window.applyActivitiesFilters === 'function') {
                window.applyActivitiesFilters();
            }
        }
    } catch (e) {
        console.error("Error loading active timers:", e);
    }
}

// ============= RENDER ACTIVITY CARD =============
function renderActivityCard(activity) {
    const div = document.createElement("div");
    div.className = "activity-card p-4 rounded-xl bg-white/80 border border-blue-100 shadow-sm hover:shadow-lg flex items-center justify-between gap-3";
    div.setAttribute("data-activity-id", activity.id);

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
    const allCategories = typeof window !== 'undefined' && window.allCategories ? window.allCategories : { custom: [] };

    // Создаем объект с названиями категорий
    const categoryNames = {
        "general": t('category_general'),
        "study": t('category_study'),
        "sport": t('category_sport'),
        "hobby": t('category_hobby'),
        "work": t('category_work'),
        "health": t('category_health')
    };

    // Добавляем пользовательские категории
    if (allCategories.custom) {
        allCategories.custom.forEach(customCat => {
            categoryNames[customCat.id] = customCat.name;
        });
    }

    const category = activity.category || "general";
    const categoryName = categoryNames[category] || category;

    // Определяем тип единицы измерения
    const unitType = activity.unit_type || 'time';

    const left = document.createElement("div");
    left.className = "flex-grow";
    left.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
            <div class="text-lg font-semibold text-gray-800">${activity.name}</div>
            <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center justify-center whitespace-normal text-center">${categoryName}</span>
        </div>
        <div class="text-sm text-gray-500">${unitType === 'quantity' ? (activity.xp_per_unit || 1) + ' ' + t('xp_per_unit') : (activity.xp_per_hour || 60) + ' ' + t('xp_per_hour')}</div>
    `;

    // Timer button - показываем только для активностей типа "time"
    const timerBtn = document.createElement("button");
    timerBtn.draggable = false;

    if (unitType === 'quantity') {
        timerBtn.style.display = 'none';
    } else {
        const isActive = activeTimers.has(activity.id);

        if (isActive) {
            const timerInfo = activeTimers.get(activity.id);
            const elapsedMs = Date.now() - timerInfo.startTime;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);
            const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
            const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
            const xpPerSecond = (activity.xp_per_hour || 60) / 3600;
            const earnedXP = Math.round(elapsedSeconds * xpPerSecond);

            timerBtn.className = "timer-btn px-6 py-2 rounded-xl text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 transition-all duration-300";
            timerBtn.innerHTML = `<i class="fas fa-stop text-red-500"></i> <span id="timer-${activity.id}">${minutes}:${seconds} (+${earnedXP} XP)</span>`;
        } else {
            timerBtn.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2";
            timerBtn.innerHTML = `<i class="fas fa-play text-green-500"></i> ${t('start')}`;
        }

        timerBtn.dataset.activityId = activity.id;
        timerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleTimer(activity.id, e.currentTarget, activity);
        });
        timerBtn.addEventListener("mousedown", (e) => e.stopPropagation());
    }

    // Manual time/quantity button
    const manualTimeBtn = document.createElement("button");
    manualTimeBtn.className = "manual-time-btn p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    manualTimeBtn.innerHTML = '<i class="fas fa-clock"></i>';
    manualTimeBtn.draggable = false;
    manualTimeBtn.title = unitType === 'quantity' ? t('manual_quantity') : t('manual_time');
    manualTimeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openManualTimeModal(activity.id, false); // false = показывать все активности
    });
    manualTimeBtn.addEventListener("mousedown", (e) => e.stopPropagation());

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = t('edit');
    editBtn.draggable = false;
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditModal(activity);
    });
    editBtn.addEventListener("mousedown", (e) => e.stopPropagation());

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = t('delete');
    deleteBtn.draggable = false;
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteActivity(activity.id, div);
    });
    deleteBtn.addEventListener("mousedown", (e) => e.stopPropagation());

    div.appendChild(left);
    div.appendChild(timerBtn);
    div.appendChild(manualTimeBtn);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    return div;
}

// ============= TIMER FUNCTIONS =============
async function toggleTimer(activityId, button, activity) {
    const isActive = activeTimers.has(activityId);
    if (isActive) {
        await stopTimer(activityId, button);
    } else {
        await startTimer(activityId, button, activity);
    }
}

async function startTimer(activityId, button, activity) {
    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/timer/start?activity_id=${activityId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const logId = data.log_id;
        const startTime = Date.now();
        const timerInfo = { logId, startTime, intervalId: null, activity };
        activeTimers.set(activityId, timerInfo);

        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        button.innerHTML = '<i class="fas fa-stop text-red-500"></i> <span id="timer-' + activityId + '">00:00</span>';
        button.className = "timer-btn px-6 py-2 rounded-xl text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 transition-all duration-300";

        const intervalId = setInterval(() => {
            const timerInfo = activeTimers.get(activityId);
            if (timerInfo) {
                updateTimerDisplay(activityId, timerInfo.startTime, activity);
            }
        }, 1000);
        timerInfo.intervalId = intervalId;
    } catch (e) {
        console.error("Error starting timer:", e);
        alert("Ошибка запуска таймера");
    }
}

function updateTimerDisplay(activityId, startTime, activity) {
    const timerInfo = activeTimers.get(activityId);
    if (!timerInfo) {
        return;
    }

    const actualStartTime = timerInfo.startTime;
    const elapsedMs = Date.now() - actualStartTime;

    if (elapsedMs < 0) {
        console.warn(`Negative elapsed time for activity ${activityId}, startTime: ${actualStartTime}, now: ${Date.now()}`);
        return;
    }

    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    const timerSpan = document.getElementById(`timer-${activityId}`);

    if (timerSpan) {
        const xpPerSecond = activity.xp_per_hour / 3600;
        const earnedXP = Math.round(elapsedSeconds * xpPerSecond);
        timerSpan.textContent = `${minutes}:${seconds} (+${earnedXP} XP)`;
    }
}

async function stopTimer(activityId, button) {
    const timerInfo = activeTimers.get(activityId);
    if (!timerInfo || !timerInfo.logId) {
        alert("Таймер не запущен");
        return;
    }

    if (timerInfo.intervalId) {
        clearInterval(timerInfo.intervalId);
    }

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/timer/stop/${timerInfo.logId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        activeTimers.delete(activityId);

        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        button.innerHTML = `<i class="fas fa-play text-green-500"></i> ${t('start')}`;
        button.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2 transition-all duration-300";

        // Обновляем данные
        if (typeof window.loadWallet === 'function') await window.loadWallet();
        if (typeof window.loadTodayStats === 'function') window.loadTodayStats();
        if (typeof window.loadWeekCalendar === 'function') window.loadWeekCalendar();
        if (typeof window.loadStreak === 'function') window.loadStreak();
        if (typeof window.loadGoals === 'function') await window.loadGoals();

        let message = `✅ Таймер остановлен! Заработано ${Math.round(data.xp_earned)} XP`;
        if (data.streak_bonus && data.streak_bonus > 0) {
            message += `\n🔥 Бонус за серию: +${data.streak_bonus} XP`;
        }
        if (data.completed_goals && data.completed_goals.length > 0) {
            message += `\n🎯 Цель выполнена: ${data.completed_goals.join(", ")}`;
        }
        alert(message);
    } catch (e) {
        console.error("Error stopping timer:", e);
        alert("Ошибка остановки таймера");
    }
}

// ============= CREATE ACTIVITY =============
async function createActivity() {
    console.log("[createActivity] Function called");
    if (!activityNameInput) {
        activityNameInput = document.getElementById("activity-name");
    }
    if (!xpPerHourInput) {
        xpPerHourInput = document.getElementById("xp-per-hour");
    }
    console.log("[createActivity] Inputs found:", {
        activityNameInput: !!activityNameInput,
        xpPerHourInput: !!xpPerHourInput
    });

    const name = activityNameInput ? activityNameInput.value.trim() : '';
    const categoryEl = document.getElementById("activity-category");
    const category = categoryEl ? (categoryEl.value || "general") : "general";
    const unitTypeEl = document.getElementById("activity-unit-type");
    const unitType = unitTypeEl ? unitTypeEl.value : "time";

    let xpPerHour = 60;
    let xpPerUnit = null;

    if (unitType === "time") {
        xpPerHour = xpPerHourInput ? Number(xpPerHourInput.value) || 60 : 60;
    } else {
        const xpPerUnitInput = document.getElementById("xp-per-unit");
        xpPerUnit = xpPerUnitInput ? Number(xpPerUnitInput.value) || 1 : 1;
    }

    if (!name) {
        showActivityMessage("Введите название активности", "error");
        return;
    }

    const duplicate = allActivities.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        showActivityMessage(`❌ "${name}" уже существует!`, "error");
        if (activityNameInput) activityNameInput.focus();
        return;
    }

    try {
        const activityData = {
            name,
            category: category,
            unit_type: unitType,
            xp_per_hour: unitType === "time" ? xpPerHour : null,
            xp_per_unit: unitType === "quantity" ? xpPerUnit : null
        };

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/activities/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(activityData)
        });

        if (!res.ok) {
            const error = await res.json();
            showActivityMessage(error.detail || "Ошибка создания", "error");
            return;
        }

        const created = await res.json();
        if (activityNameInput) activityNameInput.value = "";
        if (xpPerHourInput) xpPerHourInput.value = "60";
        const xpPerUnitInput = document.getElementById("xp-per-unit");
        if (xpPerUnitInput) xpPerUnitInput.value = "1";
        if (unitTypeEl) unitTypeEl.value = "time";
        if (typeof window.updateActivityXPInputs === 'function') window.updateActivityXPInputs();
        
        // Перезагружаем активности с сервера для обеспечения согласованности
        try {
            await loadActivities();
        } catch (loadError) {
            console.error("Error reloading activities:", loadError);
            // Если перезагрузка не удалась, просто добавляем созданную активность в список
            allActivities.push(created);
            updateActivitiesCategoryFilter();
            applyActivitiesFilters();
        }
        
        // Находим только что созданную активность для её подсветки
        const createdActivityId = created.id;
        
        // Если новая активность попала в скрытый список (больше 5 активностей), открываем аккордеон
        getActivitiesElements();
        const activitiesContainer = document.getElementById('activities-list-container');
        if (allActivities.length > 5 && activitiesAccordionBtn && activitiesListHidden && activitiesContainer) {
            const newActivityElement = document.querySelector(`[data-activity-id="${createdActivityId}"]`);
            const newActivityInHidden = newActivityElement && activitiesListHidden.contains(newActivityElement);
            
            if (newActivityInHidden) {
                const isExpanded = localStorage.getItem('activitiesAccordionExpanded') === 'true' ||
                                   activitiesContainer.classList.contains('activities-expanded');
                if (!isExpanded && activitiesListHidden.classList.contains('hidden')) {
                    toggleActivitiesAccordion();
                }
                
                setTimeout(() => {
                    if (newActivityElement) {
                        newActivityElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        newActivityElement.style.transition = 'background-color 0.3s';
                        newActivityElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                        setTimeout(() => {
                            newActivityElement.style.backgroundColor = '';
                        }, 2000);
                    }
                }, 200);
            } else if (newActivityElement) {
                setTimeout(() => {
                    newActivityElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    newActivityElement.style.transition = 'background-color 0.3s';
                    newActivityElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                    setTimeout(() => {
                        newActivityElement.style.backgroundColor = '';
                    }, 2000);
                }, 200);
            }
        }
        
        showActivityMessage(`✅ Активность "${created.name}" создана!`, "success");
    } catch (e) {
        console.error("Error:", e);
        showActivityMessage("Ошибка сети", "error");
    }
}

// ============= EDIT ACTIVITY =============
function openEditModal(activity) {
    if (typeof window.updateCategoryDropdown === 'function') {
        window.updateCategoryDropdown('edit-activity-category');
    }

    document.getElementById("edit-activity-id").value = activity.id;
    document.getElementById("edit-activity-name").value = activity.name;

    const unitType = activity.unit_type || 'time';
    const unitTypeEl = document.getElementById("edit-activity-unit-type");
    if (unitTypeEl) {
        unitTypeEl.value = unitType;
        if (typeof window.updateEditActivityXPInputs === 'function') {
            window.updateEditActivityXPInputs();
        }
    }

    if (unitType === 'quantity') {
        const xpPerUnitEl = document.getElementById("edit-xp-per-unit");
        if (xpPerUnitEl) {
            xpPerUnitEl.value = activity.xp_per_unit || 1;
        }
    } else {
        const xpPerHourEl = document.getElementById("edit-xp-per-hour");
        if (xpPerHourEl) {
            xpPerHourEl.value = activity.xp_per_hour || 60;
        }
    }

    const categoryEl = document.getElementById("edit-activity-category");
    const categoryText = document.getElementById("edit-activity-category-text");
    if (categoryEl && categoryText) {
        setTimeout(() => {
            const categoryValue = activity.category || "general";
            categoryEl.value = categoryValue;
            const allCategories = typeof window !== 'undefined' && window.allCategories ? window.allCategories : { standard: [], custom: [] };
            const allCats = [...(allCategories.standard || []), ...(allCategories.custom || [])];
            const selectedCat = allCats.find(c => c.id === categoryValue);
            if (selectedCat) {
                categoryText.textContent = selectedCat.name;
            } else {
                categoryText.textContent = "Общее";
            }
        }, 100);
    }

    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }

    if (typeof window.updateEditActivityXPInputs === 'function') {
        window.updateEditActivityXPInputs();
    }

    document.getElementById("edit-activity-modal").classList.remove("hidden");
}

function closeEditModal() {
    document.getElementById("edit-activity-modal").classList.add("hidden");
    document.getElementById("edit-activity-form").reset();
}

async function updateActivity() {
    const id = document.getElementById("edit-activity-id").value;
    const name = document.getElementById("edit-activity-name").value.trim();
    const categoryEl = document.getElementById("edit-activity-category");
    const category = categoryEl ? categoryEl.value || "general" : "general";
    const unitTypeEl = document.getElementById("edit-activity-unit-type");
    const unitType = unitTypeEl ? unitTypeEl.value : "time";

    let xpPerHour = null;
    let xpPerUnit = null;

    if (unitType === "time") {
        xpPerHour = Number(document.getElementById("edit-xp-per-hour").value) || 60;
    } else {
        const xpPerUnitInput = document.getElementById("edit-xp-per-unit");
        xpPerUnit = xpPerUnitInput ? Number(xpPerUnitInput.value) || 1 : 1;
    }

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (!name) {
        alert(t('enter_activity_name'));
        return;
    }

    try {
        const activityData = {
            name,
            category: category,
            unit_type: unitType,
            xp_per_hour: unitType === "time" ? xpPerHour : null,
            xp_per_unit: unitType === "quantity" ? xpPerUnit : null
        };

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/activities/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(activityData)
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || t('error_updating'));
            return;
        }

        const updatedActivity = await res.json();
        const activityId = parseInt(id);
        
        const activityIndex = allActivities.findIndex(a => a.id === activityId);
        if (activityIndex !== -1) {
            allActivities[activityIndex] = updatedActivity;
        }
        
        updateActivitiesCategoryFilter();
        
        const activityCard = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (activityCard) {
            const nameElement = activityCard.querySelector('.text-lg.font-semibold');
            if (nameElement) {
                nameElement.textContent = updatedActivity.name;
            }
            
            const categoryBadge = activityCard.querySelector('.px-2.py-0\\.5');
            if (categoryBadge) {
                const allCategories = typeof window !== 'undefined' && window.allCategories ? window.allCategories : { custom: [] };
                const categoryNames = {
                    "general": t('category_general'),
                    "study": t('category_study'),
                    "sport": t('category_sport'),
                    "hobby": t('category_hobby'),
                    "work": t('category_work'),
                    "health": t('category_health')
                };
                if (allCategories.custom) {
                    allCategories.custom.forEach(customCat => {
                        categoryNames[customCat.id] = customCat.name;
                    });
                }
                const category = updatedActivity.category || "general";
                const categoryName = categoryNames[category] || category;
                categoryBadge.textContent = categoryName;
            }
            
            const xpInfo = activityCard.querySelector('.text-sm.text-gray-500');
            if (xpInfo) {
                const unitType = updatedActivity.unit_type || 'time';
                xpInfo.textContent = unitType === 'quantity' 
                    ? (updatedActivity.xp_per_unit || 1) + ' ' + t('xp_per_unit')
                    : (updatedActivity.xp_per_hour || 60) + ' ' + t('xp_per_hour');
            }
        } else {
            applyActivitiesFilters();
        }
        
        closeEditModal();
        showActivityMessage(`✅ ${t('activity_updated')}`, "success");
    } catch (e) {
        console.error("Error:", e);
        alert(t('network_error'));
    }
}

// ============= DELETE ACTIVITY =============
async function deleteActivity(activityId, cardElement) {
    if (!confirm("Удалить активность?")) return;

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/activities/${activityId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            alert("Ошибка удаления");
            return;
        }

        cardElement.style.transition = "all 0.3s ease";
        cardElement.style.opacity = "0";
        cardElement.style.transform = "translateX(-20px)";
        setTimeout(() => {
            cardElement.remove();
            allActivities = allActivities.filter(a => a.id != activityId);
            updateActivitiesCategoryFilter();
            applyActivitiesFilters();
        }, 300);
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

// ============= MANUAL TIME/QUANTITY =============
async function openManualTimeModal(activityId, filterByTime = true) {
    const select = document.getElementById("manual-activity-select");
    if (!select) {
        console.error("manual-activity-select not found");
        return;
    }
    
    if (!allActivities || allActivities.length === 0) {
        console.log("Activities not loaded, loading...");
        try {
            await loadActivities();
            if (!allActivities || allActivities.length === 0) {
                console.warn("Activities still empty after load, retrying...");
                await new Promise(resolve => setTimeout(resolve, 200));
                await loadActivities();
            }
        } catch (e) {
            console.error("Error loading activities:", e);
        }
    }
    
    console.log("All activities for dropdown:", allActivities?.length || 0, allActivities);
    
    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
    const existingDefaultOption = select.querySelector('option[value=""]');
    if (existingDefaultOption) {
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        existingDefaultOption.textContent = t('select_activity_label');
    } else {
        select.innerHTML = `<option value="">${t('select_activity_label')}</option>`;
    }
    
    if (allActivities && allActivities.length > 0) {
        let activitiesToShow;
        
        if (filterByTime) {
            activitiesToShow = allActivities.filter(activity => {
                if (!activity || !activity.name) {
                    return false;
                }
                const unitType = activity.unit_type || 'time';
                return unitType === 'time';
            });
            
            console.log(`Adding ${activitiesToShow.length} time-based activities to dropdown (filtered from ${allActivities.length} total)`);
        } else {
            activitiesToShow = allActivities.filter(activity => {
                return activity && activity.name;
            });
            
            console.log(`Adding ${activitiesToShow.length} all activities to dropdown (from ${allActivities.length} total)`);
        }
        
        if (activitiesToShow.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = filterByTime 
                ? "Нет активностей с типом 'Время'. Создайте активность с типом 'Время (минуты)'."
                : "Нет активностей. Создайте активность сначала.";
            option.disabled = true;
            select.appendChild(option);
        } else {
            activitiesToShow.forEach(activity => {
                const option = document.createElement("option");
                option.value = activity.id;
                const unitType = activity.unit_type || 'time';
                if (unitType === 'quantity') {
                    option.textContent = `${activity.name} (${activity.xp_per_unit || 1} ${t('xp_per_unit')})`;
                } else {
                    option.textContent = `${activity.name} (${activity.xp_per_hour || 60} ${t('xp_per_hour')})`;
                }
                select.appendChild(option);
            });
        }
    } else {
        console.warn("No activities found");
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Нет активностей. Создайте активность сначала.";
        option.disabled = true;
        select.appendChild(option);
    }
    
    if (activityId) {
        select.value = activityId;
        if (typeof window.updateManualModalUI === 'function') {
            window.updateManualModalUI(activityId);
        }
    } else {
        const titleEl = document.getElementById("manual-modal-title");
        if (filterByTime) {
            titleEl.textContent = `⏱️ ${t('manual_time')}`;
            titleEl.setAttribute('data-i18n', 'manual_time');
            const timeContainer = document.getElementById("manual-time-input-container");
            const quantityContainer = document.getElementById("manual-quantity-input-container");
            if (timeContainer) timeContainer.classList.remove('hidden');
            if (quantityContainer) quantityContainer.classList.add('hidden');
            const timeInput = document.getElementById("manual-minutes");
            if (timeInput) {
                timeInput.placeholder = "Введите к-во времени";
                timeInput.setAttribute('required', 'required');
            }
            const quantityInput = document.getElementById("manual-quantity");
            if (quantityInput) quantityInput.removeAttribute('required');
        } else {
            titleEl.textContent = `📊 ${t('manual_quantity')}`;
            titleEl.setAttribute('data-i18n', 'manual_quantity');
        }
        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations();
        }
    }

    const minutesInput = document.getElementById("manual-minutes");
    const quantityInput = document.getElementById("manual-quantity");
    const previewEl = document.getElementById("manual-time-preview");
    
    if (minutesInput) minutesInput.value = "";
    if (quantityInput) quantityInput.value = "";
    if (previewEl) previewEl.classList.add("hidden");
    
    const modal = document.getElementById("manual-time-modal");
    if (modal) {
        modal.classList.remove("hidden");
    }
}

function closeManualTimeModal() {
    document.getElementById("manual-time-modal").classList.add("hidden");
}

async function addManualTime() {
    const activityId = document.getElementById("manual-activity-select").value;
    const activity = allActivities.find(a => a.id == activityId);

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (!activityId || !activity) {
        alert(t('select_activity_label'));
        return;
    }

    const unitType = activity.unit_type || 'time';
    let requestData = { activity_id: Number(activityId) };

    if (unitType === 'quantity') {
        const quantity = Number(document.getElementById("manual-quantity").value);
        if (!quantity || quantity < 1) {
            alert(t('enter_quantity'));
            return;
        }
        requestData.quantity = quantity;
    } else {
        const minutes = Number(document.getElementById("manual-minutes").value);
        if (!minutes || minutes < 1) {
            alert(t('enter_minutes'));
            return;
        }
        requestData.minutes = minutes;
    }

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/timer/manual`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || t('error_adding'));
            return;
        }

        const data = await res.json();
        closeManualTimeModal();
        if (typeof window.loadWallet === 'function') await window.loadWallet();
        if (typeof window.loadHistory === 'function') await window.loadHistory();
        if (typeof window.loadGoals === 'function') await window.loadGoals();
        if (unitType === 'quantity') {
            const quantity = Number(document.getElementById("manual-quantity").value);
            showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${quantity} ${t('units')}!`, "success");
        } else {
            const minutes = Number(document.getElementById("manual-minutes").value);
            showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${minutes} ${t('min_short')}!`, "success");
        }
    } catch (e) {
        console.error("Error:", e);
        alert(t('network_error'));
    }
}

async function startActivityFromRecommendation(activityId) {
    const activity = allActivities.find(a => a.id === activityId);
    if (!activity) {
        alert("Активность не найдена. Пожалуйста, обновите страницу.");
        return;
    }

    if (activeTimers.has(activityId)) {
        alert("Таймер уже запущен для этой активности! Прокрутите к разделу 'Активности' чтобы остановить его.");
        setTimeout(() => {
            document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
    }

    let startBtn = null;
    let activityCard = null;

    const allTimerBtns = document.querySelectorAll('.timer-btn');
    for (const btn of allTimerBtns) {
        if (btn.dataset.activityId == activityId) {
            startBtn = btn;
            activityCard = btn.closest('[data-activity-id]') || btn.parentElement;
            break;
        }
    }

    if (!startBtn) {
        activityCard = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (activityCard) {
            startBtn = activityCard.querySelector('.timer-btn');
        }
    }

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
    const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);

    if (startBtn && !startBtn.classList.contains('bg-red-100')) {
        startBtn.click();
        showNotification(`✅ ${t('activity_started').replace('{activity}', activity.name)}`, 'success');
        setTimeout(() => {
            document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else if (!startBtn) {
        alert("Кнопка таймера не найдена. Пожалуйста, обновите страницу.");
    } else {
        alert("Таймер уже запущен для этой активности!");
    }
}

async function loadActivitiesForGoal() {
    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/activities/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
            console.error("Failed to load activities");
            return;
        }
        const data = await res.json();

        const select = document.getElementById("goal-activity");
        if (!select) {
            console.error("goal-activity select not found");
            return;
        }

        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        const loadingOption = select.querySelector('option[value=""]');
        if (loadingOption) {
            loadingOption.textContent = t('loading_activities');
            loadingOption.setAttribute('data-i18n', 'loading_activities');
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = t('loading_activities');
            option.setAttribute('data-i18n', 'loading_activities');
            select.appendChild(option);
        }

        if (data.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = t('create_activity_first');
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        data.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.id;
            const unitType = activity.unit_type || 'time';
            if (unitType === 'quantity') {
                option.textContent = `${activity.name} (${activity.xp_per_unit || 1} ${t('xp_per_unit')})`;
            } else {
                option.textContent = `${activity.name} (${activity.xp_per_hour} ${t('xp_per_hour')})`;
            }
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Error loading activities for goal:", e);
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.allActivities = allActivities;
    window.activeTimers = activeTimers;
    window.activitiesFilterState = activitiesFilterState;
    window.loadActivities = loadActivities;
    window.createActivity = createActivity;
    window.updateActivity = updateActivity;
    window.deleteActivity = deleteActivity;
    window.openEditModal = openEditModal;
    window.closeEditModal = closeEditModal;
    window.toggleTimer = toggleTimer;
    window.startTimer = startTimer;
    window.stopTimer = stopTimer;
    window.updateTimerDisplay = updateTimerDisplay;
    window.loadActiveTimers = loadActiveTimers;
    window.renderActivityCard = renderActivityCard;
    window.applyActivitiesFilters = applyActivitiesFilters;
    window.initActivitiesFilters = initActivitiesFilters;
    window.toggleActivitiesAccordion = toggleActivitiesAccordion;
    window.updateActivitiesAccordionButton = updateActivitiesAccordionButton;
    window.updateActivitiesCategoryFilter = updateActivitiesCategoryFilter;
    window.openManualTimeModal = openManualTimeModal;
    window.closeManualTimeModal = closeManualTimeModal;
    window.addManualTime = addManualTime;
    window.startActivityFromRecommendation = startActivityFromRecommendation;
    window.loadActivitiesForGoal = loadActivitiesForGoal;
    window.showActivityMessage = showActivityMessage;
    window.getActivitiesElements = getActivitiesElements;
}
