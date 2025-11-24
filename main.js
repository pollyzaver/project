(function(){
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const overlay = document.querySelector('.overlay');
  const body = document.body;

  /* ----------- MOBILE NAV ----------- */

  function openNav(){
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded','true');
    siteNav.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('menu-open');
  }

  function closeNav(){
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded','false');
    siteNav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('menu-open');
  }

  navToggle && navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.classList.contains('active');
    expanded ? closeNav() : openNav();
  });

  overlay && overlay.addEventListener('click', closeNav);

  // Закрытие меню по клику на ссылки
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeNav();
      }
    });
  });

  // Закрытие меню при ресайзе окна
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && siteNav.classList.contains('active')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(siteNav.classList.contains('active')) closeNav();
    }
  });

  /* ----------- FILTERS ----------- */

  const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
  const products = Array.from(document.querySelectorAll('.product-card'));

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Обновляем активную кнопку
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Фильтруем продукты
      const filter = btn.dataset.filter;

      products.forEach(p => {
        if (filter === 'all' || p.dataset.category === filter) {
          p.style.display = '';
          p.style.opacity = '0';
          p.style.transform = 'translateY(20px)';
          
          // Анимация появления
          setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
            p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          }, 50);
        } else {
          p.style.display = 'none';
        }
      });

      // После фильтрации сбрасываем пагинацию на первую страницу
      setTimeout(() => {
        initPagination();
      }, 100);
    });
  });

  /* ----------- PAGINATION ----------- */

  function initPagination() {
    const productCards = document.querySelectorAll('.product-card');
    const paginationPages = document.querySelector('.pagination-pages');
    const paginationPrev = document.querySelector('.pagination-prev');
    const paginationNext = document.querySelector('.pagination-next');
    
    const itemsPerPage = 9;
    let currentPage = 1;
    
    // Фильтруем только видимые карточки (после применения фильтров)
    const visibleProducts = Array.from(productCards).filter(card => {
      return card.style.display !== 'none';
    });
    
    // Считаем общее количество страниц
    const totalPages = Math.ceil(visibleProducts.length / itemsPerPage);
    
    // Создаем кнопки страниц
    function createPaginationButtons() {
      paginationPages.innerHTML = '';
      
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-page ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => goToPage(i));
        paginationPages.appendChild(pageButton);
      }
    }
    
    // Переход на страницу
    function goToPage(page) {
      currentPage = page;
      
      // Сначала скрываем все карточки
      productCards.forEach(card => {
        card.style.display = 'none';
      });
      
      // Показываем только видимые карточки для текущей страницы
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      visibleProducts.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
          card.style.display = '';
          // Добавляем анимацию появления
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }
      });
      
      // Обновляем активную кнопку
      document.querySelectorAll('.pagination-page').forEach((btn, index) => {
        btn.classList.toggle('active', index + 1 === currentPage);
      });
      
      // Обновляем состояние кнопок вперед/назад
      if (paginationPrev) paginationPrev.disabled = currentPage === 1;
      if (paginationNext) paginationNext.disabled = currentPage === totalPages;
    }
    
    // Инициализация только если есть карточки
    if (visibleProducts.length > 0 && paginationPages) {
      createPaginationButtons();
      
      // Обработчики кнопок вперед/назад
      if (paginationPrev) {
        paginationPrev.addEventListener('click', () => {
          if (currentPage > 1) goToPage(currentPage - 1);
        });
      }
      
      if (paginationNext) {
        paginationNext.addEventListener('click', () => {
          if (currentPage < totalPages) goToPage(currentPage + 1);
        });
      }
      
      // Показываем первую страницу при загрузке
      goToPage(1);
    }
  }

  /* ----------- SKIP LINK ----------- */

  const skipLink = document.querySelector('.skip-link');

  if(skipLink){
    skipLink.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(target){
        target.setAttribute('tabindex', '-1');
        target.focus();
        
        // Прокрутка к элементу с плавной анимацией
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Убираем tabindex после фокуса
        setTimeout(() => {
          target.removeAttribute('tabindex');
        }, 1000);
      }
    });
  }

  /* ----------- ENHANCE ANIMATIONS ----------- */

  // Добавляем плавное появление элементов при скролле
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Инициализируем всё при загрузке
  document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initPagination();
  });

})();