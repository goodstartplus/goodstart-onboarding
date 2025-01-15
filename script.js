let userResponses = {};

// Avança para a próxima tela
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Salva o nome
function saveName() {
    const name = document.getElementById('user-name').value;
    userResponses['Nome'] = name;
    nextScreen('age-screen');
}

// Salva respostas únicas
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    if (question === 'age') {
        nextScreen('study-method-screen');
    } else if (question === 'conversation-goal') {
        nextScreen('summary-screen');
    }
}

// Salva respostas múltiplas (checkboxes)
function saveCheckboxes(question) {
    const checkboxes = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const values = Array.from(checkboxes).map(cb => cb.value);
    userResponses[question] = values;

    if (question === 'challenges') {
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

    userResponses['challenges'].forEach(challenge => {
        const video = document.createElement('video');
        video.src = videos[challenge];
        video.controls = true;
        container.appendChild(video);
    });

    nextScreen('personalized-videos-screen');
}

// Finaliza o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
