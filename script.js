// Variável para armazenar as respostas do usuário
let userResponses = {};

// Função para iniciar o onboarding com o vídeo de introdução
function startOnboarding() {
    nextScreen('intro-video-screen');
}

// Função para avançar para a próxima tela
function nextScreen(screenId) {
    const currentScreen = document.querySelector('.screen:not(.hidden)');
    if (currentScreen) {
        currentScreen.classList.add('hidden');
    }
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
        nextScreen('summary-screen');
        showSummary();
    }
}

// Salvar métodos de estudo e avançar
function saveCheckboxes(question) {
    const checkboxes = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const selectedValues = Array.from(checkboxes).map(cb => cb.value);

    userResponses[question] = selectedValues;

    if (question === 'study-method') {
        nextScreen('reason-screen');
    } else if (question === 'reason') {
        nextScreen('trust-screen');
    }
}

// Mostrar resumo personalizado
function showSummary() {
    const summaryText = `
        ${userResponses['Nome']}, vamos construir seu plano com base nas suas respostas:
        - Idade: ${userResponses['age']}
        - Como estudou inglês: ${userResponses['study-method'] ? userResponses['study-method'].join(', ') : 'Não informado'}
        - Motivo: ${userResponses['reason'] ? userResponses['reason'].join(', ') : 'Não informado'}
        - Objetivo de prática: ${userResponses['conversation-goal']}
    `;
    document.getElementById('summary-content').innerText = summaryText;
}

// Carregar vídeos personalizados com base nos desafios selecionados
function loadPersonalizedVideos() {
    const challenges = userResponses['reason'] || [];
    const videos = {
        "Férias no exterior": "assets/videos/travel.mp4",
        "Trabalho": "assets/videos/work.mp4",
        "Morar no exterior": "assets/videos/live_abroad.mp4"
    };

    const videosContainer = document.getElementById('videos-container');
    videosContainer.innerHTML = '';

    challenges.forEach(challenge => {
        if (videos[challenge]) {
            const videoElement = document.createElement('video');
            videoElement.src = videos[challenge];
            videoElement.controls = true;
            videoElement.autoplay = false;
            videoElement.classList.add('personalized-video');
            videosContainer.appendChild(videoElement);
        }
    });

    nextScreen('personalized-videos-screen');
}

// Finalizar e redirecionar
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
