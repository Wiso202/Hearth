// 1. REMPLACE CETTE URL PAR LA TIENNE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzt6DYomjuQbmhZ0HGmxebvqTZh9nAi5cIXXumt59PYiNk373Z7_yzP4RwErx-RvR3eaw/exec";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const playlist = ['assets/audio/song1.mp3', 'assets/audio/song2.mp3'];

// Récupération
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
            
            // Lancer musique au premier clic sur la page (contrainte navigateur)
            document.body.addEventListener('click', () => {
                const audio = document.getElementById('bg-music');
                if(audio.paused) {
                    audio.src = playlist[Math.floor(Math.random() * playlist.length)];
                    audio.play();
                }
            }, {once: true});
        });
}

function checkAnswer() {
    const ans = document.getElementById('quiz-answer').value.toLowerCase().trim();
    if(ans === window.correctAnswer) {
        window.quizPassed = true;
        document.getElementById('envelope-hint').innerText = "Bravo ! Touche l'enveloppe ❤️";
        document.getElementById('final-section').scrollIntoView({behavior: "smooth"});
    } else {
        alert("Mauvaise réponse... essaye encore !");
    }
}

function handleEnvelopeClick() {
    if(!window.quizPassed) return alert("Réponds au quiz d'abord !");
    const env = document.getElementById('envelope');
    env.classList.add('open');
    setInterval(createHeart, 300);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
