// Variável para armazenar as respostas do usuário
let userResponses = {};
let selectedChallenges = [];
let storyIndex = 0;

// Função para iniciar o onboarding
function startOnboarding() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('english-level-screen').classList.remove('hidden');
}

// Função para salvar respostas e avançar
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    if (question === 'level') {
        document.getElementById('english-level-screen').classList.add('hidden');
        document.getElementById('challenges-screen').classList.remove('hidden');
    }
}

// Função para capturar desafios selecionados
function saveChallenges() {
    const checkboxes = document.querySelectorAll('#challenges-screen input[type="checkbox"]:checked');
    selectedChallenges = Array.from(checkboxes).map(cb => cb.value);

    if (selectedChallenges.length === 0) {
        alert('Por favor, selecione pelo menos um desafio.');
        return;
    }

    loadPersonalizedStories();
}

// Função para carregar os stories personalizados com base nas respostas
function loadPersonalizedStories() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

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
