document.addEventListener("DOMContentLoaded", function () {
    let currentStep = localStorage.getItem("currentStep") ? parseInt(localStorage.getItem("currentStep")) : 0;
    const steps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progress-bar");
    const progressSteps = document.querySelectorAll(".step");

    function updateProgress() {
        let progressPercent = ((currentStep) / (steps.length - 1)) * 100;
        progressBar.style.width = progressPercent + "%";

        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });
    }

    function nextStep() {
        const inputs = steps[currentStep].querySelectorAll("input");
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute("required") && !input.value.trim()) {
                isValid = false;
                alert(`Please fill in the ${input.previousElementSibling.innerText}`);
            }
        });

        if (isValid) {
            steps[currentStep].classList.remove("active");
            currentStep++;
            if (currentStep < steps.length) {
                steps[currentStep].classList.add("active");
                localStorage.setItem("currentStep", currentStep); // Save progress
                updateProgress();
            }
        }
    }

    function proceedToBank() {
        localStorage.removeItem("currentStep"); // Reset progress
        window.location.href = "bank-verification.html";
    }

    // Restore progress if user leaves and comes back
    function restoreProgress() {
        steps.forEach(step => step.classList.remove("active"));
        if (currentStep < steps.length) {
            steps[currentStep].classList.add("active");
        }
        updateProgress();
    }

    restoreProgress();
    window.nextStep = nextStep;
    window.proceedToBank = proceedToBank;
});
                               
