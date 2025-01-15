// Variável para armazenar as respostas do usuário
let userResponses = {};

// Função para iniciar o onboarding com o vídeo de introdução
function startOnboarding() {
    document.getElementById('intro-video-screen').classList.remove('hidden');
}

// Continuar após o vídeo de introdução
function continueAfterIntro() {
    document.getElementById('intro-video-screen').classList.add('hidden');
    document.getElementById('name-screen').classList.remove('hidden');
}

// Salvar nome e avançar
function saveName() {
    const name = document.getElementById('user-name').value;
    if (name.trim() !== "") {
        userResponses['Nome'] = name;
        document.getElementById('name-screen').classList.add('hidden');
        document.getElementById('age-screen').classList.remove('hidden');
    } else {
        alert("Por favor, insira seu nome.");
    }
}

// Salvar idade e avançar
function saveAge(age) {
    userResponses['Idade'] = age;
    document.getElementById('age-screen').classList.add('hidden');
    document.getElementById('study-method-screen').classList.remove('hidden');
}

// Salvar métodos de estudo e avançar
function saveStudyMethod() {
    const checkboxes = document.querySelectorAll('#study-method-screen input[type="checkbox"]:checked');
    const methods = Array.from(checkboxes).map(cb => cb.value);
    userResponses['Como estudou inglês'] = methods;
    document.getElementById('study-method-screen').classList.add('hidden');
    document.getElementById('reason-screen').classList.remove('hidden');
}

// Salvar motivos e avançar
function saveReason() {
    const checkboxes = document.querySelectorAll('#reason-screen input[type="checkbox"]:checked');
    const reasons = Array.from(checkboxes).map(cb => cb.value);
    userResponses['Motivo para aprender'] = reasons;
    document.getElementById('reason-screen').classList.add('hidden');
    document.getElementById('features-screen').classList.remove('hidden');
}

// Avançar após mostrar recursos
function continueAfterFeatures() {
    document.getElementById('features-screen').classList.add('hidden');
    document.getElementById('practice-goal-screen').classList.remove('hidden');
}

// Salvar objetivo de prática e avançar
function savePracticeGoal(goal) {
    userResponses['Objetivo de prática'] = goal;
    document.getElementById('practice-goal-screen').classList.add('hidden');
    showSummary();
}

// Mostrar resumo personalizado
function showSummary() {
    const summaryText = `
        ${userResponses['Nome']}, vamos construir seu plano com base nas suas respostas:
        - Idade: ${userResponses['Idade']}
        - Como estudou inglês: ${userResponses['Como estudou inglês'].join(', ')}
        - Motivo: ${userResponses['Motivo para aprender'].join(', ')}
        - Objetivo de prática: ${userResponses['Objetivo de prática']}
    `;
    document.getElementById('summary-text').innerText = summaryText;

    document.getElementById('summary-screen').classList.remove('hidden');
}

// Finalizar e redirecionar
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
