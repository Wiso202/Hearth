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
        
        // Remplissage avec vérification d'image
        const img = document.getElementById('display-photo');
        img.src = data.photo_url;
        img.onerror = () => { img.src = "assets/img/default-love.jpg"; }; // Image de secours si base64 foire
        
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

function checkAnswer() {
    const ans = document.getElementById('quiz-answer').value.toLowerCase().trim();
    if(ans === window.correctAnswer) {
        const final = document.getElementById('final-section');
        final.style.opacity = "1";
        final.style.pointerEvents = "all";
        final.scrollIntoView({behavior: "smooth"});
        document.getElementById('quiz-btn').className = "btn btn-success";
    }
}

// FIX : Pluie de coeurs
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
    heart.style.opacity = Math.random();
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}

let pressTimer;
const seal = document.getElementById('magic-seal');

const startPress = (e) => {
    e.preventDefault();
    seal.classList.add('active');
    pressTimer = setTimeout(() => {
        seal.classList.add('d-none');
        document.getElementById('surprise-reveal').classList.remove('hidden');
        setInterval(createHeart, 200); // Lancement de la pluie de coeurs ici !
    }, 3000);
};

const cancelPress = () => {
    clearTimeout(pressTimer);
    seal.classList.remove('active');
};

seal.addEventListener('mousedown', startPress);
seal.addEventListener('touchstart', startPress);
seal.addEventListener('mouseup', cancelPress);
seal.addEventListener('touchend', cancelPress);

function setupMusic() {
    const audio = document.getElementById('bg-music');
    document.body.addEventListener('click', () => {
        if(audio.paused) {
            audio.src = playlist[Math.floor(Math.random()*12)];
            audio.play();
        }
    }, {once: true});
}



