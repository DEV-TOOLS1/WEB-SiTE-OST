// Initialize stats from localStorage
function initializeStats() {
    const downloads = localStorage.getItem('ostpe_downloads') || '0';
    const activeUsers = localStorage.getItem('ostpe_active_users') || '0';

    const downloadsEl = document.getElementById('total-downloads');
    const usersEl = document.getElementById('active-users');

    if (downloadsEl) {
        downloadsEl.textContent = downloads;
    }
    if (usersEl) {
        usersEl.textContent = activeUsers;
    }
}

// Handle download button clicks
function downloadOSTEP(event, edition) {
    event.preventDefault();

    let currentDownloads = parseInt(localStorage.getItem('ostpe_downloads')) || 0;
    let currentUsers = parseInt(localStorage.getItem('ostpe_active_users')) || 0;

    // Increment downloads
    currentDownloads++;

    // Increment active users (once per session, check with a flag)
    const sessionKey = 'ostpe_user_counted_' + new Date().toDateString();
    if (!sessionStorage.getItem(sessionKey)) {
        currentUsers++;
        sessionStorage.setItem(sessionKey, 'true');
    }

    // Save to localStorage
    localStorage.setItem('ostpe_downloads', currentDownloads);
    localStorage.setItem('ostpe_active_users', currentUsers);

    // Update display
    const downloadsEl = document.getElementById('total-downloads');
    const usersEl = document.getElementById('active-users');

    if (downloadsEl) {
        downloadsEl.textContent = currentDownloads;
        // Add animation
        downloadsEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            downloadsEl.style.transform = 'scale(1)';
        }, 300);
    }

    if (usersEl && currentUsers > 0) {
        usersEl.textContent = currentUsers;
        usersEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            usersEl.style.transform = 'scale(1)';
        }, 300);
    }

    // Show success message
    showNotification(`${edition.charAt(0).toUpperCase() + edition.slice(1)} Edition download started!`);

    // Simulate download after a short delay
    setTimeout(() => {
        console.log('Download for ' + edition + ' edition initiated');
        // In a real scenario, you would trigger an actual download here
    }, 500);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Handle form submission status messages
function handleFormStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');

    if (status && message) {
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${status}`;
            messageDiv.textContent = decodeURIComponent(message);

            // Insert at the top of the form container
            formContainer.insertBefore(messageDiv, formContainer.firstChild);

            // Auto-remove success messages after 5 seconds
            if (status === 'success') {
                setTimeout(() => {
                    messageDiv.remove();
                }, 5000);
            }

            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        const links = menu.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
            });
        });
    }

    // Initialize stats on page load
    initializeStats();

    // Handle form status messages
    handleFormStatus();
});
