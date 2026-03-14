document.addEventListener("DOMContentLoaded", () => {
    
    const paymentForm = document.getElementById('payment-form');
    
    if (paymentForm) {
        // Format Card Number (add spaces)
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                // Format into chunks of 4
                value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                e.target.value = value.substring(0, 19); // Max 16 digits + 3 spaces
            });
        }

        // Format Expiry Date (MM/YY)
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
            });
        }

        // Format CVV (max 4 digits)
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value.substring(0, 4);
            });
        }

        // Form Submission Simulation
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('payment-submit');
            const errorElement = document.getElementById('payment-error');
            
            // Basic Validation
            const name = document.getElementById('card-name').value.trim();
            const number = cardNumberInput.value.replace(/\s+/g, '');
            const expiry = expiryInput.value;
            const cvv = cvvInput.value;

            errorElement.style.display = 'none';

            if (name.length < 3) {
                showError(errorElement, "Please enter a valid cardholder name.");
                return;
            }

            if (number.length < 15) {
                showError(errorElement, "Card number must be 15 or 16 digits.");
                return;
            }

            if (expiry.length < 5) {
                showError(errorElement, "Expiry date must be in MM/YY format.");
                return;
            }

            if (cvv.length < 3) {
                showError(errorElement, "CVV must be 3 or 4 digits.");
                return;
            }

            // Simulate Payment Processing Animation
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span> Processing Payment...`;
            submitBtn.classList.add('loading');
            
            // Add a subtle class to form to indicate processing
            paymentForm.style.opacity = '0.7';

            // Fake timeout
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 2000);
        });
    }

    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
});
