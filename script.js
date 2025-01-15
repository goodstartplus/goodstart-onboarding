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

// Função para salvar os desafios e carregar os vídeos
function saveChallenges() {
    const checkboxes = document.querySelectorAll('#challenges-screen input[type="checkbox"]:checked');
    const selectedChallenges = Array.from(checkboxes).map(cb => cb.value);
    userResponses['challenges'] = selectedChallenges;

    if (selectedChallenges.length > 0) {
        loadPersonalizedStories(selectedChallenges);
    } else {
        alert("Selecione pelo menos uma dificuldade para continuar.");
    }
}

// Função para carregar os vídeos personalizados com base nas respostas
function loadPersonalizedStories(selectedChallenges) {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

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
        storiesContainer.innerHTML = ""; // Limpa o vídeo anterior

        const videoElement = document.createElement('video');
        videoElement.src = videoSrc;
        videoElement.autoplay = true;
        videoElement.muted = false;
        videoElement.controls = true;
        videoElement.className = 'story-video';

        videoElement.onended = function () {
            loadVideo(index + 1);
        };

        storiesContainer.appendChild(videoElement);
    }

    loadVideo(storyIndex);
}

// Função para continuar após os vídeos
function continueOnboarding() {
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
}

// Função para finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
