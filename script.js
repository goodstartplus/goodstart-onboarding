// Variável para armazenar respostas do usuário
let userResponses = {};

// Troca de telas
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Salvar nome
function saveName() {
    const name = document.getElementById('user-name').value;
    if (name.trim() !== "") {
        userResponses['Nome'] = name;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira seu nome.");
    }
}

// Salvar respostas simples
function saveAnswer(question, answer) {
    userResponses[question] = answer;
    if (question === 'age') nextScreen('study-method-screen');
    if (question === 'conversation-goal') nextScreen('summary-screen');
}

// Salvar checkboxes
function saveCheckboxes(question) {
    const selected = Array.from(document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`)).map(cb => cb.value);
    userResponses[question] = selected;
    if (question === 'study-method') nextScreen('reason-screen');
    if (question === 'reason') nextScreen('challenges-screen');
}

// Carregar vídeos personalizados
function loadPersonalizedVideos() {
    const challenges = userResponses['challenges'] || [];
    const videos = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const container = document.getElementById('videos-container');
    container.innerHTML = '';
    challenges.forEach(challenge => {
        if (videos[challenge]) {
            const video = document.createElement('video');
            video.src = videos[challenge];
            video.controls = true;
            video.classList.add('personalized-video');
            container.appendChild(video);
        }
    });

    nextScreen('personalized-videos-screen');
}

// Finalizar
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
