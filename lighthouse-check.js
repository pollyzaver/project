// Lighthouse audit helper
class LighthouseAudit {
    constructor() {
        this.commonIssues = {
            'aria-allowed-attr': 'Используются недопустимые ARIA атрибуты',
            'aria-required-attr': 'Отсутствуют обязательные ARIA атрибуты',
            'aria-required-children': 'Отсутствуют обязательные дочерние ARIA элементы',
            'aria-required-parent': 'Отсутствует обязательный родительский ARIA элемент',
            'aria-roles': 'Используются недопустимые ARIA роли',
            'aria-valid-attr-value': 'Некорректные значения ARIA атрибутов',
            'button-name': 'Кнопки без доступного имени',
            'color-contrast': 'Недостаточная контрастность цветов',
            'document-title': 'Отсутствует или некорректный заголовок документа',
            'duplicate-id': 'Дублирующиеся ID элементов',
            'form-field-multiple-labels': 'Несколько меток для поля формы',
            'frame-title': 'Фреймы без заголовков',
            'html-has-lang': 'Отсутствует языковой атрибут HTML',
            'html-lang-valid': 'Некорректное значение языкового атрибута',
            'image-alt': 'Изображения без альтернативного текста',
            'input-image-alt': 'Изображения-кнопки без альтернативного текста',
            'label': 'Элементы формы без меток',
            'link-name': 'Ссылки без доступного имени',
            'list': 'Списки без корректной разметки',
            'listitem': 'Элементы списка без родительского списка',
            'meta-viewport': 'Некорректный viewport',
            'video-caption': 'Видео без субтитров'
        };
    }

    // Manual accessibility checks
    manualChecks() {
        const checks = {
            'Семантика': this.checkSemantics(),
            'Навигация': this.checkNavigation(),
            'Формы': this.checkForms(),
            'Цвет и контраст': this.checkColorContrast(),
            'Клавиатура': this.checkKeyboardAccess(),
            'Фокус': this.checkFocusManagement()
        };

        return checks;
    }

    checkSemantics() {
        const issues = [];
        
        // Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.substring(1)));
        
        // Check for heading hierarchy
        for (let i = 1; i < headingLevels.length; i++) {
            if (headingLevels[i] > headingLevels[i - 1] + 1) {
                issues.push('Некорректная иерархия заголовков');
                break;
            }
        }

        // Check for semantic elements
        const semanticElements = ['header', 'nav', 'main', 'footer', 'section', 'article', 'aside'];
        semanticElements.forEach(tag => {
            if (!document.querySelector(tag)) {
                issues.push(`Отсутствует семантический элемент <${tag}>`);
            }
        });

        return issues.length ? issues : ['✅ Семантическая разметка корректна'];
    }

    checkNavigation() {
        const issues = [];
        
        // Check skip link
        const skipLink = document.querySelector('.skip-link');
        if (!skipLink) {
            issues.push('Отсутствует skip-link для навигации с клавиатуры');
        }

        // Check navigation landmarks
        const navs = document.querySelectorAll('nav');
        navs.forEach((nav, index) => {
            if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
                issues.push(`Навигация #${index + 1} без метки для скринридеров`);
            }
        });

        return issues.length ? issues : ['✅ Навигация доступна'];
    }

    checkForms() {
        const issues = [];
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // Check labels
                if (!input.labels.length && input.type !== 'hidden') {
                    issues.push(`Поле ввода без метки в форме #${index + 1}`);
                }

                // Check required fields
                if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
                    issues.push(`Обязательное поле без aria-required в форме #${index + 1}`);
                }
            });
        });

        return issues.length ? issues : ['✅ Формы доступны'];
    }

    checkColorContrast() {
        // This would typically use a contrast checking library
        return ['⚠️ Проверьте контрастность вручную с помощью DevTools'];
    }

    checkKeyboardAccess() {
        const issues = [];
        
        // Check interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        
        interactiveElements.forEach(el => {
            if (el.offsetParent !== null) { // Only visible elements
                const tabIndex = el.getAttribute('tabindex');
                if (tabIndex && parseInt(tabIndex) < 0 && el.tabIndex >= 0) {
                    issues.push('Элемент с tabindex="-1" может получить фокус');
                }
            }
        });

        return issues.length ? issues : ['✅ Клавиатурная навигация доступна'];
    }

    checkFocusManagement() {
        const issues = [];
        
        // Check focus indicators
        const style = getComputedStyle(document.documentElement);
        const outlineStyle = style.getPropertyValue('outline-style');
        
        if (outlineStyle === 'none') {
            issues.push('Возможно отключены стили фокуса');
        }

        return issues.length ? issues : ['✅ Управление фокусом настроено'];
    }

    generateReport() {
        const report = this.manualChecks();
        console.group('🔍 Accessibility Audit Report');
        
        Object.entries(report).forEach(([category, issues]) => {
            console.group(category);
            issues.forEach(issue => console.log(issue));
            console.groupEnd();
        });
        
        console.groupEnd();
        return report;
    }
}

// Run audit when needed
if (process.env.NODE_ENV === 'development') {
    document.addEventListener('DOMContentLoaded', () => {
        const audit = new LighthouseAudit();
        audit.generateReport();
    });
}