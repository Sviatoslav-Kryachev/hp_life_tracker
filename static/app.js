const API_BASE = "http://127.0.0.1:8000";

let authToken = localStorage.getItem('token') || '';

// State
const activeTimers = new Map();
let allActivities = [];


// DOM elements
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


async function loadWallet() {
 try {
   const res = await fetch(`${API_BASE}/xp/wallet`, {
     headers: { "Authorization": `Bearer ${authToken}` }
   });
   if (!res.ok) return;
   const data = await res.json();
   balanceSpan.textContent = `${Math.round(data.balance)} XP`;
   levelSpan.textContent = data.level;
 } catch (e) {
   console.error("Error loading wallet", e);
 }
}



// Load activities
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


// Render single activity card with controls
function renderActivityCard(activity) {
 const div = document.createElement("div");
 div.className = "activity-card p-4 mb-3 rounded-xl bg-white/80 border border-blue-100 shadow-sm hover:shadow-lg flex items-center justify-between gap-3";


 const left = document.createElement("div");
 left.className = "flex-grow";
 left.innerHTML = `
   <div class="text-lg font-semibold text-gray-800">${activity.name}</div>
   <div class="text-sm text-gray-500">${activity.category || "general"} · ${activity.xp_per_hour} XP/час</div>
 `;


 // Timer start/stop button
 const timerBtn = document.createElement("button");
 timerBtn.className =
   "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2";
 timerBtn.innerHTML = '<i class="fas fa-play text-green-500"></i> Старт';
 timerBtn.dataset.activityId = activity.id;
 timerBtn.addEventListener("click", (e) => toggleTimer(activity.id, e.currentTarget, activity));


 // Manual time button
 const manualTimeBtn = document.createElement("button");
 manualTimeBtn.className =
   "manual-time-btn p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
 manualTimeBtn.innerHTML = '<i class="fas fa-clock"></i>';
 manualTimeBtn.title = "Добавить время вручную";
 manualTimeBtn.dataset.activityId = activity.id;
 manualTimeBtn.addEventListener("click", (e) => {
   e.stopPropagation();
   openManualTimeModal(activity.id);
 });


 // Edit button
 const editBtn = document.createElement("button");
 editBtn.className =
   "edit-btn p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
 editBtn.innerHTML = '<i class="fas fa-edit"></i>';
 editBtn.title = "Редактировать активность";
 editBtn.dataset.activityId = activity.id;
 editBtn.addEventListener("click", (e) => {
   e.stopPropagation();
   openEditModal(activity);
 });


 // Delete button
 const deleteBtn = document.createElement("button");
 deleteBtn.className =
   "delete-btn p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
 deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
 deleteBtn.title = "Удалить активность";
 deleteBtn.dataset.activityId = activity.id;
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


// Open edit modal with activity populated
function openEditModal(activity) {
 document.getElementById("edit-activity-id").value = activity.id;
 document.getElementById("edit-activity-name").value = activity.name;
 document.getElementById("edit-xp-per-hour").value = activity.xp_per_hour;
 document.getElementById("edit-activity-category").value = activity.category || "";
 document.getElementById("edit-activity-modal").classList.remove("hidden");
}


function closeEditModal() {
 document.getElementById("edit-activity-modal").classList.add("hidden");
 document.getElementById("edit-activity-form").reset();
}


// Activity update
async function updateActivity() {
  const id = document.getElementById("edit-activity-id").value;
  const name = document.getElementById("edit-activity-name").value.trim();
  const xpPerHour = Number(document.getElementById("edit-xp-per-hour").value) || 60;
  const category = document.getElementById("edit-activity-category").value.trim();


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
          body: JSON.stringify({ name, xp_per_hour: xpPerHour, category })
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
      console.error("Ошибка:", e);
      alert("Ошибка сети");
  }
}


// Manual time modal and functions
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
     body: JSON.stringify({ activity_id: activityId, minutes })
   });
   if (!res.ok) {
     const error = await res.json();
     alert(error.detail || "Ошибка добавления времени");
     return;
   }
   const data = await res.json();
   closeManualTimeModal();
   await loadWallet();
   await loadActivities();
   showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${minutes} мин!`, "success");
 } catch (e) {
   console.error("Ошибка:", e);
   alert("Ошибка сети");
 }
}


// Delete activity
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
   await loadWallet();
 } catch (e) {
   console.error("Ошибка удаления:", e);
   alert("Ошибка сети");
 }
}


// Timer functions: start/stop & time display
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
   const timerInfo = {logId, startTime, intervalId: null, activity};
   activeTimers.set(activityId, timerInfo);
   button.innerHTML = '<i class="fas fa-stop text-red-500"></i> <span id="timer-' + activityId + '">00:00</span>';
   button.className = "timer-btn px-6 py-2 rounded-xl text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 transition-all duration-300";
   const intervalId = setInterval(() => updateTimerDisplay(activityId, startTime, activity), 1000);
   timerInfo.intervalId = intervalId;
 } catch (e) {
   console.error("Ошибка запуска:", e);
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
   await loadWallet(); // Only wallet to avoid double XP
   alert(`✅ Таймер остановлен! Заработано ${Math.round(data.xp_earned)} XP`);
 } catch (e) {
   console.error("Ошибка остановки:", e);
   alert("Ошибка остановки таймера");
 }
}


// Show messages for activity feedback
function showActivityMessage(text, type) {
 const msgEl = document.getElementById("activity-message");
 if (!msgEl) return;
 msgEl.textContent = text;
 msgEl.classList.remove("hidden", "text-red-500", "text-green-600");
 if (type === "error") msgEl.classList.add("text-red-500");
 else if (type === "success") msgEl.classList.add("text-green-600");
 setTimeout(() => msgEl.classList.add("hidden"), 4000);
}


// ===== REWARDS =====
const START_REWARDS = [
 {id: 1, name: "15 минут YouTube", xp_cost: 10, is_custom: false},
 {id: 2, name: "30 минут соцсетей", xp_cost: 25, is_custom: false},
 {id: 3, name: "1 час игры", xp_cost: 50, is_custom: false}
];


function loadRewards() {
 if (!rewardsList) return;
 rewardsList.innerHTML = "";
 START_REWARDS.forEach(renderRewardCard);
}


// Render rewards with edit/delete for custom
function renderRewardCard(reward) {
 const div = document.createElement("div");
 div.className = "p-4 rounded-xl bg-white/90 border border-yellow-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-200";


 const left = document.createElement("div");
 left.innerHTML = `<div class="font-semibold text-gray-800">${reward.name}</div><div class="text-sm text-gray-500">${reward.xp_cost} XP</div>`;


 const btnContainer = document.createElement("div");
 btnContainer.className = "flex gap-2";


 if (!reward.is_custom) {
   const spendBtn = document.createElement("button");
   spendBtn.className = "bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2";
   spendBtn.innerHTML = `<i class="fas fa-coins"></i>Потратить`;
   spendBtn.addEventListener("click", () => spendReward(reward.id));
   btnContainer.appendChild(spendBtn);
 }


 if (reward.is_custom) {
   const editBtn = document.createElement("button");
   editBtn.className = "edit-reward-btn p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center w-9 h-9 shadow-sm hover:shadow-md";
   editBtn.innerHTML = '<i class="fas fa-edit"></i>';
   editBtn.title = "Редактировать награду";
   editBtn.dataset.rewardId = reward.id;
   editBtn.addEventListener("click", (e) => {
     e.stopPropagation();
     openEditRewardModal(reward);
   });
   btnContainer.appendChild(editBtn);


   const deleteBtn = document.createElement("button");
   deleteBtn.className = "delete-reward-btn p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center w-9 h-9 shadow-sm hover:shadow-md";
   deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
   deleteBtn.title = "Удалить награду";
   deleteBtn.dataset.rewardId = reward.id;
   deleteBtn.addEventListener("click", (e) => {
     e.stopPropagation();
     deleteReward(reward.id, div);
   });
   btnContainer.appendChild(deleteBtn);
 }


 div.appendChild(left);
 div.appendChild(btnContainer);
 rewardsList.appendChild(div);
}


function openEditRewardModal(reward) {
 document.getElementById("edit-reward-id").value = reward.id;
 document.getElementById("edit-reward-name").value = reward.name;
 document.getElementById("edit-reward-cost").value = reward.xp_cost;
 document.getElementById("edit-reward-modal").classList.remove("hidden");
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
    body: JSON.stringify({name, xp_cost: xpCost})
  });
  if (!res.ok) {
    const error = await res.json();
    alert(error.detail || "Ошибка обновления");
    return;
  }
  document.getElementById("edit-reward-modal").classList.add("hidden");
  showRewardMessage("✅ Награда обновлена!", "success");
  await loadRewards();
} catch (e) {
  console.error("Ошибка:", e);
  alert("Ошибка сети");
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
   showRewardMessage("✅ Награда удалена!", "success");
   await loadRewards();
 } catch (e) {
   console.error("Ошибка:", e);
   alert("Ошибка сети");
 }
}


// Spend reward function
async function spendReward(rewardId) {
 if (!rewardMessage) return;
 rewardMessage.classList.remove("hidden", "text-red-500", "text-green-600");
 rewardMessage.classList.add("text-gray-500");
 rewardMessage.textContent = "Проверяем баланс...";
 try {
   const res = await fetch(`${API_BASE}/rewards/spend/${rewardId}`, {method: "POST",
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
 } catch (e) {
   console.error("Ошибка сети:", e);
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
}


// Initialization of event handlers on DOM loaded
window.addEventListener("DOMContentLoaded", () => {
 loadWallet();
 loadActivities();
 loadRewards();


 if (newActivityForm) {
   newActivityForm.addEventListener("submit", (e) => {
     e.preventDefault();
     createActivity();
   });
 }


 if (newRewardForm) {
   newRewardForm.addEventListener("submit", (e) => {
     e.preventDefault();
     createReward();
   });
 }


 const manualForm = document.getElementById("manual-time-form");
 if (manualForm) {
   manualForm.addEventListener("submit", async (e) => {
     e.preventDefault();
     await addManualTime();
   });
   document.getElementById("manual-minutes").addEventListener("input", (e) => {
     const activityId = document.getElementById("manual-activity-select").value;
     updateManualPreview(activityId);
   });
   document.getElementById("manual-activity-select").addEventListener("change", (e) => {
     updateManualPreview(e.target.value);
   });
 }


 const editForm = document.getElementById("edit-activity-form");
 if (editForm) {
   editForm.addEventListener("submit", async (e) => {
     e.preventDefault();
     await updateActivity();
   });
 }


 const editRewardForm = document.getElementById("edit-reward-form");
 if (editRewardForm) {
   editRewardForm.addEventListener("submit", async (e) => {
     e.preventDefault();
     await updateReward();
   });
 }
});


// Create activity function
async function createActivity() {
 const name = activityNameInput.value.trim();
 const xp = xpPerHourInput ? Number(xpPerHourInput.value) || 60 : 60;
 if (!name) {
   showActivityMessage("Введите название активности", "error");
   return;
 }
 const duplicate = allActivities.find(activity => activity.name.toLowerCase() === name.toLowerCase());
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
     body: JSON.stringify({name, xp_per_hour: xp})
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
   console.error("Ошибка сети:", e);
   showActivityMessage("Ошибка соединения", "error");
 }
}

// Создание новой награды
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
    rewardCostInput.value = "1";

    // Добавляем новую награду в список и отображаем
    START_REWARDS.push(created); // если используешь локальный массив
    renderRewardCard(created);
    showRewardMessage(`✅ "${created.name}" создана!`, "success");

  } catch (e) {
    console.error("Ошибка сети:", e);
    showRewardMessage("Ошибка соединения", "error");
  }
}
