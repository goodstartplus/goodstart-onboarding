let userResponses = {};

// Avança para a próxima tela
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Salva o nome
function saveName() {
    const name = document.getElementById('user-name').value;
    if (name.trim() !== "") {
        userResponses['Nome'] = name;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira seu nome.");
    }
}

// Salva respostas únicas
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    if (question === 'age') {
        nextScreen('study-method-screen');
    } else if (question === 'conversation-goal') {
        nextScreen('summary-screen');
        showSummary();
    }
}

// Função corrigida para salvar checkboxes e avançar
function saveCheckboxes(question) {
    const checkboxes = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const selectedValues = Array.from(checkboxes).map(cb => cb.value);

    if (selectedValues.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }

    userResponses[question] = selectedValues;

    if (question === 'study-method') {
        nextScreen('reason-screen');
    } else if (question === 'reason') {
        nextScreen('challenges-screen');
    } else if (question === 'challenges') {
        loadPersonalizedVideos();
    }
}

// Carrega vídeos personalizados
function loadPersonalizedVideos() {
    const videos = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const container = document.getElementById('videos-container');
    container.innerHTML = "";

    (userResponses['challenges'] || []).forEach(challenge => {
        if (videos[challenge]) {
            const video = document.createElement('video');
            video.src = videos[challenge];
            video.controls = true;
            video.autoplay = false;
            video.classList.add('personalized-video');
            container.appendChild(video);
        }
    });

    nextScreen('personalized-videos-screen');
}

// Mostra o resumo personalizado
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

// Finaliza o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
