let userResponses = {};
let currentStep = 0;
const totalSteps = 7; // Adjust based on the number of screens

// ✅ Navigate to the next screen and update the progress bar
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    window.scrollTo(0, 0);
    updateProgress();
}

// ✅ Update the progress bar
function updateProgress() {
    currentStep++;
    const progress = (currentStep / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
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

// ✅ Save checkbox answers (multi-choice)
function saveCheckboxes(question) {
    const selectedOptions = document.querySelectorAll(`#${question}-screen .checkbox-option.checked input`);
    const values = Array.from(selectedOptions).map(cb => cb.value);

    if (values.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }

    userResponses[question] = values;

    if (question === 'challenges') {
        loadPersonalizedVideos();
    } else {
        nextScreen('reason-screen');
    }
}

// ✅ Display a personalized summary
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

// ✅ Finalize onboarding and redirect
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}

// ✅ Navigate to the next screen and hide others
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    window.scrollTo(0, 0); // Scroll to the top for better UX
}
