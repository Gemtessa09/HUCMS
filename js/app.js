// app.js - Shared JavaScript functions for HUCMSS Result System

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('HUCMSS Result System loaded');
    
    // Initialize common components
    initCommonComponents();
});

// Common components initialization
function initCommonComponents() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize form validations
    initFormValidation();
    
    // Initialize modals
    initModals();
    
    // Initialize notifications
    initNotifications();
}

// Tooltip initialization
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'fixed bg-gray-800 text-white text-sm rounded-lg py-1 px-2 z-50';
            tooltip.textContent = tooltipText;
            tooltip.id = 'dynamic-tooltip';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.getElementById('dynamic-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Form validation initialization
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly', 'error');
            }
        });
        
        // Add validation to required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

// Modal initialization
function initModals() {
    // Close modals on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.active');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// Notification system initialization
function initNotifications() {
    // Auto-remove notifications after 5 seconds
    setInterval(() => {
        const notifications = document.querySelectorAll('.notification:not(.persistent)');
        notifications.forEach(notification => {
            if (notification.dataset.timestamp) {
                const created = parseInt(notification.dataset.timestamp);
                const now = Date.now();
                if (now - created > 5000) {
                    notification.remove();
                }
            }
        });
    }, 1000);
}

// Form validation function
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email fields
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            markFieldInvalid(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    // Validate password fields
    const passwordFields = form.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        if (field.value && field.value.length < 6) {
            markFieldInvalid(field, 'Password must be at least 6 characters');
            isValid = false;
        }
    });
    
    return isValid;
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        markFieldInvalid(field, 'This field is required');
        return false;
    }
    
    // Clear any existing error
    markFieldValid(field);
    return true;
}

// Mark field as invalid
function markFieldInvalid(field, message) {
    field.classList.add('border-red-500');
    field.classList.remove('border-gray-300', 'border-green-500');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const error = document.createElement('p');
    error.className = 'field-error text-red-600 text-sm mt-1';
    error.textContent = message;
    field.parentNode.appendChild(error);
}

// Mark field as valid
function markFieldValid(field) {
    field.classList.remove('border-red-500', 'border-gray-300');
    field.classList.add('border-green-500');
    
    // Remove error message
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Password validation
function isValidPassword(password) {
    return password.length >= 6;
}

// Show notification
function showNotification(message, type = 'info', persistent = false) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-transform duration-300 translate-x-full`;
    notification.dataset.timestamp = Date.now();
    
    // Set type-specific styles
    let icon = 'ℹ️';
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';
    let borderColor = 'border-blue-200';
    
    switch(type) {
        case 'success':
            icon = '✅';
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            borderColor = 'border-green-200';
            break;
        case 'error':
            icon = '❌';
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            borderColor = 'border-red-200';
            break;
        case 'warning':
            icon = '⚠️';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-200';
            break;
    }
    
    if (persistent) {
        notification.classList.add('persistent');
    }
    
    notification.innerHTML = `
        <div class="flex items-start">
            <span class="text-xl mr-3">${icon}</span>
            <div class="flex-1">
                <p class="${textColor} font-medium">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 ${textColor} hover:opacity-75">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.classList.add(bgColor, borderColor, 'border');
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Auto-remove non-persistent notifications after 5 seconds
    if (!persistent) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    return notification;
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Confirm dialog
function showConfirm(message, callback) {
    const confirmModal = document.createElement('div');
    confirmModal.id = 'confirm-modal';
    confirmModal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    confirmModal.innerHTML = `
        <div class="modal-content bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Confirm Action</h3>
                    <button onclick="document.getElementById('confirm-modal').remove()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <p class="text-gray-600 mb-6">${message}</p>
                <div class="flex justify-end space-x-4">
                    <button onclick="document.getElementById('confirm-modal').remove()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button id="confirm-action" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    document.getElementById('confirm-action').addEventListener('click', function() {
        callback();
        confirmModal.remove();
    });
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Toggle icon
        const icon = input.parentNode.querySelector('button i');
        if (icon) {
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }
}

// Format date
function formatDate(date, format = 'long') {
    const d = new Date(date);
    const options = format === 'short' ? 
        { month: 'short', day: 'numeric', year: 'numeric' } :
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    return d.toLocaleDateString('en-US', options);
}

// Format time
function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Debounce function for performance
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

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        showNotification,
        showModal,
        closeModal,
        showConfirm,
        togglePassword,
        formatDate,
        formatTime
    };
}