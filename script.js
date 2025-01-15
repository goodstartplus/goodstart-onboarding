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
    } else if (question === 'challenges') {
        loadPersonalizedStories();
    }
}

// Função para carregar os stories personalizados com base nas respostas
function loadPersonalizedStories() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

    const selectedChallenges = userResponses['challenges'] || [];
    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = '';

    selectedChallenges.forEach(challenge => {
        let storyFile = '';
        switch (challenge) {
            case 'Falta de prática':
                storyFile = 'stories/practice.html';
                break;
            case 'Medo de falar':
                storyFile = 'stories/fear.html';
                break;
            case 'Pronúncia':
                storyFile = 'stories/pronunciation.html';
                break;
            case 'Vocabulário':
                storyFile = 'stories/vocabulary.html';
                break;
        }
        if (storyFile) {
            const iframe = document.createElement('iframe');
            iframe.src = storyFile;
            iframe.classList.add('story-frame');
            storiesContainer.appendChild(iframe);
        }
    });
}

// Função para selecionar múltiplos desafios
function toggleChallenge(challenge) {
    if (!userResponses['challenges']) {
        userResponses['challenges'] = [];
    }

    const index = userResponses['challenges'].indexOf(challenge);
    if (index > -1) {
        userResponses['challenges'].splice(index, 1);
    } else {
        userResponses['challenges'].push(challenge);
    }
}

// Função para finalizar o onboarding
function finishOnboarding() {
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('final-screen').classList.remove('hidden');
    console.log('Respostas do usuário:', userResponses);
}
