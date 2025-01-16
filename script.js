// ✅ Global Variables
let userResponses = {};
let currentStep = 0;
const totalSteps = 9;  // Total number of screens

// ✅ Smooth Screen Navigation
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    const nextScreen = document.getElementById(screenId);
    if (nextScreen) {
        nextScreen.classList.remove('hidden');
        updateProgress();
        window.scrollTo(0, 0);
    } else {
        console.error(`Screen with ID "${screenId}" not found.`);
    }
}

// ✅ Progress Bar Update
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

// ✅ Save the User's Name
function saveName() {
    const nameInput = document.getElementById('user-name').value.trim();
    if (nameInput.length >= 2) {
        userResponses['nome'] = nameInput;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

// ✅ Save Single-Choice Answers (Age Selection)
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    const flow = {
        'idade': 'study-method-screen'
    };

    nextScreen(flow[question]);
}

// ✅ Checkbox Toggle Function
function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    option.classList.toggle('checked', checkbox.checked);
}

// ✅ Save Checkbox Responses and Move to the Next Screen
function saveCheckboxes(question) {
    const checkedOptions = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const values = Array.from(checkedOptions).map(cb => cb.value);

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

// ✅ Web Stories Style: Load and Play Personalized Videos
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Ouvir e entender": "assets/videos/listening.mp4",
        "Vocabulário": "assets/videos/vocabulary.mp4"
    };

    const selectedChallenges = userResponses['challenges'] || [];
    const selectedVideos = selectedChallenges.map(challenge => videoMap[challenge]);

    if (selectedVideos.length === 0) {
        alert("Nenhum vídeo disponível para os desafios selecionados.");
        nextScreen('summary-screen');
        return;
    }

    let currentVideoIndex = 0;
    const videoElement = document.getElementById('story-video');
    const progressContainer = document.getElementById('video-progress-container');

    function playVideo(index) {
        if (index >= selectedVideos.length) {
            nextScreen('summary-screen');
            return;
        }

        videoElement.src = selectedVideos[index];
        videoElement.load();
        videoElement.play().catch(error => {
            console.error("Erro ao carregar o vídeo:", error);
            currentVideoIndex++;
            playVideo(currentVideoIndex);
        });

        updateVideoProgress(index, selectedVideos.length);
    }

    // ✅ Web Stories Behavior: Click to Skip or Go Back
    videoElement.onclick = (e) => {
        const clickX = e.offsetX;
        if (clickX > videoElement.clientWidth / 2) {
            currentVideoIndex++;
        } else {
            currentVideoIndex = Math.max(0, currentVideoIndex - 1);
        }
        playVideo(currentVideoIndex);
    };

    // ✅ Auto-play next video
    videoElement.onended = () => {
        currentVideoIndex++;
        playVideo(currentVideoIndex);
    };

    playVideo(currentVideoIndex);
}

// ✅ Update Video Progress Bar
function updateVideoProgress(currentIndex, totalVideos) {
    const progressContainer = document.getElementById('video-progress-container');
    progressContainer.innerHTML = "";

    for (let i = 0; i < totalVideos; i++) {
        const bar = document.createElement('div');
        bar.classList.add('progress-bar-segment');
        if (i < currentIndex) {
            bar.classList.add('completed');
        }
        progressContainer.appendChild(bar);
    }
}

// ✅ Show Personalized Summary
function showSummary() {
    const { nome, idade, 'study-method': estudo, reason, challenges } = userResponses;

    const summaryText = `
        ${nome}, aqui está o seu resumo:
        - Idade: ${idade}
        - Como estudou inglês: ${estudo ? estudo.join(', ') : 'Não informado'}
        - Motivos: ${reason ? reason.join(', ') : 'Não informado'}
        - Desafios: ${challenges ? challenges.join(', ') : 'Não informado'}
    `;

    document.getElementById('summary-content').innerText = summaryText;
    document.getElementById('summary-name').innerText = nome;
}

// ✅ Finish Onboarding and Redirect
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}
