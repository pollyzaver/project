// Обработка формы контактов
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Простая валидация
        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const message = document.getElementById('contact-message');
        
        if (!name.value || !email.value || !message.value) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Имитация отправки
        alert('Сообщение отправлено! Мы свяжемся с вами в течение 2 часов.');
        contactForm.reset();
    });
}

// Маска для телефона на странице контактов
const contactPhone = document.getElementById('contact-phone');
if (contactPhone) {
    contactPhone.addEventListener('input', function(e) {
        let digits = e.target.value.replace(/\D/g, '');
        digits = digits.substring(0, 11);
        
        if (digits.startsWith('8')) {
            digits = '7' + digits.substring(1);
        } else if (digits.length === 10) {
            digits = '7' + digits;
        }
        
        let formattedValue = '+7';
        if (digits.length > 1) formattedValue += ' (' + digits.substring(1, 4);
        if (digits.length >= 4) formattedValue += ') ' + digits.substring(4, 7);
        if (digits.length >= 7) formattedValue += '-' + digits.substring(7, 9);
        if (digits.length >= 9) formattedValue += '-' + digits.substring(9, 11);
        
        e.target.value = formattedValue;
    });
}