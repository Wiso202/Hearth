// 1. CONFIGURATION
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7S_3Jsjdb7wH0bUTHpbhtYUIHDmTlNy5hpRwoofUPTML9wJq-fIeCSxp8K6X0atLZEA/exec";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const playlist = Array.from({length: 12}, (_, i) => `assets/audio/${i+1}.mp3`);

let pressTimer;
const seal = document.getElementById('magic-seal');

// 2. RÉCUPÉRATION DES DONNÉES
if (id) {
    fetch(`${SCRIPT_URL}?id=${id}`)
    .then(res => res.json())
    .then(data => {
        const now = new Date();
        const openingDate = new Date(data.date_ouverture);

        // Vérification de la date
        if (now < openingDate) {
            document.getElementById('loader').style.display = 'none';
            showCountdown(openingDate);
            return;
        }

        // Chargement du contenu
        document.getElementById('loader').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';

        // Remplissage des éléments
        document.getElementById('display-photo').src = data.photo_url;
        document.getElementById('display-titre').innerText = data.titre_debut;
        document.getElementById('m1').innerText = data.souvenir_1;
        document.getElementById('m2').innerText = data.souvenir_2;
        document.getElementById('m3').innerText = data.souvenir_3;
        document.getElementById('display-question').innerText = data.question_jeu;
        
        // Stockage des variables globales
        window.m1 = data.souvenir_1;
        window.m2 = data.souvenir_2;
        window.m3 = data.souvenir_3;
        window.finalMessage = data.message_final;
        window.vocalAudio = data.audio_base64;
        window.correctAnswer = data.reponse_jeu.toLowerCase().trim();
        
        // Initialiser le premier texte de la timeline
        document.getElementById('moment-text').innerText = window.m1;

        setupMusic();
        applyNightMode();
    });
}

// 3. FONCTIONS D'INTERFACE
function typeWriter(text, elementId, speed = 50) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function showCountdown(target) {
    const overlay = document.getElementById('countdown-overlay');
    overlay.style.display = 'flex';
    document.getElementById('target-date').innerText = target.toLocaleDateString();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = target - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('timer').innerText = `${d}j ${h}h ${m}m ${s}s`;
        if (diff < 0) { clearInterval(timer); window.location.reload(); }
    }, 1000);
}

// 4. TIMELINE INTERACTIVE
const slider = document.getElementById('timeline-slider');
const momentText = document.getElementById('moment-text');
const momentIcon = document.getElementById('moment-icon');



// 5. JEU ET RÉVÉLATION
function checkAnswer() {
    const ans = document.getElementById('quiz-answer').value.toLowerCase().trim();
    const btn = document.getElementById('quiz-btn');
    
    if(ans === window.correctAnswer) {
        document.getElementById('final-section').classList.replace('opacity-0', 'opacity-100');
        document.getElementById('final-section').style.pointerEvents = "all";
        document.getElementById('final-section').scrollIntoView({behavior: "smooth"});
    } else {
        btn.innerText = "Essaye encore, mon cœur... 😘";
        btn.style.backgroundColor = "#ffc107";
        setTimeout(() => {
            btn.innerText = "C'est ça !";
            btn.style.backgroundColor = "#e63946";
        }, 2000);
    }
}

const startPress = (e) => {
    e.preventDefault();
    seal.classList.add('active');
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);

    pressTimer = setTimeout(() => {
        seal.style.display = 'none';
        document.getElementById('surprise-reveal').classList.remove('hidden');
        
        if (window.vocalAudio) {
            const audio = new Audio(window.vocalAudio);
            audio.play().catch(err => console.log("Audio bloqué par le navigateur"));
        }
        
        typeWriter(window.finalMessage, 'display-message', 70);
        setInterval(createHeart, 250);
    }, 3000);
};

const stopPress = () => {
    clearTimeout(pressTimer);
    seal.classList.remove('active');
};

if (seal) {
    seal.addEventListener('mousedown', startPress);
    seal.addEventListener('touchstart', startPress);
    seal.addEventListener('mouseup', stopPress);
    seal.addEventListener('touchend', stopPress);
}

// 6. EFFETS VISUELS (Parallaxe, Cœurs, Mode Nuit)
function createHeart() {
    const h = document.createElement('div');
    h.className = 'heart-particle';
    h.innerHTML = ['❤️', '💖', '💝', '🌸'][Math.floor(Math.random()*4)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (Math.random() * 20 + 10) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5000);
}

function applyNightMode() {
    const hour = new Date().getHours();
    if (hour >= 19 || hour <= 7) {
        document.body.classList.add('night-mode');
        // Vérifie si particlesJS est chargé dans l'HTML
        if (typeof particlesJS !== 'undefined') {
            particlesJS("main-content", {"particles":{"number":{"value":80},"color":{"value":"#ffffff"},"opacity":{"value":0.3},"size":{"value":2},"move":{"enable":true,"speed":1}}});
        }
    }
}

// Parallaxe Polaroid
document.addEventListener('mousemove', (e) => {
    const polaroid = document.querySelector('.polaroid-frame');
    if (polaroid) {
        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;
        polaroid.style.transform = `rotate(-2deg) translate(${x}px, ${y}px)`;
    }
});

// Secret Tap
const romanticTitle = document.querySelector('.romantic-title');
if (romanticTitle) {
    let tapCount = 0;
    romanticTitle.addEventListener('click', () => {
        tapCount++;
        if (tapCount === 5) {
            alert("💖 Mon secret : Je t'aime plus que tout.");
            window.open('https://open.spotify.com', '_blank');
            tapCount = 0;
        }
    });
}

function setupMusic() {
    const audio = document.getElementById('bg-music');
    document.body.addEventListener('click', () => {
        if(audio && audio.paused) {
            audio.src = playlist[Math.floor(Math.random()*12)];
            audio.play();
        }
    }, {once: true});
}
