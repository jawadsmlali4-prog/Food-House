// ==========================================
// 1. قائمة التنقل المتحركة (Mobile Menu)
// ==========================================
document.addEventListener('DOMContentLoaded', function () {

  // إنشاء زر القائمة للهواتف
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '☰';
  menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
  header.querySelector('.header-content').insertBefore(menuToggle, nav);

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.innerHTML = nav.classList.contains('open') ? '✕' : '☰';
  });

  // إغلاق القائمة عند النقر على رابط
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.innerHTML = '☰';
    });
  });

  // ==========================================
  // 2. تمرير سلس (Smooth Scroll)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================
  // 3. تمييز الرابط النشط أثناء التمرير
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 4. التحقق من نموذج الحجز (Validation)
  // ==========================================
  const form = document.querySelector('.reservation-form');
  
  if (form) {
    const nom = document.getElementById('nom');
    const prenom = document.getElementById('prenom');
    const email = document.getElementById('email');
    const date = document.getElementById('date');
    const personnes = document.getElementById('personnes');
    const message = document.getElementById('message');

    // دالة عرض الخطأ
    function showError(input, message) {
      input.classList.add('error');
      input.classList.remove('success');
      let errorMsg = input.parentElement.querySelector('.error-msg');
      if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-msg';
        input.parentElement.appendChild(errorMsg);
      }
      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
    }

    // دالة إزالة الخطأ
    function clearError(input) {
      input.classList.remove('error');
      input.classList.add('success');
      const errorMsg = input.parentElement.querySelector('.error-msg');
      if (errorMsg) errorMsg.style.display = 'none';
    }

    // تحقق من كل حقل
    function validateNom() {
      const val = nom.value.trim();
      if (val.length < 3) {
        showError(nom, 'Le nom doit contenir au moins 3 caractères.');
        return false;
      }
      if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(val)) {
        showError(nom, 'Le nom ne doit contenir que des lettres.');
        return false;
      }
      clearError(nom);
      return true;
    }

    function validatePrenom() {
      const val = prenom.value.trim();
      if (val.length < 3) {
        showError(prenom, 'Le prénom doit contenir au moins 3 caractères.');
        return false;
      }
      if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(val)) {
        showError(prenom, 'Le prénom ne doit contenir que des lettres.');
        return false;
      }
      clearError(prenom);
      return true;
    }

    function validateEmail() {
      const val = email.value.trim();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(val)) {
        showError(email, 'Veuillez entrer un e-mail valide.');
        return false;
      }
      clearError(email);
      return true;
    }

    function validateDate() {
      const val = date.value;
      if (!val) {
        showError(date, 'Veuillez choisir une date.');
        return false;
      }
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        showError(date, 'La date ne peut pas être dans le passé.');
        return false;
      }
      clearError(date);
      return true;
    }

    function validatePersonnes() {
      const val = parseInt(personnes.value);
      if (isNaN(val) || val < 1 || val > 20) {
        showError(personnes, 'Le nombre doit être entre 1 et 20.');
        return false;
      }
      clearError(personnes);
      return true;
    }

    function validateMessage() {
      const val = message.value.trim();
      if (val.length > 200) {
        showError(message, 'Le message ne doit pas dépasser 200 caractères.');
        return false;
      }
      clearError(message);
      return true;
    }

    // تحقق فوري عند الكتابة
    nom.addEventListener('blur', validateNom);
    prenom.addEventListener('blur', validatePrenom);
    email.addEventListener('blur', validateEmail);
    date.addEventListener('change', validateDate);
    personnes.addEventListener('blur', validatePersonnes);
    message.addEventListener('blur', validateMessage);

    // عدّاد الأحرف للمessage
    message.addEventListener('input', () => {
      let counter = message.parentElement.querySelector('.char-counter');
      if (!counter) {
        counter = document.createElement('small');
        counter.className = 'char-counter';
        message.parentElement.appendChild(counter);
      }
      counter.textContent = `${message.value.length} / 200 caractères`;
      counter.style.color = message.value.length > 200 ? '#e74c3c' : '#777';
    });

    // عند إرسال النموذج
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const valid =
        validateNom() &
        validatePrenom() &
        validateEmail() &
        validateDate() &
        validatePersonnes() &
        validateMessage();

      if (valid) {
        // رسالة نجاح
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
          ✅ <strong>Réservation envoyée!</strong><br>
          Merci ${nom.value}, nous vous contacterons bientôt à ${email.value}.
        `;
        form.appendChild(successMsg);
        form.reset();
        
        // إزالة رسائل النجاح بعد 5 ثوان
        setTimeout(() => successMsg.remove(), 5000);
      }
    });
  }

  // ==========================================
  // 5. تأثير ظهور العناصر عند التمرير (Fade In)
  // ==========================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section, .menu-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // ==========================================
  // 6. زر العودة إلى الأعلى (Back to Top)
  // ==========================================
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.innerHTML = '↑';
  topBtn.setAttribute('aria-label', 'Retour en haut');
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 400);
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
