// Variável para armazenar as respostas do usuário
let userResponses = {};

// Função para exibir a próxima tela
function nextScreen(nextScreenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));

    document.getElementById(nextScreenId).classList.remove('hidden');
}

// Iniciar o onboarding com o vídeo de introdução
function startOnboarding() {
    nextScreen('intro-video-screen');
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

// Salvar resposta de idade e avançar
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    if (question === 'age') {
        nextScreen('study-method-screen');
    } else if (question === 'conversation-goal') {
        showSummary();
        nextScreen('summary-screen');
    }
}

// Salvar checkboxes (para estudo e motivo)
function saveCheckboxes(type) {
    const checkboxes = document.querySelectorAll(`#${type}-screen input[type="checkbox"]:checked`);
    const selections = Array.from(checkboxes).map(cb => cb.value);

    userResponses[type] = selections;

    if (type === 'study-method') {
        nextScreen('reason-screen');
    } else if (type === 'reason') {
        nextScreen('trust-screen');
    }
}

// Exibir o resumo personalizado
function showSummary() {
    const summaryText = `
        ${userResponses['Nome']}, vamos construir seu plano com base nas suas respostas:
        - Idade: ${userResponses['age']}
        - Como estudou inglês: ${userResponses['study-method'].join(', ')}
        - Motivo: ${userResponses['reason'].join(', ')}
        - Objetivo de prática: ${userResponses['conversation-goal']}
    `;
    document.getElementById('summary-content').innerText = summaryText;
}

// Finalizar o onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
