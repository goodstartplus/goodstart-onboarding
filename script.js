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

// Nova função para capturar as dificuldades e avançar
function saveChallenges() {
    let selectedChallenges = [];
    document.querySelectorAll('input[name="challenges"]:checked').forEach((checkbox) => {
        selectedChallenges.push(checkbox.value);
    });

    if (selectedChallenges.length > 0) {
        userResponses['challenges'] = selectedChallenges;
        loadPersonalizedStories();  // Avança para os stories personalizados
    } else {
        alert("Por favor, selecione pelo menos uma dificuldade.");
    }
}

// Função para carregar os stories personalizados com base nas respostas
function loadPersonalizedStories() {
    document.getElementById('challenges-screen').classList.add('hidden');
    document.getElementById('stories-screen').classList.remove('hidden');

    let storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = "";  // Limpa o conteúdo anterior

    userResponses['challenges'].forEach(challenge => {
        let storyDiv = document.createElement('div');
        storyDiv.innerText = `Dica personalizada para: ${challenge}`;
        storiesContainer.appendChild(storyDiv);
    });
}

// Função para finalizar o onboarding
function finishOnboarding() {
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
}
