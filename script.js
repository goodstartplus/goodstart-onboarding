let userResponses = {};
let currentStep = 0;
const totalSteps = 7;

function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    const nextScreen = document.getElementById(screenId);
    nextScreen.classList.remove('hidden');
    updateProgress();
    window.scrollTo(0, 0);
}

function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

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

function saveName() {
    const nameInput = document.getElementById('user-name').value.trim();
    if (nameInput.length >= 2) {
        userResponses['nome'] = nameInput;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

function saveAnswer(question, answer) {
    userResponses[question] = answer;
    nextScreen('study-method-screen');
}

function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    option.classList.toggle('checked', checkbox.checked);
}

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

function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4"
    };

    const selectedChallenges = userResponses['challenges'];
    const videosContainer = document.getElementById('videos-container');
    videosContainer.innerHTML = "";

    selectedChallenges.forEach(challenge => {
        const video = document.createElement('video');
        video.src = videoMap[challenge];
        video.controls = true;
        video.autoplay = true;
        videosContainer.appendChild(video);
    });

    setTimeout(() => nextScreen('summary-screen'), 10000);
}

function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding.");
    window.location.href = "https://goodstart.com.br";
}
