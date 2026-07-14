/**
 * TWIN AI - Main JavaScript
 * Global utilities and shared functionality
 */

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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 TWIN AI initialized');
});
