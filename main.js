// Основные элементы DOM
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phone = document.getElementById('phone');
let lastActive = null;

// ==================== МАСКА ДЛЯ ТЕЛЕФОНА ====================
if (phone) {
    phone.addEventListener('input', (e) => {
        // Получаем значение и оставляем только цифры
        let digits = e.target.value.replace(/\D/g, '');
        
        // Ограничиваем длину (11 цифр: код страны + 10 цифр номера)
        digits = digits.substring(0, 11);
        
        // Нормализация: если номер начинается с 8 (российский формат), меняем на 7
        if (digits.startsWith('8') && digits.length === 11) {
            digits = '7' + digits.substring(1);
        } else if (digits.startsWith('7') && digits.length === 11) {
            // Корректный формат с кодом страны 7
        } else if (digits.length === 10) {
            // Если ввели 10 цифр без кода страны, добавляем 7
            digits = '7' + digits;
        }
        
        // Форматируем номер по шаблону: +7 (XXX) XXX-XX-XX
        let formattedValue = '+7';
        
        if (digits.length > 1) {
            formattedValue += ' (' + digits.substring(1, 4);
        }
        if (digits.length >= 4) {
            // Завершаем скобку и добавляем следующие 3 цифры
            formattedValue = formattedValue.replace(' (', ' (') + ') ' + digits.substring(4, 7);
        }
        if (digits.length >= 7) {
            formattedValue += '-' + digits.substring(7, 9);
        }
        if (digits.length >= 9) {
            formattedValue += '-' + digits.substring(9, 11);
        }
        
        // Устанавливаем отформатированное значение
        e.target.value = formattedValue;
    });

    // Обработка клавиши Backspace для удобного удаления
    phone.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            // Небольшая задержка для корректной работы после удаления
            setTimeout(() => {
                const value = phone.value;
                const cursorPos = phone.selectionStart;
                
                // Если курсор находится сразу после разделителя, перемещаем его назад
                if (value[cursorPos - 1] === ' ' || value[cursorPos - 1] === '(' || 
                    value[cursorPos - 1] === ')' || value[cursorPos - 1] === '-') {
                    phone.setSelectionRange(cursorPos - 1, cursorPos - 1);
                }
            }, 10);
        }
    });
}

// ==================== УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ ====================
openBtn?.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    // Фокусируемся на первом поле формы
    dlg.querySelector('input, select, textarea, button')?.focus();
});

closeBtn?.addEventListener('click', () => {
    dlg.close('cancel');
});

// ==================== ВАЛИДАЦИЯ ФОРМЫ ====================
form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Сброс предыдущих ошибок
    Array.from(form.elements).forEach(el => {
        if (el.setCustomValidity) {
            el.setCustomValidity('');
        }
        el.removeAttribute('aria-invalid');
    });

    // Проверка валидности всей формы
    if (!form.checkValidity()) {
        // Кастомные сообщения об ошибках
        const email = form.elements.email;
        if (email && email.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        const topic = form.elements.topic;
        if (topic && topic.validity.valueMissing) {
            topic.setCustomValidity('Пожалуйста, выберите тему обращения');
        }

        // Показ системных сообщений об ошибках
        form.reportValidity();

        // Подсветка невалидных полей
        Array.from(form.elements).forEach(el => {
            if (el.willValidate && !el.checkValidity()) {
                el.setAttribute('aria-invalid', 'true');
            }
        });

        return;
    }

    // УСПЕШНАЯ ОТПРАВКА
    // Закрываем модальное окно
    dlg.close('success');
    // Сбрасываем форму
    form.reset();
    // Показываем сообщение об успехе
    alert('Форма успешно отправлена! Спасибо за обратную связь.');
});

// ==================== ОБРАБОТКА ЗАКРЫТИЯ МОДАЛКИ ====================
dlg?.addEventListener('close', () => {
    // Возвращаем фокус на кнопку, которая открывала модальное окно
    lastActive?.focus();
});

// ==================== ДОПОЛНИТЕЛЬНАЯ ВАЛИДАЦИЯ ПРИ ВВОДЕ ====================
// Сбрасываем состояние ошибки при начале редактирования поля
form?.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
        if (field.hasAttribute('aria-invalid')) {
            field.removeAttribute('aria-invalid');
            field.setCustomValidity('');
        }
    });
});

// ==================== ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРЕЙ ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});