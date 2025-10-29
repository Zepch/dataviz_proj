// ==================== SCROLL NAVIGATION ====================
let currentSection = 0;
const sections = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');
const progressBar = document.getElementById('progress-bar');

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionIndex = Array.from(sections).indexOf(entry.target);
            updateNavigation(sectionIndex);
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Update navigation and progress
function updateNavigation(index) {
    currentSection = index;
    
    // Update nav dots
    navDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update progress bar
    const progress = ((index + 1) / sections.length) * 100;
    progressBar.style.width = progress + '%';
    
    // Update active section
    sections.forEach((section, i) => {
        if (i === index) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// Nav dot click handlers
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSection < sections.length - 1) {
            sections[currentSection + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSection > 0) {
            sections[currentSection - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        sections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'End') {
        e.preventDefault();
        sections[sections.length - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ==================== MOUSE WHEEL NAVIGATION (Optional throttled smooth scroll) ====================
let isScrolling = false;
let scrollTimeout;

window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 100);
    
    // Natural scroll - let browser handle it
}, { passive: true });

// ==================== TOUCH/SWIPE SUPPORT FOR MOBILE ====================
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSection < sections.length - 1) {
            // Swipe up - next section
            sections[currentSection + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (diff < 0 && currentSection > 0) {
            // Swipe down - previous section
            sections[currentSection - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// ==================== ANIMATE STATS ON SCROLL ====================
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(1) + (element.dataset.suffix || '');
    }, 16);
}

// Observe stat cards for animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const number = entry.target.querySelector('.stat-number');
            if (number) {
                const targetValue = parseFloat(number.dataset.value || number.textContent);
                const suffix = number.textContent.replace(/[0-9.-]/g, '');
                number.dataset.suffix = suffix;
                animateValue(number, 0, targetValue, 1000);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    const number = card.querySelector('.stat-number');
    if (number) {
        const text = number.textContent;
        const value = parseFloat(text);
        number.dataset.value = value;
    }
    statObserver.observe(card);
});

// ==================== PERFORMANCE MONITORING ====================
// Log load time
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${(loadTime / 1000).toFixed(2)} seconds`);
});

// ==================== ACCESSIBILITY ENHANCEMENTS ====================
// Add focus styles for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ==================== SMOOTH REVEAL ANIMATIONS ====================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.insight-box, .comparison-stats, .verdict-card, .final-recommendation').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ==================== PRINT/PRESENTATION MODE ====================
// Detect if printing or presenting
window.matchMedia('print').addEventListener('change', (e) => {
    if (e.matches) {
        // Print mode - show all sections
        sections.forEach(section => {
            section.classList.add('active');
            section.style.pageBreakAfter = 'always';
        });
    }
});

// ==================== AUTO-PLAY MODE (for video recording) ====================
let autoPlayInterval;
let autoPlayEnabled = false;

function startAutoPlay(intervalSeconds = 30) {
    if (autoPlayEnabled) return;
    
    autoPlayEnabled = true;
    autoPlayInterval = setInterval(() => {
        if (currentSection < sections.length - 1) {
            sections[currentSection + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            stopAutoPlay();
        }
    }, intervalSeconds * 1000);
    
    console.log('Auto-play started. Press "P" to pause.');
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayEnabled = false;
    console.log('Auto-play stopped.');
}

// Toggle auto-play with 'P' key
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        if (autoPlayEnabled) {
            stopAutoPlay();
        } else {
            startAutoPlay(40); // 40 seconds per slide for 5-minute presentation
        }
    }
});

// ==================== TOOLTIP ENHANCEMENTS ====================
// Add custom tooltips for better UX
const tooltipElements = document.querySelectorAll('[data-tooltip]');
tooltipElements.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = el.dataset.tooltip;
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(255, 215, 0, 0.95)';
        tooltip.style.color = '#000';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '14px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '1000';
        document.body.appendChild(tooltip);
        
        const rect = el.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        
        el.addEventListener('mouseleave', () => {
            tooltip.remove();
        }, { once: true });
    });
});

// ==================== CONSOLE EASTER EGG ====================
console.log('%c💰 Gold Data Visualization 💰', 'font-size: 20px; color: #FFD700; font-weight: bold;');
console.log('%cTips:', 'font-size: 14px; color: #FFD700;');
console.log('- Use Arrow Keys or Page Up/Down to navigate');
console.log('- Press "P" to start/stop auto-play mode');
console.log('- Press "Home" to go to first slide, "End" for last slide');
console.log('- Click navigation dots on the right to jump to sections');

// ==================== INITIALIZATION ====================
// Set initial state
updateNavigation(0);

// Preload images and optimize performance
document.fonts.ready.then(() => {
    console.log('Fonts loaded successfully');
});
