// ✅ Global Variables
let userResponses = {};
let currentStep = 0;
const totalSteps = 9;

// ✅ Navigate to the next screen and update progress bar
function nextScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Show the desired screen
    const nextScreen = document.getElementById(screenId);
    if (nextScreen) {
        nextScreen.classList.remove('hidden');
    } else {
        console.error(`Screen with ID "${screenId}" not found.`);
    }

    window.scrollTo(0, 0);
    updateProgress();
}


// ✅ Update the progress bar
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

// ✅ Show "Continuar" button after intro video ends
document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.querySelector('#intro-video-screen video');
    const continueButton = document.querySelector('#intro-video-screen button');

    if (introVideo) {
        introVideo.onended = () => {
            continueButton.style.display = 'block';
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

// ✅ Toggle checkbox state with visual feedback
function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');

    // ✅ Toggle the checkbox and apply smooth visual feedback
    if (checkbox.checked) {
        checkbox.checked = false;
        option.classList.remove('checked');
    } else {
        checkbox.checked = true;
        option.classList.add('checked');
    }
}



function saveCheckboxes(question) {
    // ✅ Select all checked checkboxes in the current screen
    const checkedOptions = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    
    // ✅ Map selected values
    const values = Array.from(checkedOptions).map(cb => cb.value);

    if (values.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }

    // ✅ Save user responses
    userResponses[question] = values;

    // ✅ Screen flow logic
    const flow = {
        'study-method': 'reason-screen',
        'reason': 'challenges-screen',
        'challenges': () => {
            loadPersonalizedVideos();
            return 'personalized-videos-screen';
        }
    };

    const next = flow[question];

    // ✅ Move to the next screen
    if (typeof next === 'function') {
        nextScreen(next());
    } else if (next) {
        nextScreen(next);
    } else {
        console.error(`No flow defined for question: ${question}`);
    }
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

// ✅ Load personalized videos in Web Stories style
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Ouvir e entender": "assets/videos/listening.mp4",
        "Falta de vocabulário": "assets/videos/vocabulary.mp4"
    };

    const selectedChallenges = userResponses['reason'] || [];  // ✅ Corrected from 'challenges' to 'reason'
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

    // ✅ Play videos with progress bar animation
    function playVideo(index) {
        if (index >= selectedVideos.length) {
            stopVideo();
            nextScreen('summary-screen');
            return;
        }

        videoElement.src = selectedVideos[index];
        videoElement.muted = false;
        videoElement.currentTime = 0;
        videoElement.play();

        const allProgressBars = document.querySelectorAll('.progress-bar-fill');
        allProgressBars.forEach((bar, i) => {
            bar.style.width = i < index ? '100%' : '0%';
        });

        const currentBar = allProgressBars[index];
        currentBar.style.transition = `width ${videoElement.duration}s linear`;
        currentBar.style.width = '100%';
    }

    videoElement.onended = () => {
        currentVideoIndex++;
        playVideo(currentVideoIndex);
    };

    videoElement.onclick = (event) => {
        const clickX = event.clientX;
        const screenWidth = window.innerWidth;

        if (clickX > screenWidth / 2) {
            currentVideoIndex++;
            playVideo(currentVideoIndex);
        } else {
            currentVideoIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : 0;
            playVideo(currentVideoIndex);
        }
    };

    function stopVideo() {
        videoElement.pause();
        videoElement.currentTime = 0;
        videoElement.src = "";
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopVideo();
        }
    });

    nextScreen('personalized-videos-screen');
    playVideo(currentVideoIndex);
}


// ✅ Finalize onboarding and redirect
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}
