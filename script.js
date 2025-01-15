let userResponses = {};

// Avança para a próxima tela
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Salva o nome e avança
function saveName() {
    const name = document.getElementById('user-name').value.trim();
    if (name !== "") {
        userResponses['Nome'] = name;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira seu nome.");
    }
}

// Salva respostas únicas (idade, objetivo de conversação)
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    if (question === 'age') {
        nextScreen('study-method-screen');
    } else if (question === 'conversation-goal') {
        nextScreen('summary-screen');
        showSummary();
    }
}

// Salva respostas múltiplas (checkboxes)
function saveCheckboxes(question) {
    const checkboxes = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const values = Array.from(checkboxes).map(cb => cb.value);
    userResponses[question] = values;

    if (question === 'study-method') {
        nextScreen('reason-screen');
    } else if (question === 'reason') {
        nextScreen('challenges-screen');
    } else if (question === 'challenges') {
        nextScreen('trust-screen');
    }
}

// Mostra o resumo personalizado
function showSummary() {
    const summaryText = `
        ${userResponses['Nome']}, vamos construir seu plano com base nas suas respostas:
        - Idade: ${userResponses['age']}
        - Como estudou inglês: ${userResponses['study-method'] ? userResponses['study-method'].join(', ') : 'Não informado'}
        - Motivo: ${userResponses['reason'] ? userResponses['reason'].join(', ') : 'Não informado'}
        - Desafios: ${userResponses['challenges'] ? userResponses['challenges'].join(', ') : 'Não informado'}
        - Objetivo de prática: ${userResponses['conversation-goal']}
    `;
    document.getElementById('summary-content').innerText = summaryText;
}

// Carrega os vídeos personalizados com base nos desafios
function loadPersonalizedVideos() {
    const videos = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const container = document.getElementById('videos-container');
    container.innerHTML = "";

    const challenges = userResponses['challenges'] || [];

    challenges.forEach(challenge => {
        if (videos[challenge]) {
            const videoElement = document.createElement('video');
            videoElement.src = videos[challenge];
            videoElement.controls = true;
            videoElement.autoplay = true;
            videoElement.classList.add('personalized-video');
            container.appendChild(videoElement);
        }
    });

    nextScreen('personalized-videos-screen');
}

// Finaliza o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
