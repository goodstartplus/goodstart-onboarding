let userResponses = {};
let currentStep = 0;
const totalSteps = 7;

// ✅ Screen Navigation
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    const nextScreen = document.getElementById(screenId);
    if (nextScreen) {
        nextScreen.classList.remove('hidden');
    } else {
        console.error(`Screen with ID "${screenId}" not found.`);
    }
    updateProgress();
    window.scrollTo(0, 0);
}

// ✅ Progress Bar Update
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

// ✅ Intro Video Logic
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
    nextScreen('study-method-screen');
}

// ✅ Toggle Checkbox
function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    option.classList.toggle('checked', checkbox.checked);
}

// ✅ Save Checkbox Selections
function saveCheckboxes(question) {
    const checkedOptions = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const values = Array.from(checkedOptions).map(cb => cb.value);

    if (values.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }

    userResponses[question] = values;

    const flow = {
        'study-method': 'challenges-screen',
        'challenges': () => {
            loadPersonalizedVideos();
            return 'personalized-videos-screen';
        }
    };

    const next = flow[question];
    nextScreen(typeof next === 'function' ? next() : next);
}

// ✅ Load and Play All 5 Personalized Videos
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Ouvir e entender": "assets/videos/listening.mp4",
        "Falta de vocabulário": "assets/videos/vocabulary.mp4"
    };

    const selectedChallenges = userResponses['challenges'] || [];
    const selectedVideos = selectedChallenges.map(challenge => videoMap[challenge]).filter(Boolean);

    if (selectedVideos.length === 0) {
        alert("Nenhum vídeo disponível para as dificuldades selecionadas.");
        nextScreen('summary-screen');
        return;
    }

    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.style.width = "100%";
    videoElement.style.height = "auto";
    videoElement.style.objectFit = "cover";

    const videosContainer = document.getElementById('videos-container');
    videosContainer.innerHTML = "";
    videosContainer.appendChild(videoElement);

    let currentVideoIndex = 0;

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
    }

    videoElement.onended = () => {
        currentVideoIndex++;
        playVideo(currentVideoIndex);
    };

    playVideo(currentVideoIndex);
}

// ✅ Personalized Summary
function showSummary() {
    const { nome, idade, 'study-method': estudo, challenges } = userResponses;

    const summaryText = `
        ${nome}, aqui está o seu resumo:
        - Idade: ${idade}
        - Método de estudo: ${estudo ? estudo.join(', ') : 'Não informado'}
        - Dificuldades: ${challenges ? challenges.join(', ') : 'Não informado'}
    `;

    document.getElementById('summary-content').innerText = summaryText;
    document.getElementById('summary-name').innerText = nome;
}

// ✅ Final Step: Redirect
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}
