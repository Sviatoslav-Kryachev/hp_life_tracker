const API_BASE = "http://127.0.0.1:8000";

// ============= AUTH STATE =============
let authToken = localStorage.getItem('token') || '';
let currentUser = null;

// ============= APP STATE =============
const activeTimers = new Map();
let allActivities = [];
let allRewards = [];

// ============= DOM ELEMENTS =============
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const activityNameInput = document.getElementById("activity-name");
const xpPerHourInput = document.getElementById("xp-per-hour");
const activitiesList = document.getElementById("activities-list");
const newActivityForm = document.getElementById("new-activity-form");
const balanceSpan = document.getElementById("balance");
const levelSpan = document.getElementById("level");
const rewardsList = document.getElementById("rewards-list");
const rewardMessage = document.getElementById("reward-message");
const newRewardForm = document.getElementById("new-reward-form");
const rewardNameInput = document.getElementById("reward-name");
const rewardCostInput = document.getElementById("reward-cost");


// ============= AUTH FUNCTIONS =============
function showLoginForm() {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-tab").classList.add("bg-white", "shadow", "text-indigo-600");
    document.getElementById("login-tab").classList.remove("text-gray-500");
    document.getElementById("register-tab").classList.remove("bg-white", "shadow", "text-indigo-600");
    document.getElementById("register-tab").classList.add("text-gray-500");
}

function showRegisterForm() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("register-tab").classList.add("bg-white", "shadow", "text-indigo-600");
    document.getElementById("register-tab").classList.remove("text-gray-500");
    document.getElementById("login-tab").classList.remove("bg-white", "shadow", "text-indigo-600");
    document.getElementById("login-tab").classList.add("text-gray-500");
}

async function login(email, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Ошибка входа");
        }
        
        const data = await res.json();
        authToken = data.access_token;
        localStorage.setItem('token', authToken);
        
        await loadCurrentUser();
        showApp();
        
    } catch (e) {
        document.getElementById("login-error").textContent = e.message;
        document.getElementById("login-error").classList.remove("hidden");
    }
}

async function register(email, username, password) {
    try {
        // Проверяем invite код из URL
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get('invite');
        
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email, 
                password, 
                username: username || null,
                invite_code: inviteCode || null
            })
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Ошибка регистрации");
        }
        
        document.getElementById("register-error").classList.add("hidden");
        document.getElementById("register-success").textContent = "✅ Регистрация успешна! Теперь войдите.";
        document.getElementById("register-success").classList.remove("hidden");
        
        setTimeout(() => {
            showLoginForm();
            document.getElementById("login-email").value = email;
        }, 1500);
        
    } catch (e) {
        document.getElementById("register-success").classList.add("hidden");
        document.getElementById("register-error").textContent = e.message;
        document.getElementById("register-error").classList.remove("hidden");
    }
}

async function loadCurrentUser() {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Не удалось загрузить пользователя");
        
        currentUser = await res.json();
        document.getElementById("user-info").textContent = currentUser.username || currentUser.email;
        
        // Проверяем, является ли пользователь администратором
        checkAdminStatus();
        
    } catch (e) {
        console.error("Error loading user:", e);
        logout();
    }
}

async function checkAdminStatus() {
    try {
        // Пытаемся получить invite код - если успешно, значит админ
        const res = await fetch(`${API_BASE}/admin/invite-code`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (res.ok) {
            document.getElementById("admin-btn").classList.remove("hidden");
            loadInviteCode();
        }
    } catch (e) {
        // Не админ или ошибка
    }
}

function logout() {
    authToken = '';
    currentUser = null;
    localStorage.removeItem('token');
    showAuth();
}

function showAuth() {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
}

function showApp() {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    loadWallet();
    loadActivities();
    loadRewards();
    loadTodayStats();
    loadWeekCalendar();
    loadStreak();
    loadRecommendations();
    loadGoals();
    loadHistory(); // Автоматически загружаем историю
}

async function checkAuth() {
    // Сразу скрываем auth-section если есть токен, чтобы избежать мигания
    if (authToken) {
        authSection.classList.add("hidden");
        appSection.classList.remove("hidden");
    } else {
        showAuth();
        return;
    }
    
    try {
        await loadCurrentUser();
        showApp();
    } catch (e) {
        showAuth();
    }
}


// ============= WALLET =============
async function loadWallet() {
    try {
        const res = await fetch(`${API_BASE}/xp/wallet`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        balanceSpan.textContent = `${Math.round(data.balance)} XP`;
        levelSpan.textContent = data.level;
        
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
        const res = await fetch(`${API_BASE}/xp/today`, {
            headers: { "Authorization": `Bearer ${authToken}` }
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
            timeEl.textContent = hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
        }
    } catch (e) {
        console.error("Error loading today stats", e);
    }
}

// ============= WEEK CALENDAR =============
async function loadWeekCalendar() {
    try {
        const res = await fetch(`${API_BASE}/xp/week`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const calendarEl = document.getElementById('week-calendar');
        if (!calendarEl) return;
        
        calendarEl.innerHTML = data.map((day, index) => {
            const isToday = index === 6;
            const hasActivity = day.earned > 0 || day.spent > 0;
            const intensity = Math.min(day.earned / 100, 1); // Интенсивность цвета
            
            return `
                <div class="flex flex-col items-center ${isToday ? 'scale-110' : ''}" title="${day.earned} XP заработано, ${day.spent} XP потрачено">
                    <span class="text-xs text-gray-500 mb-1">${day.day_name}</span>
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                        ${isToday ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 
                          hasActivity ? `bg-emerald-${Math.round(intensity * 4 + 1)}00 text-emerald-800` : 'bg-gray-100 text-gray-400'}">
                        ${Math.round(day.earned)}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading week calendar", e);
    }
}

// ============= HISTORY =============
let historyOpen = false;

function toggleHistory() {
    historyOpen = !historyOpen;
    const panel = document.getElementById('history-panel');
    const chevron = document.getElementById('history-chevron');
    
    if (historyOpen) {
        panel.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
        loadHistory();
    } else {
        panel.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
    }
}

async function loadHistory() {
    try {
        const res = await fetch(`${API_BASE}/xp/full-history?limit=30`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const listEl = document.getElementById('history-list');
        if (!listEl) return;
        
        if (data.length === 0) {
            listEl.innerHTML = '<div class="text-center text-gray-400 py-4">История пуста</div>';
            return;
        }
        
        listEl.innerHTML = data.map(item => {
            const isEarn = item.type === 'earn';
            const date = new Date(item.date);
            const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            
            return `
                <div class="flex items-center justify-between p-2.5 rounded-lg ${isEarn ? 'bg-emerald-50' : 'bg-red-50'} transition-all hover:bg-opacity-80">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isEarn ? 'bg-emerald-500' : 'bg-red-500'}">
                            <i class="fas ${isEarn ? 'fa-arrow-up' : 'fa-arrow-down'} text-white text-xs"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="font-medium text-gray-800 text-sm truncate">${item.description}</div>
                            <div class="text-xs text-gray-500">${dateStr} в ${timeStr}${item.duration_minutes ? ` • ${Math.round(item.duration_minutes)} мин` : ''}</div>
                        </div>
                    </div>
                    <div class="font-bold ${isEarn ? 'text-emerald-600' : 'text-red-600'} flex-shrink-0 ml-2">
                        ${isEarn ? '+' : '-'}${Math.round(item.amount)} XP
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading history", e);
    }
}


// ============= ACTIVITIES =============
async function loadActivities() {
    try {
        const res = await fetch(`${API_BASE}/activities/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        allActivities = data;
        activitiesList.innerHTML = "";
        data.forEach(renderActivityCard);
    } catch (e) {
        console.error("Error loading activities", e);
    }
}

function renderActivityCard(activity) {
    const div = document.createElement("div");
    div.className = "activity-card p-4 mb-3 rounded-xl bg-white/80 border border-blue-100 shadow-sm hover:shadow-lg flex items-center justify-between gap-3";

    const left = document.createElement("div");
    left.className = "flex-grow";
    left.innerHTML = `
        <div class="text-lg font-semibold text-gray-800">${activity.name}</div>
        <div class="text-sm text-gray-500">${activity.xp_per_hour} XP/час</div>
    `;

    // Timer button
    const timerBtn = document.createElement("button");
    timerBtn.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2";
    timerBtn.innerHTML = '<i class="fas fa-play text-green-500"></i> Старт';
    timerBtn.dataset.activityId = activity.id;
    timerBtn.addEventListener("click", (e) => toggleTimer(activity.id, e.currentTarget, activity));

    // Manual time button
    const manualTimeBtn = document.createElement("button");
    manualTimeBtn.className = "manual-time-btn p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    manualTimeBtn.innerHTML = '<i class="fas fa-clock"></i>';
    manualTimeBtn.title = "Добавить время вручную";
    manualTimeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openManualTimeModal(activity.id);
    });

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = "Редактировать";
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditModal(activity);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = "Удалить";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteActivity(activity.id, div);
    });

    div.appendChild(left);
    div.appendChild(timerBtn);
    div.appendChild(manualTimeBtn);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    activitiesList.appendChild(div);
}

async function createActivity() {
    const name = activityNameInput.value.trim();
    const xp = xpPerHourInput ? Number(xpPerHourInput.value) || 60 : 60;
    
    if (!name) {
        showActivityMessage("Введите название активности", "error");
        return;
    }
    
    const duplicate = allActivities.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        showActivityMessage(`❌ "${name}" уже существует!`, "error");
        activityNameInput.focus();
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/activities/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_per_hour: xp })
        });
        
        if (!res.ok) {
            const error = await res.json();
            showActivityMessage(error.detail || "Ошибка создания", "error");
            return;
        }
        
        const created = await res.json();
        activityNameInput.value = "";
        if (xpPerHourInput) xpPerHourInput.value = "60";
        allActivities.push(created);
        renderActivityCard(created);
        showActivityMessage(`✅ "${created.name}" создана!`, "success");
    } catch (e) {
        console.error("Error:", e);
        showActivityMessage("Ошибка соединения", "error");
    }
}

function openEditModal(activity) {
    document.getElementById("edit-activity-id").value = activity.id;
    document.getElementById("edit-activity-name").value = activity.name;
    document.getElementById("edit-xp-per-hour").value = activity.xp_per_hour;
    document.getElementById("edit-activity-modal").classList.remove("hidden");
}

function closeEditModal() {
    document.getElementById("edit-activity-modal").classList.add("hidden");
    document.getElementById("edit-activity-form").reset();
}

async function updateActivity() {
    const id = document.getElementById("edit-activity-id").value;
    const name = document.getElementById("edit-activity-name").value.trim();
    const xpPerHour = Number(document.getElementById("edit-xp-per-hour").value) || 60;

    if (!name) {
        alert("Введите название активности");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/activities/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_per_hour: xpPerHour })
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Ошибка обновления");
            return;
        }

        closeEditModal();
        await loadActivities();
        showActivityMessage("✅ Активность обновлена!", "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

async function deleteActivity(activityId, cardElement) {
    if (!confirm("Удалить активность?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/activities/${activityId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            alert("Ошибка удаления");
            return;
        }
        
        cardElement.style.transition = "all 0.3s ease";
        cardElement.style.opacity = "0";
        cardElement.style.transform = "translateX(-20px)";
        setTimeout(() => cardElement.remove(), 300);
        allActivities = allActivities.filter(a => a.id != activityId);
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
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
        const res = await fetch(`${API_BASE}/timer/start?activity_id=${activityId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        const data = await res.json();
        const logId = data.log_id;
        const startTime = Date.now();
        const timerInfo = { logId, startTime, intervalId: null, activity };
        activeTimers.set(activityId, timerInfo);
        
        button.innerHTML = '<i class="fas fa-stop text-red-500"></i> <span id="timer-' + activityId + '">00:00</span>';
        button.className = "timer-btn px-6 py-2 rounded-xl text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 transition-all duration-300";
        
        const intervalId = setInterval(() => updateTimerDisplay(activityId, startTime, activity), 1000);
        timerInfo.intervalId = intervalId;
    } catch (e) {
        console.error("Error starting timer:", e);
        alert("Ошибка запуска таймера");
    }
}

function updateTimerDisplay(activityId, startTime, activity) {
    const elapsedMs = Date.now() - startTime;
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
        const res = await fetch(`${API_BASE}/timer/stop/${timerInfo.logId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        const data = await res.json();
        activeTimers.delete(activityId);
        
        button.innerHTML = '<i class="fas fa-play text-green-500"></i> Старт';
        button.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2 transition-all duration-300";
        
        await loadWallet();
        loadTodayStats(); // Обновляем статистику
        loadWeekCalendar(); // Обновляем календарь
        loadStreak(); // Обновляем streak
        
        let message = `✅ Таймер остановлен! Заработано ${Math.round(data.xp_earned)} XP`;
        if (data.streak_bonus && data.streak_bonus > 0) {
            message += `\n🔥 Бонус за серию: +${data.streak_bonus} XP`;
        }
        if (data.completed_goals && data.completed_goals.length > 0) {
            message += `\n🎯 Цель выполнена: ${data.completed_goals.join(", ")}`;
            loadGoals(); // Обновляем список целей
        }
        alert(message);
    } catch (e) {
        console.error("Error stopping timer:", e);
        alert("Ошибка остановки таймера");
    }
}


// ============= MANUAL TIME =============
function openManualTimeModal(activityId) {
    const select = document.getElementById("manual-activity-select");
    select.innerHTML = '<option value="">Выберите активность</option>';
    allActivities.forEach(activity => {
        const option = document.createElement("option");
        option.value = activity.id;
        option.textContent = `${activity.name} (${activity.xp_per_hour} XP/час)`;
        select.appendChild(option);
    });
    select.value = activityId;
    document.getElementById("manual-minutes").value = "";
    document.getElementById("manual-time-preview").classList.add("hidden");
    document.getElementById("manual-time-modal").classList.remove("hidden");
}

function closeManualTimeModal() {
    document.getElementById("manual-time-modal").classList.add("hidden");
}

function updateManualPreview(activityId) {
    const minutes = document.getElementById("manual-minutes").value;
    const preview = document.getElementById("manual-time-preview");
    if (activityId && minutes) {
        const activity = allActivities.find(a => a.id == activityId);
        if (activity) {
            const xp = Math.round((minutes / 60) * activity.xp_per_hour);
            preview.textContent = `+${xp} XP`;
            preview.classList.remove("hidden");
        }
    } else {
        preview.classList.add("hidden");
    }
}

async function addManualTime() {
    const activityId = document.getElementById("manual-activity-select").value;
    const minutes = Number(document.getElementById("manual-minutes").value);
    
    if (!activityId || !minutes || minutes < 1) {
        alert("Выберите активность и укажите минуты");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/timer/manual`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ activity_id: Number(activityId), minutes })
        });
        
        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Ошибка добавления времени");
            return;
        }
        
        const data = await res.json();
        closeManualTimeModal();
        await loadWallet();
        showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${minutes} мин!`, "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}


// ============= REWARDS =============

// Preset награды с брендами
const REWARD_PRESETS = {
    mcdonalds: { name: "McDonald's", xp_cost: 100, icon: "M", iconType: "text", bgColor: "bg-red-500", textColor: "text-yellow-400", borderColor: "border-red-200" },
    youtube: { name: "YouTube 30 мин", xp_cost: 30, icon: "fab fa-youtube", iconType: "icon", bgColor: "bg-red-600", textColor: "text-white", borderColor: "border-red-200" },
    gaming: { name: "Игры 1 час", xp_cost: 60, icon: "fas fa-gamepad", iconType: "icon", bgColor: "bg-gradient-to-br from-purple-500 to-pink-500", textColor: "text-white", borderColor: "border-purple-200" },
    netflix: { name: "Netflix 1 серия", xp_cost: 50, icon: "N", iconType: "text", bgColor: "bg-black", textColor: "text-red-600", borderColor: "border-gray-300" },
    coffee: { name: "Кофе", xp_cost: 40, icon: "fas fa-coffee", iconType: "icon", bgColor: "bg-green-700", textColor: "text-white", borderColor: "border-green-200" },
    custom: { name: "", xp_cost: 10, icon: "fas fa-gift", iconType: "icon", bgColor: "bg-gradient-to-br from-amber-400 to-orange-500", textColor: "text-white", borderColor: "border-amber-200" }
};

function selectPreset(presetKey) {
    const preset = REWARD_PRESETS[presetKey];
    if (preset) {
        document.getElementById("reward-name").value = preset.name;
        document.getElementById("reward-cost").value = preset.xp_cost;
        document.getElementById("reward-name").focus();
    }
}

// Определяем бренд по названию награды
function detectBrand(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("mcdonald") || lowerName.includes("макдональдс") || lowerName.includes("мак")) {
        return { icon: "M", iconType: "text", bgColor: "bg-red-500", textColor: "text-yellow-400", borderColor: "border-red-200" };
    }
    if (lowerName.includes("youtube") || lowerName.includes("ютуб")) {
        return { icon: "fab fa-youtube", iconType: "icon", bgColor: "bg-red-600", textColor: "text-white", borderColor: "border-red-200" };
    }
    if (lowerName.includes("игр") || lowerName.includes("game") || lowerName.includes("gaming")) {
        return { icon: "fas fa-gamepad", iconType: "icon", bgColor: "bg-gradient-to-br from-purple-500 to-pink-500", textColor: "text-white", borderColor: "border-purple-200" };
    }
    if (lowerName.includes("netflix") || lowerName.includes("нетфликс")) {
        return { icon: "N", iconType: "text", bgColor: "bg-black", textColor: "text-red-600", borderColor: "border-gray-300" };
    }
    if (lowerName.includes("кофе") || lowerName.includes("coffee") || lowerName.includes("starbucks") || lowerName.includes("старбакс")) {
        return { icon: "fas fa-coffee", iconType: "icon", bgColor: "bg-green-700", textColor: "text-white", borderColor: "border-green-200" };
    }
    if (lowerName.includes("instagram") || lowerName.includes("инстаграм")) {
        return { icon: "fab fa-instagram", iconType: "icon", bgColor: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400", textColor: "text-white", borderColor: "border-pink-200" };
    }
    if (lowerName.includes("tiktok") || lowerName.includes("тикток")) {
        return { icon: "fab fa-tiktok", iconType: "icon", bgColor: "bg-black", textColor: "text-white", borderColor: "border-gray-300" };
    }
    if (lowerName.includes("spotify") || lowerName.includes("спотифай") || lowerName.includes("музык")) {
        return { icon: "fab fa-spotify", iconType: "icon", bgColor: "bg-green-500", textColor: "text-white", borderColor: "border-green-200" };
    }
    if (lowerName.includes("пицц") || lowerName.includes("pizza")) {
        return { icon: "fas fa-pizza-slice", iconType: "icon", bgColor: "bg-orange-500", textColor: "text-white", borderColor: "border-orange-200" };
    }
    if (lowerName.includes("кино") || lowerName.includes("фильм") || lowerName.includes("movie")) {
        return { icon: "fas fa-film", iconType: "icon", bgColor: "bg-indigo-600", textColor: "text-white", borderColor: "border-indigo-200" };
    }
    if (lowerName.includes("сон") || lowerName.includes("sleep") || lowerName.includes("отдых")) {
        return { icon: "fas fa-bed", iconType: "icon", bgColor: "bg-blue-500", textColor: "text-white", borderColor: "border-blue-200" };
    }
    // Дефолт
    return { icon: "fas fa-gift", iconType: "icon", bgColor: "bg-gradient-to-br from-amber-400 to-orange-500", textColor: "text-white", borderColor: "border-amber-200" };
}

async function loadRewards() {
    try {
        const res = await fetch(`${API_BASE}/rewards/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) return;
        
        const data = await res.json();
        allRewards = data;
        rewardsList.innerHTML = "";
        data.forEach(renderRewardCard);
    } catch (e) {
        console.error("Error loading rewards:", e);
    }
}

function renderRewardCard(reward) {
    const brand = detectBrand(reward.name);
    
    const div = document.createElement("div");
    div.className = `reward-card group relative p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border-2 ${brand.borderColor} hover:shadow-md hover:border-opacity-80 transition-all duration-200 w-full max-w-full overflow-hidden`;

    // Основная структура: всё в одной строке, кнопки по центру по высоте
    const mainSection = document.createElement("div");
    mainSection.className = "flex items-center justify-between gap-4";
    
    // Левая часть: иконка и название со стоимостью
    const leftSection = document.createElement("div");
    leftSection.className = "flex items-center gap-3 flex-1 min-w-0";
    
    // Иконка бренда
    const icon = document.createElement("div");
    icon.className = `w-12 h-12 ${brand.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200`;
    
    if (brand.iconType === "text") {
        icon.innerHTML = `<span class="${brand.textColor} font-black text-lg">${brand.icon}</span>`;
    } else {
        icon.innerHTML = `<i class="${brand.icon} ${brand.textColor} text-lg"></i>`;
    }
    
    // Название и стоимость
    const nameDiv = document.createElement("div");
    nameDiv.className = "flex-1 min-w-0";
    nameDiv.innerHTML = `
        <div class="font-bold text-gray-800 text-base leading-tight break-words mb-1">${reward.name}</div>
        <div class="flex items-center gap-1.5">
            <div class="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <i class="fas fa-coins text-white text-[8px]"></i>
            </div>
            <span class="text-amber-700 text-xs font-bold">${reward.xp_cost} XP</span>
        </div>
    `;
    
    leftSection.appendChild(icon);
    leftSection.appendChild(nameDiv);
    
    // Правая часть: кнопки (выровнены по центру по высоте)
    const btnContainer = document.createElement("div");
    btnContainer.className = "flex items-center gap-2 flex-shrink-0";

    // Кнопки редактирования и удаления (только для своих наград, всегда видны)
    if (reward.user_id) {
        const editBtn = document.createElement("button");
        editBtn.className = "w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 flex-shrink-0";
        editBtn.innerHTML = '<i class="fas fa-pen text-xs"></i>';
        editBtn.title = "Редактировать";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openEditRewardModal(reward);
        });
        btnContainer.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "w-9 h-9 rounded-lg bg-gradient-to-br from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 flex-shrink-0";
        deleteBtn.innerHTML = '<i class="fas fa-trash text-xs"></i>';
        deleteBtn.title = "Удалить";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteReward(reward.id, div);
        });
        btnContainer.appendChild(deleteBtn);
    }

    // Кнопка покупки
    const spendBtn = document.createElement("button");
    spendBtn.className = "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 active:scale-95 flex-shrink-0 whitespace-nowrap h-9";
    spendBtn.innerHTML = '<i class="fas fa-shopping-bag text-xs"></i><span class="hidden sm:inline">Купить</span>';
    spendBtn.addEventListener("click", () => spendReward(reward.id));
    btnContainer.appendChild(spendBtn);

    mainSection.appendChild(leftSection);
    mainSection.appendChild(btnContainer);

    div.appendChild(mainSection);
    rewardsList.appendChild(div);
}

async function createReward() {
    const name = rewardNameInput.value.trim();
    const xpCost = rewardCostInput ? Number(rewardCostInput.value) : 0;

    if (!name || xpCost <= 0) {
        showRewardMessage("Введите корректное название и стоимость", "error");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/rewards/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_cost: xpCost })
        });

        if (!res.ok) {
            const error = await res.json();
            showRewardMessage(error.detail || "Ошибка создания", "error");
            return;
        }

        const created = await res.json();
        rewardNameInput.value = "";
        rewardCostInput.value = "10";
        allRewards.push(created);
        renderRewardCard(created);
        showRewardMessage(`✅ "${created.name}" создана!`, "success");
    } catch (e) {
        console.error("Error:", e);
        showRewardMessage("Ошибка соединения", "error");
    }
}

function openEditRewardModal(reward) {
    document.getElementById("edit-reward-id").value = reward.id;
    document.getElementById("edit-reward-name").value = reward.name;
    document.getElementById("edit-reward-cost").value = reward.xp_cost;
    document.getElementById("edit-reward-modal").classList.remove("hidden");
}

function closeEditRewardModal() {
    document.getElementById("edit-reward-modal").classList.add("hidden");
}

async function updateReward() {
    const id = document.getElementById("edit-reward-id").value;
    const name = document.getElementById("edit-reward-name").value.trim();
    const xpCost = Number(document.getElementById("edit-reward-cost").value) || 0;
    
    if (!name || xpCost <= 0) {
        alert("Введите корректное название и стоимость");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/rewards/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_cost: xpCost })
        });
        
        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Ошибка обновления");
            return;
        }
        
        closeEditRewardModal();
        await loadRewards();
        showRewardMessage("✅ Награда обновлена!", "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

async function deleteReward(rewardId, cardElement) {
    if (!confirm("Удалить награду?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/rewards/${rewardId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            alert("Ошибка удаления");
            return;
        }
        
        cardElement.style.transition = "all 0.3s ease";
        cardElement.style.opacity = "0";
        cardElement.style.transform = "translateX(-20px)";
        setTimeout(() => cardElement.remove(), 300);
        allRewards = allRewards.filter(r => r.id != rewardId);
        showRewardMessage("✅ Награда удалена!", "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

async function spendReward(rewardId) {
    if (!rewardMessage) return;
    
    rewardMessage.classList.remove("hidden", "text-red-500", "text-green-600");
    rewardMessage.classList.add("text-gray-500");
    rewardMessage.textContent = "Проверяем баланс...";
    
    try {
        const res = await fetch(`${API_BASE}/rewards/spend/${rewardId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            let errorMsg = data.detail || "Не удалось потратить XP";
            // Проверяем, это блокировка из черного списка
            if (res.status === 403) {
                errorMsg = `🚫 ${errorMsg}`;
            }
            rewardMessage.textContent = errorMsg;
            rewardMessage.classList.remove("text-gray-500");
            rewardMessage.classList.add("text-red-500");
            return;
        }
        
        rewardMessage.textContent = `✅ ${data.reward} получена! Минус ${data.spent} XP. Баланс: ${Math.round(data.new_balance)} XP`;
        rewardMessage.classList.remove("text-gray-500");
        rewardMessage.classList.add("text-green-600");
        await loadWallet();
        loadTodayStats(); // Обновляем статистику
    } catch (e) {
        console.error("Error:", e);
        rewardMessage.textContent = "Ошибка соединения. Проверьте сервер.";
        rewardMessage.classList.remove("text-gray-500");
        rewardMessage.classList.add("text-red-500");
    }
}

function showRewardMessage(text, type) {
    if (!rewardMessage) return;
    rewardMessage.textContent = text;
    rewardMessage.classList.remove("hidden", "text-red-500", "text-green-600", "text-gray-500");
    if (type === "error") {
        rewardMessage.classList.add("text-red-500");
    } else if (type === "success") {
        rewardMessage.classList.add("text-green-600");
    }
    setTimeout(() => rewardMessage.classList.add("hidden"), 4000);
}


// ============= INITIALIZATION =============
window.addEventListener("DOMContentLoaded", () => {
    // Сразу проверяем токен и скрываем auth-section если он есть
    if (authToken) {
        authSection.classList.add("hidden");
        appSection.classList.remove("hidden");
    }
    // Check auth on load
    checkAuth();

    // Login form
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        login(email, password);
    });

    // Register form
    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("register-email").value;
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;
        const passwordConfirm = document.getElementById("register-password-confirm").value;
        
        if (password !== passwordConfirm) {
            document.getElementById("register-error").textContent = "Пароли не совпадают";
            document.getElementById("register-error").classList.remove("hidden");
            return;
        }
        
        register(email, username, password);
    });

    // Activity form
    if (newActivityForm) {
        newActivityForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createActivity();
        });
    }

    // Reward form
    if (newRewardForm) {
        newRewardForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createReward();
        });
    }

    // Manual time form
    const manualForm = document.getElementById("manual-time-form");
    if (manualForm) {
        manualForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await addManualTime();
        });
        
        document.getElementById("manual-minutes").addEventListener("input", () => {
            const activityId = document.getElementById("manual-activity-select").value;
            updateManualPreview(activityId);
        });
        
        document.getElementById("manual-activity-select").addEventListener("change", (e) => {
            updateManualPreview(e.target.value);
        });
    }

    // Edit activity form
    const editForm = document.getElementById("edit-activity-form");
    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await updateActivity();
        });
    }

    // Edit reward form
    const editRewardForm = document.getElementById("edit-reward-form");
    if (editRewardForm) {
        editRewardForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await updateReward();
        });
    }

    // Create goal form
    const createGoalForm = document.getElementById("create-goal-form");
    if (createGoalForm) {
        createGoalForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await createGoal();
        });
    }
});

// ============= FORGOT PASSWORD =============
let resetCodeEmail = null;

function showForgotPassword() {
    document.getElementById("forgot-password-modal").classList.remove("hidden");
    document.getElementById("forgot-step1").classList.remove("hidden");
    document.getElementById("forgot-step2").classList.add("hidden");
    resetCodeEmail = null;
}

function closeForgotPassword() {
    document.getElementById("forgot-password-modal").classList.add("hidden");
    resetCodeEmail = null;
}

async function requestResetCode() {
    const email = document.getElementById("forgot-email").value.trim();
    const errorEl = document.getElementById("forgot-error1");
    
    if (!email) {
        errorEl.textContent = "Введите email";
        errorEl.classList.remove("hidden");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.detail || "Ошибка запроса");
        }
        
        // Сохраняем email для следующего шага
        resetCodeEmail = email;
        
        // Показываем код (только для разработки!)
        alert(`Код восстановления: ${data.code}\n\n(В продакшене код будет отправлен на email)`);
        
        // Переходим ко второму шагу
        document.getElementById("forgot-step1").classList.add("hidden");
        document.getElementById("forgot-step2").classList.remove("hidden");
        errorEl.classList.add("hidden");
        
    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove("hidden");
    }
}

async function resetPassword() {
    const code = document.getElementById("forgot-code").value.trim();
    const newPassword = document.getElementById("forgot-new-password").value;
    const confirmPassword = document.getElementById("forgot-confirm-password").value;
    const errorEl = document.getElementById("forgot-error2");
    const successEl = document.getElementById("forgot-success");
    
    errorEl.classList.add("hidden");
    successEl.classList.add("hidden");
    
    if (!code || code.length !== 6) {
        errorEl.textContent = "Введите 6-значный код";
        errorEl.classList.remove("hidden");
        return;
    }
    
    if (!newPassword || newPassword.length < 6) {
        errorEl.textContent = "Пароль должен быть минимум 6 символов";
        errorEl.classList.remove("hidden");
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorEl.textContent = "Пароли не совпадают";
        errorEl.classList.remove("hidden");
        return;
    }
    
    if (!resetCodeEmail) {
        errorEl.textContent = "Ошибка: email не найден";
        errorEl.classList.remove("hidden");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: resetCodeEmail,
                code: code,
                new_password: newPassword
            })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.detail || "Ошибка сброса пароля");
        }
        
        successEl.textContent = "✅ Пароль успешно изменён! Теперь войдите.";
        successEl.classList.remove("hidden");
        
        setTimeout(() => {
            closeForgotPassword();
            showLoginForm();
            document.getElementById("login-email").value = resetCodeEmail;
        }, 2000);
        
    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove("hidden");
    }
}

// ============= STREAK =============
async function loadStreak() {
    try {
        const res = await fetch(`${API_BASE}/streak/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const countEl = document.getElementById('streak-count');
        const recordEl = document.getElementById('streak-record');
        const messageEl = document.getElementById('streak-message');
        
        if (countEl) countEl.textContent = data.current_streak;
        if (recordEl) recordEl.textContent = data.longest_streak;
        
        if (messageEl) {
            if (data.current_streak === 0) {
                messageEl.textContent = "Начните активность, чтобы начать серию!";
            } else if (data.current_streak === 1) {
                messageEl.textContent = "🔥 Отличное начало! Продолжайте завтра!";
            } else if (data.current_streak < 7) {
                messageEl.textContent = `🔥 ${data.current_streak} дней подряд! Продолжайте!`;
            } else if (data.current_streak < 30) {
                messageEl.textContent = `🔥 Неделя подряд! Вы получаете бонусы XP!`;
            } else {
                messageEl.textContent = `🔥 Месяц без пропусков! Вы получаете +100 XP бонус!`;
            }
        }
    } catch (e) {
        console.error("Error loading streak", e);
    }
}

// ============= RECOMMENDATIONS =============
async function loadRecommendations() {
    try {
        const res = await fetch(`${API_BASE}/recommendations/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const listEl = document.getElementById('recommendations-list');
        if (!listEl) return;
        
        if (!data.recommendations || data.recommendations.length === 0) {
            listEl.innerHTML = '<div class="text-center text-gray-400 py-4">Нет рекомендаций. Продолжайте заниматься!</div>';
            return;
        }
        
        listEl.innerHTML = data.recommendations.map(rec => {
            let icon = "fas fa-lightbulb";
            let bgColor = "bg-blue-50";
            let borderColor = "border-blue-200";
            let textColor = "text-blue-700";
            
            if (rec.priority === "high") {
                icon = "fas fa-fire";
                bgColor = "bg-orange-50";
                borderColor = "border-orange-300";
                textColor = "text-orange-700";
            } else if (rec.priority === "medium") {
                icon = "fas fa-exclamation-circle";
                bgColor = "bg-amber-50";
                borderColor = "border-amber-200";
                textColor = "text-amber-700";
            }
            
            let actionBtn = '';
            if (rec.activity_id) {
                actionBtn = `<button onclick="startActivityFromRecommendation(${rec.activity_id})" class="ml-auto px-2 py-1 rounded ${bgColor} ${textColor} text-[10px] font-medium hover:opacity-80 transition-all flex-shrink-0" title="Начать">
                    <i class="fas fa-play"></i>
                </button>`;
            }
            
            return `
                <div class="flex items-center gap-2 p-2 rounded-lg ${bgColor} border ${borderColor} transition-all hover:scale-[1.01]">
                    <div class="w-6 h-6 rounded ${bgColor} flex items-center justify-center flex-shrink-0">
                        <i class="${icon} ${textColor} text-xs"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium ${textColor} text-xs">${rec.message}</div>
                    </div>
                    ${actionBtn}
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading recommendations", e);
    }
}

function startActivityFromRecommendation(activityId) {
    // Находим кнопку старта для этой активности
    const activityCard = document.querySelector(`[data-activity-id="${activityId}"]`);
    if (activityCard) {
        const startBtn = activityCard.querySelector('.timer-btn');
        if (startBtn) {
            startBtn.click();
        }
    }
}

// ============= ADMIN PANEL =============
async function loadInviteCode() {
    try {
        const res = await fetch(`${API_BASE}/admin/invite-code`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const baseUrl = window.location.origin + window.location.pathname;
        const inviteLink = `${baseUrl}?invite=${data.invite_code}`;
        document.getElementById("invite-link").value = inviteLink;
    } catch (e) {
        console.error("Error loading invite code:", e);
    }
}

function showAdminPanel() {
    document.getElementById("admin-panel").classList.remove("hidden");
    loadChildren();
    loadInviteCode();
}

function hideAdminPanel() {
    document.getElementById("admin-panel").classList.add("hidden");
}

function copyInviteLink() {
    const input = document.getElementById("invite-link");
    input.select();
    document.execCommand("copy");
    
    const btn = event.target.closest("button");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
    btn.classList.add("bg-green-500", "hover:bg-green-600");
    btn.classList.remove("bg-blue-500", "hover:bg-blue-600");
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove("bg-green-500", "hover:bg-green-600");
        btn.classList.add("bg-blue-500", "hover:bg-blue-600");
    }, 2000);
}

async function loadChildren() {
    try {
        const res = await fetch(`${API_BASE}/admin/children`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) {
            document.getElementById("children-list").innerHTML = '<div class="text-center text-gray-400 py-4">Ошибка загрузки</div>';
            return;
        }
        
        const children = await res.json();
        const listEl = document.getElementById("children-list");
        
        if (children.length === 0) {
            listEl.innerHTML = '<div class="text-center text-gray-400 py-4">Нет подопечных. Отправьте ссылку для регистрации.</div>';
            return;
        }
        
        listEl.innerHTML = children.map(child => `
            <div class="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-bold text-gray-800">${child.username}</div>
                        <div class="text-sm text-gray-500">${child.email}</div>
                    </div>
                    <button onclick="showChildStats(${child.id}, '${child.username}')" 
                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all">
                        <i class="fas fa-chart-line mr-2"></i>Статистика
                    </button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error loading children:", e);
        document.getElementById("children-list").innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки</div>';
    }
}

async function showChildStats(childId, childName) {
    document.getElementById("child-stats-modal").classList.remove("hidden");
    document.getElementById("child-stats-name").textContent = `Статистика: ${childName}`;
    document.getElementById("child-stats-content").innerHTML = '<div class="text-center text-gray-400 py-8">Загрузка...</div>';
    
    try {
        // Загружаем статистику
        const [statsRes, historyRes, activitiesRes, goalsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/child/${childId}/stats`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/history?limit=20`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/activities`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/goals`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            })
        ]);
        
        if (!statsRes.ok) throw new Error("Ошибка загрузки статистики");
        
        const stats = await statsRes.json();
        const history = historyRes.ok ? await historyRes.json() : [];
        const activities = activitiesRes.ok ? await activitiesRes.json() : [];
        const goals = goalsRes.ok ? await goalsRes.json() : [];
        
        const contentEl = document.getElementById("child-stats-content");
        contentEl.innerHTML = `
            <!-- Основная статистика -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${Math.round(stats.balance)}</div>
                    <div class="text-sm opacity-90">Баланс XP</div>
                </div>
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${stats.level}</div>
                    <div class="text-sm opacity-90">Уровень</div>
                </div>
                <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${stats.current_streak}</div>
                    <div class="text-sm opacity-90">Серия дней</div>
                </div>
                <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${stats.activities_count}</div>
                    <div class="text-sm opacity-90">Активностей</div>
                </div>
            </div>
            
            <!-- Детальная статистика -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-xl p-4">
                    <h4 class="font-bold text-gray-800 mb-3">📊 Общая статистика</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Всего заработано:</span>
                            <span class="font-bold text-green-600">${Math.round(stats.total_earned)} XP</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Всего потрачено:</span>
                            <span class="font-bold text-red-600">${Math.round(stats.total_spent)} XP</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Рекорд серии:</span>
                            <span class="font-bold">${stats.longest_streak} дней</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Дней активности:</span>
                            <span class="font-bold">${stats.total_days_active}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-4">
                    <h4 class="font-bold text-gray-800 mb-3">📅 Сегодня</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Заработано:</span>
                            <span class="font-bold text-green-600">${Math.round(stats.today_earned)} XP</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Время:</span>
                            <span class="font-bold">${Math.round(stats.today_time)} минут</span>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">За неделю:</span>
                            <span class="font-bold text-green-600">${Math.round(stats.week_earned)} XP</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- История -->
            <div class="mb-4">
                <h4 class="font-bold text-gray-800 mb-3">📜 Последние транзакции</h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${history.length > 0 ? history.map(item => {
                        const date = new Date(item.date);
                        const isEarn = item.type === 'earn';
                        return `
                            <div class="flex items-center justify-between p-3 rounded-lg ${isEarn ? 'bg-emerald-50' : 'bg-red-50'}">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg flex items-center justify-center ${isEarn ? 'bg-emerald-500' : 'bg-red-500'}">
                                        <i class="fas ${isEarn ? 'fa-arrow-up' : 'fa-arrow-down'} text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-800 text-sm">${item.description}</div>
                                        <div class="text-xs text-gray-500">${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                                <div class="font-bold ${isEarn ? 'text-emerald-600' : 'text-red-600'}">
                                    ${isEarn ? '+' : '-'}${Math.round(item.amount)} XP
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="text-center text-gray-400 py-4">История пуста</div>'}
                </div>
            </div>
            
            <!-- Активности -->
            <div class="mb-4">
                <h4 class="font-bold text-gray-800 mb-3">🎯 Активности</h4>
                <div class="grid grid-cols-2 gap-2">
                    ${activities.length > 0 ? activities.map(act => `
                        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div class="font-medium text-gray-800 text-sm">${act.name}</div>
                            <div class="text-xs text-gray-600">${act.xp_per_hour} XP/час</div>
                        </div>
                    `).join('') : '<div class="text-gray-400 text-sm">Нет активностей</div>'}
                </div>
            </div>
            
            <!-- Цели -->
            <div>
                <h4 class="font-bold text-gray-800 mb-3">🎯 Цели</h4>
                <div class="space-y-2">
                    ${goals.length > 0 ? goals.map(goal => {
                        const progressPercent = Math.min(goal.progress_percent, 100);
                        const isCompleted = goal.is_completed === 1;
                        return `
                            <div class="p-3 bg-purple-50 rounded-lg border ${isCompleted ? 'border-green-300' : 'border-purple-200'}">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="font-medium text-gray-800 text-sm">${goal.title}</div>
                                    ${isCompleted ? '<span class="text-green-600 text-xs">✓ Выполнено</span>' : ''}
                                </div>
                                <div class="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>${Math.round(goal.current_xp)} / ${Math.round(goal.target_xp)} XP</span>
                                    <span>${Math.round(progressPercent)}%</span>
                                </div>
                                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}" 
                                         style="width: ${progressPercent}%"></div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="text-gray-400 text-sm">Нет целей</div>'}
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Error loading child stats:", e);
        document.getElementById("child-stats-content").innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки статистики</div>';
    }
}

function closeChildStats() {
    document.getElementById("child-stats-modal").classList.add("hidden");
}

// ============= GOALS =============
async function loadGoals() {
    try {
        const res = await fetch(`${API_BASE}/goals/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const listEl = document.getElementById('goals-list');
        if (!listEl) return;
        
        if (data.length === 0) {
            listEl.innerHTML = '<div class="text-center text-gray-400 py-4">Нет целей. Создайте первую цель!</div>';
            return;
        }
        
        listEl.innerHTML = data.map(goal => {
            const progressPercent = Math.min(goal.progress_percent, 100);
            const isCompleted = goal.is_completed === 1;
            const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;
            
            return `
                <div class="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 ${isCompleted ? 'border-green-400 bg-green-50' : 'border-purple-300'} hover:shadow-md transition-all">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                                <h4 class="font-bold text-gray-800 text-sm">${goal.title}</h4>
                                ${isCompleted ? '<span class="px-1.5 py-0.5 bg-green-500 text-white text-[10px] rounded-full flex-shrink-0">✓ Выполнено</span>' : ''}
                            </div>
                            ${goal.activity_name ? `
                                <div class="flex items-center gap-1 mb-1">
                                    <i class="fas fa-tag text-purple-600 text-xs"></i>
                                    <span class="text-xs text-purple-700 font-medium">${goal.activity_name}</span>
                                </div>
                            ` : ''}
                            ${goal.target_date ? `
                                <div class="flex items-center gap-1 mb-1">
                                    <i class="fas fa-calendar text-gray-500 text-xs"></i>
                                    <span class="text-[10px] text-gray-600">
                                        ${new Date(goal.target_date).toLocaleDateString('ru-RU')} 
                                        ${daysLeft !== null ? (daysLeft > 0 ? `(${daysLeft} дн.)` : daysLeft === 0 ? '(Сегодня!)' : '(Просрочено)') : ''}
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="flex gap-1 flex-shrink-0 ml-2">
                            ${!isCompleted ? `
                                <button onclick="editGoal(${goal.id})" class="w-6 h-6 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-all" title="Редактировать">
                                    <i class="fas fa-edit text-[10px]"></i>
                                </button>
                                <button onclick="deleteGoal(${goal.id})" class="w-6 h-6 rounded bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all" title="Удалить">
                                    <i class="fas fa-trash text-[10px]"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="mb-1">
                        <div class="flex justify-between text-[10px] mb-1">
                            <span class="text-gray-600 font-medium">${Math.round(goal.current_xp)} / ${Math.round(goal.target_xp)} XP</span>
                            <span class="font-bold text-purple-600">${Math.round(progressPercent)}%</span>
                        </div>
                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
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
    document.getElementById("goal-modal-title").textContent = "🎯 Новая цель";
    document.getElementById("goal-submit-btn").innerHTML = '<i class="fas fa-check mr-2"></i>Создать цель';
    document.getElementById("edit-goal-id").value = "";
    document.getElementById("create-goal-modal").classList.remove("hidden");
    // Загружаем список активностей для выбора
    loadActivitiesForGoal();
    // Очищаем форму
    document.getElementById("create-goal-form").reset();
}

function closeCreateGoalModal() {
    document.getElementById("create-goal-modal").classList.add("hidden");
    document.getElementById("create-goal-form").reset();
    document.getElementById("edit-goal-id").value = "";
}

async function editGoal(goalId) {
    try {
        // Загружаем данные цели
        const res = await fetch(`${API_BASE}/goals/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) {
            alert("Ошибка загрузки целей");
            return;
        }
        const goals = await res.json();
        const goal = goals.find(g => g.id === goalId);
        
        if (!goal) {
            alert("Цель не найдена");
            return;
        }
        
        if (goal.is_completed === 1) {
            alert("Нельзя редактировать выполненную цель");
            return;
        }
        
        // Заполняем форму данными цели
        document.getElementById("edit-goal-id").value = goal.id;
        document.getElementById("goal-title").value = goal.title;
        document.getElementById("goal-description").value = goal.description || "";
        document.getElementById("goal-target-xp").value = goal.target_xp;
        document.getElementById("goal-target-date").value = goal.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : "";
        
        // Загружаем активности и выбираем нужную
        await loadActivitiesForGoal();
        if (goal.activity_id) {
            document.getElementById("goal-activity").value = goal.activity_id;
        }
        
        // Меняем заголовок и кнопку
        document.getElementById("goal-modal-title").textContent = "✏️ Редактировать цель";
        document.getElementById("goal-submit-btn").innerHTML = '<i class="fas fa-save mr-2"></i>Сохранить изменения';
        
        // Открываем модальное окно
        document.getElementById("create-goal-modal").classList.remove("hidden");
    } catch (e) {
        console.error("Error loading goal for edit:", e);
        alert("Ошибка загрузки цели: " + e.message);
    }
}

async function loadActivitiesForGoal() {
    try {
        const res = await fetch(`${API_BASE}/activities/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
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
        
        select.innerHTML = '<option value="">-- Выберите активность --</option>';
        
        if (data.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Сначала создайте активность";
            option.disabled = true;
            select.appendChild(option);
            return;
        }
        
        data.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.id;
            option.textContent = `${activity.name} (${activity.xp_per_hour} XP/час)`;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Error loading activities for goal:", e);
        alert("Ошибка загрузки активностей: " + e.message);
    }
}

async function createGoal() {
    const goalId = document.getElementById("edit-goal-id").value;
    const title = document.getElementById("goal-title").value.trim();
    const description = document.getElementById("goal-description").value.trim();
    const targetXp = parseFloat(document.getElementById("goal-target-xp").value);
    const activityId = document.getElementById("goal-activity").value;
    const targetDate = document.getElementById("goal-target-date").value;
    
    if (!title || !targetXp || targetXp <= 0) {
        alert("Заполните название и целевое количество XP");
        return;
    }
    
    if (!activityId) {
        alert("Пожалуйста, выберите активность для цели");
        return;
    }
    
    try {
        // Если есть ID - это редактирование, иначе - создание
        if (goalId) {
            // Редактирование
            const res = await fetch(`${API_BASE}/goals/${goalId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
                    activity_id: activityId ? parseInt(activityId) : null,
                    target_date: targetDate ? new Date(targetDate).toISOString() : null
                })
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Ошибка обновления цели");
            }
            
            closeCreateGoalModal();
            loadGoals();
            alert("✅ Цель обновлена!");
        } else {
            // Создание
            const res = await fetch(`${API_BASE}/goals/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
                    activity_id: activityId ? parseInt(activityId) : null,
                    target_date: targetDate ? new Date(targetDate).toISOString() : null
                })
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Ошибка создания цели");
            }
            
            closeCreateGoalModal();
            loadGoals();
            alert("✅ Цель создана!");
        }
    } catch (e) {
        alert("Ошибка: " + e.message);
    }
}

async function deleteGoal(goalId) {
    if (!confirm("Удалить эту цель?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/goals/${goalId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Ошибка удаления");
        
        loadGoals();
    } catch (e) {
        alert("Ошибка удаления цели");
    }
}

async function editGoal(goalId) {
    // Пока просто удаляем и предлагаем создать заново
    // Можно добавить модальное окно редактирования позже
    alert("Редактирование целей будет добавлено позже. Пока можно удалить и создать заново.");
}
