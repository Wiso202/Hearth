// --- assets/js/script-google.js ---

// 1. Gestion de l'importation de la photo (Conversion Base64)
document.getElementById('photo_input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const preview = document.getElementById('preview-container');

    reader.onloadend = function() {
        // Stocke l'image convertie dans le champ caché pour l'envoi vers Google Sheet
        document.getElementById('photo_base64').value = reader.result;
        
        // Petit aperçu visuel pour l'utilisateur
        preview.innerHTML = `<img src="${reader.result}" style="width:100px; height:100px; border-radius:10px; margin-top:10px; object-fit:cover; border: 1px solid rgba(255,255,255,0.2);">`;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

// 2. Gestion de la navigation par étapes (Multi-step form)
const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const progress = document.getElementById("progress");
let currentStep = 0;

// URL de ton déploiement Google Apps Script (Vérifie bien qu'elle se termine par /exec)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzt6DYomjuQbmhZ0HGmxebvqTZh9nAi5cIXXumt59PYiNk373Z7_yzP4RwErx-RvR3eaw/exec";

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
    // Met à jour la barre de progression
    progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
    
    // Gère l'affichage des boutons selon l'étape
    prevBtn.style.display = currentStep === 0 ? "none" : "block";
    nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "block";
    submitBtn.style.display = currentStep === steps.length - 1 ? "block" : "none";
}

// 3. Envoi des données vers Google Sheets
document.getElementById("love-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Génération d'un ID unique côté client (pour éviter les erreurs CORS au retour)
    const uniqueId = Math.random().toString(36).substr(2, 9);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // On ajoute l'ID généré aux données envoyées
    data.id_unique = uniqueId;

    submitBtn.innerText = "Envoi de ton amour...";
    submitBtn.disabled = true;

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Crucial pour éviter l'erreur bloquante
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        // Avec no-cors, on ne peut pas lire la réponse JSON, 
        // donc on génère le lien de succès immédiatement
        const finalLink = window.location.origin + window.location.pathname.replace('create.html', 'view.html') + "?id=" + uniqueId;
        
        document.getElementById("generatedLink").innerText = finalLink;
        document.getElementById("successModal").style.display = "flex";
        
        submitBtn.innerText = "C'est envoyé ! ❤️";
    })
    .catch(err => {
        console.error("Erreur d'envoi:", err);
        alert("Une erreur est survenue lors de l'envoi. Vérifie ta connexion.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Réessayer ❤️";
    });
});

// Fonction pour copier le lien facilement
function copyLink() {
    const linkText = document.getElementById("generatedLink").innerText;
    navigator.clipboard.writeText(linkText).then(() => {
        alert("Lien copié ! Il ne te reste plus qu'à lui envoyer 💌");
    });
}
