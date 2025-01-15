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

// Função para salvar desafios selecionados e carregar vídeos
function saveChallenges() {
    const selectedChallenges = Array.from(document.querySelectorAll('#challenges-screen input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    userResponses['challenges'] = selectedChallenges;

    loadPersonalizedVideos();
}

// Função para carregar vídeos personalizados com base nas respostas
function loadPersonalizedVideos() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = '';  // Limpa o conteúdo anterior

    userResponses['challenges'].forEach(challenge => {
        let videoFile = '';

        switch (challenge) {
            case 'Falta de prática':
                videoFile = 'practice.mp4';
                break;
            case 'Medo de falar':
                videoFile = 'fear.mp4';
                break;
            case 'Pronúncia':
                videoFile = 'pronunciation.mp4';
                break;
            case 'Vocabulário':
                videoFile = 'vocabulary.mp4';
                break;
        }

        const videoElement = document.createElement('video');
        videoElement.src = `assets/videos/${videoFile}`;
        videoElement.controls = true;
        videoElement.width = 400;
        storiesContainer.appendChild(videoElement);
    });
}

// Função para continuar o onboarding após os vídeos
function continueOnboarding() {
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
}

// Função para finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
