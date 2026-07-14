/**
 * TWIN AI - Main JavaScript
 * Global utilities and shared functionality
 */

const THEME_STORAGE_KEY = 'twin-ai-theme';

function getStoredTheme() {
    try {
        const theme = localStorage.getItem(THEME_STORAGE_KEY);
        return theme === 'dark' || theme === 'light' ? theme : null;
    } catch (error) {
        return null;
    }
}

function getSystemTheme() {
    if (!window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme() {
    return getStoredTheme() || getSystemTheme();
}

function updateThemeToggleButtons(theme) {
    const isDark = theme === 'dark';

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.setAttribute('aria-pressed', String(isDark));
        button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');

        const icon = button.querySelector('[data-theme-icon]');
        const label = button.querySelector('[data-theme-label]');

        if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        if (label) label.textContent = isDark ? 'Light' : 'Dark';
    });
}

function applyTheme(theme, persist = false) {
    const resolved = theme === 'dark' ? 'dark' : 'light';
    const root = document.documentElement;

    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;

    if (persist) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, resolved);
        } catch (error) {
            // Ignore storage failures in private mode or restricted browsers.
        }
    }

    updateThemeToggleButtons(resolved);
    return resolved;
}

function toggleTheme() {
    const current = document.documentElement.dataset.theme || getInitialTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
}

function initThemeControls() {
    applyTheme(document.documentElement.dataset.theme || getInitialTheme(), false);

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.addEventListener('click', toggleTheme);
    });

    if (window.matchMedia) {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => {
            if (!getStoredTheme()) {
                applyTheme(media.matches ? 'dark' : 'light', false);
            }
        };

        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', onChange);
        } else if (typeof media.addListener === 'function') {
            media.addListener(onChange);
        }
    }
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Get severity color class
function getSeverityClass(severity) {
    const classes = {
        critical: 'text-red',
        high: 'text-orange',
        medium: 'text-yellow',
        low: 'text-green'
    };
    return classes[severity] || 'text-slate';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg glass-card text-sm z-50 fade-in-up`;
    toast.style.borderLeft = `3px solid ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff3333' : '#00d4ff'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initializeApp() {
    initThemeControls();
    console.log('🌍 TWIN AI initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
