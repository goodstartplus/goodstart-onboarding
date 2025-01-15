// Variável para armazenar as respostas do usuário
let userResponses = {};

// Função para iniciar o onboarding
function startOnboarding() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('intro-video-screen').classList.remove('hidden');
}

// Função para ir para a próxima tela
function goToNextScreen(currentScreenId, nextScreenId) {
    document.getElementById(currentScreenId).classList.add('hidden');
    document.getElementById(nextScreenId).classList.remove('hidden');
}

// Função para salvar respostas
function saveAnswer(question, answer) {
    userResponses[question] = answer;
}

// Função para salvar múltiplas respostas (checkboxes)
function saveMultipleAnswers(question) {
    let selectedOptions = [];
    document.querySelectorAll(`#${question}-screen input[type='checkbox']:checked`).forEach((checkbox) => {
        selectedOptions.push(checkbox.value);
    });
    userResponses[question] = selectedOptions;
}

// Função para carregar os stories personalizados com base nas respostas
function loadPersonalizedStories() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

    const selectedChallenges = userResponses['challenges'] || [];
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
            <button onclick="nextVideo()">Próximo</button>
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
            videoElement.pause();
        }
        storyIndex++;
        loadVideo(storyIndex);
    };

    loadVideo(storyIndex);
}

// Função para exibir o resumo final personalizado
function showSummary() {
    const summaryContainer = document.getElementById('summary-container');
    summaryContainer.innerHTML = `
        <h3>${userResponses['name']}, vamos construir seu plano de aprendizagem com base nas suas respostas:</h3>
        <p><strong>Nível:</strong> ${userResponses['level']}</p>
        <p><strong>Tempo de estudo diário:</strong> ${userResponses['practice-time']} minutos</p>
        <p><strong>Motivações:</strong> ${userResponses['reasons'].join(', ')}</p>
        <p><strong>Principais desafios:</strong> ${userResponses['challenges'].join(', ')}</p>
    `;
}

// Função para continuar o onboarding após os stories
function continueOnboarding() {
    goToNextScreen('stories-screen', 'finish-screen');
    showSummary();
}

// Função para finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
