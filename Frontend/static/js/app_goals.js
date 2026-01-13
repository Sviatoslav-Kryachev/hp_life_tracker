// ============= GOALS MODULE =============
// Управление целями

// Зависимости: app_utils.js, app_auth.js, app_activities.js (должны быть загружены первыми)

// ============= GOALS FUNCTIONS =============
async function loadGoals() {
    try {
        console.log('[loadGoals] Starting to load goals...');
        const listEl = document.getElementById('goals-list');
        if (!listEl) {
            console.warn("[loadGoals] Goals list element not found");
            return;
        }

        const getToken = typeof getAuthToken === 'function' ? getAuthToken : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken : () => localStorage.getItem('token') || '';
        const translate = typeof t === 'function' ? t : (typeof window !== 'undefined' && window.t) ? window.t : (key) => key;
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        
        console.log('[loadGoals] API_BASE:', apiBase);
        const token = getToken();
        console.log('[loadGoals] Token available:', !!token);
        
        if (!token) {
            console.error("[loadGoals] No auth token available");
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${translate('auth_required') || 'Требуется авторизация'}</div>`;
            return;
        }

        console.log('[loadGoals] Fetching goals from:', `${apiBase}/goals/`);
        const res = await fetch(`${apiBase}/goals/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log('[loadGoals] Response status:', res.status, res.statusText);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[loadGoals] Failed to load goals:", res.status, res.statusText, errorText);
            listEl.innerHTML = `<div class="text-center text-red-400 py-4 text-xs">${translate('error_loading_goals') || 'Ошибка загрузки целей'}</div>`;
            return;
        }

        let data = await res.json();
        console.log('[loadGoals] Received', data.length, 'goals');

        if (data.length === 0) {
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${translate('no_goals') || 'Нет целей'}</div>`;
            return;
        }

        const localeMap = { 'ru': 'ru-RU', 'uk': 'uk-UA', 'de': 'de-DE', 'en': 'en-US' };
        const currentLanguage = typeof window !== 'undefined' && window.currentLanguage ? window.currentLanguage : localStorage.getItem('language') || 'ru';
        const allActivities = typeof window !== 'undefined' && window.allActivities ? window.allActivities : [];

        // Сортируем цели по дате достижения: ближайшие сверху, дальние снизу
        data.sort((a, b) => {
            if (a.is_completed && !b.is_completed) return 1;
            if (!a.is_completed && b.is_completed) return -1;

            if (a.target_date && b.target_date) {
                const dateA = new Date(a.target_date);
                const dateB = new Date(b.target_date);
                return dateA - dateB;
            }

            if (a.target_date && !b.target_date) return -1;
            if (!a.target_date && b.target_date) return 1;

            return (a.name || a.title || '').localeCompare(b.name || b.title || '');
        });

        // Проверяем, есть ли новые достигнутые цели для поздравления
        const shownNotificationsKey = 'shown_goal_notifications';
        let shownNotifications = JSON.parse(localStorage.getItem(shownNotificationsKey) || '{}');

        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        Object.keys(shownNotifications).forEach(key => {
            if (shownNotifications[key] < sevenDaysAgo) {
                delete shownNotifications[key];
            }
        });

        const newlyCompletedGoals = data.filter(goal => {
            if (goal.is_completed === 1 && goal.completed_at) {
                const goalKey = `goal_${goal.id}`;
                const completedTimestamp = new Date(goal.completed_at).getTime();

                if (shownNotifications[goalKey] && shownNotifications[goalKey] >= completedTimestamp) {
                    return false;
                }

                const now = Date.now();
                const timeDiff = now - completedTimestamp;

                if (timeDiff < 86400000) {
                    shownNotifications[goalKey] = completedTimestamp;
                    localStorage.setItem(shownNotificationsKey, JSON.stringify(shownNotifications));
                    return true;
                }
            }
            return false;
        });

        // Показываем поздравление для новых достигнутых целей
        newlyCompletedGoals.forEach(goal => {
            const goalTitle = goal.title || (goal.activity_name ? `"${goal.activity_name}"` : 'цели');
            const bonusText = goal.completion_bonus_xp > 0
                ? ` Бонус: +${Math.round(goal.completion_bonus_xp)} XP!`
                : '';
            const message = `🎉 Поздравляем! Цель "${goalTitle}" достигнута!${bonusText} Прокрутите к разделу "Мои цели" чтобы увидеть прогресс.`;
            const showNotif = typeof showNotification === 'function' ? showNotification : (typeof window !== 'undefined' && window.showNotification) ? window.showNotification : console.log;
            showNotif(message, 'success');
        });

        listEl.innerHTML = data.map(goal => {
            const progressPercent = goal.target_xp > 0 ? Math.min((goal.current_xp / goal.target_xp) * 100, 100) : 0;
            const isCompleted = goal.is_completed === 1;
            const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

            const activity = goal.activity_id ? allActivities.find(a => a.id == goal.activity_id) : null;
            const showQuantity = activity && activity.unit_type === 'quantity' && goal.target_quantity;

            return `
                <div class="p-2 md:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg md:rounded-xl border-2 ${isCompleted ? 'border-green-400 bg-green-50' : 'border-purple-300'} hover:shadow-md transition-all">
                    <div class="flex items-start justify-between mb-1.5 md:mb-2">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-1 md:gap-1.5 mb-1 flex-wrap">
                                <h4 class="font-bold text-gray-800 text-xs md:text-sm">${goal.title}</h4>
                                ${isCompleted ? `<span class="px-1 md:px-1.5 py-0.5 bg-green-500 text-white text-[9px] md:text-[10px] rounded-full flex-shrink-0">✓ ${translate('completed')}</span>` : ''}
                            </div>
                            ${goal.activity_name ? `
                                <div class="flex items-center gap-1 mb-0.5 md:mb-1">
                                    <i class="fas fa-tag text-purple-600 text-[10px] md:text-xs"></i>
                                    <span class="text-[10px] md:text-xs text-purple-700 font-medium">${goal.activity_name}</span>
                                </div>
                            ` : ''}
                            ${showQuantity ? `
                                <div class="flex items-center gap-1 mb-0.5 md:mb-1">
                                    <i class="fas fa-hashtag text-purple-600 text-[10px] md:text-xs"></i>
                                    <span class="text-[10px] md:text-xs text-purple-700 font-medium">${Math.round(goal.current_quantity || 0)} / ${Math.round(goal.target_quantity)} ${translate('units')}</span>
                                </div>
                            ` : ''}
                            ${goal.target_date ? `
                                <div class="flex items-center gap-1 mb-0.5 md:mb-1">
                                    <i class="fas fa-calendar text-gray-500 text-[10px] md:text-xs"></i>
                                    <span class="text-[9px] md:text-[10px] text-gray-600">
                                        ${new Date(goal.target_date).toLocaleDateString(localeMap[currentLanguage] || 'ru-RU')}
                                        ${daysLeft !== null ? (daysLeft > 0 ? `(${daysLeft} ${translate('days_short')})` : daysLeft === 0 ? `(${translate('today_exclamation')})` : `(${translate('overdue')})`) : ''}
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="flex gap-0.5 md:gap-1 flex-shrink-0 ml-1 md:ml-2">
                            ${!isCompleted ? `
                                <button onclick="if(typeof window.editGoal === 'function') window.editGoal(${goal.id})" class="w-5 h-5 md:w-6 md:h-6 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-all" title="${translate('edit')}">
                                    <i class="fas fa-edit text-[9px] md:text-[10px]"></i>
                                </button>
                                <button onclick="if(typeof window.deleteGoal === 'function') window.deleteGoal(${goal.id})" class="w-5 h-5 md:w-6 md:h-6 rounded bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all" title="${translate('delete')}">
                                    <i class="fas fa-trash text-[9px] md:text-[10px]"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="mb-0.5 md:mb-1">
                        <div class="flex justify-between text-[9px] md:text-[10px] mb-0.5 md:mb-1">
                            <span class="text-gray-600 font-medium">${Math.round(goal.current_xp)} / ${Math.round(goal.target_xp)} XP</span>
                            <span class="font-bold text-purple-600">${Math.round(progressPercent)}%</span>
                        </div>
                        <div class="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}"
                                 style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading goals:", e);
    }
}

function showCreateGoalModal() {
    if (typeof window.updateDateInputLang === 'function') {
        window.updateDateInputLang();
    }

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
    const titleEl = document.getElementById("goal-modal-title");
    const submitBtn = document.getElementById("goal-submit-btn");
    if (titleEl) titleEl.textContent = t('new_goal');
    if (submitBtn) submitBtn.innerHTML = `<i class="fas fa-check mr-2"></i>${t('create_goal_btn')}`;
    
    const editIdEl = document.getElementById("edit-goal-id");
    if (editIdEl) editIdEl.value = "";
    
    const modal = document.getElementById("create-goal-modal");
    if (modal) modal.classList.remove("hidden");
    
    const form = document.getElementById("create-goal-form");
    if (form) form.reset();
    
    const quantityContainer = document.getElementById("goal-quantity-container");
    const modeSelector = document.getElementById("goal-mode-selector");
    const xpContainer = document.getElementById("goal-xp-container");
    if (quantityContainer) quantityContainer.classList.add("hidden");
    if (modeSelector) modeSelector.classList.add("hidden");
    if (xpContainer) {
        xpContainer.classList.remove("hidden");
        const xpInput = document.getElementById("goal-target-xp");
        if (xpInput) xpInput.required = true;
    }
    
    if (typeof window.loadActivitiesForGoal === 'function') {
        window.loadActivitiesForGoal();
    }
    
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }

    const activitySelect = document.getElementById("goal-activity");
    if (activitySelect) {
        const newSelect = activitySelect.cloneNode(true);
        activitySelect.parentNode.replaceChild(newSelect, activitySelect);
        newSelect.addEventListener('change', updateGoalFormForActivity);
    }

    const dateInput = document.getElementById('goal-target-date');
    if (dateInput) {
        dateInput.removeEventListener('focus', updateDateInputLang);
        dateInput.removeEventListener('click', updateDateInputLang);
        dateInput.addEventListener('focus', updateDateInputLang);
        dateInput.addEventListener('click', updateDateInputLang);
    }

    setTimeout(() => {
        if (typeof window.updateDateInputLang === 'function') {
            window.updateDateInputLang();
        }
    }, 100);
}

function closeCreateGoalModal() {
    const modal = document.getElementById("create-goal-modal");
    if (modal) modal.classList.add("hidden");
    
    const form = document.getElementById("create-goal-form");
    if (form) form.reset();
    
    const editIdEl = document.getElementById("edit-goal-id");
    if (editIdEl) editIdEl.value = "";
}

function updateGoalFormForActivity() {
    const activityId = document.getElementById("goal-activity")?.value;
    const quantityContainer = document.getElementById("goal-quantity-container");
    const xpContainer = document.getElementById("goal-xp-container");
    const modeSelector = document.getElementById("goal-mode-selector");

    if (!activityId) {
        if (modeSelector) modeSelector.classList.add("hidden");
        if (quantityContainer) quantityContainer.classList.add("hidden");
        if (xpContainer) {
            xpContainer.classList.remove("hidden");
            const xpInput = document.getElementById("goal-target-xp");
            if (xpInput) xpInput.required = true;
        }
        return;
    }

    const allActivities = typeof window !== 'undefined' && window.allActivities ? window.allActivities : [];
    const activity = allActivities.find(a => a.id == activityId);
    
    if (activity && activity.unit_type === 'quantity') {
        if (modeSelector) modeSelector.classList.remove("hidden");
        setupGoalModeSelector();
        const quantityMode = document.querySelector('input[name="goal-mode"][value="quantity"]');
        if (quantityMode) {
            quantityMode.checked = true;
            updateGoalModeDisplay('quantity');
        }
    } else {
        if (modeSelector) modeSelector.classList.add("hidden");
        if (quantityContainer) quantityContainer.classList.add("hidden");
        if (xpContainer) {
            xpContainer.classList.remove("hidden");
            const xpInput = document.getElementById("goal-target-xp");
            if (xpInput) xpInput.required = true;
        }
    }
}

function setupGoalModeSelector() {
    const modeInputs = document.querySelectorAll('input[name="goal-mode"]');
    modeInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateGoalModeDisplay(this.value);
        });
    });
}

function updateGoalModeDisplay(mode) {
    const quantityContainer = document.getElementById("goal-quantity-container");
    const xpContainer = document.getElementById("goal-xp-container");
    const quantityInput = document.getElementById("goal-target-quantity");
    const xpInput = document.getElementById("goal-target-xp");
    const modeOptions = document.querySelectorAll('.goal-mode-option');

    modeOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.value === mode) {
            option.classList.remove('border-gray-200');
            option.classList.add('border-purple-500', 'bg-purple-50');
        } else {
            option.classList.remove('border-purple-500', 'bg-purple-50');
            option.classList.add('border-gray-200');
        }
    });

    if (mode === 'quantity') {
        if (quantityContainer) quantityContainer.classList.remove("hidden");
        if (xpContainer) xpContainer.classList.add("hidden");
        if (quantityInput) quantityInput.required = true;
        if (xpInput) xpInput.required = false;
    } else {
        if (quantityContainer) quantityContainer.classList.add("hidden");
        if (xpContainer) xpContainer.classList.remove("hidden");
        if (quantityInput) quantityInput.required = false;
        if (xpInput) xpInput.required = true;
    }
}

async function editGoal(goalId) {
    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        
        const res = await fetch(`${apiBase}/goals/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
            alert(t('error_loading_goals'));
            return;
        }
        const goals = await res.json();
        const goal = goals.find(g => g.id === goalId);

        if (!goal) {
            alert(t('goal_not_found'));
            return;
        }

        if (goal.is_completed === 1) {
            alert(t('cannot_edit_completed'));
            return;
        }

        const editIdEl = document.getElementById("edit-goal-id");
        const titleEl = document.getElementById("goal-title");
        const descEl = document.getElementById("goal-description");
        const xpEl = document.getElementById("goal-target-xp");
        const dateEl = document.getElementById("goal-target-date");
        const quantityEl = document.getElementById("goal-target-quantity");
        const bonusEl = document.getElementById("goal-completion-bonus");
        
        if (editIdEl) editIdEl.value = goal.id;
        if (titleEl) titleEl.value = goal.title;
        if (descEl) descEl.value = goal.description || "";
        if (xpEl) xpEl.value = goal.target_xp;
        if (dateEl) dateEl.value = goal.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : "";
        if (quantityEl) quantityEl.value = goal.target_quantity || "";
        if (bonusEl) bonusEl.value = goal.completion_bonus_xp || 0;

        if (typeof window.loadActivitiesForGoal === 'function') {
            await window.loadActivitiesForGoal();
        }
        
        if (goal.activity_id) {
            const activitySelect = document.getElementById("goal-activity");
            if (activitySelect) {
                activitySelect.value = goal.activity_id;
                updateGoalFormForActivity();

                const allActivities = typeof window !== 'undefined' && window.allActivities ? window.allActivities : [];
                const activity = allActivities.find(a => a.id == goal.activity_id);
                if (activity && activity.unit_type === 'quantity') {
                    if (goal.target_quantity && goal.target_quantity > 0) {
                        const quantityMode = document.querySelector('input[name="goal-mode"][value="quantity"]');
                        if (quantityMode) {
                            quantityMode.checked = true;
                            updateGoalModeDisplay('quantity');
                        }
                    } else {
                        const xpMode = document.querySelector('input[name="goal-mode"][value="xp"]');
                        if (xpMode) {
                            xpMode.checked = true;
                            updateGoalModeDisplay('xp');
                        }
                    }
                }
            }
        }

        if (typeof window.updateDateInputLang === 'function') {
            window.updateDateInputLang();
        }

        const titleModalEl = document.getElementById("goal-modal-title");
        const submitBtn = document.getElementById("goal-submit-btn");
        if (titleModalEl) titleModalEl.textContent = t('edit_goal');
        if (submitBtn) submitBtn.innerHTML = `<i class="fas fa-save mr-2"></i>${t('save_changes')}`;

        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations();
        }

        const dateInput = document.getElementById('goal-target-date');
        if (dateInput) {
            dateInput.removeEventListener('focus', updateDateInputLang);
            dateInput.removeEventListener('click', updateDateInputLang);
            dateInput.addEventListener('focus', updateDateInputLang);
            dateInput.addEventListener('click', updateDateInputLang);
        }

        setTimeout(() => {
            if (typeof window.updateDateInputLang === 'function') {
                window.updateDateInputLang();
            }
        }, 100);

        const modal = document.getElementById("create-goal-modal");
        if (modal) modal.classList.remove("hidden");
    } catch (e) {
        console.error("Error loading goal for edit:", e);
        alert("Ошибка загрузки цели: " + e.message);
    }
}

async function createGoal() {
    const editIdEl = document.getElementById("edit-goal-id");
    const goalId = editIdEl ? editIdEl.value : '';
    const titleEl = document.getElementById("goal-title");
    const title = titleEl ? titleEl.value.trim() : '';
    const descEl = document.getElementById("goal-description");
    const description = descEl ? descEl.value.trim() : '';
    const activitySelect = document.getElementById("goal-activity");
    const activityId = activitySelect ? activitySelect.value : '';
    const dateEl = document.getElementById("goal-target-date");
    const targetDate = dateEl ? dateEl.value : '';
    const quantityEl = document.getElementById("goal-target-quantity");
    const xpEl = document.getElementById("goal-target-xp");
    const bonusEl = document.getElementById("goal-completion-bonus");
    const completionBonus = bonusEl ? parseFloat(bonusEl.value) || 0 : 0;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (!activityId) {
        alert(t('select_activity_for_goal'));
        return;
    }

    const allActivities = typeof window !== 'undefined' && window.allActivities ? window.allActivities : [];
    const activity = allActivities.find(a => a.id == activityId);
    let targetXp = null;
    let targetQuantity = null;

    if (activity && activity.unit_type === 'quantity') {
        const selectedMode = document.querySelector('input[name="goal-mode"]:checked');
        if (selectedMode && selectedMode.value === 'quantity') {
            targetQuantity = quantityEl ? parseFloat(quantityEl.value) : null;
            if (!targetQuantity || targetQuantity <= 0) {
                alert(t('enter_target_quantity'));
                return;
            }
            if (activity.xp_per_unit && activity.xp_per_unit > 0) {
                targetXp = targetQuantity * activity.xp_per_unit;
            } else {
                targetXp = targetQuantity;
            }
        } else {
            targetXp = xpEl ? parseFloat(xpEl.value) : null;
            if (!targetXp || targetXp <= 0) {
                alert(t('fill_title_and_xp'));
                return;
            }
        }
    } else {
        targetXp = xpEl ? parseFloat(xpEl.value) : null;
        if (!targetXp || targetXp <= 0) {
            alert(t('fill_title_and_xp'));
            return;
        }
    }

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);
        
        if (goalId) {
            const res = await fetch(`${apiBase}/goals/${goalId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
                    target_quantity: targetQuantity || null,
                    completion_bonus_xp: completionBonus,
                    activity_id: activityId ? parseInt(activityId) : null,
                    target_date: targetDate ? new Date(targetDate).toISOString() : null
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || t('error_updating'));
            }

            closeCreateGoalModal();
            await loadGoals();
            showNotification(`✅ ${t('goal_updated')}`, 'success');
        } else {
            const res = await fetch(`${apiBase}/goals/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
                    target_quantity: targetQuantity || null,
                    completion_bonus_xp: completionBonus,
                    activity_id: activityId ? parseInt(activityId) : null,
                    target_date: targetDate ? new Date(targetDate).toISOString() : null
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || t('error_creating_goal'));
            }

            closeCreateGoalModal();
            await loadGoals();
            showNotification(`✅ ${t('goal_created')}`, 'success');
        }
    } catch (e) {
        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        alert(t('error') + ": " + e.message);
    }
}

async function deleteGoal(goalId) {
    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
    if (!confirm(t('delete_goal_confirm'))) return;

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);
        
        if (!token) {
            alert(t('auth_required'));
            return;
        }
        
        const res = await fetch(`${apiBase}/goals/${goalId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(t('error_deleting'));

        await loadGoals();
        showNotification(`✅ ${t('goal_deleted')}`, 'success');
    } catch (e) {
        alert(t('error_deleting_goal'));
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.loadGoals = loadGoals;
    window.showCreateGoalModal = showCreateGoalModal;
    window.closeCreateGoalModal = closeCreateGoalModal;
    window.editGoal = editGoal;
    window.createGoal = createGoal;
    window.deleteGoal = deleteGoal;
    window.updateGoalFormForActivity = updateGoalFormForActivity;
    window.setupGoalModeSelector = setupGoalModeSelector;
    window.updateGoalModeDisplay = updateGoalModeDisplay;
}
