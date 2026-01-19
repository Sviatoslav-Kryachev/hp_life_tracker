// ============= AUTH MODULE =============
// Авторизация и управление пользователем

// Зависимости: app_utils.js (должен быть загружен первым)

// ============= AUTH STATE =============
let authToken = localStorage.getItem('token') || '';
let currentUser = null;

// Функция для получения актуального токена (всегда из localStorage)
function getAuthToken() {
    return localStorage.getItem('token') || authToken || '';
}

// ============= AUTH FUNCTIONS =============
// Функция инициализации обработчиков форм авторизации
function initAuthForms() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) {
        setTimeout(initAuthForms, 100);
        return;
    }
    
    const existingHandler = authSection.getAttribute('data-auth-handler');
    if (existingHandler === 'true') {
        return;
    }
    
    authSection.addEventListener('submit', async function(e) {
        if (e.target.id === 'login-form') {
            e.preventDefault();
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");
            const submitBtn = e.target.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput) {
                console.error("Login form inputs not found");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Вход...';
                try {
                    await login(email, password);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } else {
                await login(email, password);
            }
        }
        
        if (e.target.id === 'register-form') {
            e.preventDefault();
            const email = document.getElementById("register-email").value;
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;
            const passwordConfirm = document.getElementById("register-password-confirm").value;

            if (password !== passwordConfirm) {
                const errorEl = document.getElementById("register-error");
                if (errorEl) {
                    errorEl.textContent = "Пароли не совпадают";
                    errorEl.classList.remove("hidden");
                }
                return;
            }

            register(email, username, password);
        }
    }, true);
    
    authSection.setAttribute('data-auth-handler', 'true');
}

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
        const errorEl = document.getElementById("login-error");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.add("hidden");
        }

        if (!email || !password) {
            if (errorEl) {
                errorEl.textContent = "Пожалуйста, заполните все поля";
                errorEl.classList.remove("hidden");
            }
            return;
        }

        email = email.trim();
        password = password.trim();

        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            let errorMessage = "Ошибка входа";
            try {
                const error = await res.json();
                errorMessage = error.detail || errorMessage;
            } catch (parseError) {
                if (res.status === 401) {
                    errorMessage = "Неверный email или пароль";
                } else if (res.status === 404) {
                    errorMessage = "Сервер не найден. Проверьте подключение.";
                } else {
                    errorMessage = `Ошибка ${res.status}: ${res.statusText}`;
                }
            }

            if (errorEl) {
                errorEl.textContent = errorMessage;
                errorEl.classList.remove("hidden");
            } else {
                alert(errorMessage);
            }
            return;
        }

        const data = await res.json();
        if (!data.access_token) {
            if (errorEl) {
                errorEl.textContent = "Ошибка: токен не получен";
                errorEl.classList.remove("hidden");
            }
            return;
        }

        authToken = data.access_token;
        localStorage.setItem('token', authToken);

        await loadCurrentUser();
        if (typeof showApp === 'function') {
            showApp();
        }
    } catch (e) {
        console.error("Login error:", e);
        const errorEl = document.getElementById("login-error");
        const errorMessage = e.message || "Произошла ошибка при входе. Проверьте подключение к интернету.";

        if (errorEl) {
            errorEl.textContent = errorMessage;
            errorEl.classList.remove("hidden");
        } else {
            alert(errorMessage);
        }
    }
}

async function register(email, username, password) {
    try {
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
        const token = getAuthToken();
        if (!token) {
            console.error("No auth token available for loadCurrentUser");
            return;
        }

        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Не удалось загрузить пользователя");

        currentUser = await res.json();
        
        const userInfoEl = document.getElementById("user-info");
        if (userInfoEl) {
            userInfoEl.textContent = currentUser.username || currentUser.email;
        } else {
            setTimeout(() => {
                const userInfoEl = document.getElementById("user-info");
                if (userInfoEl) {
                    userInfoEl.textContent = currentUser.username || currentUser.email;
                }
            }, 500);
        }

        checkAdminStatus();
    } catch (e) {
        console.error("Error loading user:", e);
    }
}

async function checkAdminStatus() {
    try {
        const token = getAuthToken();
        if (!token) return;
        const res = await fetch(`${API_BASE}/admin/invite-code`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            const adminBtn = document.getElementById("admin-btn");
            const footerAdminBtn = document.getElementById("footer-admin-btn");
            if (adminBtn) {
                adminBtn.classList.remove("hidden");
                // Дополнительно убеждаемся, что кнопка видна
                adminBtn.style.display = "inline-flex";
                adminBtn.style.visibility = "visible";
                adminBtn.style.opacity = "1";
                console.log("[checkAdminStatus] Admin button shown:", adminBtn);
            }
            if (footerAdminBtn) {
                footerAdminBtn.classList.remove("hidden");
                footerAdminBtn.style.display = "flex";
                footerAdminBtn.style.visibility = "visible";
                footerAdminBtn.style.opacity = "1";
            }
            if (typeof loadInviteCode === 'function') {
                loadInviteCode();
            }
        } else {
            console.log("[checkAdminStatus] User is not admin, status:", res.status);
        }
    } catch (e) {
        console.log("[checkAdminStatus] Error checking admin status:", e);
        // Не админ или ошибка
    }
}

function logout() {
    authToken = '';
    currentUser = null;
    localStorage.removeItem('token');
    
    const bottomNav = document.getElementById('bottom-navigation');
    if (bottomNav) {
        bottomNav.classList.add('hidden');
    }
    
    if (typeof showAuth === 'function') {
        showAuth();
    }
}

function showAuth() {
    const authSection = document.getElementById("auth-section");
    const appSection = document.getElementById("app-section");
    
    if (!authSection || !appSection) {
        if (typeof initDOMElements === 'function') {
            initDOMElements();
        }
    }
    
    if (authSection) {
        authSection.classList.remove("hidden");
        authSection.style.display = '';
        authSection.style.height = '';
        authSection.style.overflow = '';
    }
    if (appSection) {
        appSection.classList.add("hidden");
        appSection.style.display = 'none';
        appSection.style.height = '0';
        appSection.style.overflow = 'hidden';
        appSection.style.position = 'absolute';
        appSection.style.left = '-9999px';
    }
    
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const bottomNav = document.getElementById('bottom-navigation');
    if (bottomNav) {
        bottomNav.classList.add('hidden');
    }
}

async function showApp() {
    // Проверяем валидность токена перед показом приложения
    const token = getAuthToken();
    if (!token) {
        console.warn('[showApp] No token found, showing auth section');
        showAuth();
        return;
    }
    
    // Проверяем валидность токена через API
    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) {
            // Токен невалидный, очищаем и показываем форму авторизации
            console.warn('[showApp] Token validation failed, clearing token and showing auth');
            localStorage.removeItem('token');
            authToken = '';
            currentUser = null;
            showAuth();
            return;
        }
        
        // Токен валидный, загружаем данные пользователя
        currentUser = await res.json();
    } catch (error) {
        console.error('[showApp] Error validating token:', error);
        // При ошибке сети тоже показываем форму авторизации для безопасности
        localStorage.removeItem('token');
        authToken = '';
        currentUser = null;
        showAuth();
        return;
    }
    
    const authSection = document.getElementById("auth-section");
    const appSection = document.getElementById("app-section");
    
    if (!authSection || !appSection) {
        if (typeof initDOMElements === 'function') {
            initDOMElements();
        }
    }
    
    // Скрываем appSection до полной загрузки данных
    if (appSection) {
        appSection.classList.add("hidden");
        appSection.style.display = 'none';
    }
    
    if (typeof window.loadAppComponents === 'function') {
        await window.loadAppComponents();
    }
    
    // Скрываем authSection, но НЕ показываем appSection до загрузки данных
    if (authSection) {
        authSection.classList.add("hidden");
        authSection.style.display = 'none';
        authSection.style.height = '0';
        authSection.style.overflow = 'hidden';
    }

    // НЕ показываем appSection и bottomNav до загрузки данных
    // Они будут показаны после завершения loadData()

    // Сбрасываем кэш элементов
    if (typeof window !== 'undefined') {
        window.rewardsListVisible = null;
        window.rewardsListHidden = null;
        window.rewardsAccordionBtn = null;
        window.historyListVisible = null;
        window.historyListHidden = null;
        window.historyAccordionBtn = null;
        window.activitiesListVisible = null;
        window.activitiesListHidden = null;
        window.activitiesAccordionBtn = null;
    }

    // Загружаем данные сразу без задержек
    const loadData = async () => {
        console.log('[showApp] Starting data load immediately...');
        
        // Проверяем статус администратора сразу после загрузки компонентов
        // Используем небольшую задержку, чтобы убедиться, что компоненты загружены
        setTimeout(() => {
            if (typeof checkAdminStatus === 'function') {
                checkAdminStatus();
            }
        }, 200);
        
        // Загружаем данные параллельно и последовательно для критичных
        try {
            // Критичные данные загружаем параллельно для скорости
            const criticalLoads = Promise.all([
                typeof window.loadWallet === 'function' ? window.loadWallet() : Promise.resolve(),
                typeof window.loadCategories === 'function' ? window.loadCategories() : Promise.resolve(),
                typeof window.loadActivities === 'function' ? window.loadActivities() : Promise.resolve(),
            ]);
            
            await criticalLoads;
            
            // После загрузки активностей сразу загружаем активные таймеры
            if (typeof window.loadActiveTimers === 'function') {
                await window.loadActiveTimers();
            }
            
            // Инициализируем фильтры активностей
            if (typeof window.initActivitiesFilters === 'function') window.initActivitiesFilters();
            
            // Остальные данные загружаем параллельно
            const parallelLoads = Promise.all([
                typeof window.loadRewards === 'function' ? window.loadRewards() : Promise.resolve(),
                typeof window.loadTodayStats === 'function' ? window.loadTodayStats() : Promise.resolve(),
                typeof window.loadWeekCalendar === 'function' ? window.loadWeekCalendar() : Promise.resolve(),
                typeof window.loadStreak === 'function' ? window.loadStreak() : Promise.resolve(),
                typeof window.loadRecommendations === 'function' ? window.loadRecommendations() : Promise.resolve(),
                typeof window.loadGoals === 'function' ? window.loadGoals() : Promise.resolve(),
                typeof window.loadHistory === 'function' ? window.loadHistory() : Promise.resolve(),
                typeof window.loadGroups === 'function' ? window.loadGroups() : Promise.resolve(),
                typeof window.loadChallenges === 'function' ? window.loadChallenges() : Promise.resolve(),
                typeof window.loadAchievements === 'function' ? window.loadAchievements() : Promise.resolve(),
            ]);
            
            await parallelLoads;
            
            // Устанавливаем период истории
            if (document.getElementById('history-period-today') && typeof window.setHistoryPeriod === 'function') {
                window.setHistoryPeriod(window.historyPeriod);
            }
            
            // Обновляем категории и другие UI элементы
            if (typeof window.updateCategoryDropdown === 'function') {
                window.updateCategoryDropdown('activity-category');
                window.updateCategoryDropdown('edit-activity-category');
            }
            
            // Не критичные данные загружаем в фоне
            if (typeof window.loadCategoryStats === 'function') {
                setTimeout(() => window.loadCategoryStats(), 100);
            }
            if (typeof window.loadLeaderboard === 'function') {
                setTimeout(() => window.loadLeaderboard(), 100);
            }
            
            console.log('[showApp] All data loaded successfully');
            
            // ТОЛЬКО ПОСЛЕ загрузки всех данных показываем appSection и остальной контент
            if (appSection) {
                appSection.classList.remove("hidden");
                appSection.style.display = '';
                appSection.style.height = '';
                appSection.style.overflow = '';
                appSection.style.position = '';
                appSection.style.left = '';
            }
            
            const bottomNav = document.getElementById('bottom-navigation');
            if (bottomNav) {
                bottomNav.classList.remove('hidden');
            }
            
            // Прокручиваем страницу вверх после показа контента
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            // Проверяем статус администратора после загрузки всех данных
            // Делаем это с задержкой, чтобы убедиться, что все компоненты загружены
            setTimeout(() => {
                if (typeof checkAdminStatus === 'function') {
                    checkAdminStatus();
                }
            }, 300);
            
            // Инициализируем мобильную навигацию после загрузки данных
            // Только если токен валидный (мы уже проверили это в начале showApp)
            const isMobile = window.innerWidth <= 1024;
            if (isMobile) {
                setTimeout(() => {
                    const hash = window.location.hash.replace('#', '');
                    const initialSection = (hash && ['activities', 'rewards', 'history', 'goals'].includes(hash)) 
                        ? hash 
                        : 'activities';
                    
                    if (typeof showMobileSection === 'function') {
                        showMobileSection(initialSection);
                    }
                    
                    const activeBtn = document.querySelector(`.mobile-nav-btn[data-section="${initialSection}"]`);
                    if (activeBtn) {
                        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
                            btn.classList.remove('active-nav');
                        });
                        activeBtn.classList.add('active-nav');
                    }
                    
                    if (window.location.hash !== `#${initialSection}`) {
                        window.history.replaceState({ section: initialSection }, '', `#${initialSection}`);
                    }
                }, 100);
            }
        } catch (error) {
            console.error('[showApp] Error loading data:', error);
            // Даже при ошибке показываем appSection, чтобы пользователь видел интерфейс
            if (appSection) {
                appSection.classList.remove("hidden");
                appSection.style.display = '';
            }
            const bottomNav = document.getElementById('bottom-navigation');
            if (bottomNav) {
                bottomNav.classList.remove('hidden');
            }
        }
    };
    
    // Начинаем загрузку данных сразу без задержек
    await loadData();
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.authToken = authToken;
    window.currentUser = currentUser;
    window.getAuthToken = getAuthToken;
    window.initAuthForms = initAuthForms;
    window.showLoginForm = showLoginForm;
    window.showRegisterForm = showRegisterForm;
    window.login = login;
    window.register = register;
    window.loadCurrentUser = loadCurrentUser;
    window.checkAdminStatus = checkAdminStatus;
    window.logout = logout;
    window.showAuth = showAuth;
    window.showApp = showApp;
}
