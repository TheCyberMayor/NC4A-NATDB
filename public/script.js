// CADETN National Database Form - JavaScript
// Form Validation and Submission Handler

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('officerDataForm');
    const submissionDate = document.getElementById('submissionDate');
    
    // Set today's date as default for submission date
    const today = new Date().toISOString().split('T')[0];
    submissionDate.value = today;
    submissionDate.setAttribute('max', today);

    // Phone number validation pattern (Nigerian format)
    const phonePattern = /^0[789][01]\d{8}$/;
    
    // NIN validation pattern (11 digits)
    const ninPattern = /^\d{11}$/;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Real-time validation for phone numbers
    const phoneInputs = ['phoneNumber', 'alternatePhone', 'nokPhone'];
    phoneInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', function() {
                validatePhoneNumber(this);
            });
        }
    });

    // Real-time validation for NIN
    const ninInput = document.getElementById('nin');
    if (ninInput) {
        ninInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 11);
        });
        ninInput.addEventListener('blur', function() {
            validateNIN(this);
        });
    }

    // Email validation
    const emailInput = document.getElementById('emailAddress');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
    }

    // Validate date of birth (must be at least 18 years old)
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
        dobInput.addEventListener('blur', function() {
            validateDateOfBirth(this);
        });
    }

    // Validate enlistment date
    const enlistmentInput = document.getElementById('dateOfEnlistment');
    if (enlistmentInput) {
        enlistmentInput.addEventListener('blur', function() {
            validateEnlistmentDate(this);
        });
    }

    // Phone number validation function
    function validatePhoneNumber(input) {
        const value = input.value.trim();
        
        if (value && !phonePattern.test(value)) {
            showError(input, 'Please enter a valid Nigerian phone number (e.g., 08012345678)');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // NIN validation function
    function validateNIN(input) {
        const value = input.value.trim();
        
        if (value && !ninPattern.test(value)) {
            showError(input, 'NIN must be exactly 11 digits');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // Email validation function
    function validateEmail(input) {
        const value = input.value.trim();
        
        if (value && !emailPattern.test(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // Date of birth validation (minimum age 18)
    function validateDateOfBirth(input) {
        const value = input.value;
        if (!value) return true;

        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 18) {
            showError(input, 'Officer must be at least 18 years old');
            return false;
        } else if (age > 100) {
            showError(input, 'Please enter a valid date of birth');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // Enlistment date validation
    function validateEnlistmentDate(input) {
        const value = input.value;
        if (!value) return true;

        const enlistmentDate = new Date(value);
        const today = new Date();
        
        if (enlistmentDate > today) {
            showError(input, 'Enlistment date cannot be in the future');
            return false;
        }

        const dobInput = document.getElementById('dateOfBirth');
        if (dobInput.value) {
            const dob = new Date(dobInput.value);
            if (enlistmentDate < dob) {
                showError(input, 'Enlistment date must be after date of birth');
                return false;
            }
        }

        clearError(input);
        return true;
    }

    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('has-error');
        input.classList.add('error');
        
        let errorText = formGroup.querySelector('.error-text');
        if (!errorText) {
            errorText = document.createElement('span');
            errorText.className = 'error-text';
            formGroup.appendChild(errorText);
        }
        errorText.textContent = message;
    }

    // Clear error message
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('has-error');
        input.classList.remove('error');
        
        const errorText = formGroup.querySelector('.error-text');
        if (errorText) {
            errorText.remove();
        }
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear all previous errors
        document.querySelectorAll('.error').forEach(el => {
            clearError(el);
        });

        // Validate all fields
        let isValid = true;
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate phone numbers
        phoneInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input && input.value.trim()) {
                if (!validatePhoneNumber(input)) {
                    isValid = false;
                }
            }
        });

        // Validate NIN
        if (ninInput && ninInput.value.trim()) {
            if (!validateNIN(ninInput)) {
                isValid = false;
            }
        }

        // Validate email
        if (emailInput) {
            if (!validateEmail(emailInput)) {
                isValid = false;
            }
        }

        // Validate dates
        if (!validateDateOfBirth(dobInput)) {
            isValid = false;
        }

        if (!validateEnlistmentDate(enlistmentInput)) {
            isValid = false;
        }

        // Check declaration checkbox
        const declarationCheckbox = document.getElementById('declaration');
        if (!declarationCheckbox.checked) {
            showError(declarationCheckbox, 'You must agree to the declaration');
            isValid = false;
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            showMessage('Please correct the errors in the form before submitting', 'error');
            return;
        }

        // If validation passes, collect and submit data
        submitFormData();
    });

    // Submit form data
    function submitFormData() {
        // Show loading spinner
        showLoading(true);

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Add timestamp
        data.submissionTimestamp = new Date().toISOString();
        data.formVersion = '1.0';

        console.log('Form Data:', data);

        // Submit to server
        fetch('/api/officers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            showLoading(false);
            
            if (result.success) {
                showMessage('Form submitted successfully! Your data has been recorded.', 'success');
                
                // Clear draft
                localStorage.removeItem('cadetFormDraft');
                
                // Optionally reset form after successful submission
                setTimeout(() => {
                    if (confirm('Data submitted successfully. Would you like to submit another form?')) {
                        form.reset();
                        submissionDate.value = today;
                        hideMessage();
                    }
                }, 2000);
            } else {
                showMessage(result.message || 'Submission failed. Please try again.', 'error');
            }
        })
        .catch(error => {
            showLoading(false);
            showMessage('An error occurred. Please check your connection and try again.', 'error');
            console.error('Error:', error);
        });
    }

    // Note: Data is now submitted to the server database
    // LocalStorage is only used for draft saving

    // Show loading spinner
    function showLoading(show) {
        let loadingDiv = document.querySelector('.loading-spinner');
        
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-spinner';
            loadingDiv.innerHTML = '<div class="spinner"></div><p>Submitting your data...</p>';
            form.appendChild(loadingDiv);
        }
        
        if (show) {
            loadingDiv.classList.add('show');
            // Disable submit button
            document.querySelector('.btn-primary').disabled = true;
        } else {
            loadingDiv.classList.remove('show');
            // Enable submit button
            document.querySelector('.btn-primary').disabled = false;
        }
    }

    // Show success/error message
    function showMessage(message, type) {
        hideMessage(); // Clear any existing messages
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message show`;
        messageDiv.innerHTML = `<strong>${type === 'success' ? 'Success!' : 'Error!'}</strong> ${message}`;
        
        form.insertBefore(messageDiv, form.firstChild);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Hide messages
    function hideMessage() {
        const messages = document.querySelectorAll('.success-message, .error-message');
        messages.forEach(msg => msg.remove());
    }

    // Auto-save functionality (optional)
    let autoSaveTimeout;
    form.addEventListener('input', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveFormDraft();
        }, 3000); // Auto-save after 3 seconds of inactivity
    });

    // Save form as draft
    function saveFormDraft() {
        const formData = new FormData(form);
        const draft = {};
        
        formData.forEach((value, key) => {
            if (value) draft[key] = value;
        });

        if (Object.keys(draft).length > 0) {
            localStorage.setItem('cadetFormDraft', JSON.stringify(draft));
            console.log('Draft saved automatically');
        }
    }

    // Load draft on page load
    function loadFormDraft() {
        const draft = localStorage.getItem('cadetFormDraft');
        
        if (draft) {
            const shouldLoad = confirm('A saved draft was found. Would you like to load it?');
            
            if (shouldLoad) {
                const data = JSON.parse(draft);
                
                Object.keys(data).forEach(key => {
                    const field = form.elements[key];
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === 'on';
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                showMessage('Draft loaded successfully', 'success');
                setTimeout(hideMessage, 3000);
            } else {
                localStorage.removeItem('cadetFormDraft');
            }
        }
    }

    // Load draft when page loads
    loadFormDraft();

    // Clear draft when form is successfully submitted
    form.addEventListener('submit', function() {
        localStorage.removeItem('cadetFormDraft');
    });

    // Print functionality
    window.printForm = function() {
        window.print();
    };

    // Export functionality removed - use admin dashboard to export data from database

    console.log('CADETN National Database Form initialized');
});
