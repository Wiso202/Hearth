document.getElementById('photo_input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const preview = document.getElementById('preview-container');

    reader.onloadend = function() {
        // On stocke la version texte de l'image dans le champ caché
        document.getElementById('photo_base64').value = reader.result;
        
        // Petit aperçu pour l'utilisateur
        preview.innerHTML = `<img src="${reader.result}" style="width:100px; height:100px; border-radius:10px; margin-top:10px; object-fit:cover;">`;
    };

    if (file) {
        reader.readAsDataURL(file); // Convertit l'image en base64
    }
});

const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const progress = document.getElementById("progress");
let currentStep = 0;

// URL de ton déploiement Apps Script (À REMPLACER)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDEi2a3YxiJEBd2InwC6KPlDMuI11k4e3xdHYkMT1AWk66XDDwtejj-VXlKCw7mzM7WA/exec";

nextBtn.addEventListener("click", () => {
    steps[currentStep].classList.remove("active");
    currentStep++;
    steps[currentStep].classList.add("active");
    updateUI();
});

prevBtn.addEventListener("click", () => {
    steps[currentStep].classList.remove("active");
    currentStep--;
    steps[currentStep].classList.add("active");
    updateUI();
});

function updateUI() {
    progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
    prevBtn.style.display = currentStep === 0 ? "none" : "block";
    nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "block";
    submitBtn.style.display = currentStep === steps.length - 1 ? "block" : "none";
}

document.getElementById("love-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    submitBtn.innerText = "Création en cours...";

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        if(response.result === "success") {
            const finalLink = window.location.origin + "/view.html?id=" + response.id;
            document.getElementById("generatedLink").innerText = finalLink;
            document.getElementById("successModal").style.display = "flex";
        }
    });
});