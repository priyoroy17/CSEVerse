// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {


    // 1. DATE AND TIME FUNCTIONALITY

    function initDateTime() {
        // Create date-time display element
        const notesSection = document.querySelector('.notes-section');
        const notesContainer = document.querySelector('.notes-container');

        if (notesContainer) {
            // Create date-time container
            const dateTimeContainer = document.createElement('div');
            dateTimeContainer.className = 'datetime-container';
            dateTimeContainer.style.cssText = `
                background-color: var(--background-primary, #ffffff);
                padding: 1rem;
                border-radius: var(--border-radius, 8px);
                box-shadow: var(--shadow-light, 0 1px 3px rgba(0,0,0,0.1));
                margin-bottom: 2rem;
                text-align: center;
                border: 1px solid var(--border-color, #e2e8f0);
            `;

            // Create date and time elements
            const dateElement = document.createElement('div');
            dateElement.className = 'current-date';
            dateElement.style.cssText = `
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--text-primary, #1e293b);
                margin-bottom: 0.5rem;
            `;

            const timeElement = document.createElement('div');
            timeElement.className = 'current-time';
            timeElement.style.cssText = `
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary-color, #3b82f6);
                font-family: 'Courier New', monospace;
            `;

            const label = document.createElement('div');
            label.textContent = 'Current Date & Time';
            label.style.cssText = `
                font-size: 0.9rem;
                color: var(--text-secondary, #64748b);
                margin-bottom: 1rem;
                font-weight: 500;
            `;

            // Append elements
            dateTimeContainer.appendChild(label);
            dateTimeContainer.appendChild(dateElement);
            dateTimeContainer.appendChild(timeElement);

            // Insert at the beginning of notes container
            notesContainer.insertBefore(dateTimeContainer, notesContainer.firstChild);

            // Update time function
            function updateDateTime() {
                const now = new Date();

                // Format date
                const dateOptions = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
                const formattedDate = now.toLocaleDateString('en-US', dateOptions);

                // Format time
                const timeOptions = {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                };
                const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

                // Update elements
                dateElement.textContent = formattedDate;
                timeElement.textContent = formattedTime;
            }

            // Initial update
            updateDateTime();

            // Update every second
            setInterval(updateDateTime, 1000);
        }
    }


    // 2. DARK MODE TOGGLE FUNCTIONALITY

    function initDarkMode() {
        // Create dark mode toggle button
        const navbar = document.querySelector('.nav-menu');
        if (navbar) {
            const toggleContainer = document.createElement('li');
            toggleContainer.className = 'nav-item';

            const toggleButton = document.createElement('button');
            toggleButton.className = 'dark-mode-toggle';
            toggleButton.innerHTML = '🌙';
            toggleButton.setAttribute('aria-label', 'Toggle dark mode');
            toggleButton.style.cssText = `
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: var(--border-radius, 8px);
                transition: var(--transition, all 0.3s ease);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
            `;

            toggleContainer.appendChild(toggleButton);
            navbar.appendChild(toggleContainer);

            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                enableDarkMode();
            }

            // Toggle button click event
            toggleButton.addEventListener('click', function () {
                if (document.body.classList.contains('dark-mode')) {
                    disableDarkMode();
                } else {
                    enableDarkMode();
                }
            });

            // Hover effect for toggle button
            toggleButton.addEventListener('mouseenter', function () {
                this.style.backgroundColor = 'var(--background-tertiary, #f1f5f9)';
            });

            toggleButton.addEventListener('mouseleave', function () {
                this.style.backgroundColor = 'transparent';
            });
        }

        function enableDarkMode() {
            document.body.classList.add('dark-mode');
            updateToggleButton('☀️');
            localStorage.setItem('theme', 'dark');

            // Apply dark mode styles
            const darkStyles = `
                .dark-mode {
                    --primary-color: #60a5fa;
                    --primary-dark: #3b82f6;
                    --primary-light: #1e3a8a;
                    --text-primary: #f1f5f9;
                    --text-secondary: #cbd5e1;
                    --background-primary: #1e293b;
                    --background-secondary: #0f172a;
                    --background-tertiary: #334155;
                    --border-color: #475569;
                    --shadow-light: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
                    --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
                    --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                }
                
                .dark-mode .subject-card:hover {
                    border-color: var(--primary-color);
                }
                
                .dark-mode .note-subject {
                    background-color: var(--primary-color);
                    color: var(--background-primary);
                }
                
                .dark-mode .footer {
                    background-color: var(--background-secondary);
                }
            `;

            addOrUpdateStyles('dark-mode-styles', darkStyles);
        }

        function disableDarkMode() {
            document.body.classList.remove('dark-mode');
            updateToggleButton('🌙');
            localStorage.setItem('theme', 'light');

            // Remove dark mode styles
            const darkStyleSheet = document.getElementById('dark-mode-styles');
            if (darkStyleSheet) {
                darkStyleSheet.remove();
            }
        }

        function updateToggleButton(icon) {
            const toggleButton = document.querySelector('.dark-mode-toggle');
            if (toggleButton) {
                toggleButton.innerHTML = icon;
            }
        }

        function addOrUpdateStyles(id, css) {
            // Remove existing styles
            const existingStyles = document.getElementById(id);
            if (existingStyles) {
                existingStyles.remove();
            }

            // Add new styles
            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        }
    }


    // 3. PDF UPLOAD FUNCTIONALITY

    function initPdfUpload() {
        const fileInput = document.getElementById('pdf-upload');
        const uploadForm = document.getElementById('notes-upload-form');

        if (fileInput) {
            // Create file name display element
            const fileNameDisplay = document.createElement('div');
            fileNameDisplay.className = 'file-name-display';
            fileNameDisplay.style.cssText = `
                margin-top: 0.5rem;
                padding: 0.5rem;
                background-color: var(--background-tertiary, #f1f5f9);
                border-radius: var(--border-radius, 8px);
                border: 1px solid var(--border-color, #e2e8f0);
                font-size: 0.9rem;
                color: var(--text-secondary, #64748b);
                display: none;
            `;

            // Insert after file input
            fileInput.parentNode.insertBefore(fileNameDisplay, fileInput.nextSibling);

            // File input change event
            fileInput.addEventListener('change', function (e) {
                const file = e.target.files[0];

                if (file) {
                    // Validate file type
                    if (file.type !== 'application/pdf') {
                        showFileError('Please select a PDF file only.');
                        return;
                    }

                    // Validate file size (max 10MB)
                    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                    if (file.size > maxSize) {
                        showFileError('File size must be less than 10MB.');
                        return;
                    }

                    // Show file information
                    showFileInfo(file);
                } else {
                    hideFileDisplay();
                }
            });

            // Form submission handling
            if (uploadForm) {
                uploadForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const formData = new FormData(this);
                    const file = fileInput.files[0];

                    if (!file) {
                        showNotification('Please select a PDF file to upload.', 'error');
                        return;
                    }

                    // Show upload progress
                    showUploadProgress();

                    // Simulate upload process (replace with actual upload logic)
                    setTimeout(() => {
                        showNotification('File uploaded successfully!', 'success');
                        hideUploadProgress();

                        // Add uploaded file to notes display
                        addUploadedFileToDisplay(formData);

                        // Reset form
                        uploadForm.reset();
                        hideFileDisplay();
                    }, 2000);
                });
            }
        }

        function showFileInfo(file) {
            const fileNameDisplay = document.querySelector('.file-name-display');
            const fileSize = formatFileSize(file.size);

            fileNameDisplay.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--primary-color, #3b82f6);">📄</span>
                    <div>
                        <div style="font-weight: 500; color: var(--text-primary, #1e293b);">${file.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary, #64748b);">Size: ${fileSize}</div>
                    </div>
                    <button type="button" class="remove-file-btn" style="
                        background: none;
                        border: none;
                        color: var(--text-secondary, #64748b);
                        cursor: pointer;
                        font-size: 1.2rem;
                        margin-left: auto;
                    ">×</button>
                </div>
            `;

            fileNameDisplay.style.display = 'block';

            // Add remove file functionality
            const removeBtn = fileNameDisplay.querySelector('.remove-file-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function () {
                    fileInput.value = '';
                    hideFileDisplay();
                });
            }
        }

        function showFileError(message) {
            const fileNameDisplay = document.querySelector('.file-name-display');
            fileNameDisplay.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444;">
                    <span>⚠️</span>
                    <span>${message}</span>
                </div>
            `;
            fileNameDisplay.style.display = 'block';
            fileNameDisplay.style.borderColor = '#ef4444';
            fileNameDisplay.style.backgroundColor = '#fef2f2';

            // Clear file input
            fileInput.value = '';

            // Hide error after 5 seconds
            setTimeout(() => {
                hideFileDisplay();
            }, 5000);
        }

        function hideFileDisplay() {
            const fileNameDisplay = document.querySelector('.file-name-display');
            fileNameDisplay.style.display = 'none';
            fileNameDisplay.style.borderColor = 'var(--border-color, #e2e8f0)';
            fileNameDisplay.style.backgroundColor = 'var(--background-tertiary, #f1f5f9)';
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function showUploadProgress() {
            const uploadButton = document.querySelector('.upload-button');
            if (uploadButton) {
                uploadButton.textContent = 'Uploading...';
                uploadButton.disabled = true;
                uploadButton.style.opacity = '0.6';
            }
        }

        function hideUploadProgress() {
            const uploadButton = document.querySelector('.upload-button');
            if (uploadButton) {
                uploadButton.textContent = 'Upload Notes';
                uploadButton.disabled = false;
                uploadButton.style.opacity = '1';
            }
        }

        function addUploadedFileToDisplay(formData) {
            const notesGrid = document.querySelector('.notes-grid');
            const subject = formData.get('subject');
            const title = formData.get('title');
            const file = formData.get('pdf');

            if (notesGrid && subject && title && file) {
                const noteItem = document.createElement('article');
                noteItem.className = 'note-item';

                const now = new Date();
                const uploadDate = now.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                noteItem.innerHTML = `
                    <div class="note-header">
                        <h4 class="note-title">${title}</h4>
                        <span class="note-subject">${subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ')}</span>
                    </div>
                    <div class="note-content">
                        <p class="note-description">Recently uploaded file</p>
                        <div class="note-meta">
                            <span class="note-date">Uploaded: ${uploadDate}</span>
                            <span class="note-size">${formatFileSize(file.size)}</span>
                        </div>
                    </div>
                    <div class="note-actions">
                        <a href="#" class="note-action-btn view-btn">View</a>
                        <a href="#" class="note-action-btn download-btn">Download</a>
                    </div>
                `;

                // Add to beginning of grid
                notesGrid.insertBefore(noteItem, notesGrid.firstChild);

                // Add fade-in animation
                noteItem.style.opacity = '0';
                noteItem.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    noteItem.style.transition = 'all 0.5s ease';
                    noteItem.style.opacity = '1';
                    noteItem.style.transform = 'translateY(0)';
                }, 100);
            }
        }

        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius, 8px);
                box-shadow: var(--shadow-medium, 0 4px 6px rgba(0,0,0,0.1));
                z-index: 10000;
                font-weight: 500;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            `;

            // Set colors based on type
            if (type === 'success') {
                notification.style.backgroundColor = '#dcfce7';
                notification.style.color = '#166534';
                notification.style.borderLeft = '4px solid #22c55e';
            } else if (type === 'error') {
                notification.style.backgroundColor = '#fef2f2';
                notification.style.color = '#dc2626';
                notification.style.borderLeft = '4px solid #ef4444';
            } else {
                notification.style.backgroundColor = '#dbeafe';
                notification.style.color = '#1e40af';
                notification.style.borderLeft = '4px solid #3b82f6';
            }

            notification.textContent = message;
            document.body.appendChild(notification);

            // Show notification
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Hide notification after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 5000);
        }
    }


    // 4. ADDITIONAL UTILITY FUNCTIONS

    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navbar scroll effect
    function initNavbarScroll() {
        const header = document.querySelector('.header');

        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 5. INITIALIZE ALL FUNCTIONALITY

    // Initialize all features
    initDateTime();
    initDarkMode();
    initPdfUpload();
    initSmoothScrolling();
    initNavbarScroll();

    // Console log for debugging
    console.log('CSE Website JavaScript loaded successfully!');
    console.log('Features initialized: DateTime, Dark Mode, PDF Upload, Smooth Scrolling, Navbar Effects');
});

// 6. UTILITY FUNCTIONS (GLOBAL SCOPE)

// Function to handle responsive navigation (for mobile)
function toggleMobileNav() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Function to scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}