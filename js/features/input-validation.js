const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const form = document.getElementById('form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        /**
         * Validates a single input field and applies the 'invalid' class if necessary.
         * @param {HTMLElement} input - The input element to validate.
         * @returns {boolean} True if valid, false otherwise.
         */
        function validateField(input) {
            let isValid = true;
            const value = input.value.trim();
            const isEmail = input.id === 'email';

            // 1. Check for emptiness (required for all fields)
            if (value === '') {
                isValid = false;
            } 
            
            // 2. Check email format if it's the email field and it's not empty
            else if (isEmail && !emailRegex.test(value)) {
                isValid = false;
            }

            // Apply or remove the 'invalid' class based on validation result
            if (!isValid) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }

            return isValid;
        }

        form.addEventListener('submit', function(event) {
            // Prevent the default form submission to run our validation
            event.preventDefault();

            // Run validation on all fields
            const isNameValid = validateField(nameInput);
            const isEmailValid = validateField(emailInput);
            const isMessageValid = validateField(messageInput);
            
            // Check if all fields are valid
            const isFormValid = isNameValid && isEmailValid && isMessageValid;

            if (isFormValid) {
                // If the form is valid, manually submit the form data
                form.submit();
                
            } 
            // If invalid, the red underlines remain and submission is blocked.
        });

        // Add event listeners for immediate feedback on user typing
        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener('input', () => validateField(input));
        });
