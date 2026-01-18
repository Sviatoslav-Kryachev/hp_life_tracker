// ============= AUTH INITIALIZATION =============
// Инициализация проверки авторизации и управления секциями

/**
 * Проверяет наличие токена и показывает/скрывает соответствующие секции
 * Вызывается при загрузке страницы и после операций авторизации
 */
function applyAuthCheck() {
    try {
        const token = localStorage.getItem('token');
        const authSection = document.getElementById('auth-section');
        const appSection = document.getElementById('app-section');
        
        if (token) {
            // Если есть токен, проверяем его валидность асинхронно
            // Но сначала показываем auth-section, пока не подтвердится валидность
            if (authSection) {
                authSection.classList.remove('hidden');
                authSection.style.display = '';
                authSection.style.visibility = 'visible';
                authSection.style.height = '';
                authSection.style.overflow = '';
            }
            if (appSection) {
                appSection.classList.add('hidden');
                appSection.style.display = 'none';
                appSection.style.visibility = 'visible';
                appSection.style.height = '0';
                appSection.style.overflow = 'hidden';
                appSection.style.position = 'absolute';
                appSection.style.left = '-9999px';
            }
            
            // Асинхронно проверяем валидность токена
            (async () => {
                try {
                    const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
                    const res = await fetch(`${apiBase}/auth/me`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    
                    if (res.ok) {
                        // Токен валидный, загружаем данные приложения
                        // showApp() сама покажет app-section и загрузит данные
                        if (typeof window.showApp === 'function') {
                            await window.showApp();
                        }
                    } else {
                        // Токен невалидный, очищаем и оставляем auth-section
                        console.warn('[applyAuthCheck] Token validation failed, clearing token');
                        localStorage.removeItem('token');
                        if (typeof window !== 'undefined' && window.authToken !== undefined) {
                            window.authToken = '';
                        }
                        // Убеждаемся, что auth-section видим
                        if (authSection) {
                            authSection.classList.remove('hidden');
                            authSection.style.display = '';
                        }
                        if (appSection) {
                            appSection.classList.add('hidden');
                            appSection.style.display = 'none';
                        }
                    }
                } catch (error) {
                    console.error('[applyAuthCheck] Error validating token:', error);
                    // При ошибке оставляем auth-section видимым для безопасности
                    if (authSection) {
                        authSection.classList.remove('hidden');
                        authSection.style.display = '';
                    }
                    if (appSection) {
                        appSection.classList.add('hidden');
                        appSection.style.display = 'none';
                    }
                }
            })();
        } else {
            // Если токена нет, показываем auth-section и скрываем app-section
            if (authSection) {
                authSection.classList.remove('hidden');
                authSection.style.display = '';
                authSection.style.visibility = 'visible';
                authSection.style.height = '';
                authSection.style.overflow = '';
            }
            if (appSection) {
                appSection.classList.add('hidden');
                appSection.style.display = 'none';
                appSection.style.visibility = 'visible';
                appSection.style.height = '0';
                appSection.style.overflow = 'hidden';
                appSection.style.position = 'absolute';
                appSection.style.left = '-9999px';
            }
        }
        
        // Предотвращаем скролл вниз при загрузке
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Дополнительная проверка через небольшую задержку
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 50);
    } catch(e) {
        console.error('Auth check error:', e);
    }
}

// Экспортируем функцию для использования в других скриптах
if (typeof window !== 'undefined') {
    window.applyAuthCheck = applyAuthCheck;
}
