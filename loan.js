let currentStep = 0;
const steps = document.querySelectorAll(".form-step");

function nextStep() {
    steps[currentStep].classList.remove("active");
    currentStep++;
    if (currentStep < steps.length) {
        steps[currentStep].classList.add("active");
    }
}

function proceedToBank() {
    window.location.href = "bank-verification.html";
}
