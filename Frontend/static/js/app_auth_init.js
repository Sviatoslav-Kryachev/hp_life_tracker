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
            // Если есть токен, скрываем auth-section и показываем app-section
            if (authSection) {
                authSection.classList.add('hidden');
                authSection.style.display = 'none';
                authSection.style.visibility = 'visible';
                authSection.style.height = '0';
                authSection.style.overflow = 'hidden';
            }
            if (appSection) {
                appSection.classList.remove('hidden');
                appSection.style.display = '';
                appSection.style.visibility = 'visible';
                appSection.style.height = '';
                appSection.style.overflow = '';
                appSection.style.position = '';
                appSection.style.left = '';
            }
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
