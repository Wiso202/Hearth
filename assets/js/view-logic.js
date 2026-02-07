// 1. REMPLACE CETTE URL PAR LA TIENNE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzt6DYomjuQbmhZ0HGmxebvqTZh9nAi5cIXXumt59PYiNk373Z7_yzP4RwErx-RvR3eaw/exec";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// 1. TA PLAYLIST (12 chansons)
// Remplace 'Nom de la musique' par le nom exact de ton fichier dans assets/audio/
const playlist = [
    'assets/audio/Burna-Boy-For-My-Hand-feat.-Ed-Sheeran-_Official-Music-Video_.mp3',
    'assets/audio/crisba_tchotcho_clip_officiel_aac_25813.mp3',
    'assets/audio/DADJU - Ma woman (Audio Officiel).mp3',
    'assets/audio/DADJU_-_Reine_(Clip_Officiel)(256k).mp3',
    'assets/audio/Ed_Sheeran_-_Perfect__28Official_Music_Video_29.mp3',
    'assets/audio/Garou_C_line_Dion_-_Sous_le_vent_Vid_o_officielle_remasteris_e_en_HD_480P.mp3',
    'assets/audio/goulam_pour_toujours_clip_officiel_mp3_75035.mp3',
    'assets/audio/Justin_Bieber_-_Holy_Acoustic_ft._Chance_The_Rapper_720P.mp3',
    'assets/audio/Justin-Bieber-Die-In-Your-Arms-_Lyrics-Letras_.mp3',
    'assets/audio/nikanor_feat_sessime_toi_et_moi_audio_officiel_aac_37501.mp3',
    'assets/audio/VANO-BABY-Fitè-_Clip-officiel_.mp3',
    'assets/audio/VANO-BABY-TU-MERITES-TOUT-_CLIP-OFFICIEL_.mp3'
];

// 2. RÉCUPÉRATION DES DONNÉES
if (id) {
    fetch(`${SCRIPT_URL}?id=${id}`)
        .then(res => res.json())
        .then(data => {
            // Cacher le loader et afficher le contenu
            document.getElementById('loader').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';

            // Remplissage des éléments
            document.getElementById('display-photo').src = data.photo_url;
            document.getElementById('display-titre').innerText = data.titre_debut;
            document.getElementById('m1').innerText = data.souvenir_1;
            document.getElementById('m2').innerText = data.souvenir_2;
            document.getElementById('m3').innerText = data.souvenir_3;
            document.getElementById('display-question').innerText = data.question_jeu;
            document.getElementById('display-message').innerText = data.message_final;
            
            // Stockage de la réponse du quiz
            window.correctAnswer = data.reponse_jeu.toLowerCase().trim();
            
            // Initialiser la musique aléatoire
            setupMusic();
        })
        .catch(err => {
            console.error("Erreur au chargement :", err);
            document.getElementById('loader').innerText = "Impossible de charger ton Instant... ❤️";
        });
}

// 3. LOGIQUE MUSICALE
function setupMusic() {
    const audio = document.getElementById('bg-music');
    const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
    audio.src = randomSong;

    // Gestion de l'autonomie (les navigateurs bloquent le son sans clic)
    document.body.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log("Lecture auto bloquée :", e));
        }
    }, { once: true });
}

// 4. LOGIQUE DU QUIZ
function checkAnswer() {
    const userInput = document.getElementById('quiz-answer').value.toLowerCase().trim();
    if (userInput === window.correctAnswer) {
        window.quizPassed = true;
        document.getElementById('envelope-hint').innerText = "Bravo mon amour ! Touche l'enveloppe ❤️";
        document.getElementById('final-section').scrollIntoView({ behavior: "smooth" });
    } else {
        alert("Ce n'est pas tout à fait ça... essaye encore ! ❤️");
    }
}

// 5. L'ENVELOPPE ET LES CŒURS
function handleEnvelopeClick() {
    if (!window.quizPassed) {
        alert("Réponds au petit quiz juste au-dessus pour débloquer ton enveloppe ! ✨");
        return;
    }
    
    const env = document.getElementById('envelope');
    env.classList.add('open');
    
    // Lancement de la pluie de cœurs
    setInterval(createHeart, 300);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    heart.style.fontSize = (Math.random() * 10 + 15) + 'px'; // Tailles variées
    document.body.appendChild(heart);
    
    // Supprimer le cœur après l'animation pour ne pas ralentir le site
    setTimeout(() => heart.remove(), 5000);
}

