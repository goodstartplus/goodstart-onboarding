// ✅ Global Variables
let userResponses = {};
let currentStep = 0;
const totalSteps = 5;

// ✅ Navigation between screens and updating the progress bar
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    const nextScreen = document.getElementById(screenId);
    if (nextScreen) {
        nextScreen.classList.remove('hidden');
    }

    updateProgress();
    window.scrollTo(0, 0);
}

// ✅ Update Progress Bar
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    if (currentStep < totalSteps) currentStep++;
}

// ✅ Show "Continuar" button after 5 seconds or video ends
document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.querySelector('#intro-video-screen video');
    const continueButton = document.getElementById('continue-intro');

    continueButton.style.display = 'none';

    setTimeout(() => {
        continueButton.style.display = 'block';
    }, 5000);

    introVideo.onended = () => {
        continueButton.style.display = 'block';
    };

    continueButton.addEventListener('click', () => {
        nextScreen('name-screen');
    });
});

// ✅ Save Name
function saveName() {
    const nameInput = document.getElementById('user-name').value.trim();
    if (nameInput.length >= 2) {
        userResponses['nome'] = nameInput;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

// ✅ Save Single-Choice Answers
function saveAnswer(question, answer) {
    userResponses[question] = answer;
    const flow = {
        'idade': 'study-method-screen'
    };
    nextScreen(flow[question]);
}

// ✅ Toggle Checkbox
function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    option.classList.toggle('checked', checkbox.checked);
}

// ✅ Save Checkbox Responses
function saveCheckboxes(question) {
    const checkedOptions = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const values = Array.from(checkedOptions).map(cb => cb.value);

    if (values.length === 0) {
        alert("Selecione pelo menos uma opção.");
        return;
    }

    userResponses[question] = values;

    if (question === 'motivo') {
        showSummary();
        nextScreen('summary-screen');
    } else {
        nextScreen('reason-screen');
    }
}

// ✅ Show Summary
function showSummary() {
    const { nome, idade, 'metodo-estudo': estudo, motivo } = userResponses;
    const summaryText = `
        ${nome}, aqui está seu resumo:
        - Idade: ${idade}
        - Método de estudo: ${estudo ? estudo.join(', ') : 'Não informado'}
        - Motivo: ${motivo ? motivo.join(', ') : 'Não informado'}
    `;
    document.getElementById('summary-content').innerText = summaryText;
    document.getElementById('summary-name').innerText = nome;
}

// ✅ Finish Onboarding
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding.");
    window.location.href = "https://goodstart.com.br";
}
