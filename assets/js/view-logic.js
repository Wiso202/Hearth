// 1. REMPLACE CETTE URL PAR LA TIENNE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDEi2a3YxiJEBd2InwC6KPlDMuI11k4e3xdHYkMT1AWk66XDDwtejj-VXlKCw7mzM7WA/exec";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

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
        });
}

function checkAnswer() {
    const ans = document.getElementById('quiz-answer').value.toLowerCase().trim();
    if(ans === window.correctAnswer) {
        document.getElementById('final-section').style.opacity = "1";
        document.getElementById('final-section').style.pointerEvents = "all";
        document.getElementById('quiz-btn').innerText = "Bravo ❤️";
    } else {
        alert("Essaye encore mon amour...");
    }
}

let timer;
const seal = document.getElementById('magic-seal');

seal.addEventListener('mousedown', startPress);
seal.addEventListener('mouseup', endPress);
seal.addEventListener('touchstart', startPress);
seal.addEventListener('touchend', endPress);

function startPress() {
    seal.classList.add('active');
    timer = setTimeout(() => {
        document.getElementById('magic-seal').classList.add('hidden');
        document.getElementById('surprise-finale').classList.remove('hidden');
        if(navigator.vibrate) navigator.vibrate(200);
        
        // DÉCLENCHE LA PLUIE DE COEURS UNIQUEMENT ICI
        setInterval(createHeart, 300);
    }, 3000);
}

function endPress() {
    seal.classList.remove('active');
    clearTimeout(timer);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-particle');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 5000);
}