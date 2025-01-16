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

// ✅ Update progress bar
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

// ✅ Toggle checkbox selection
function toggleCheckbox(option) {
    option.classList.toggle('checked');
    const checkbox = option.querySelector('input');
    checkbox.checked = !checkbox.checked;
}

// ✅ Save checkbox responses
function saveCheckboxes(question) {
    const selectedOptions = document.querySelectorAll(`#${question}-screen .checkbox-option.checked input`);
    const values = Array.from(selectedOptions).map(cb => cb.value);

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

// ✅ Load personalized videos
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Ouvir e entender": "assets/videos/listening.mp4",
        "Falta de vocabulário": "assets/videos/vocabulary.mp4"
    };

    const selectedChallenges = userResponses['challenges'] || [];
    const selectedVideos = selectedChallenges.map(challenge => videoMap[challenge]);

    let videoElement = document.getElementById('story-video');
    videoElement.src = selectedVideos[0];
    videoElement.play();
}

// ✅ Finish onboarding
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
