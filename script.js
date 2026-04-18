document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. MOBILE MENU TOGGLE (ALL PAGES)
    // ============================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // ============================================================
    // 2. SMOOTH SCROLLING (INDEX & OTHERS)
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href === '#') return; // Ignore empty hashes
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                // Close mobile menu if open
                if (mainNav) mainNav.classList.remove('active');
                
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // 3. GENERIC SCROLL REVEAL (INDEX, MENU, GALLERY)
    // ============================================================
    const revealElements = document.querySelectorAll('.menu-item, .menu-card, .wide-card, .gallery-item');
    
    function revealOnScroll() {
        revealElements.forEach(el => {
            if (el.style.display === 'none') return;
            const rect = el.getBoundingClientRect();
            // Trigger 50px before entering viewport bottom
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('visible');
                // For index.html menu-items that used inline opacities
                if (el.classList.contains('menu-item')) {
                    el.style.opacity = 1;
                    el.style.transform = 'translateY(0)';
                }
            }
        });
    }
    
    // Initial styles for index.html elements not managed via purely CSS classes
    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Hero element animation mapping
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = 0;
        heroSection.style.transform = 'translateY(20px)';
        heroSection.style.transition = 'opacity 1s ease, transform 1s ease';
        setTimeout(() => {
            heroSection.style.opacity = 1;
            heroSection.style.transform = 'translateY(0)';
        }, 300);
    }

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    setTimeout(revealOnScroll, 100);

    // ============================================================
    // 4. CONTACT PAGE FORM SUBMISSION
    // ============================================================
    window.handleSubmit = function() {
        const fname = document.getElementById('fname').value.trim();
        const lname = document.getElementById('lname').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        const successMsg = document.getElementById('successMsg');

        if (!fname || !lname || !email || !subject || !message) {
            alert('Please fill in all mandatory fields (marked with *).');
            return;
        }

        successMsg.style.display = 'block';
        
        // Clear form
        document.getElementById('fname').value = '';
        document.getElementById('lname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('subject').selectedIndex = 0;
        document.getElementById('message').value = '';

        setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    };

    // ============================================================
    // 5. MENU PAGE SPECIAL LOGIC
    // ============================================================
    // Scroll to section for menu category naval
    window.scrollToMenuSection = function(id, event) {
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.cat-nav-btn').forEach(b => b.classList.remove('active'));
        if(event) event.currentTarget.classList.add('active');
    };

    const menuSections = ['chicken','burgers','wraps','combos','drinks','sides'];
    window.addEventListener('scroll', () => {
        let current = '';
        menuSections.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 160) current = id;
        });
        document.querySelectorAll('.cat-nav-btn').forEach((btn, i) => {
            if(menuSections[i] === current) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });

    window.toggleFav = function(btn) {
        btn.classList.toggle('liked');
        btn.textContent = btn.classList.contains('liked') ? '❤️' : '🤍';
        event.stopPropagation();
    };

    window.addToOrder = function(name) {
        const toast = document.getElementById('toast');
        if(!toast) return;
        toast.textContent = `✅ ${name} added to your order!`;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(30px)';
        }, 2200);
        event.stopPropagation();
    };

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const q = this.value.toLowerCase().trim();
            let visible = 0;
            const menuCards = document.querySelectorAll('.menu-card');
            
            menuCards.forEach(card => {
                const name = (card.dataset.name || '').toLowerCase();
                const text = card.textContent.toLowerCase();
                const match = !q || name.includes(q) || text.includes(q);
                card.style.display = match ? '' : 'none';
                if (match) visible++;
            });
            
            const noResults = document.getElementById('noResults');
            if(noResults) noResults.style.display = visible === 0 ? 'block' : 'none';

            // Hide/show section headers if all cards hidden
            menuSections.forEach(id => {
                const sec = document.getElementById(id);
                if (!sec) return;
                const anyVisible = Array.from(sec.querySelectorAll('.menu-card')).some(c => c.style.display !== 'none');
                sec.style.display = anyVisible ? '' : 'none';
            });
        });
    }

    // ============================================================
    // 6. GALLERY PAGE SPECIAL LOGIC
    // ============================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const emptyState = document.getElementById('emptyState');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                let visibleCount = 0;

                galleryItems.forEach(item => {
                    const match = filter === 'all' || item.dataset.category === filter;
                    item.dataset.hidden = !match;
                    if (match) {
                        item.style.display = 'block';
                        visibleCount++;
                        item.classList.remove('visible');
                        setTimeout(() => item.classList.add('visible'), 30);
                    } else {
                        item.style.display = 'none';
                    }
                });

                if(emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
            });
        });
    }

    // Lightbox Logic
    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
        return Array.from(galleryItems).filter(i => i.style.display !== 'none');
    }

    window.openLightbox = function(item) {
        visibleItems = getVisibleItems();
        currentIndex = visibleItems.indexOf(item);
        showLightboxItem(currentIndex);
        document.getElementById('lightbox').classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    function showLightboxItem(idx) {
        if(!visibleItems.length) return;
        const item = visibleItems[idx];
        document.getElementById('lbImg').src = item.dataset.src;
        document.getElementById('lbImg').alt = item.dataset.title;
        document.getElementById('lbTitle').textContent = item.dataset.title;
        document.getElementById('lbCat').textContent = item.dataset.category.toUpperCase();
    }

    window.closeLightbox = function() {
        const lb = document.getElementById('lightbox');
        if(lb) {
            lb.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => window.openLightbox(item));
    });

    const lbClose = document.getElementById('lbClose');
    if (lbClose) lbClose.addEventListener('click', closeLightbox);

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    const lbPrev = document.getElementById('lbPrev');
    if (lbPrev) {
        lbPrev.addEventListener('click', e => {
            e.stopPropagation();
            visibleItems = getVisibleItems();
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            showLightboxItem(currentIndex);
        });
    }

    const lbNext = document.getElementById('lbNext');
    if (lbNext) {
        lbNext.addEventListener('click', e => {
            e.stopPropagation();
            visibleItems = getVisibleItems();
            currentIndex = (currentIndex + 1) % visibleItems.length;
            showLightboxItem(currentIndex);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        const lb = document.getElementById('lightbox');
        if (!lb || !lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
        if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    });

});



document.querySelector('.promo-btn').onclick = () => {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
};


// CHIQBY Section Button Interactions
(function () {
  var toast = document.getElementById('chiqby-toast');
  var toastTimer;

  document.querySelectorAll('.chiqby-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var action = btn.innerText;
      if (!toast) return;

      clearTimeout(toastTimer);
      toast.innerText = 'Redirecting to ' + action + '...';
      toast.style.display = 'block';

      toastTimer = setTimeout(function () {
        toast.style.display = 'none';
      }, 2000);
    });
  });
})();