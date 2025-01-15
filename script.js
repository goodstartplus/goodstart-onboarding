// Variável para armazenar as respostas do usuário
let userResponses = {};
let selectedChallenges = [];
let storyIndex = 0;

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

// Função para salvar desafios selecionados
function saveChallenges() {
    selectedChallenges = [];
    const checkboxes = document.querySelectorAll('#challenges-screen input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => selectedChallenges.push(checkbox.value));

    if (selectedChallenges.length > 0) {
        loadPersonalizedStories();
    }
}

// Função para carregar os stories personalizados com base nas respostas
function loadPersonalizedStories() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');
    storyIndex = 0;
    loadVideo(storyIndex);
}

// Função para carregar os vídeos de acordo com os desafios selecionados
function loadVideo(index) {
    if (index >= selectedChallenges.length) {
        continueOnboarding();
        return;
    }

    const videos = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const challenge = selectedChallenges[index];
    const videoSrc = videos[challenge];

    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = "";  // Limpa o vídeo anterior

    const videoElement = document.createElement('video');
    videoElement.src = videoSrc;
    videoElement.autoplay = true;
    videoElement.muted = false;
    videoElement.controls = true;
    videoElement.className = 'story-video';

    // Carrega o próximo vídeo após o término
    videoElement.onended = function () {
        storyIndex++;
        loadVideo(storyIndex);
    };

    storiesContainer.appendChild(videoElement);
}

// Função para continuar após os vídeos
function continueOnboarding() {
    stopCurrentVideo();
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
}

// Função para parar o vídeo atual
function stopCurrentVideo() {
    const videoElement = document.querySelector('#stories-container video');
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
    }
}

// Função para finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br"; // Redireciona para a plataforma
}
