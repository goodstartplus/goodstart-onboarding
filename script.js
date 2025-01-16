let userResponses = {};
let currentStep = 0;
const totalSteps = 9; // Total steps

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

// ✅ Show "Continuar" button after video ends
document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.querySelector('#intro-video-screen video');
    const continueButton = document.querySelector('#intro-video-screen button');

    if (introVideo) {
        introVideo.onended = () => {
            continueButton.style.display = 'block'; // Show the button after the video finishes
        };
    }
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

// ✅ Toggle checkbox state
function toggleCheckbox(option) {
    option.classList.toggle('checked');
    option.querySelector('input').checked = !option.querySelector('input').checked;
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

// ✅ Load videos in Web Stories style
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const selectedChallenges = userResponses['challenges'] || [];
    const selectedVideos = selectedChallenges.map(challenge => videoMap[challenge]).filter(Boolean);

    if (selectedVideos.length === 0) {
        alert("Nenhum vídeo disponível para as dificuldades selecionadas.");
        nextScreen('summary-screen');
        return;
    }

    let currentVideoIndex = 0;
    const videoElement = document.getElementById('story-video');
    const progressContainer = document.getElementById('video-progress-container');

    // ✅ Create progress bars for each video
    progressContainer.innerHTML = "";
    selectedVideos.forEach(() => {
        const bar = document.createElement('div');
        bar.classList.add('progress-bar');
        const fill = document.createElement('div');
        fill.classList.add('progress-bar-fill');
        bar.appendChild(fill);
        progressContainer.appendChild(bar);
    });

    // ✅ Play video with progress bar animation
    function playVideo(index) {
        if (index >= selectedVideos.length) {
            nextScreen('summary-screen');
            return;
        }

        videoElement.src = selectedVideos[index];
        videoElement.play();

        // Reset progress bars
        const allProgressBars = document.querySelectorAll('.progress-bar-fill');
        allProgressBars.forEach((bar, i) => {
            bar.style.width = i < index ? '100%' : '0%';
        });

        // Animate current progress bar
        const currentBar = allProgressBars[index];
        currentBar.style.transition = `width ${videoElement.duration}s linear`;
        currentBar.style.width = '100%';
    }

    // ✅ Move to the next video after one ends
    videoElement.onended = () => {
        currentVideoIndex++;
        playVideo(currentVideoIndex);
    };

    // ✅ Tap to skip to the next video
    videoElement.onclick = () => {
        videoElement.pause();
        currentVideoIndex++;
        playVideo(currentVideoIndex);
    };

    // ✅ Start the video sequence
    nextScreen('personalized-videos-screen');
    playVideo(currentVideoIndex);
}


// ✅ Finalize onboarding and redirect
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}
