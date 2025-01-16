let userResponses = {};
let currentStep = 0;
const totalSteps = 9; // Total steps including all screens

let userResponses = {};
let currentStep = 0;
const totalSteps = 9;

// ✅ Navigate to the next screen
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    window.scrollTo(0, 0);
    updateProgress();
}

// ✅ Progress Bar Update
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

// ✅ Show "Continuar" button after video ends
document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.querySelector('#intro-video-screen video');
    const continueButton = document.querySelector('#intro-video-screen button');

    introVideo.onended = () => {
        continueButton.style.display = 'block'; // Show the button after the video finishes
    };
});

// ✅ Validate and save the user's name
function saveName() {
    const nameInput = document.getElementById('user-name').value.trim();
    if (nameInput.length >= 2) {
        userResponses['Nome'] = nameInput;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

// ✅ Save single-choice answers
function saveAnswer(question, answer) {
    userResponses[question] = answer;
    nextScreen('study-method-screen');
}

// ✅ Toggle checkbox state
function toggleCheckbox(option) {
    option.classList.toggle('checked');
    option.querySelector('input').checked = !option.querySelector('input').checked;
}

// ✅ Save checkbox selections
function saveCheckboxes(question) {
    const checked = document.querySelectorAll(`#${question}-screen input:checked`);
    const values = Array.from(checked).map(cb => cb.value);

    if (values.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }

    userResponses[question] = values;

    const flow = {
        'study-method': 'reason-screen',
        'reason': 'challenges-screen',
        'challenges': () => {
            loadPersonalizedVideos();
            return 'personalized-videos-screen';
        }
    };

    const next = flow[question];
    nextScreen(typeof next === 'function' ? next() : next);
}

// ✅ Load personalized videos
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const container = document.getElementById('videos-container');
    container.innerHTML = "";

    (userResponses['challenges'] || []).forEach(challenge => {
        if (videoMap[challenge]) {
            const videoElement = document.createElement('video');
            videoElement.src = videoMap[challenge];
            videoElement.controls = true;
            container.appendChild(videoElement);
        }
    });

    nextScreen('personalized-videos-screen');
}

// ✅ Finish and redirect
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}


// ✅ Navigate to the next screen and update progress bar
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    window.scrollTo(0, 0);
    updateProgress();
}

// ✅ Update the progress bar
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

// ✅ Validate and save the user's name
function saveName() {
    const nameInput = document.getElementById('user-name');
    const name = nameInput.value.trim();

    if (name.length >= 2) {
        userResponses['Nome'] = name;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira um nome válido.");
        nameInput.focus();
    }
}

// ✅ Save single-choice answers (e.g., age)
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    const flow = {
        'age': 'study-method-screen',
        'conversation-goal': () => {
            showSummary();
            return 'summary-screen';
        }
    };

    const next = flow[question];
    nextScreen(typeof next === 'function' ? next() : next);
}

// ✅ Toggle checkbox selection with visual feedback
function toggleCheckbox(option) {
    option.classList.toggle('checked');
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
}

// ✅ Save multiple-choice (checkbox) answers
function saveCheckboxes(question) {
    const selectedOptions = document.querySelectorAll(`#${question}-screen .checkbox-option.checked input`);
    const values = Array.from(selectedOptions).map(cb => cb.value);

    if (values.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }

    userResponses[question] = values;

    // Flow control for checkboxes
    const flow = {
        'study-method': 'reason-screen',
        'reason': 'challenges-screen',
        'challenges': () => {
            loadPersonalizedVideos();
            return 'personalized-videos-screen';
        }
    };

    const next = flow[question];
    nextScreen(typeof next === 'function' ? next() : next);
}

// ✅ Show a personalized summary
function showSummary() {
    const { Nome, age, 'study-method': study, reason, challenges, 'conversation-goal': goal } = userResponses;

    const summaryText = `
        ${Nome}, vamos construir seu plano com base nas suas respostas:
        - Idade: ${age}
        - Como estudou inglês: ${study ? study.join(', ') : 'Não informado'}
        - Motivo: ${reason ? reason.join(', ') : 'Não informado'}
        - Desafios: ${challenges ? challenges.join(', ') : 'Não informado'}
        - Objetivo de prática: ${goal}
    `;

    document.getElementById('summary-content').innerText = summaryText;
    document.getElementById('summary-name').innerText = Nome;
}

// ✅ Load personalized videos based on selected challenges
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const container = document.getElementById('videos-container');
    container.innerHTML = "";

    (userResponses['challenges'] || []).forEach(challenge => {
        if (videoMap[challenge]) {
            const videoElement = document.createElement('video');
            videoElement.src = videoMap[challenge];
            videoElement.controls = true;
            videoElement.classList.add('personalized-video');
            container.appendChild(videoElement);
        }
    });

    nextScreen('personalized-videos-screen');
}

// ✅ Finalize onboarding and redirect to the platform
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}
