// Variável para armazenar as respostas do usuário
let userResponses = {};

// Função para iniciar o onboarding
function startOnboarding() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('english-level-screen').classList.remove('hidden');
}

// Função para salvar as respostas e avançar para a próxima tela
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    if (question === 'level') {
        document.getElementById('english-level-screen').classList.add('hidden');
        document.getElementById('challenges-screen').classList.remove('hidden');
    }
}

// Função para salvar desafios selecionados e carregar vídeos
function saveChallenges() {
    const selectedChallenges = Array.from(document.querySelectorAll('#challenges-screen input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    userResponses['challenges'] = selectedChallenges;

    loadPersonalizedVideos();
}

// Função para carregar os vídeos personalizados com navegação de stories
function loadPersonalizedStories() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = ''; // Limpar conteúdo anterior

    const selectedChallenges = userResponses['challenges'];
    let storyIndex = 0;

    const videos = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    function loadVideo(index) {
        if (index >= selectedChallenges.length) {
            continueOnboarding();
            return;
        }

        const challenge = selectedChallenges[index];
        const videoSrc = videos[challenge];

        const videoElement = document.createElement('video');
        videoElement.src = videoSrc;
        videoElement.autoplay = true;
        videoElement.muted = false;
        videoElement.controls = false;
        videoElement.className = 'story-video';

        videoElement.onended = function () {
            storyIndex++;
            loadVideo(storyIndex);
        };

        // Progresso visual
        const progress = document.getElementById('progress');
        progress.style.width = '0%';
        setTimeout(() => {
            progress.style.width = '100%';
        }, 50);

        storiesContainer.innerHTML = '';
        storiesContainer.appendChild(videoElement);
    }

    loadVideo(storyIndex);
}


// Função para continuar o onboarding após os vídeos
function continueOnboarding() {
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
}

// Função para finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
