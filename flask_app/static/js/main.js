/**
 * TWIN AI - Main JavaScript
 * Global utilities and shared functionality
 */

const THEME_STORAGE_KEY = 'twin-ai-theme';
const LOCATION_STORAGE_KEY = 'twin-ai-location-context';
const LOCATION_SESSION_REQUEST_KEY = 'twin-ai-location-requested';

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

function getStoredLocationContext() {
    try {
        const stored = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY));
        if (stored?.state?.id && stored?.state?.name) return stored;
    } catch (error) {
        // Ignore unavailable or malformed local storage data.
    }
    return null;
}

function updateLocationControls(context, isLoading = false) {
    const label = isLoading ? 'Finding GPS…' : context?.state?.name ? `GPS: ${context.state.name}` : 'Use GPS';
    document.querySelectorAll('[data-gps-label]').forEach((element) => {
        element.textContent = label;
    });
    document.querySelectorAll('[data-use-location]').forEach((button) => {
        button.disabled = isLoading;
        button.classList.toggle('is-active', Boolean(context?.state?.id));
        button.title = context?.state?.name ? `Using GPS location near ${context.state.name}. Select to refresh.` : 'Use my GPS location';
    });
}

function applyLocationContext(context, persist = true) {
    if (!context?.state?.id) return;

    if (persist) {
        try {
            // Store only the resolved state, never the raw GPS coordinates.
            localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(context));
        } catch (error) {
            // Location still works if storage is unavailable.
        }
    }

    updateLocationControls(context);
    document.querySelectorAll('[data-location-state]').forEach((select) => {
        const matchingOption = select.querySelector(`option[value="${context.state.id}"]`);
        if (matchingOption && select.value !== String(context.state.id)) {
            select.value = String(context.state.id);
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    window.dispatchEvent(new CustomEvent('twinai:locationchange', { detail: context }));
}

function requestAppLocation(force = false) {
    if (!navigator.geolocation) {
        showToast('GPS location is not supported in this browser.', 'error');
        return;
    }

    try {
        if (!force && sessionStorage.getItem(LOCATION_SESSION_REQUEST_KEY)) return;
        sessionStorage.setItem(LOCATION_SESSION_REQUEST_KEY, 'true');
    } catch (error) {
        // Continue when session storage is unavailable.
    }

    updateLocationControls(getStoredLocationContext(), true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const query = new URLSearchParams({
                latitude: position.coords.latitude.toFixed(5),
                longitude: position.coords.longitude.toFixed(5)
            });
            const response = await fetch(`/api/location-context?${query}`);
            if (!response.ok) throw new Error('Unable to resolve the selected location');
            const payload = await response.json();
            const context = { state: payload.state, distance_km: payload.distance_km, selected_at: payload.timestamp };
            applyLocationContext(context);
            showToast(`Location applied: ${payload.state.name}`, 'success');
        } catch (error) {
            updateLocationControls(getStoredLocationContext());
            window.dispatchEvent(new CustomEvent('twinai:locationerror'));
            showToast('Could not apply your GPS location. Using the current selection.', 'error');
        }
    }, () => {
        updateLocationControls(getStoredLocationContext());
        window.dispatchEvent(new CustomEvent('twinai:locationerror'));
        showToast('GPS permission was not granted. You can still choose a state manually.', 'info');
    }, { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 });
}

window.TwinAILocation = {
    get: getStoredLocationContext,
    request: () => requestAppLocation(true)
};

function initLocationControls() {
    document.querySelectorAll('[data-use-location]').forEach((button) => {
        button.addEventListener('click', requestAppLocation);
    });

    const storedContext = getStoredLocationContext();
    updateLocationControls(storedContext);
    if (storedContext) {
        applyLocationContext(storedContext, false);
    } else {
        // Ask once per browser session so location-aware pages can immediately
        // show local climate, air quality, and agriculture information.
        window.setTimeout(() => requestAppLocation(), 150);
    }
}

function initializeApp() {
    initThemeControls();
    initLocationControls();
    console.log('🌍 TWIN AI initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
