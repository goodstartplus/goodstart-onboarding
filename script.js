// Variável para armazenar as respostas do usuário
let userResponses = {};
let selectedChallenges = [];
let storyIndex = 0;

// Função para iniciar o onboarding com o vídeo de introdução
function startOnboarding() {
    nextScreen('intro-video-screen');
}

// Função para avançar para a próxima tela
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Salvar nome e avançar
function saveName() {
    const name = document.getElementById('user-name').value;
    if (name.trim() !== "") {
        userResponses['Nome'] = name;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira seu nome.");
    }
}

// Salvar idade e avançar
function saveAnswer(question, answer) {
    userResponses[question] = answer;
    if (question === 'age') {
        nextScreen('study-method-screen');
    } else if (question === 'conversation-goal') {
        nextScreen('challenges-screen');
    }
}

// Salvar métodos de estudo e avançar
function saveCheckboxes(question) {
    const checkboxes = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const values = Array.from(checkboxes).map(cb => cb.value);
    userResponses[question] = values;

    if (question === 'study-method') {
        nextScreen('reason-screen');
    } else if (question === 'reason') {
        nextScreen('trust-screen');
    } else if (question === 'challenges') {
        selectedChallenges = values;
        loadPersonalizedVideos();
    }
}

// Função para carregar vídeos personalizados
function loadPersonalizedVideos() {
    nextScreen('stories-screen');
    storyIndex = 0;

    const videos = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    function loadVideo(index) {
        if (index >= selectedChallenges.length) {
            nextScreen('summary-screen');
            return;
        }

        const challenge = selectedChallenges[index];
        const videoSrc = videos[challenge];
        const storiesContainer = document.getElementById('stories-container');

        storiesContainer.innerHTML = `
            <video id="current-video" src="${videoSrc}" controls autoplay></video>
            <button onclick="nextVideo()">Próximo</button>
        `;
    }

    window.nextVideo = function () {
        const videoElement = document.getElementById('current-video');
        if (videoElement) videoElement.pause();
        storyIndex++;
        loadVideo(storyIndex);
    };

    loadVideo(storyIndex);
}

// Mostrar resumo personalizado
function showSummary() {
    const summaryText = `
        ${userResponses['Nome']}, vamos construir seu plano com base nas suas respostas:
        - Idade: ${userResponses['age']}
        - Como estudou inglês: ${userResponses['study-method'].join(', ')}
        - Motivo: ${userResponses['reason'].join(', ')}
        - Objetivo de prática: ${userResponses['conversation-goal']}
    `;
    document.getElementById('summary-content').innerText = summaryText;
}

// Finalizar e redirecionar
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
