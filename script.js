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

    // Exemplo de carregamento de stories
    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = `<p>Carregando stories personalizados para: ${userResponses['challenges']}</p>`;
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
