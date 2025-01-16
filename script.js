let userResponses = {};
let currentStep = 0;

// ✅ Navigate to the next screen
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// ✅ Show "Continuar" button after video ends
document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.querySelector('#intro-video-screen video');
    const continueButton = document.querySelector('#intro-video-screen button');
    introVideo.onended = () => continueButton.style.display = 'block';
});

// ✅ Save user's name
function saveName() {
    const name = document.getElementById('user-name').value.trim();
    if (name.length >= 2) {
        userResponses['Nome'] = name;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

// ✅ Toggle checkbox selection
function toggleCheckbox(option) {
    option.classList.toggle('checked');
    option.querySelector('input').checked = !option.querySelector('input').checked;
}

// ✅ Save checkbox answers and load videos
function saveCheckboxes(question) {
    const selectedOptions = document.querySelectorAll(`#${question}-screen .checkbox-option.checked input`);
    userResponses[question] = Array.from(selectedOptions).map(cb => cb.value);
    if (question === 'challenges') loadPersonalizedVideos();
}

// ✅ Load personalized videos in stories format
function loadPersonalizedVideos() {
    const videoMap = {
        "Falta de prática": "assets/videos/practice.mp4",
        "Medo de falar": "assets/videos/fear.mp4",
        "Pronúncia": "assets/videos/pronunciation.mp4",
        "Ouvir e entender": "assets/videos/listening.mp4",
        "Falta de vocabulário": "assets/videos/vocabulary.mp4"
    };
    const videos = userResponses['challenges'].map(challenge => videoMap[challenge]);
    let current = 0;

    const videoElement = document.getElementById('story-video');
    videoElement.src = videos[current];
    videoElement.play();

    videoElement.onclick = () => {
        current++;
        if (current < videos.length) videoElement.src = videos[current];
        else nextScreen('summary-screen');
    };
}
