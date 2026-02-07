// 1. REMPLACE CETTE URL PAR LA TIENNE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzt6DYomjuQbmhZ0HGmxebvqTZh9nAi5cIXXumt59PYiNk373Z7_yzP4RwErx-RvR3eaw/exec";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const playlist = Array.from({length: 12}, (_, i) => `assets/audio/${i+1}.mp3`);

if (id) {
    fetch(`${SCRIPT_URL}?id=${id}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';

        document.getElementById('display-photo').src = data.photo_url;
        document.getElementById('display-titre').innerText = data.titre_debut;
        document.getElementById('m1').innerText = data.souvenir_1;
        document.getElementById('m2').innerText = data.souvenir_2;
        document.getElementById('m3').innerText = data.souvenir_3;
        document.getElementById('display-question').innerText = data.question_jeu;
        document.getElementById('display-message').innerText = data.message_final;
        
        window.correctAnswer = data.reponse_jeu.toLowerCase().trim();
        setupMusic();
    });
}

function setupMusic() {
    const audio = document.getElementById('bg-music');
    audio.volume = 0; // On commence à 0
    
    document.body.addEventListener('click', () => {
        if(audio.paused) {
            audio.src = playlist[Math.floor(Math.random()*12)];
            audio.play();
            // Effet de fondu (Fade-in)
            let vol = 0;
            const fadeIn = setInterval(() => {
                if (vol < 0.5) { vol += 0.05; audio.volume = vol; } 
                else { clearInterval(fadeIn); }
            }, 200);
        }
    }, {once: true});
}

function checkAnswer() {
    const ans = document.getElementById('quiz-answer').value.toLowerCase().trim();
    if(ans === window.correctAnswer) {
        const final = document.getElementById('final-section');
        final.classList.replace('opacity-0', 'opacity-100');
        final.style.pointerEvents = "all";
        final.scrollIntoView({behavior: "smooth"});
    }
}

// Scellé Tactile
let pressTimer;
const seal = document.getElementById('magic-seal');

const start = (e) => {
    e.preventDefault();
    seal.classList.add('active');
    pressTimer = setTimeout(() => {
        seal.style.display = 'none';
        document.getElementById('surprise-reveal').classList.remove('hidden');
        setInterval(createHeart, 250);
    }, 3000);
};

const stop = () => {
    clearTimeout(pressTimer);
    seal.classList.remove('active');
};

seal.addEventListener('mousedown', start);
seal.addEventListener('touchstart', start);
seal.addEventListener('mouseup', stop);
seal.addEventListener('touchend', stop);

function createHeart() {
    const h = document.createElement('div');
    h.className = 'heart-particle';
    h.innerHTML = ['❤️', '💖', '💝', '🌸'][Math.floor(Math.random()*4)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (Math.random() * 20 + 10) + 'px';
    h.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5000);
}




