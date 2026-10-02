/* ==========================================================================
   POGA FARM - Interactive JavaScript
   Ref: https://www.b-egg.farm/
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initMobileDrawer();
  initBackgroundCarousel();
  initProductTabs();
  initRecipeModal();
  initContactForm();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Interactive Preloader Animation (0% to 100%)
   -------------------------------------------------------------------------- */
function initPreloader() {
  const loaderScreen = document.getElementById('loader-screen');
  const loaderNumber = document.getElementById('loader-number');
  const loaderBarFill = document.getElementById('loader-bar-fill');
  
  if (!loaderScreen || !loaderNumber) return;
  
  let currentProgress = 0;
  const duration = 1400; // ms
  const interval = 20; // ms
  const step = 100 / (duration / interval);
  
  const timer = setInterval(() => {
    currentProgress += step;
    if (currentProgress >= 100) {
      currentProgress = 100;
      clearInterval(timer);
      
      loaderNumber.textContent = '100';
      if (loaderBarFill) loaderBarFill.style.width = '100%';
      
      setTimeout(() => {
        loaderScreen.classList.add('loaded');
        document.body.style.overflow = 'auto';
      }, 300);
    } else {
      const rounded = Math.floor(currentProgress);
      loaderNumber.textContent = rounded;
      if (loaderBarFill) loaderBarFill.style.width = rounded + '%';
    }
  }, interval);
}

/* --------------------------------------------------------------------------
   2. Sticky Navbar & ScrollSpy Highlight
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Drawer & Auto-Close Handler
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('mobile-close');
  const drawer = document.getElementById('mobile-drawer');
  const allDrawerLinks = document.querySelectorAll('.drawer-link, .nav-link, a[href^="#"]');

  if (!drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  allDrawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* --------------------------------------------------------------------------
   4. 15-Second Auto-Rotating Product Background Carousel
   -------------------------------------------------------------------------- */
function initBackgroundCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-indicators .dot');
  
  if (!slides.length) return;

  let currentSlide = 0;
  const slideIntervalTime = 15000; // 15 seconds

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  let carouselTimer = setInterval(nextSlide, slideIntervalTime);

  // Allow manual dot click
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.dataset.slide);
      if (!isNaN(slideIndex)) {
        clearInterval(carouselTimer);
        goToSlide(slideIndex);
        carouselTimer = setInterval(nextSlide, slideIntervalTime);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Product Category Switcher (Matching b-egg.farm data)
   -------------------------------------------------------------------------- */
const productData = {
  eggs: {
    title: 'pasture-raised organic eggs',
    tag: 'Liquid egg products',
    image: 'images/eggs.jpg',
    desc: 'Liquid egg products are a ready-to-use ingredient that minimizes your time in the kitchen. Produced in state-of-the-art facilities with strict zero antibiotic standards.',
    cat: 'Whole Egg, Whites & Yolks',
    vol: '9 egg / 500 ml',
    pack: 'Biological Ecological Carton',
    fat: '10.2 G',
    carbs: '1.1 G',
    protein: '12.5 G'
  },
  milk: {
    title: 'pure farm fresh milk',
    tag: '100% Raw & Organic Dairy',
    image: 'images/milk.jpg',
    desc: 'Produced daily from pastured Jersey cows grazing on chemical-free clover. Processed using gentle micro-pasteurization to retain vital natural cream layer.',
    cat: 'Whole Raw Milk & Butter',
    vol: '1.0 Liter / Glass Bottle',
    pack: 'Recyclable Glass Bottle',
    fat: '3.8 G',
    carbs: '4.7 G',
    protein: '3.4 G'
  },
  meat: {
    title: 'heritage pasture-raised meat',
    tag: 'Grass-Fed & Antibiotic Free',
    image: 'images/meat.jpg',
    desc: 'Sustainably raised grass-fed beef steak, free-range chicken, and heritage pork. Hand-cut by our master butchers with zero added water or preservatives.',
    cat: 'Grass-Fed Ribeye & Chicken',
    vol: '500g - 1kg Vacuum Cuts',
    pack: 'Biodegradable Pack',
    fat: '14.5 G',
    carbs: '0.0 G',
    protein: '22.8 G'
  }
};

function initProductTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const card = document.getElementById('product-card');
  const imgElem = document.getElementById('product-img');
  const titleElem = document.getElementById('product-title');
  const tagElem = document.getElementById('product-tag');
  const descElem = document.getElementById('product-desc');
  const specCat = document.getElementById('spec-cat');
  const specVol = document.getElementById('spec-vol');
  const specPack = document.getElementById('spec-pack');

  const energyFat = document.getElementById('energy-fat');
  const energyCarbs = document.getElementById('energy-carbs');
  const energyProtein = document.getElementById('energy-protein');

  if (!tabBtns.length || !card) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      if (!productData[category]) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';

      setTimeout(() => {
        const data = productData[category];
        
        if (imgElem) imgElem.src = data.image;
        if (titleElem) titleElem.textContent = data.title;
        if (tagElem) tagElem.textContent = data.tag;
        if (descElem) descElem.textContent = data.desc;
        if (specCat) specCat.textContent = data.cat;
        if (specVol) specVol.textContent = data.vol;
        if (specPack) specPack.textContent = data.pack;

        if (energyFat) energyFat.textContent = data.fat;
        if (energyCarbs) energyCarbs.textContent = data.carbs;
        if (energyProtein) energyProtein.textContent = data.protein;

        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 220);
    });
  });
}

/* --------------------------------------------------------------------------
   6. Recipe Interactive Modal
   -------------------------------------------------------------------------- */
function initRecipeModal() {
  const openBtn = document.getElementById('open-recipe-modal');
  const closeBtn = document.getElementById('close-recipe-modal');
  const orderBtn = document.getElementById('modal-order-btn');
  const modal = document.getElementById('recipe-modal');

  if (!modal) return;

  if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  if (orderBtn) orderBtn.addEventListener('click', () => modal.classList.remove('open'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

/* --------------------------------------------------------------------------
   7. Contact / Order Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('order-form');
  const successMsg = document.getElementById('success-msg');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    
    if (emailInput && emailInput.value.trim()) {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
    }
  });
}

/* --------------------------------------------------------------------------
   8. Smooth Anchor Scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
