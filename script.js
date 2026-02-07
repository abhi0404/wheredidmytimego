function animateNumber(elementId, finalValue, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const value = Math.floor(progress * finalValue);
        element.innerText = value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

document.addEventListener("DOMContentLoaded", function () {
    const lifeForm = document.getElementById("lifeForm");

    const phoneInput = document.getElementById("phone");
    const reduceInput = document.getElementById("reducePhone");
    const reduceValue = document.getElementById("reduceValue");
    const resultDiv = document.getElementById("result");
    const chartCanvas = document.getElementById("lifeChart");

    const age = document.getElementById("age");
        const lifespan = document.getElementById("lifespan");
        const sleep = document.getElementById("sleep");
        const phone = document.getElementById("phone");
        const work = document.getElementById("work");
        const commute = document.getElementById("commute");

        allowOnlyNumbers(age);
        allowOnlyNumbers(lifespan);
        allowOnlyNumbers(sleep);
        allowOnlyNumbers(phone);
        allowOnlyNumbers(work);
        allowOnlyNumbers(commute);

    let lifeChart = null;

    /* ---------------- Slider Sync ---------------- */

    function updateSliderMax() {
        const phoneHours = Number(phoneInput.value) || 0;
        reduceInput.max = phoneHours;

        if (Number(reduceInput.value) > phoneHours) {
            reduceInput.value = phoneHours;
        }
        reduceValue.innerText = reduceInput.value;
    }

    phoneInput.addEventListener("input", updateSliderMax);

    reduceInput.addEventListener("input", function () {
        reduceValue.innerText = this.value;
    });

    updateSliderMax();

    /* ---------------- Form Submit ---------------- */

    lifeForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const age = Number(document.getElementById("age").value);

        const lifespan = Number(document.getElementById("lifespan").value);
 
        const sleep = Number(document.getElementById("sleep").value);
 
        const phone = Number(phoneInput.value);
   
        const work = Number(document.getElementById("work").value);
     
        const commute = Number(document.getElementById("commute").value);
     
        const reducePhone = Number(reduceInput.value);
     

        /* ----------- Validations ----------- */

        if (age >= lifespan) {
            resultDiv.innerHTML =
                "<p style='color:red;'>Age must be less than lifespan.</p>";
            return;
        }

        const adjustedPhone = Math.max(phone - reducePhone, 0);
        const totalHours = sleep + work + commute + adjustedPhone;

        if (totalHours > 24) {
            resultDiv.innerHTML =
                "<p style='color:red;'>Sleep + Work + Commute + Phone (after reduction) must be ≤ 24 hours.</p>";
            return;
        }

        /* ----------- Core Calculations ----------- */

        const remainingYears = lifespan - age;
        const daysLeft = remainingYears * 365;
        const hoursLeft = daysLeft * 24;

        const sleepHours = sleep * daysLeft;
        const consciousHours = hoursLeft - sleepHours;

        const phoneHours = adjustedPhone * daysLeft;
        const workHours = work * daysLeft;
        const commuteHours = commute * daysLeft;

        const savedPhoneHours = reducePhone * daysLeft;

        const phonePercent = ((phoneHours / consciousHours) * 100).toFixed(1);
        const workPercent = ((workHours / consciousHours) * 100).toFixed(1);
        const commutePercent = ((commuteHours / consciousHours) * 100).toFixed(1);
        const savedPercent = ((savedPhoneHours / consciousHours) * 100).toFixed(1);
        const lifeUsedPercent = ((age / lifespan) * 100).toFixed(1);

        /* ----------- Chart ----------- */

        if (lifeChart) {
            lifeChart.destroy();
        }

        lifeChart = new Chart(chartCanvas.getContext("2d"), {
            type: "doughnut",
            data: {
                labels: ["Phone (%)","Work (%)","Commute (%)","Saved Phone Time (%)"],
                datasets: [{
                    data: [phonePercent, workPercent, commutePercent, savedPercent],
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        /* ----------- Result Text ----------- */

        resultDiv.innerHTML = `
            <h3>Your Life, In Numbers</h3> 
            <p><strong>${lifeUsedPercent}% of your life is already gone.</strong></p> 
            <p>You have approximately <strong>${remainingYears} years</strong> left.</p> 
            <p> After sleep, you are left with about <strong><span id="consciousHours">0</span></strong> for everything that matters. </p> 
            <h4>If nothing changes, here’s where that time will go:</h4> 
            <p>📱 <strong>Phone:</strong>
                <span id="phoneHours">0</span> hours — <strong>${phonePercent}%</strong>
            </p>

            <p>📉 <strong>If you reduce phone usage:</strong>
                You reclaim <strong><span id="savedPhoneHours">0</span> hours</strong>
                (<strong>${savedPercent}%</strong>) of your conscious life
            </p>
            <p>💼 <strong>Work:</strong> <span id="workHours">0</span> hours — <strong>${workPercent}%</strong> of your conscious life</p> 
            <p>🚗 <strong>Commute:</strong> <span id="commuteHours">0</span> hours — <strong>${commutePercent}%</strong> of your conscious life</p> 
            <p style="margin-top:15px;"><em>This isn’t meant to scare you. It’s meant to show you what your days are quietly adding up to.</em></p> 
        `;
        animateNumber("consciousHours", consciousHours);
        animateNumber("phoneHours", phoneHours);
        animateNumber("savedPhoneHours", savedPhoneHours);
        animateNumber("workHours", workHours);
        animateNumber("commuteHours", commuteHours);
        
        document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

function allowOnlyNumbers(inputEl) {
    inputEl.addEventListener("input", () => {
        inputEl.value = inputEl.value.replace(/[^0-9]/g, "");
    });
}

function shareFacebook() {
    const pageUrl = encodeURIComponent(window.location.href);
    const message = encodeURIComponent(generateShareMessage());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${message}`, "_blank");
}

function shareTwitter() {
    const pageUrl = encodeURIComponent(window.location.href);
    const message = encodeURIComponent(generateShareMessage());
    window.open(`https://twitter.com/intent/tweet?url=${pageUrl}&text=${message}`, "_blank");
}

function shareWhatsApp() {
    const message = encodeURIComponent(generateShareMessage() + " " + window.location.href);
    window.open(`https://wa.me/?text=${message}`, "_blank");
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link."));
}

// Helper function to generate share message dynamically
function generateShareMessage() {
    const conscious = document.getElementById("consciousHours")?.innerText || 0;
    const phone = document.getElementById("phoneHours")?.innerText || 0;
    return `I just found out I have ${conscious} conscious hours left, and will spend ${phone} hours on my phone! Check your numbers here:`;
}