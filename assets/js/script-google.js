// --- assets/js/script-google.js ---

// 1. Gestion des Médias (Photo & Audio)
function setupMediaHandlers() {
    // Gestion de la Photo
    document.getElementById('photo_input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        const preview = document.getElementById('preview-container');

        reader.onloadend = function() {
            document.getElementById('photo_base64').value = reader.result;
            preview.innerHTML = `<img src="${reader.result}" style="width:100px; height:100px; border-radius:10px; margin-top:10px; object-fit:cover; border: 1px solid rgba(255,255,255,0.2);">`;
        };
        if (file) reader.readAsDataURL(file);
    });

    // Gestion de l'Audio Vocal
    const audioInput = document.getElementById('audio_input');
    if (audioInput) {
        audioInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            const status = document.getElementById('audio-status');

            reader.onloadend = function() {
                document.getElementById('audio_base64').value = reader.result;
                if (status) status.innerText = "✅ Message vocal prêt !";
            };
            if (file) reader.readAsDataURL(file);
        });
    }
}

// 2. Gestion de la navigation "Livre Ouvert"
const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const progress = document.getElementById("progress");
let currentStep = 0;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7S_3Jsjdb7wH0bUTHpbhtYUIHDmTlNy5hpRwoofUPTML9wJq-fIeCSxp8K6X0atLZEA/exec";

function changeStep(direction) {
    // Animation de sortie (optionnelle selon ton CSS)
    steps[currentStep].style.opacity = "0";
    
    setTimeout(() => {
        steps[currentStep].classList.remove("active");
        currentStep += direction;
        steps[currentStep].classList.add("active");
        steps[currentStep].style.opacity = "1";
        updateUI();
    }, 300);
}

nextBtn.addEventListener("click", () => {
    // Vérification basique avant de passer à la suite
    const inputs = steps[currentStep].querySelectorAll("input[required], textarea[required]");
    let valid = true;
    inputs.forEach(input => { if(!input.value) valid = false; });

    if(valid) {
        changeStep(1);
    } else {
        alert("Remplis tous les petits cœurs avant de continuer... ❤️");
    }
});

prevBtn.addEventListener("click", () => changeStep(-1));

function updateUI() {
    progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
    prevBtn.style.display = currentStep === 0 ? "none" : "block";
    nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "block";
    submitBtn.style.display = currentStep === steps.length - 1 ? "block" : "none";
}

// 3. Envoi vers Google Sheets
document.getElementById("love-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // On s'assure que les Base64 sont bien inclus
    data.id_unique = uniqueId;
    data.photo_url = document.getElementById('photo_base64').value;
    data.audio_base64 = document.getElementById('audio_base64').value;

    submitBtn.innerText = "Envoi de ton amour...";
    submitBtn.disabled = true;

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        body: JSON.stringify(data)
    })
    .then(() => {
        const finalLink = window.location.origin + window.location.pathname.replace('create.html', 'view.html') + "?id=" + uniqueId;
        document.getElementById("generatedLink").innerText = finalLink;
        document.getElementById("successModal").style.display = "flex";
        submitBtn.innerText = "C'est envoyé ! ❤️";
    })
    .catch(err => {
        console.error("Erreur:", err);
        submitBtn.disabled = false;
        submitBtn.innerText = "Réessayer ❤️";
    });
});

function copyLink() {
    const linkText = document.getElementById("generatedLink").innerText;
    navigator.clipboard.writeText(linkText).then(() => {
        alert("Lien copié ! Il ne te reste plus qu'à lui envoyer 💌");
    });
}

// Initialisation
setupMediaHandlers();
