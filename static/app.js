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
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username: username || null })
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
        
    } catch (e) {
        console.error("Error loading user:", e);
        logout();
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
}

async function checkAuth() {
    if (!authToken) {
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
                <div class="flex items-center justify-between p-3 rounded-xl ${isEarn ? 'bg-emerald-50' : 'bg-red-50'} transition-all hover:scale-[1.01]">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-lg flex items-center justify-center ${isEarn ? 'bg-emerald-500' : 'bg-red-500'}">
                            <i class="fas ${isEarn ? 'fa-arrow-up' : 'fa-arrow-down'} text-white text-sm"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800 text-sm">${item.description}</div>
                            <div class="text-xs text-gray-500">${dateStr} в ${timeStr}${item.duration_minutes ? ` • ${Math.round(item.duration_minutes)} мин` : ''}</div>
                        </div>
                    </div>
                    <div class="font-bold ${isEarn ? 'text-emerald-600' : 'text-red-600'}">
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
        alert(`✅ Таймер остановлен! Заработано ${Math.round(data.xp_earned)} XP`);
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
    div.className = `reward-card group relative p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white border-2 ${brand.borderColor} hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center gap-3`;

    // Левая часть
    const left = document.createElement("div");
    left.className = "flex items-center gap-3 flex-1 min-w-0";
    
    // Иконка бренда
    const icon = document.createElement("div");
    icon.className = `w-11 h-11 ${brand.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`;
    
    if (brand.iconType === "text") {
        icon.innerHTML = `<span class="${brand.textColor} font-black text-lg">${brand.icon}</span>`;
    } else {
        icon.innerHTML = `<i class="${brand.icon} ${brand.textColor} text-lg"></i>`;
    }
    
    // Текст
    const text = document.createElement("div");
    text.className = "flex-1 overflow-hidden";
    text.innerHTML = `
        <div class="font-bold text-gray-800 text-sm leading-tight" style="word-break: break-word;">${reward.name}</div>
        <div class="flex items-center gap-1 mt-1">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                <i class="fas fa-coins text-[10px]"></i> ${reward.xp_cost}
            </span>
        </div>
    `;
    
    left.appendChild(icon);
    left.appendChild(text);

    // Кнопки
    const btnContainer = document.createElement("div");
    btnContainer.className = "flex items-center gap-1.5 flex-shrink-0";

    // Кнопка покупки
    const spendBtn = document.createElement("button");
    spendBtn.className = "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 hover:scale-105 active:scale-95";
    spendBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Купить';
    spendBtn.addEventListener("click", () => spendReward(reward.id));
    btnContainer.appendChild(spendBtn);

    // Кнопки редактирования (только для своих наград)
    if (reward.user_id) {
        const actionsWrapper = document.createElement("div");
        actionsWrapper.className = "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity";
        
        const editBtn = document.createElement("button");
        editBtn.className = "w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-500 text-gray-400 hover:text-white transition-all flex items-center justify-center";
        editBtn.innerHTML = '<i class="fas fa-pen text-xs"></i>';
        editBtn.title = "Редактировать";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openEditRewardModal(reward);
        });
        actionsWrapper.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-500 text-gray-400 hover:text-white transition-all flex items-center justify-center";
        deleteBtn.innerHTML = '<i class="fas fa-trash text-xs"></i>';
        deleteBtn.title = "Удалить";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteReward(reward.id, div);
        });
        actionsWrapper.appendChild(deleteBtn);
        
        btnContainer.appendChild(actionsWrapper);
    }

    div.appendChild(left);
    div.appendChild(btnContainer);
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
            rewardMessage.textContent = data.detail || "Не удалось потратить XP";
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
});
