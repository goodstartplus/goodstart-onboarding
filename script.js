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

// Função para capturar as dificuldades selecionadas e avançar
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

    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = "";  // Limpa o conteúdo anterior

    // Exemplo de carregamento de stories personalizados
    userResponses['challenges'].forEach(challenge => {
        let storyDiv = document.createElement('div');
        storyDiv.classList.add('story-item');
        storyDiv.innerText = `Dica personalizada para: ${challenge}`;
        storiesContainer.appendChild(storyDiv);
    });
}

// Função para continuar o onboarding após os stories
function continueOnboarding() {
    document.getElementById('stories-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
}

// Função para finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br"; // Redireciona para a plataforma
}
