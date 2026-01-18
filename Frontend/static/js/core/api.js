// ============= API MODULE =============
// Централизованные обертки для API вызовов
// ВАЖНО: API_BASE должен быть определен в app_utils.js

/**
 * Получает токен авторизации
 * @returns {string|null} Токен или null
 */
function getAuthToken() {
    // Пробуем получить через функцию, если она есть
    if (typeof window.getAuthToken === 'function') {
        return window.getAuthToken();
    }
    // Иначе из localStorage
    return localStorage.getItem('token');
}

/**
 * Получает базовый URL API
 * @returns {string} Базовый URL API
 */
function getApiBase() {
    if (typeof API_BASE !== 'undefined') {
        return API_BASE;
    }
    if (typeof window !== 'undefined' && window.API_BASE) {
        return window.API_BASE;
    }
    return window.location.origin;
}

/**
 * Создает заголовки для запроса
 * @param {Object} customHeaders - Дополнительные заголовки
 * @param {boolean} includeAuth - Включать ли токен авторизации (по умолчанию true)
 * @returns {Object} Объект с заголовками
 */
function createHeaders(customHeaders = {}, includeAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
}

/**
 * Обрабатывает ответ от API
 * @param {Response} response - Объект Response от fetch
 * @returns {Promise<Object>} Распарсенный JSON или ошибка
 */
async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorText = await response.text();
            if (errorText) {
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.detail || errorText;
                } catch {
                    errorMessage = errorText;
                }
            }
        } catch (e) {
            // Если не удалось прочитать текст ошибки, используем стандартное сообщение
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = response;
        throw error;
    }

    // Если ответ пустой (204 No Content), возвращаем null
    if (response.status === 204) {
        return null;
    }

    // Пытаемся распарсить JSON
    try {
        return await response.json();
    } catch (e) {
        // Если не JSON, возвращаем текст
        return await response.text();
    }
}

/**
 * Выполняет GET запрос
 * @param {string} endpoint - Endpoint (без базового URL)
 * @param {Object} options - Дополнительные опции (headers, includeAuth и т.д.)
 * @returns {Promise<Object>} Ответ от API
 */
async function apiGet(endpoint, options = {}) {
    const { headers: customHeaders = {}, includeAuth = true, ...fetchOptions } = options;
    const apiBase = getApiBase();
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: createHeaders(customHeaders, includeAuth),
            ...fetchOptions
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`[apiGet] Error fetching ${url}:`, error);
        throw error;
    }
}

/**
 * Выполняет POST запрос
 * @param {string} endpoint - Endpoint (без базового URL)
 * @param {Object} data - Данные для отправки
 * @param {Object} options - Дополнительные опции (headers, includeAuth и т.д.)
 * @returns {Promise<Object>} Ответ от API
 */
async function apiPost(endpoint, data = null, options = {}) {
    const { headers: customHeaders = {}, includeAuth = true, ...fetchOptions } = options;
    const apiBase = getApiBase();
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = createHeaders(customHeaders, includeAuth);
    
    // Если data null или undefined, не добавляем body
    const body = data !== null && data !== undefined ? JSON.stringify(data) : undefined;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
            ...fetchOptions
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`[apiPost] Error posting to ${url}:`, error);
        throw error;
    }
}

/**
 * Выполняет PUT запрос
 * @param {string} endpoint - Endpoint (без базового URL)
 * @param {Object} data - Данные для отправки
 * @param {Object} options - Дополнительные опции (headers, includeAuth и т.д.)
 * @returns {Promise<Object>} Ответ от API
 */
async function apiPut(endpoint, data = null, options = {}) {
    const { headers: customHeaders = {}, includeAuth = true, ...fetchOptions } = options;
    const apiBase = getApiBase();
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = createHeaders(customHeaders, includeAuth);
    const body = data !== null && data !== undefined ? JSON.stringify(data) : undefined;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body,
            ...fetchOptions
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`[apiPut] Error putting to ${url}:`, error);
        throw error;
    }
}

/**
 * Выполняет DELETE запрос
 * @param {string} endpoint - Endpoint (без базового URL)
 * @param {Object} options - Дополнительные опции (headers, includeAuth и т.д.)
 * @returns {Promise<Object>} Ответ от API
 */
async function apiDelete(endpoint, options = {}) {
    const { headers: customHeaders = {}, includeAuth = true, ...fetchOptions } = options;
    const apiBase = getApiBase();
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: createHeaders(customHeaders, includeAuth),
            ...fetchOptions
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`[apiDelete] Error deleting ${url}:`, error);
        throw error;
    }
}

/**
 * Выполняет PATCH запрос
 * @param {string} endpoint - Endpoint (без базового URL)
 * @param {Object} data - Данные для отправки
 * @param {Object} options - Дополнительные опции (headers, includeAuth и т.д.)
 * @returns {Promise<Object>} Ответ от API
 */
async function apiPatch(endpoint, data = null, options = {}) {
    const { headers: customHeaders = {}, includeAuth = true, ...fetchOptions } = options;
    const apiBase = getApiBase();
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = createHeaders(customHeaders, includeAuth);
    const body = data !== null && data !== undefined ? JSON.stringify(data) : undefined;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers,
            body,
            ...fetchOptions
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`[apiPatch] Error patching ${url}:`, error);
        throw error;
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.apiGet = apiGet;
    window.apiPost = apiPost;
    window.apiPut = apiPut;
    window.apiDelete = apiDelete;
    window.apiPatch = apiPatch;
    window.getAuthToken = getAuthToken;
    window.getApiBase = getApiBase;
}
