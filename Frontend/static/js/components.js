// ============= COMPONENT LOADER =============
// Простая система загрузки компонентов без фреймворков

/**
 * Загружает компонент (HTML + CSS) и вставляет в указанный контейнер
 * @param {string} componentName - имя компонента (например, 'header', 'footer')
 * @param {string} containerSelector - селектор контейнера для вставки (или 'body' для модальных окон)
 * @param {string} componentPath - путь к компоненту (опционально, по умолчанию используется componentName)
 * @returns {Promise<void>}
 */
async function loadComponent(componentName, containerSelector, componentPath = null) {
    try {
        const path = componentPath || componentName;
        const container = containerSelector === 'body' ? document.body : document.querySelector(containerSelector);
        
        if (!container) {
            console.warn(`Container not found: ${containerSelector}`);
            return;
        }

        // Загружаем HTML
        const htmlPath = componentPath 
            ? `/static/components/${componentPath}/${componentName}.html`
            : `/static/components/${componentName}/${componentName}.html`;
            
        const htmlResponse = await fetch(htmlPath);
        if (!htmlResponse.ok) {
            throw new Error(`Failed to load ${componentName}.html: ${htmlResponse.status}`);
        }
        const html = await htmlResponse.text();

        // Загружаем CSS
        const cssPath = componentPath
            ? `/static/components/${componentPath}/${componentName}.css`
            : `/static/components/${componentName}/${componentName}.css`;
            
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = cssPath;
        cssLink.onerror = () => console.warn(`Failed to load ${componentName}.css`);
        
        // Добавляем CSS в head, если его еще нет
        const existingLink = document.querySelector(`link[href="${cssPath}"]`);
        if (!existingLink) {
            document.head.appendChild(cssLink);
        }

        // Вставляем HTML
        if (containerSelector === 'body') {
            // Для модальных окон добавляем в конец body
            container.insertAdjacentHTML('beforeend', html);
        } else {
            // Для обычных компонентов заменяем содержимое контейнера
            container.innerHTML = html;
            // Убеждаемся, что контейнер виден после загрузки
            if (container.style.visibility === 'hidden' && container.innerHTML.trim() !== '') {
                container.style.visibility = 'visible';
            }
        }

        console.log(`✓ Component "${componentName}" loaded`);
    } catch (error) {
        console.error(`Error loading component "${componentName}":`, error);
    }
}

/**
 * Загружает несколько компонентов последовательно
 * @param {Array<{name: string, selector: string, path?: string}>} components
 * @returns {Promise<void>}
 */
async function loadComponents(components) {
    for (const component of components) {
        await loadComponent(component.name, component.selector, component.path);
    }
}

// Экспортируем функции для использования в других скриптах
if (typeof window !== 'undefined') {
    window.loadComponent = loadComponent;
    window.loadComponents = loadComponents;
}
