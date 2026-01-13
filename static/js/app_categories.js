// ============= CATEGORIES MODULE =============
// Управление категориями

// Зависимости: app_utils.js, app_auth.js (должны быть загружены первыми)

// ============= CATEGORIES STATE =============
let allCategories = { standard: [], custom: [], all: [] };

// ============= LOAD CATEGORIES =============
async function loadCategories() {
    try {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (!token) {
            // Даже без токена обновляем dropdown с базовыми категориями
            if (typeof window.updateCategoryDropdown === 'function') {
                window.updateCategoryDropdown('activity-category');
                window.updateCategoryDropdown('edit-activity-category');
            }
            return;
        }

        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const res = await fetch(`${apiBase}/categories/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("Failed to load categories:", res.status);
            // Обновляем dropdown с базовыми категориями даже при ошибке
            if (typeof window.updateCategoryDropdown === 'function') {
                window.updateCategoryDropdown('activity-category');
                window.updateCategoryDropdown('edit-activity-category');
            }
            return;
        }

        const data = await res.json();
        allCategories = data;

        // Обновляем dropdown для создания активности
        if (typeof window.updateCategoryDropdown === 'function') {
            window.updateCategoryDropdown('activity-category');
            // Обновляем dropdown для редактирования активности
            window.updateCategoryDropdown('edit-activity-category');
        }
        
        // Обновляем селект категорий в админ панели
        if (typeof window.updateAdminCategoryFilter === 'function') {
            window.updateAdminCategoryFilter();
        }

        // Обновляем список категорий в модальном окне, если оно открыто
        const categoryModal = document.getElementById('category-modal');
        if (categoryModal && !categoryModal.classList.contains('hidden')) {
            if (typeof window.renderCustomCategoriesList === 'function') {
                window.renderCustomCategoriesList();
            }
        }

        // Перерисовываем активности, если они уже были загружены, чтобы обновить названия категорий
        const allActivities = typeof window !== 'undefined' && window.allActivities ? window.allActivities : [];
        if (allActivities && allActivities.length > 0) {
            if (typeof window.applyActivitiesFilters === 'function') {
                window.applyActivitiesFilters();
            }
        }
    } catch (e) {
        console.error("Error loading categories:", e);
        // Обновляем dropdown с базовыми категориями даже при ошибке
        if (typeof window.updateCategoryDropdown === 'function') {
            window.updateCategoryDropdown('activity-category');
            window.updateCategoryDropdown('edit-activity-category');
        }
    }
}

// ============= UPDATE CATEGORY DROPDOWN =============
function updateCategoryDropdown(selectId) {
    const hiddenInput = document.getElementById(selectId);
    const button = document.getElementById(`${selectId}-button`);
    const textSpan = document.getElementById(`${selectId}-text`);
    const dropdown = document.getElementById(`${selectId}-dropdown`);

    if (!hiddenInput || !button || !textSpan || !dropdown) {
        console.warn(`Custom dropdown elements for ${selectId} not found:`, {
            hiddenInput: !!hiddenInput,
            button: !!button,
            textSpan: !!textSpan,
            dropdown: !!dropdown
        });
        return;
    }

    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    // Устанавливаем "Общее" по умолчанию, если значение не установлено или пустое
    if (!hiddenInput.value || hiddenInput.value === '') {
        hiddenInput.value = 'general';
        if (textSpan) {
            const generalCat = allCategories.standard?.find(c => c.id === 'general') || { name: t('category_general') };
            textSpan.textContent = generalCat.name;
        }
    }

    const currentValue = hiddenInput.value || 'general';

    // Очищаем dropdown
    dropdown.innerHTML = '';

    // Добавляем стандартные категории (с fallback если еще не загружены)
    const standardCats = allCategories.standard && allCategories.standard.length > 0
        ? allCategories.standard
        : [
            {id: "general", name: "Общее"},
            {id: "study", name: "Учеба"},
            {id: "sport", name: "Спорт"},
            {id: "hobby", name: "Хобби"},
            {id: "work", name: "Работа"},
            {id: "health", name: "Здоровье"}
        ];

    // Определяем, какие стандартные категории были заменены пользовательскими
    const replacedStandardCategories = new Set();
    if (allCategories.custom && allCategories.custom.length > 0) {
        allCategories.custom.forEach(cat => {
            if (cat.replaced_standard_category) {
                replacedStandardCategories.add(cat.replaced_standard_category);
            }
        });
    }

    // Добавляем стандартные категории, пропуская те, что были заменены пользовательскими
    standardCats.forEach(cat => {
        if (!replacedStandardCategories.has(cat.id)) {
            const option = createDropdownOption(cat.id, cat.name, false, null, selectId);
            dropdown.appendChild(option);
        } else {
            const replacement = allCategories.custom.find(c => c.replaced_standard_category === cat.id);
            if (replacement) {
                const option = createDropdownOption(replacement.id, replacement.name, true, replacement, selectId);
                dropdown.appendChild(option);
            }
        }
    });

    // Добавляем остальные пользовательские категории (которые не заменяют стандартные)
    const nonReplacementCustom = allCategories.custom?.filter(cat => !cat.replaced_standard_category) || [];
    if (nonReplacementCustom.length > 0) {
        const separator = document.createElement('div');
        separator.className = 'px-4 py-2 text-gray-400 text-xs border-t border-gray-200';
        separator.textContent = '──────────';
        dropdown.appendChild(separator);

        nonReplacementCustom.forEach(cat => {
            const option = createDropdownOption(cat.id, cat.name, true, cat, selectId);
            dropdown.appendChild(option);
        });
    }

    // Всегда добавляем кнопку "Добавить категорию" в конец списка
    const addOption = document.createElement('div');
    addOption.className = 'px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between border-t border-gray-200';
    addOption.innerHTML = `<span class="text-blue-600 font-semibold">➕ ${t('add_category')}</span>`;
    addOption.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdown(selectId);
        if (typeof window.openCategoryModal === 'function') {
            window.openCategoryModal();
        }
    };
    dropdown.appendChild(addOption);

    console.log(`Dropdown ${selectId} updated:`, {
        standardCats: standardCats.length,
        customCats: allCategories.custom?.length || 0,
        addOptionAdded: true
    });

    // Обновляем отображаемый текст
    const selectedCat = [...standardCats, ...(allCategories.custom || [])].find(c => c.id === currentValue);
    if (selectedCat) {
        textSpan.textContent = selectedCat.name;
        hiddenInput.value = currentValue;
    } else {
        const generalCat = standardCats.find(c => c.id === 'general');
        textSpan.textContent = generalCat ? generalCat.name : t('category_general');
        hiddenInput.value = 'general';
    }

    // Обработчик открытия/закрытия dropdown
    if (!button._dropdownHandler) {
        button._dropdownHandler = (e) => {
            e.stopPropagation();
            const isOpen = !dropdown.classList.contains('hidden');
            if (isOpen) {
                closeDropdown(selectId);
            } else {
                openDropdown(selectId);
            }
        };
        button.addEventListener('click', button._dropdownHandler);
    }

    // Закрываем dropdown при клике вне его
    if (!document._categoryDropdownHandler) {
        document._categoryDropdownHandler = (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                closeDropdown('activity-category');
                closeDropdown('edit-activity-category');
            }
        };
        document.addEventListener('click', document._categoryDropdownHandler);
    }
}

function createDropdownOption(value, name, isCustom, categoryData, selectId) {
    const option = document.createElement('div');
    option.className = 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group min-w-0';
    option.dataset.value = value;
    option.dataset.isCustom = isCustom ? 'true' : 'false';

    const leftPart = document.createElement('div');
    leftPart.className = 'flex-1 min-w-0 pr-2 text-center';
    leftPart.textContent = name;
    leftPart.style.wordBreak = 'break-word';

    option.appendChild(leftPart);

    // Категория "Общее" - захардкоженная, без кнопок редактирования и удаления
    if (value === 'general') {
        option.className = 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-center group min-w-0';
        leftPart.className = 'text-center';
        option.onclick = (e) => {
            e.stopPropagation();
            selectCategoryOption(selectId, value, name);
        };
        return option;
    }

    // Добавляем кнопки редактирования для всех остальных категорий
    const actions = document.createElement('div');
    actions.className = isCustom ? 'flex items-center gap-1' : 'flex items-center gap-0.5';

    // Кнопка редактирования
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors';
    editBtn.innerHTML = '<i class="fas fa-pencil-alt text-xs"></i>';
    editBtn.title = 'Редактировать категорию';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdown(selectId);
        if (isCustom && categoryData) {
            if (typeof window.openCategoryModal === 'function') {
                window.openCategoryModal(categoryData.id, categoryData.name);
            }
        } else {
            if (typeof window.openCategoryModal === 'function') {
                window.openCategoryModal(null, name, value);
            }
        }
    };

    actions.appendChild(editBtn);

    // Кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);
    
    if (isCustom && categoryData) {
        deleteBtn.className = 'p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors';
        deleteBtn.title = 'Удалить категорию (активности перейдут в "Общее")';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            closeDropdown(selectId);
            if (typeof window.deleteCategory === 'function') {
                window.deleteCategory(categoryData.id);
            }
        };
    } else {
        deleteBtn.className = 'p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer';
        deleteBtn.title = 'Стандартные категории нельзя удалить';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            showNotification('❌ Стандартные категории нельзя удалить', 'error');
        };
    }
    deleteBtn.innerHTML = '<i class="fas fa-trash text-xs"></i>';
    actions.appendChild(deleteBtn);

    option.appendChild(actions);

    // При клике на опцию выбираем её
    option.onclick = (e) => {
        if (e.target.closest('button')) return;
        selectCategoryOption(selectId, value, name);
    };

    return option;
}

function selectCategoryOption(selectId, value, name) {
    const hiddenInput = document.getElementById(selectId);
    const textSpan = document.getElementById(`${selectId}-text`);

    if (hiddenInput && textSpan) {
        hiddenInput.value = value;
        textSpan.textContent = name;
        closeDropdown(selectId);

        const event = new Event('change', { bubbles: true });
        hiddenInput.dispatchEvent(event);
    }
}

function openDropdown(selectId) {
    const dropdown = document.getElementById(`${selectId}-dropdown`);
    const button = document.getElementById(`${selectId}-button`);
    if (dropdown && button) {
        dropdown.classList.remove('hidden');
        const icon = button.querySelector('i');
        if (icon) icon.classList.add('rotate-180');
    }
}

function closeDropdown(selectId) {
    const dropdown = document.getElementById(`${selectId}-dropdown`);
    const button = document.getElementById(`${selectId}-button`);
    if (dropdown && button) {
        dropdown.classList.add('hidden');
        const icon = button.querySelector('i');
        if (icon) icon.classList.remove('rotate-180');
    }
}

// ============= CATEGORY MODAL =============
function openCategoryModal(categoryId = null, categoryName = null, standardCategoryId = null) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('category-modal-title');
    const nameInput = document.getElementById('category-name');
    const idInput = document.getElementById('category-id');

    if (categoryId && categoryName) {
        if (title) title.textContent = 'Редактировать категорию';
        if (idInput) idInput.value = categoryId;
        if (nameInput) nameInput.value = categoryName;
        if (idInput) {
            delete idInput.dataset.originalName;
            delete idInput.dataset.originalValue;
        }
    } else if (categoryName) {
        if (title) title.textContent = 'Редактировать категорию';
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = categoryName;
        if (idInput) {
            idInput.dataset.originalName = categoryName;
            idInput.dataset.originalValue = standardCategoryId || categoryName;
        }
    } else {
        if (title) title.textContent = 'Добавить категорию';
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = '';
        if (idInput) {
            delete idInput.dataset.originalName;
            delete idInput.dataset.originalValue;
        }
    }

    if (typeof window.renderCustomCategoriesList === 'function') {
        window.renderCustomCategoriesList();
    }

    if (modal) modal.classList.remove('hidden');
}

function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.classList.add('hidden');
    
    const form = document.getElementById('category-form');
    if (form) form.reset();
}

async function saveCategory() {
    const nameInput = document.getElementById('category-name');
    const idInput = document.getElementById('category-id');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name) {
        alert('Введите название категории');
        return;
    }

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);
        
        let res;
        if (idInput && idInput.value) {
            // Редактирование
            const dbId = idInput.value.replace('custom_', '');
            res = await fetch(`${apiBase}/categories/${dbId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });
        } else {
            // Создание новой категории или редактирование стандартной
            const originalName = idInput?.dataset.originalName;
            const originalValue = idInput?.dataset.originalValue;

            if (originalName && originalValue) {
                // Редактируем стандартную категорию
                const existingCategory = allCategories.custom?.find(cat => cat.name === originalName);

                if (existingCategory) {
                    const dbId = existingCategory.id.replace('custom_', '');
                    res = await fetch(`${apiBase}/categories/${dbId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ name })
                    });
                } else {
                    res = await fetch(`${apiBase}/categories/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: name,
                            replace_standard_category: originalValue
                        })
                    });
                }
            } else {
                // Создание новой категории
                res = await fetch(`${apiBase}/categories/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name })
                });
            }
        }

        if (!res.ok) {
            let errorMessage = 'Ошибка сохранения категории';
            try {
                const errorData = await res.json();
                errorMessage = errorData.detail || errorMessage;
            } catch (e) {
                const text = await res.text().catch(() => '');
                if (text.includes('уже существует') || text.includes('already exists') || text.includes('duplicate')) {
                    errorMessage = 'Категория с таким названием уже существует';
                }
            }

            if (errorMessage.includes('уже существует') || errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
                showNotification('❌ Категория с таким названием уже существует!', 'error');
            } else if (errorMessage.includes('no such table')) {
                showNotification('❌ Ошибка базы данных. Обратитесь к администратору.', 'error');
            } else {
                showNotification(`❌ ${errorMessage}`, 'error');
            }
            return;
        }

        const newData = await res.json();
        await loadCategories();
        if (typeof window.renderCustomCategoriesList === 'function') {
            window.renderCustomCategoriesList();
        }

        // Если редактировали стандартную категорию, обновляем все активности
        const originalValue = idInput?.dataset.originalValue;
        if (originalValue && newData.id) {
            if (typeof window.loadActivities === 'function') {
                await window.loadActivities();
            }
        }

        // Обновляем dropdown категорий
        if (typeof window.updateCategoryDropdown === 'function') {
            window.updateCategoryDropdown('activity-category');
            window.updateCategoryDropdown('edit-activity-category');
        }

        // Обновляем выбранную категорию в активных dropdown
        const activityCategory = document.getElementById('activity-category');
        const activityCategoryText = document.getElementById('activity-category-text');
        const editCategory = document.getElementById('edit-activity-category');
        const editCategoryText = document.getElementById('edit-activity-category-text');

        const originalName = idInput?.dataset.originalName;
        if (originalValue && newData.id) {
            if (activityCategory && activityCategoryText) {
                if (activityCategory.value === originalValue || activityCategoryText.textContent === originalName) {
                    activityCategory.value = newData.id;
                    activityCategoryText.textContent = newData.name;
                }
            }
            if (editCategory && editCategoryText) {
                if (editCategory.value === originalValue || editCategoryText.textContent === originalName) {
                    editCategory.value = newData.id;
                    editCategoryText.textContent = newData.name;
                }
            }
        }

        if (idInput && idInput.value && newData.id) {
            if (activityCategory && activityCategoryText) {
                if (activityCategory.value === idInput.value) {
                    activityCategory.value = newData.id;
                    activityCategoryText.textContent = newData.name;
                }
            }
            if (editCategory && editCategoryText) {
                if (editCategory.value === idInput.value) {
                    editCategory.value = newData.id;
                    editCategoryText.textContent = newData.name;
                }
            }
        }

        // Автоматически выбираем сохраненную категорию в dropdown активности
        if (newData.id && activityCategory && activityCategoryText) {
            setTimeout(() => {
                selectCategoryOption('activity-category', newData.id, newData.name);
            }, 100);
        }

        closeCategoryModal();
        showNotification('✅ Категория сохранена!', 'success');
    } catch (e) {
        console.error('Error saving category:', e);
        alert('Ошибка сохранения категории');
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Удалить эту категорию? Активности с этой категорией будут переведены в "Общее".')) {
        return;
    }

    try {
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        const showNotification = typeof window !== 'undefined' && window.showNotification ? window.showNotification : (message, type) => console.log(`Notification (${type}): ${message}`);
        
        const dbId = categoryId.replace('custom_', '');
        const res = await fetch(`${apiBase}/categories/${dbId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || 'Ошибка удаления категории');
            return;
        }

        await loadCategories();
        if (typeof window.renderCustomCategoriesList === 'function') {
            window.renderCustomCategoriesList();
        }

        showNotification('✅ Категория удалена!', 'success');
    } catch (e) {
        console.error('Error deleting category:', e);
        alert('Ошибка удаления категории');
    }
}

function renderCustomCategoriesList() {
    const listContainer = document.getElementById('custom-categories-list');
    if (!listContainer) {
        console.warn('custom-categories-list container not found');
        return;
    }

    if (!allCategories.custom || allCategories.custom.length === 0) {
        listContainer.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">У вас пока нет пользовательских категорий</div>';
        return;
    }

    listContainer.innerHTML = allCategories.custom.map(cat => {
        const categoryName = (cat.name || 'Без названия').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const categoryId = cat.id || `custom_${cat.db_id}`;
        const dbId = cat.db_id || categoryId.replace('custom_', '');

        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span class="font-medium text-gray-800 flex-1">${categoryName}</span>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onclick="event.stopPropagation(); if(typeof window.openCategoryModal === 'function') window.openCategoryModal('${categoryId}', '${categoryName.replace(/&#39;/g, "'")}')"
                        class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Редактировать категорию">
                        <i class="fas fa-pencil-alt text-sm"></i>
                    </button>
                    <button
                        onclick="event.stopPropagation(); if(typeof window.deleteCategory === 'function') window.deleteCategory('${categoryId}')"
                        class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить категорию">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Инициализация формы категории
function initCategoryForm() {
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCategory();
        });
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.allCategories = allCategories;
    window.loadCategories = loadCategories;
    window.updateCategoryDropdown = updateCategoryDropdown;
    window.createDropdownOption = createDropdownOption;
    window.selectCategoryOption = selectCategoryOption;
    window.openDropdown = openDropdown;
    window.closeDropdown = closeDropdown;
    window.openCategoryModal = openCategoryModal;
    window.closeCategoryModal = closeCategoryModal;
    window.saveCategory = saveCategory;
    window.deleteCategory = deleteCategory;
    window.renderCustomCategoriesList = renderCustomCategoriesList;
    window.initCategoryForm = initCategoryForm;
}

// Инициализируем форму категории при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryForm);
} else {
    initCategoryForm();
}
