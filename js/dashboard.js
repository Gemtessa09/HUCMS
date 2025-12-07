// dashboard.js - Dashboard interactions for HUCMSS Result System

// Global variables
let currentUser = {};
let dashboardData = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded');
    
    // Initialize dashboard
    initDashboard();
});

// Initialize dashboard
function initDashboard() {
    // Load user data
    loadUserData();
    
    // Initialize common dashboard components
    initDashboardComponents();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize real-time updates
    initRealTimeUpdates();
}

// Load user data from session
function loadUserData() {
    currentUser = {
        role: sessionStorage.getItem('userRole') || 'guest',
        name: sessionStorage.getItem('userName') || 'User',
        email: sessionStorage.getItem('userEmail') || '',
        id: sessionStorage.getItem('userID') || '',
        department: sessionStorage.getItem('userDepartment') || ''
    };
    
    // Update UI with user data
    updateUserUI();
    
    // Check authentication
    checkAuthentication();
}

// Update UI with user data
function updateUserUI() {
    // Update user name
    const userNameElements = document.querySelectorAll('#user-name, #teacher-name, #student-name, #admin-name');
    userNameElements.forEach(el => {
        if (el) el.textContent = currentUser.name;
    });
    
    // Update user role
    const userRoleElements = document.querySelectorAll('#user-role');
    userRoleElements.forEach(el => {
        if (el) el.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    });
    
    // Update user email
    const userEmailElements = document.querySelectorAll('#user-email');
    userEmailElements.forEach(el => {
        if (el) el.textContent = currentUser.email;
    });
    
    // Update user ID
    const userIDElements = document.querySelectorAll('#user-id');
    userIDElements.forEach(el => {
        if (el) el.textContent = currentUser.id;
    });
    
    // Update dashboard title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle && !pageTitle.textContent.includes('Dashboard')) {
        const role = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        pageTitle.textContent = `${role} Dashboard`;
    }
}

// Check authentication
function checkAuthentication() {
    if (currentUser.role === 'guest') {
        showNotification('Please login to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Initialize dashboard components
function initDashboardComponents() {
    // Initialize date and time
    initDateTime();
    
    // Initialize sidebar
    initSidebar();
    
    // Initialize notifications
    initDashboardNotifications();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
    
    // Initialize data tables
    initDataTables();
    
    // Initialize form handlers
    initDashboardForms();
}

// Initialize date and time
function initDateTime() {
    updateDateTime();
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
    
    // Update date every hour
    setInterval(() => {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }, 3600000);
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    
    // Update date
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Update time
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    // Update any other time elements
    document.querySelectorAll('.live-time').forEach(el => {
        el.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    });
    
    // Update relative time
    updateRelativeTime();
}

// Update relative time (e.g., "2 hours ago")
function updateRelativeTime() {
    document.querySelectorAll('[data-time]').forEach(el => {
        const timestamp = el.dataset.time;
        if (timestamp) {
            const timeDiff = Date.now() - new Date(timestamp).getTime();
            const minutes = Math.floor(timeDiff / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) {
                el.textContent = `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
                el.textContent = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else if (minutes > 0) {
                el.textContent = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else {
                el.textContent = 'Just now';
            }
        }
    });
}

// Initialize sidebar
function initSidebar() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.classList.toggle('active');
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                if (sidebar.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    }
    
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active-nav');
            });
            this.classList.add('active-nav');
            
            // Close sidebar on mobile after selection
            if (window.innerWidth < 768 && sidebar) {
                sidebar.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });
    
    // Collapsible sidebar sections
    document.querySelectorAll('.sidebar-section-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const section = this.closest('.sidebar-section');
            if (section) {
                section.classList.toggle('collapsed');
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            }
        });
    });
}

// Initialize dashboard notifications
function initDashboardNotifications() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDropdown = document.getElementById('notification-dropdown');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('hidden');
            
            // Mark notifications as read
            markNotificationsAsRead();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationDropdown.classList.add('hidden');
            }
        });
        
        // Load notifications
        loadNotifications();
    }
}

// Load notifications
function loadNotifications() {
    // Simulated notifications data
    const notifications = [
        {
            id: 1,
            title: 'New Announcement',
            message: 'Department meeting scheduled for tomorrow',
            type: 'info',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false
        },
        {
            id: 2,
            title: 'Result Published',
            message: 'CS101 results have been published',
            type: 'success',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: false
        },
        {
            id: 3,
            title: 'System Update',
            message: 'Scheduled maintenance this weekend',
            type: 'warning',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: true
        }
    ];
    
    // Update notification badge
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('#notification-btn .notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    
    // Populate notifications dropdown
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
        notificationList.innerHTML = '';
        
        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`;
            item.innerHTML = `
                <div class="flex justify-between">
                    <p class="font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-800'}">${notification.title}</p>
                    <span class="text-xs text-gray-500">${formatTime(notification.timestamp)}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
                ${!notification.read ? '<span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2"></span>' : ''}
            `;
            
            item.addEventListener('click', function() {
                markNotificationAsRead(notification.id);
            });
            
            notificationList.appendChild(item);
        });
        
        // Add view all link
        if (notifications.length > 0) {
            const viewAll = document.createElement('a');
            viewAll.href = '#';
            viewAll.className = 'block text-center p-3 text-blue-600 hover:text-blue-800 text-sm font-medium';
            viewAll.textContent = 'View All Notifications';
            viewAll.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('All notifications page would open here', 'info');
            });
            notificationList.appendChild(viewAll);
        }
    }
}

// Mark notifications as read
function markNotificationsAsRead() {
    // Update badge
    const badge = document.querySelector('#notification-btn .notification-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    // Mark all as read in UI
    document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('bg-blue-50');
        const title = item.querySelector('p.font-medium');
        if (title) {
            title.classList.remove('text-blue-800');
            title.classList.add('text-gray-800');
        }
        
        const unreadIndicator = item.querySelector('.inline-block.w-2.h-2');
        if (unreadIndicator) {
            unreadIndicator.remove();
        }
    });
}

// Mark single notification as read
function markNotificationAsRead(id) {
    // Find and mark notification
    const notificationItem = document.querySelector(`[data-notification-id="${id}"]`);
    if (notificationItem) {
        notificationItem.classList.remove('bg-blue-50');
        const title = notificationItem.querySelector('p.font-medium');
        if (title) {
            title.classList.remove('text-blue-800');
            title.classList.add('text-gray-800');
        }
        
        const unreadIndicator = notificationItem.querySelector('.inline-block.w-2.h-2');
        if (unreadIndicator) {
            unreadIndicator.remove();
        }
        
        // Update badge count
        const badge = document.querySelector('#notification-btn .notification-badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            const newCount = Math.max(0, currentCount - 1);
            badge.textContent = newCount;
            badge.style.display = newCount > 0 ? 'flex' : 'none';
        }
    }
}

// Initialize search functionality
function initSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.trim().toLowerCase();
            const tableId = this.dataset.table;
            
            if (tableId) {
                filterTable(tableId, searchTerm);
            }
        }, 300));
        
        // Clear search button
        const clearBtn = input.parentNode.querySelector('.search-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                input.value = '';
                const tableId = input.dataset.table;
                if (tableId) {
                    filterTable(tableId, '');
                }
                input.focus();
            });
        }
    });
}

// Filter table rows
function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update showing count
    const showingElement = document.getElementById(`showing-${tableId}`);
    if (showingElement) {
        showingElement.textContent = `1-${visibleCount}`;
    }
}

// Initialize charts
function initCharts() {
    // Performance chart
    const perfChartCanvas = document.getElementById('performanceChart');
    if (perfChartCanvas) {
        new Chart(perfChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Performance',
                    data: [65, 70, 72, 75, 78, 80],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Usage chart
    const usageChartCanvas = document.getElementById('usageChart');
    if (usageChartCanvas) {
        new Chart(usageChartCanvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Students', 'Teachers', 'Admins'],
                datasets: [{
                    data: [1245, 68, 12],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Initialize data tables
function initDataTables() {
    // Add sort functionality
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', function() {
            const table = this.closest('table');
            const columnIndex = Array.from(this.parentNode.children).indexOf(this);
            const isAscending = this.classList.contains('asc');
            
            // Reset all headers
            table.querySelectorAll('th').forEach(th => {
                th.classList.remove('asc', 'desc');
            });
            
            // Set new direction
            this.classList.remove('asc', 'desc');
            this.classList.add(isAscending ? 'desc' : 'asc');
            
            // Sort table
            sortTable(table, columnIndex, !isAscending);
        });
    });
    
    // Initialize pagination
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            const tableId = this.closest('.pagination').dataset.table;
            
            if (page && tableId) {
                goToPage(tableId, parseInt(page));
            }
        });
    });
}

// Sort table
function sortTable(table, columnIndex, ascending = true) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aText = a.children[columnIndex].textContent.trim();
        const bText = b.children[columnIndex].textContent.trim();
        
        // Try to convert to numbers for numeric sorting
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }
        
        // String comparison
        return ascending ? 
            aText.localeCompare(bText) : 
            bText.localeCompare(aText);
    });
    
    // Reappend rows in sorted order
    rows.forEach(row => tbody.appendChild(row));
}

// Go to specific page in paginated table
function goToPage(tableId, page) {
    const rowsPerPage = 10;
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    rows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update pagination UI
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    updatePaginationUI(tableId, page, totalPages);
}

// Update pagination UI
function updatePaginationUI(tableId, currentPage, totalPages) {
    const pagination = document.querySelector(`.pagination[data-table="${tableId}"]`);
    if (!pagination) return;
    
    // Update page buttons
    pagination.querySelectorAll('.page-btn').forEach(btn => {
        const page = parseInt(btn.dataset.page);
        btn.classList.remove('active');
        if (page === currentPage) {
            btn.classList.add('active');
        }
    });
    
    // Update showing count
    const showingElement = document.getElementById(`showing-${tableId}`);
    if (showingElement) {
        const start = ((currentPage - 1) * 10) + 1;
        const end = Math.min(currentPage * 10, totalPages * 10);
        showingElement.textContent = `${start}-${end}`;
    }
}

// Initialize dashboard forms
function initDashboardForms() {
    // Auto-save forms
    document.querySelectorAll('form[data-autosave]').forEach(form => {
        form.addEventListener('input', debounce(function() {
            saveFormData(this);
        }, 1000));
    });
    
    // Form submission handlers
    document.querySelectorAll('form.dashboard-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleDashboardFormSubmit(this);
        });
    });
}

// Save form data
function saveFormData(form) {
    const formId = form.id || 'unsaved-form';
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    localStorage.setItem(`form-${formId}`, JSON.stringify(data));
    
    // Show auto-save notification
    const autoSaveIndicator = form.querySelector('.autosave-indicator');
    if (autoSaveIndicator) {
        autoSaveIndicator.textContent = 'Auto-saved';
        autoSaveIndicator.classList.add('text-green-600');
        
        setTimeout(() => {
            autoSaveIndicator.textContent = '';
            autoSaveIndicator.classList.remove('text-green-600');
        }, 2000);
    }
}

// Handle dashboard form submission
function handleDashboardFormSubmit(form) {
    if (!validateForm(form)) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    const formId = form.id;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Form submitted successfully!', 'success');
        
        // Clear auto-saved data
        localStorage.removeItem(`form-${formId}`);
        
        // Reset form if needed
        if (form.dataset.reset === 'true') {
            form.reset();
        }
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reload data if needed
        if (form.dataset.reload === 'true') {
            loadDashboardData();
        }
    }, 1500);
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading data
    dashboardData = {
        stats: {
            students: 1245,
            teachers: 68,
            results: 856,
            pending: 23
        },
        recentActivity: [
            { action: 'New student registered', time: '1 hour ago' },
            { action: 'Results published for CS101', time: '2 hours ago' },
            { action: 'Teacher account approved', time: '3 hours ago' }
        ]
    };
    
    // Update UI with data
    updateDashboardUI();
}

// Update dashboard UI with loaded data
function updateDashboardUI() {
    // Update stats
    document.querySelectorAll('[data-stat]').forEach(el => {
        const stat = el.dataset.stat;
        if (dashboardData.stats[stat]) {
            el.textContent = dashboardData.stats[stat];
        }
    });
    
    // Update recent activity
    const activityList = document.getElementById('recent-activity-list');
    if (activityList && dashboardData.recentActivity) {
        activityList.innerHTML = '';
        dashboardData.recentActivity.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg';
            item.innerHTML = `
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <div class="flex-1">
                    <p class="text-sm text-gray-800">${activity.action}</p>
                    <p class="text-xs text-gray-500">${activity.time}</p>
                </div>
            `;
            activityList.appendChild(item);
        });
    }
}

// Initialize navigation
function initNavigation() {
    // Section navigation
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });
    
    // Breadcrumb navigation
    document.querySelectorAll('.breadcrumb-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href === '#') {
                e.preventDefault();
                const section = this.dataset.section;
                if (section) {
                    showSection(section);
                }
            }
        });
    });
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Update active navigation
        updateActiveNav(sectionId);
        
        // Update breadcrumb
        updateBreadcrumb(sectionId);
        
        // Load section data if needed
        if (targetSection.dataset.load === 'true') {
            loadSectionData(sectionId);
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Update active navigation
function updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active-nav');
        if (item.dataset.section === sectionId) {
            item.classList.add('active-nav');
        }
    });
}

// Update breadcrumb
function updateBreadcrumb(sectionId) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    const sections = {
        'dashboard': 'Dashboard',
        'manage-students': 'Manage Students',
        'view-results': 'View Results',
        'add-marks': 'Add Marks'
        // Add more sections as needed
    };
    
    if (sections[sectionId]) {
        breadcrumb.innerHTML = `
            <a href="#" data-section="dashboard" class="breadcrumb-link text-blue-600 hover:text-blue-800">Dashboard</a>
            <span class="mx-2">/</span>
            <span class="text-gray-600">${sections[sectionId]}</span>
        `;
    }
}

// Load section data
function loadSectionData(sectionId) {
    // Show loading state
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
        const loadingElement = section.querySelector('.loading-indicator');
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }
    }
    
    // Simulate data loading
    setTimeout(() => {
        // Hide loading
        const loadingElement = document.querySelector('.loading-indicator');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
        
        // Populate section data
        populateSectionData(sectionId);
    }, 1000);
}

// Populate section data
function populateSectionData(sectionId) {
    // This would be implemented per section
    switch(sectionId) {
        case 'manage-students':
            populateStudentsTable();
            break;
        case 'view-results':
            populateResultsTable();
            break;
        // Add more cases as needed
    }
}

// Populate students table
function populateStudentsTable() {
    // This would load actual student data
    const table = document.getElementById('students-table');
    if (table) {
        // Add sample data or load from API
    }
}

// Initialize real-time updates
function initRealTimeUpdates() {
    // Check for new notifications every 30 seconds
    setInterval(checkNewNotifications, 30000);
    
    // Update live counters every minute
    setInterval(updateLiveCounters, 60000);
    
    // Check for system updates
    setInterval(checkSystemUpdates, 300000);
}

// Check for new notifications
function checkNewNotifications() {
    // Simulated check
    const hasNew = Math.random() > 0.7;
    if (hasNew) {
        const badge = document.querySelector('#notification-btn .notification-badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
            badge.style.display = 'flex';
            
            // Show notification
            showNotification('You have new notifications', 'info');
        }
    }
}

// Update live counters
function updateLiveCounters() {
    document.querySelectorAll('.live-counter').forEach(counter => {
        const currentValue = parseInt(counter.textContent) || 0;
        const increment = Math.floor(Math.random() * 3);
        counter.textContent = currentValue + increment;
    });
}

// Check system updates
function checkSystemUpdates() {
    // This would check for system updates or announcements
    console.log('Checking for system updates...');
}

// Logout function
function logout() {
    showConfirm('Are you sure you want to logout?', function() {
        // Clear session data
        sessionStorage.clear();
        
        // Clear remember me if not checked
        const rememberLogin = localStorage.getItem('rememberLogin');
        if (rememberLogin !== 'true') {
            localStorage.clear();
        } else {
            // Keep rememberLogin but clear user data
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
        }
        
        showNotification('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// Export for use in HTML files
window.showSection = showSection;
window.logout = logout;
window.togglePassword = togglePassword;