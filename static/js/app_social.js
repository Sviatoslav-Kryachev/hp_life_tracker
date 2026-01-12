// ============= SOCIAL FEATURES =============

// Определяем API_URL если он не определен (используем API_BASE из app.js)
if (typeof API_URL === 'undefined') {
    var API_URL = typeof API_BASE !== 'undefined' ? API_BASE : window.location.origin;
}

// ============= GROUPS =============

let myGroups = [];

async function loadGroups() {
    try {
        const res = await fetch(`${API_URL}/groups/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error("Ошибка загрузки групп");
        myGroups = await res.json();
        renderGroups();
        updateGroupSelects();
    } catch (e) {
        console.error("Error loading groups:", e);
        document.getElementById('groups-list').innerHTML = '<div class="text-center text-red-500 py-4">Ошибка загрузки групп</div>';
    }
}

function renderGroups() {
    const container = document.getElementById('groups-list');
    if (!container) return;
    
    if (myGroups.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-4">У вас пока нет групп. Создайте или присоединитесь к группе!</div>';
        return;
    }
    
    container.innerHTML = myGroups.map(group => `
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 mb-1">${escapeHtml(group.name)}</h3>
                    ${group.description ? `<p class="text-sm text-gray-600 mb-2">${escapeHtml(group.description)}</p>` : ''}
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span><i class="fas fa-users mr-1"></i>${group.member_count} участников</span>
                        <span class="px-2 py-1 rounded-full ${group.my_role === 'owner' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}">${group.my_role === 'owner' ? 'Владелец' : 'Участник'}</span>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 mt-3">
                <button onclick="viewGroupMembers(${group.id})" class="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-all border border-gray-200">
                    <i class="fas fa-users mr-1"></i>Участники
                </button>
                <button onclick="viewGroupLeaderboard(${group.id})" class="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-all border border-gray-200">
                    <i class="fas fa-trophy mr-1"></i>Рейтинг
                </button>
                ${group.my_role === 'owner' ? `
                    <button onclick="copyInviteCode('${group.invite_code}')" class="bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-all border border-gray-200" title="Код: ${group.invite_code}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="deleteGroup(${group.id})" class="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-all border border-red-200">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : `
                    <button onclick="leaveGroup(${group.id})" class="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-all border border-red-200">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

function openCreateGroupModal() {
    document.getElementById('create-group-modal').classList.remove('hidden');
    document.getElementById('group-name').value = '';
    document.getElementById('group-description').value = '';
    document.getElementById('create-group-error').classList.add('hidden');
}

function closeCreateGroupModal() {
    document.getElementById('create-group-modal').classList.add('hidden');
}

async function createGroup(e) {
    e.preventDefault();
    const name = document.getElementById('group-name').value.trim();
    const description = document.getElementById('group-description').value.trim();
    const errorEl = document.getElementById('create-group-error');
    
    if (!name) {
        errorEl.textContent = 'Введите название группы';
        errorEl.classList.remove('hidden');
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/groups/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, description: description || null })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || "Ошибка создания группы");
        }
        
        closeCreateGroupModal();
        await loadGroups();
        showMessage('Группа создана!', 'success');
    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove('hidden');
    }
}

function openJoinGroupModal() {
    document.getElementById('join-group-modal').classList.remove('hidden');
    document.getElementById('group-invite-code').value = '';
    document.getElementById('join-group-error').classList.add('hidden');
}

function closeJoinGroupModal() {
    document.getElementById('join-group-modal').classList.add('hidden');
}

async function joinGroup(e) {
    e.preventDefault();
    const inviteCode = document.getElementById('group-invite-code').value.trim().toUpperCase();
    const errorEl = document.getElementById('join-group-error');
    
    if (!inviteCode) {
        errorEl.textContent = 'Введите код приглашения';
        errorEl.classList.remove('hidden');
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/groups/join`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ invite_code: inviteCode })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || "Ошибка присоединения");
        }
        
        closeJoinGroupModal();
        await loadGroups();
        showMessage('Вы присоединились к группе!', 'success');
    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove('hidden');
    }
}

async function leaveGroup(groupId) {
    if (!confirm('Вы уверены, что хотите покинуть группу?')) return;
    
    try {
        const res = await fetch(`${API_URL}/groups/${groupId}/leave`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Ошибка");
        
        await loadGroups();
        showMessage('Вы покинули группу', 'success');
    } catch (e) {
        showMessage('Ошибка при выходе из группы', 'error');
    }
}

async function deleteGroup(groupId) {
    if (!confirm('Вы уверены, что хотите удалить группу? Это действие нельзя отменить.')) return;
    
    try {
        const res = await fetch(`${API_URL}/groups/${groupId}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Ошибка");
        
        await loadGroups();
        showMessage('Группа удалена', 'success');
    } catch (e) {
        showMessage('Ошибка при удалении группы', 'error');
    }
}

function copyInviteCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showMessage('Код скопирован!', 'success');
    });
}

async function viewGroupMembers(groupId) {
    try {
        const res = await fetch(`${API_URL}/groups/${groupId}/members`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error("Ошибка");
        const members = await res.json();
        
        const membersHtml = members.map(m => `
            <div class="bg-white rounded-lg p-3 border border-gray-200">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-medium text-gray-800">${escapeHtml(m.username)}</div>
                        <div class="text-xs text-gray-500">${escapeHtml(m.email)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-indigo-600">${Math.round(m.balance)} XP</div>
                        <div class="text-xs text-gray-500">Уровень ${m.level}</div>
                    </div>
                </div>
                <div class="mt-2 flex gap-4 text-xs text-gray-500">
                    <span><i class="fas fa-fire mr-1"></i>${m.current_streak} дней</span>
                    <span><i class="fas fa-coins mr-1"></i>${Math.round(m.total_earned)} XP всего</span>
                </div>
            </div>
        `).join('');
        
        alert(`Участники группы:\n\n${members.map(m => `${m.username} - ${Math.round(m.balance)} XP (Уровень ${m.level})`).join('\n')}`);
    } catch (e) {
        showMessage('Ошибка загрузки участников', 'error');
    }
}

function viewGroupLeaderboard(groupId) {
    document.getElementById('leaderboard-group-select').value = groupId;
    loadLeaderboard();
    // Прокручиваем к лидерборду
    document.getElementById('social').scrollIntoView({ behavior: 'smooth' });
}

function updateGroupSelects() {
    const leaderboardSelect = document.getElementById('leaderboard-group-select');
    const achievementsSelect = document.getElementById('achievements-group-select');
    const challengeSelect = document.getElementById('challenge-group-select');
    
    if (leaderboardSelect) {
        const currentValue = leaderboardSelect.value;
        leaderboardSelect.innerHTML = '<option value="global">Глобальный</option>' + 
            myGroups.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('');
        if (currentValue && currentValue !== 'global') {
            leaderboardSelect.value = currentValue;
        }
    }
    
    if (achievementsSelect) {
        const currentValue = achievementsSelect.value;
        achievementsSelect.innerHTML = '<option value="my">Мои достижения</option>' + 
            myGroups.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('');
        if (currentValue && currentValue !== 'my') {
            achievementsSelect.value = currentValue;
        }
    }
    
    if (challengeSelect) {
        challengeSelect.innerHTML = '<option value="">Глобальный челлендж</option>' + 
            myGroups.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('');
    }
}

// ============= LEADERBOARD =============

async function loadLeaderboard() {
    const groupSelect = document.getElementById('leaderboard-group-select');
    const sortSelect = document.getElementById('leaderboard-sort-select');
    const groupId = groupSelect?.value;
    const sortBy = sortSelect?.value || 'balance';
    const container = document.getElementById('leaderboard-list');
    
    if (!container) return;
    
    try {
        let url = `${API_URL}/leaderboard/`;
        if (groupId && groupId !== 'global') {
            url = `${API_URL}/leaderboard/group/${groupId}?sort_by=${sortBy}`;
        } else {
            url = `${API_URL}/leaderboard/global?sort_by=${sortBy}&limit=50`;
        }
        
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Ошибка загрузки");
        const leaderboard = await res.json();
        
        if (leaderboard.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400 py-4">Нет данных</div>';
            return;
        }
        
        container.innerHTML = leaderboard.map((entry, idx) => {
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            return `
                <div class="bg-gradient-to-r ${idx < 3 ? 'from-yellow-50 to-amber-50 border-yellow-200' : 'from-gray-50 to-gray-100 border-gray-200'} rounded-lg p-3 border">
                    <div class="flex items-center gap-3">
                        <div class="text-2xl font-bold ${idx < 3 ? 'text-yellow-600' : 'text-gray-400'} w-8 text-center">${medal || entry.rank}</div>
                        <div class="flex-1">
                            <div class="font-medium text-gray-800">${escapeHtml(entry.username)}</div>
                            <div class="text-xs text-gray-500 flex gap-3 mt-1">
                                <span><i class="fas fa-coins mr-1"></i>${Math.round(entry.balance)} XP</span>
                                <span><i class="fas fa-star mr-1"></i>Ур. ${entry.level}</span>
                                <span><i class="fas fa-fire mr-1"></i>${entry.current_streak} дней</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm font-bold text-indigo-600">${getSortValue(entry, sortBy)}</div>
                            <div class="text-xs text-gray-500">${getSortLabel(sortBy)}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading leaderboard:", e);
        container.innerHTML = '<div class="text-center text-red-500 py-4">Ошибка загрузки</div>';
    }
}

function getSortValue(entry, sortBy) {
    switch(sortBy) {
        case 'balance': return Math.round(entry.balance) + ' XP';
        case 'level': return 'Ур. ' + entry.level;
        case 'total_earned': return Math.round(entry.total_earned) + ' XP';
        case 'streak': return entry.current_streak + ' дней';
        case 'today_xp': return Math.round(entry.today_xp) + ' XP';
        case 'week_xp': return Math.round(entry.week_xp) + ' XP';
        case 'month_xp': return Math.round(entry.month_xp) + ' XP';
        default: return Math.round(entry.balance) + ' XP';
    }
}

function getSortLabel(sortBy) {
    const labels = {
        'balance': 'Баланс',
        'level': 'Уровень',
        'total_earned': 'Всего',
        'streak': 'Серия',
        'today_xp': 'Сегодня',
        'week_xp': 'Неделя',
        'month_xp': 'Месяц'
    };
    return labels[sortBy] || 'Баланс';
}

// ============= CHALLENGES =============

let myChallenges = [];

async function loadChallenges() {
    try {
        const res = await fetch(`${API_URL}/challenges/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error("Ошибка загрузки");
        myChallenges = await res.json();
        renderChallenges();
    } catch (e) {
        console.error("Error loading challenges:", e);
        const container = document.getElementById('challenges-list');
        if (container) {
            container.innerHTML = '<div class="text-center text-red-500 py-4">Ошибка загрузки</div>';
        }
    }
}

function renderChallenges() {
    const container = document.getElementById('challenges-list');
    if (!container) return;
    
    if (myChallenges.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-4">У вас пока нет челленджей. Создайте новый!</div>';
        return;
    }
    
    const now = new Date();
    container.innerHTML = myChallenges.map(challenge => {
        const startDate = new Date(challenge.start_date);
        const endDate = new Date(challenge.end_date);
        const isActive = now >= startDate && now <= endDate;
        const isUpcoming = now < startDate;
        const isFinished = now > endDate;
        const progress = challenge.target_xp > 0 ? Math.min(100, (challenge.my_progress / challenge.target_xp * 100)) : 0;
        
        return `
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800 mb-1">${escapeHtml(challenge.title)}</h3>
                        ${challenge.description ? `<p class="text-sm text-gray-600 mb-2">${escapeHtml(challenge.description)}</p>` : ''}
                        <div class="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span><i class="fas fa-users mr-1"></i>${challenge.participant_count} участников</span>
                            <span class="px-2 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : isUpcoming ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}">
                                ${isActive ? 'Активен' : isUpcoming ? 'Скоро' : 'Завершен'}
                            </span>
                        </div>
                        <div class="text-xs text-gray-500">
                            ${formatDate(startDate)} - ${formatDate(endDate)}
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">Прогресс</span>
                        <span class="font-bold ${challenge.my_completed ? 'text-green-600' : 'text-purple-600'}">
                            ${Math.round(challenge.my_progress)} / ${Math.round(challenge.target_xp)} ${getChallengeUnit(challenge.challenge_type)}
                        </span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style="width: ${progress}%"></div>
                    </div>
                    ${challenge.my_completed ? '<div class="text-xs text-green-600 mt-1"><i class="fas fa-check-circle mr-1"></i>Выполнено!</div>' : ''}
                </div>
                <button onclick="viewChallengeParticipants(${challenge.id})" class="mt-3 w-full bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-all border border-gray-200">
                    <i class="fas fa-users mr-1"></i>Участники
                </button>
            </div>
        `;
    }).join('');
}

function getChallengeUnit(type) {
    switch(type) {
        case 'xp': return 'XP';
        case 'time': return 'мин';
        case 'streak': return 'дней';
        default: return '';
    }
}

function openCreateChallengeModal() {
    document.getElementById('create-challenge-modal').classList.remove('hidden');
    document.getElementById('create-challenge-error').classList.add('hidden');
    
    // Устанавливаем даты по умолчанию
    const now = new Date();
    const startDate = new Date(now.getTime() + 60 * 60 * 1000); // Через час
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Через неделю
    
    document.getElementById('challenge-start-date').value = formatDateTimeLocal(startDate);
    document.getElementById('challenge-end-date').value = formatDateTimeLocal(endDate);
}

function closeCreateChallengeModal() {
    document.getElementById('create-challenge-modal').classList.add('hidden');
}

function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

async function createChallenge(e) {
    e.preventDefault();
    const title = document.getElementById('challenge-title').value.trim();
    const description = document.getElementById('challenge-description').value.trim();
    const groupId = document.getElementById('challenge-group-select').value;
    const challengeType = document.getElementById('challenge-type').value;
    const targetXp = parseFloat(document.getElementById('challenge-target').value);
    const startDate = new Date(document.getElementById('challenge-start-date').value);
    const endDate = new Date(document.getElementById('challenge-end-date').value);
    const rewardXp = parseFloat(document.getElementById('challenge-reward-xp').value) || 0;
    const errorEl = document.getElementById('create-challenge-error');
    
    if (!title || !targetXp || targetXp <= 0) {
        errorEl.textContent = 'Заполните все обязательные поля';
        errorEl.classList.remove('hidden');
        return;
    }
    
    if (startDate >= endDate) {
        errorEl.textContent = 'Дата окончания должна быть позже даты начала';
        errorEl.classList.remove('hidden');
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/challenges/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description: description || null,
                group_id: groupId ? parseInt(groupId) : null,
                challenge_type: challengeType,
                target_xp: targetXp,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                reward_xp: rewardXp
            })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || "Ошибка создания челленджа");
        }
        
        closeCreateChallengeModal();
        await loadChallenges();
        showMessage('Челлендж создан!', 'success');
    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove('hidden');
    }
}

async function viewChallengeParticipants(challengeId) {
    try {
        const res = await fetch(`${API_URL}/challenges/${challengeId}/participants`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error("Ошибка");
        const participants = await res.json();
        
        const participantsHtml = participants.map((p, idx) => `
            <div class="bg-white rounded-lg p-3 border border-gray-200">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="text-lg font-bold ${idx < 3 ? 'text-yellow-600' : 'text-gray-400'}">${idx + 1}</div>
                        <div>
                            <div class="font-medium text-gray-800">${escapeHtml(p.username)}</div>
                            <div class="text-xs text-gray-500">${Math.round(p.progress_percent)}% выполнено</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold ${p.is_completed ? 'text-green-600' : 'text-purple-600'}">
                            ${Math.round(p.current_progress)} ${getChallengeUnitFromChallenge(challengeId)}
                        </div>
                        ${p.is_completed ? '<div class="text-xs text-green-600"><i class="fas fa-check-circle"></i></div>' : ''}
                    </div>
                </div>
                <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style="width: ${p.progress_percent}%"></div>
                </div>
            </div>
        `).join('');
        
        alert(`Участники челленджа:\n\n${participants.map((p, idx) => `${idx + 1}. ${p.username} - ${Math.round(p.current_progress)} (${Math.round(p.progress_percent)}%)`).join('\n')}`);
    } catch (e) {
        showMessage('Ошибка загрузки участников', 'error');
    }
}

function getChallengeUnitFromChallenge(challengeId) {
    const challenge = myChallenges.find(c => c.id === challengeId);
    return challenge ? getChallengeUnit(challenge.challenge_type) : '';
}

// ============= ACHIEVEMENTS =============

let myAchievements = [];

async function loadAchievements() {
    const groupSelect = document.getElementById('achievements-group-select');
    const groupId = groupSelect?.value;
    const container = document.getElementById('achievements-list');
    
    if (!container) return;
    
    try {
        let url = `${API_URL}/achievements/`;
        if (groupId && groupId !== 'my') {
            url = `${API_URL}/achievements/group/${groupId}`;
        }
        
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Ошибка загрузки");
        const achievements = await res.json();
        
        if (achievements.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400 py-4">Нет достижений</div>';
            return;
        }
        
        container.innerHTML = achievements.map(ach => `
            <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
                <div class="flex items-start gap-3">
                    <div class="text-3xl">${ach.icon || '🏆'}</div>
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800 mb-1">${escapeHtml(ach.title)}</h3>
                        ${ach.description ? `<p class="text-sm text-gray-600 mb-2">${escapeHtml(ach.description)}</p>` : ''}
                        <div class="text-xs text-gray-500">
                            Получено: ${formatDate(ach.earned_at)}
                            ${ach.is_shared ? '<span class="ml-2 text-green-600"><i class="fas fa-share-alt mr-1"></i>Опубликовано</span>' : ''}
                        </div>
                        ${groupId === 'my' ? `
                            <button onclick="toggleAchievementShare(${ach.id}, ${ach.is_shared})" class="mt-2 text-xs ${ach.is_shared ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}">
                                <i class="fas fa-${ach.is_shared ? 'eye-slash' : 'share-alt'} mr-1"></i>
                                ${ach.is_shared ? 'Скрыть' : 'Поделиться'}
                            </button>
                        ` : `
                            <div class="text-xs text-gray-500 mt-1">от ${escapeHtml(ach.username)}</div>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error loading achievements:", e);
        container.innerHTML = '<div class="text-center text-red-500 py-4">Ошибка загрузки</div>';
    }
}

async function toggleAchievementShare(achievementId, isShared) {
    try {
        const endpoint = isShared ? 'unshare' : 'share';
        const res = await fetch(`${API_URL}/achievements/${achievementId}/${endpoint}`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Ошибка");
        
        await loadAchievements();
        showMessage(isShared ? 'Достижение скрыто' : 'Достижение опубликовано', 'success');
    } catch (e) {
        showMessage('Ошибка', 'error');
    }
}

// ============= HELPER FUNCTIONS =============

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showMessage(message, type = 'info') {
    // Используем существующую функцию showActivityMessage если есть
    if (typeof showActivityMessage === 'function') {
        showActivityMessage(message, type);
    } else {
        alert(message);
    }
}
