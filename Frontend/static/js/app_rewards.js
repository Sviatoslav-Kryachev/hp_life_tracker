// ============= REWARDS MODULE =============
// Управление наградами, покупка наград

// Зависимости: app_utils.js, app_auth.js (должны быть загружены первыми)

// ============= REWARDS STATE =============
let allRewards = [];
let rewardsListVisible, rewardsListHidden, rewardsAccordionBtn;
let rewardNameInput, rewardCostInput;
let rewardMessage;

// Preset награды с брендами
const REWARD_PRESETS = {
    mcdonalds: { name: "McDonald's", xp_cost: 100, icon: "M", iconType: "text", bgColor: "bg-red-500", textColor: "text-yellow-400", borderColor: "border-red-200" },
    youtube: { name: "YouTube 30 мин", xp_cost: 30, icon: "fab fa-youtube", iconType: "icon", bgColor: "bg-red-600", textColor: "text-white", borderColor: "border-red-200" },
    gaming: { name: "Игры 1 час", xp_cost: 60, icon: "fas fa-gamepad", iconType: "icon", bgColor: "bg-gradient-to-br from-purple-500 to-pink-500", textColor: "text-white", borderColor: "border-purple-200" },
    netflix: { name: "Netflix 1 серия", xp_cost: 50, icon: "N", iconType: "text", bgColor: "bg-black", textColor: "text-red-600", borderColor: "border-gray-300" },
    coffee: { name: "Кофе", xp_cost: 40, icon: "fas fa-coffee", iconType: "icon", bgColor: "bg-green-700", textColor: "text-white", borderColor: "border-green-200" },
    custom: { name: "", xp_cost: 10, icon: "fas fa-gift", iconType: "icon", bgColor: "bg-gradient-to-br from-amber-400 to-orange-500", textColor: "text-white", borderColor: "border-amber-200" }
};

// ============= HELPER FUNCTIONS =============
// Используем getElementInApp из core/dom.js для устранения дублирования
function getRewardsElements() {
    rewardsListVisible = getElementInApp("rewards-list-visible");
    rewardsListHidden = getElementInApp("rewards-list-hidden");
    rewardsAccordionBtn = getElementInApp("rewards-accordion-btn");
}

function selectPreset(presetKey) {
    const preset = REWARD_PRESETS[presetKey];
    if (preset) {
        if (!rewardNameInput) {
            rewardNameInput = getElement("reward-name");
        }
        if (!rewardCostInput) {
            rewardCostInput = getElement("reward-cost");
        }
        if (rewardNameInput) rewardNameInput.value = preset.name;
        if (rewardCostInput) rewardCostInput.value = preset.xp_cost;
        if (rewardNameInput) rewardNameInput.focus();
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

function showRewardMessage(text, type) {
    if (!rewardMessage) {
        rewardMessage = document.getElementById("reward-message");
    }
    const msgEl = rewardMessage;
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.remove("hidden", "text-red-500", "text-green-600", "text-gray-500");
    if (type === "error") {
        msgEl.classList.add("text-red-500");
    } else if (type === "success") {
        msgEl.classList.add("text-green-600");
    }
    setTimeout(() => msgEl.classList.add("hidden"), 4000);
}

// ============= LOAD REWARDS =============
async function loadRewards() {
    try {
        getRewardsElements();

        if (!rewardsListVisible || !rewardsListHidden || !rewardsAccordionBtn) {
            await new Promise(resolve => setTimeout(resolve, 100));
            getRewardsElements();
        }

        if (!rewardsListVisible || !rewardsListHidden || !rewardsAccordionBtn) {
            console.error("Rewards elements not found");
            return;
        }

        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) {
            console.error("No auth token available");
            if (rewardsListVisible) {
                rewardsListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            }
            if (rewardsAccordionBtn) rewardsAccordionBtn.classList.add('hidden');
            return;
        }

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/rewards/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load rewards:", res.status, res.statusText, errorText);
            if (rewardsListVisible) {
                rewardsListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки наград</div>';
            }
            if (rewardsAccordionBtn) rewardsAccordionBtn.classList.add('hidden');
            return;
        }

        const data = await res.json();
        
        // Сортируем награды: старые сверху (по возрастанию ID), новые внизу
        const sortedData = [...data].sort((a, b) => {
            const idA = a.id || 0;
            const idB = b.id || 0;
            return idA - idB;
        });
        
        allRewards = sortedData;
        
        console.log('Rewards loaded and sorted:', sortedData.map(r => ({ id: r.id, name: r.name })));

        getRewardsElements();
        if (!rewardsListVisible || !rewardsListHidden) {
            console.error("Rewards elements are null before innerHTML operations");
            return;
        }

        try {
            rewardsListVisible.innerHTML = "";
            rewardsListHidden.innerHTML = "";
        } catch (e) {
            console.error("Error clearing rewards lists:", e);
            return;
        }

        if (sortedData.length === 0) {
            try {
                rewardsListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Наград пока нет</div>';
            } catch (e) {
                console.error("Error setting empty rewards message:", e);
            }
            if (rewardsAccordionBtn) {
                rewardsAccordionBtn.classList.add('hidden');
            }
            return;
        }

        // Проверяем, был ли аккордеон развернут при предыдущей загрузке
        const wasExpanded = localStorage.getItem('rewardsAccordionExpanded') === 'true';
        const rewardsContainer = document.getElementById('rewards-list-container');
        const shouldShowAccordion = sortedData.length > 4;

        if (!rewardsListVisible) {
            console.error("rewardsListVisible is null before rendering visible rewards");
            return;
        }

        // Если аккордеон должен быть развернут или был развернут, все награды идут в hidden
        // Иначе первые 4 в visible, остальные в hidden
        if (wasExpanded && shouldShowAccordion && rewardsContainer) {
            // Аккордеон развернут - все награды в hidden
            if (!rewardsListHidden) {
                console.error("rewardsListHidden is null before rendering rewards");
                return;
            }
            
            sortedData.forEach(reward => {
                const div = renderRewardCard(reward);
                if (div && rewardsListHidden) {
                    rewardsListHidden.appendChild(div);
                }
            });
            
            rewardsListHidden.classList.remove('hidden');
            rewardsContainer.classList.add('rewards-expanded');
            
            // Устанавливаем maxHeight после отрисовки
            requestAnimationFrame(() => {
                if (rewardsContainer && rewardsListHidden.children.length > 0) {
                    const firstCard = rewardsListHidden.children[0];
                    if (firstCard) {
                        const cardHeight = firstCard.offsetHeight || 80; // fallback высота
                        const gap = 8;
                        const visibleCards = Math.min(4, rewardsListHidden.children.length);
                        const calculatedHeight = (cardHeight * visibleCards) + (gap * (visibleCards - 1));
                        rewardsContainer.style.maxHeight = calculatedHeight + 'px';
                        rewardsContainer.style.overflowY = 'auto';
                    }
                }
            });
            
            if (rewardsAccordionBtn) {
                rewardsAccordionBtn.classList.remove('hidden');
                const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
                const text = rewardsAccordionBtn.querySelector('.accordion-text');
                const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
                if (icon) icon.style.transform = 'rotate(180deg)';
                if (text) text.textContent = t('hide_rewards');
            }
        } else {
            // Аккордеон свернут - первые 4 в visible, остальные в hidden
            const visibleRewards = sortedData.slice(0, 4);
            const hiddenRewards = sortedData.slice(4);

            visibleRewards.forEach(reward => {
                const div = renderRewardCard(reward);
                if (div && rewardsListVisible) {
                    rewardsListVisible.appendChild(div);
                }
            });

            if (hiddenRewards.length > 0) {
                if (!rewardsListHidden) {
                    console.error("rewardsListHidden is null before rendering hidden rewards");
                    return;
                }

                hiddenRewards.forEach(reward => {
                    const div = renderRewardCard(reward);
                    if (div && rewardsListHidden) {
                        rewardsListHidden.appendChild(div);
                    }
                });
                
                if (rewardsContainer) {
                    rewardsContainer.classList.remove('rewards-expanded');
                    rewardsContainer.style.maxHeight = '';
                    rewardsContainer.style.overflowY = '';
                }
                if (rewardsListHidden) {
                    rewardsListHidden.classList.add('hidden');
                }
            } else {
                if (rewardsContainer) {
                    rewardsContainer.classList.remove('rewards-expanded');
                    rewardsContainer.style.maxHeight = '';
                    rewardsContainer.style.overflowY = '';
                }
            }

            if (rewardsAccordionBtn) {
                if (shouldShowAccordion) {
                    rewardsAccordionBtn.classList.remove('hidden');
                    const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
                    const text = rewardsAccordionBtn.querySelector('.accordion-text');
                    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
                    if (icon) icon.style.transform = 'rotate(0deg)';
                    if (text) text.textContent = t('show_all_rewards');
                } else {
                    rewardsAccordionBtn.classList.add('hidden');
                }
            }
        }
    } catch (e) {
        console.error("Error loading rewards:", e);
    }
}

// ============= RENDER REWARD CARD =============
function renderRewardCard(reward) {
    const brand = detectBrand(reward.name);

    const div = document.createElement("div");
    div.className = `reward-card group relative p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border-2 ${brand.borderColor} hover:shadow-md hover:border-opacity-80 transition-all duration-200 w-full max-w-full overflow-hidden`;
    div.setAttribute('data-reward-id', reward.id);

    const mainSection = document.createElement("div");
    mainSection.className = "flex items-center justify-between gap-4";

    const leftSection = document.createElement("div");
    leftSection.className = "flex items-center gap-3 flex-1 min-w-0";

    const icon = document.createElement("div");
    icon.className = `w-12 h-12 ${brand.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200`;

    if (brand.iconType === "text") {
        icon.innerHTML = `<span class="${brand.textColor} font-black text-lg">${brand.icon}</span>`;
    } else {
        icon.innerHTML = `<i class="${brand.icon} ${brand.textColor} text-lg"></i>`;
    }

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

    const btnContainer = document.createElement("div");
    btnContainer.className = "flex items-center gap-2 flex-shrink-0";

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    // Кнопки редактирования и удаления (только для своих наград)
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
    spendBtn.innerHTML = `<i class="fas fa-shopping-bag text-xs"></i><span class="hidden sm:inline">${t('buy')}</span>`;
    spendBtn.addEventListener("click", () => spendReward(reward.id));
    btnContainer.appendChild(spendBtn);

    mainSection.appendChild(leftSection);
    mainSection.appendChild(btnContainer);

    div.appendChild(mainSection);
    return div;
}

// ============= CREATE REWARD =============
async function createReward() {
    if (!rewardNameInput) {
        rewardNameInput = document.getElementById("reward-name");
    }
    if (!rewardCostInput) {
        rewardCostInput = document.getElementById("reward-cost");
    }

    const name = rewardNameInput ? rewardNameInput.value.trim() : '';
    const xpCost = rewardCostInput ? Number(rewardCostInput.value) : 0;

    if (!name || xpCost <= 0) {
        showRewardMessage("Введите корректное название и стоимость", "error");
        return;
    }

    // Валидация на дубликаты названий
    const duplicate = allRewards.find(r => r.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        showRewardMessage(`❌ "${name}" уже существует!`, "error");
        if (rewardNameInput) rewardNameInput.focus();
        return;
    }

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/rewards/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, xp_cost: xpCost })
        });

        if (!res.ok) {
            const error = await res.json();
            showRewardMessage(error.detail || "Ошибка создания", "error");
            return;
        }

        const created = await res.json();
        if (rewardNameInput) rewardNameInput.value = "";
        if (rewardCostInput) rewardCostInput.value = "10";
        
        // Перезагружаем награды с сервера для обеспечения согласованности
        try {
            await loadRewards();
        } catch (loadError) {
            console.error("Error reloading rewards:", loadError);
            // Если перезагрузка не удалась, просто добавляем созданную награду в список
            allRewards.push(created);
            allRewards.sort((a, b) => (a.id || 0) - (b.id || 0));
            getRewardsElements();
            if (rewardsListVisible && rewardsListHidden) {
                const newRewardElement = renderRewardCard(created);
                const totalRewards = allRewards.length;
                const visibleCount = Math.min(4, totalRewards);
                const newRewardIndex = allRewards.findIndex(r => r.id === created.id);
                
                if (newRewardIndex < visibleCount) {
                    rewardsListVisible.appendChild(newRewardElement);
                } else {
                    rewardsListHidden.appendChild(newRewardElement);
                    if (rewardsAccordionBtn) {
                        rewardsAccordionBtn.classList.remove('hidden');
                    }
                }
            }
        }
        
        // Находим только что созданную награду для её подсветки
        const createdRewardId = created.id;
        setTimeout(() => {
            const rewardElement = document.querySelector(`[data-reward-id="${createdRewardId}"]`);
            if (rewardElement) {
                rewardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                rewardElement.style.transition = 'background-color 0.3s';
                rewardElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                setTimeout(() => {
                    rewardElement.style.backgroundColor = '';
                }, 2000);
            }
        }, 200);
        
        showRewardMessage(`✅ "${created.name}" создана!`, "success");
    } catch (e) {
        console.error("Error:", e);
        showRewardMessage("Ошибка соединения", "error");
    }
}

// ============= EDIT REWARD =============
function openEditRewardModal(reward) {
    document.getElementById("edit-reward-id").value = reward.id;
    document.getElementById("edit-reward-name").value = reward.name;
    document.getElementById("edit-reward-cost").value = reward.xp_cost;
    document.getElementById("edit-reward-modal").classList.remove("hidden");
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }
}

function closeEditRewardModal() {
    document.getElementById("edit-reward-modal").classList.add("hidden");
}

async function updateReward() {
    const id = document.getElementById("edit-reward-id").value;
    const name = document.getElementById("edit-reward-name").value.trim();
    const xpCost = Number(document.getElementById("edit-reward-cost").value) || 0;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (!name || xpCost <= 0) {
        alert(t('enter_correct_name_cost'));
        return;
    }

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/rewards/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, xp_cost: xpCost })
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || t('error_updating_reward'));
            return;
        }

        closeEditRewardModal();
        await loadRewards();
        showRewardMessage(`✅ ${t('reward_updated')}`, "success");
    } catch (e) {
        console.error("Error:", e);
        alert(t('network_error'));
    }
}

// ============= DELETE REWARD =============
async function deleteReward(rewardId, cardElement) {
    if (!confirm("Удалить награду?")) return;

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/rewards/${rewardId}`, {
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
            loadRewards();
        }, 300);
        allRewards = allRewards.filter(r => r.id != rewardId);
        showRewardMessage("✅ Награда удалена!", "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

// ============= SPEND REWARD (PURCHASE) =============
async function spendReward(rewardId) {
    if (!rewardMessage) {
        rewardMessage = document.getElementById("reward-message");
    }
    const msgEl = rewardMessage;
    if (!msgEl) return;

    msgEl.classList.remove("hidden", "text-red-500", "text-green-600");
    msgEl.classList.add("text-gray-500");
    msgEl.textContent = "Проверяем баланс...";

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        
        const res = await fetch(`${apiBase}/rewards/spend/${rewardId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);

        if (!res.ok) {
            let errorMsg = data.detail || "Не удалось потратить XP";
            if (res.status === 403) {
                errorMsg = `🚫 ${errorMsg}`;
            }
            msgEl.textContent = errorMsg;
            msgEl.classList.remove("text-gray-500");
            msgEl.classList.add("text-red-500");
            showNotification(errorMsg, 'error');
            return;
        }

        // Успешная покупка
        const successMsg = `✅ ${t('reward_received').replace('{reward}', data.reward).replace('{spent}', data.spent).replace('{balance}', Math.round(data.new_balance))}`;
        msgEl.textContent = successMsg;
        msgEl.classList.remove("text-gray-500");
        msgEl.classList.add("text-green-600");

        showNotification(`✅ ${t('reward_purchased').replace('{reward}', data.reward).replace('{spent}', data.spent)}`, 'success');

        // Обновляем все данные
        if (typeof window.loadWallet === 'function') await window.loadWallet();
        if (typeof window.loadTodayStats === 'function') window.loadTodayStats();

        setTimeout(async () => {
            if (typeof window.loadHistory === 'function') await window.loadHistory();
        }, 300);
    } catch (e) {
        console.error("Error:", e);
        const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;
        const errorMsg = t('connection_error');
        msgEl.textContent = errorMsg;
        msgEl.classList.remove("text-gray-500");
        msgEl.classList.add("text-red-500");
        const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);
        showNotification(errorMsg, 'error');
    }
}

// ============= REWARDS ACCORDION =============
function toggleRewardsAccordion() {
    getRewardsElements();
    const rewardsContainer = document.getElementById('rewards-list-container');
    if (!rewardsListHidden || !rewardsAccordionBtn || !rewardsContainer) {
        console.error("Rewards accordion elements not found");
        return;
    }

    const isExpanded = rewardsContainer.classList.contains('rewards-expanded');
    const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
    const text = rewardsAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (!isExpanded) {
        while (rewardsListVisible && rewardsListVisible.firstChild) {
            rewardsListHidden.appendChild(rewardsListVisible.firstChild);
        }

        rewardsListHidden.classList.remove('hidden');
        rewardsContainer.classList.add('rewards-expanded');

        requestAnimationFrame(() => {
            if (rewardsContainer && rewardsListHidden.children.length > 0) {
                const firstCard = rewardsListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 8;
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    rewardsContainer.style.maxHeight = calculatedHeight + 'px';
                    rewardsContainer.style.transition = 'max-height 300ms ease';
                }
                rewardsContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_rewards');
        localStorage.setItem('rewardsAccordionExpanded', 'true');
    } else {
        const allCards = Array.from(rewardsListHidden.children);

        if (rewardsListVisible) rewardsListVisible.innerHTML = "";
        rewardsListHidden.innerHTML = "";

        allCards.forEach((card, index) => {
            if (index < 4 && rewardsListVisible) {
                rewardsListVisible.appendChild(card);
            } else {
                rewardsListHidden.appendChild(card);
            }
        });

        rewardsContainer.classList.remove('rewards-expanded');
        rewardsContainer.style.maxHeight = '';
        rewardsListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_rewards');
        localStorage.setItem('rewardsAccordionExpanded', 'false');
    }
}

function updateRewardsAccordionButton() {
    getRewardsElements();
    const rewardsContainer = document.getElementById('rewards-list-container');
    if (!rewardsListHidden || !rewardsAccordionBtn || !rewardsContainer) return;

    const isExpanded = localStorage.getItem('rewardsAccordionExpanded') === 'true';
    const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
    const text = rewardsAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (isExpanded) {
        while (rewardsListVisible && rewardsListVisible.firstChild) {
            rewardsListHidden.appendChild(rewardsListVisible.firstChild);
        }

        rewardsListHidden.classList.remove('hidden');
        rewardsContainer.classList.add('rewards-expanded');

        requestAnimationFrame(() => {
            if (rewardsContainer && rewardsListHidden.children.length > 0) {
                const firstCard = rewardsListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 8;
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    rewardsContainer.style.maxHeight = calculatedHeight + 'px';
                    rewardsContainer.style.transition = 'max-height 300ms ease';
                }
                rewardsContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_rewards');
    } else {
        const allCards = Array.from(rewardsListHidden.children);

        if (rewardsListVisible) rewardsListVisible.innerHTML = "";
        rewardsListHidden.innerHTML = "";

        allCards.forEach((card, index) => {
            if (index < 4 && rewardsListVisible) {
                rewardsListVisible.appendChild(card);
            } else {
                rewardsListHidden.appendChild(card);
            }
        });

        rewardsContainer.classList.remove('rewards-expanded');
        rewardsContainer.style.maxHeight = '';
        rewardsListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_rewards');
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.allRewards = allRewards;
    window.REWARD_PRESETS = REWARD_PRESETS;
    window.loadRewards = loadRewards;
    window.createReward = createReward;
    window.updateReward = updateReward;
    window.deleteReward = deleteReward;
    window.openEditRewardModal = openEditRewardModal;
    window.closeEditRewardModal = closeEditRewardModal;
    window.spendReward = spendReward;
    window.renderRewardCard = renderRewardCard;
    window.selectPreset = selectPreset;
    window.detectBrand = detectBrand;
    window.toggleRewardsAccordion = toggleRewardsAccordion;
    window.updateRewardsAccordionButton = updateRewardsAccordionButton;
    window.getRewardsElements = getRewardsElements;
    window.showRewardMessage = showRewardMessage;
}
