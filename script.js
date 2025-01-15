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
    } else if (question === 'challenges') {
        loadPersonalizedStories();
    }
}

// Função para carregar os stories personalizados com base nas respostas
function loadPersonalizedStories() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

    const selectedChallenges = Object.keys(userResponses).filter(key => userResponses[key] === true);
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
        const storiesContainer = document.getElementById('stories-container');

        storiesContainer.innerHTML = `
            <video id="current-video" src="${videoSrc}" controls autoplay></video>
            <button id="next-button" onclick="nextVideo()">Próximo</button>
        `;

        const videoElement = document.getElementById('current-video');

        videoElement.onended = function () {
            storyIndex++;
            loadVideo(storyIndex);
        };
    }

    window.nextVideo = function () {
        const videoElement = document.getElementById('current-video');
        if (videoElement) {
            videoElement.pause();  // Para o vídeo atual
        }
        storyIndex++;
        loadVideo(storyIndex);
    };

    loadVideo(storyIndex);
}

// Função para continuar o onboarding após os stories
function continueOnboarding() {
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
}

// Função para finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br"; // Redireciona para a plataforma
}
