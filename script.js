let userResponses = {};
let currentStep = 0;
const totalSteps = 9;

// ✅ Navigate to the next screen and update progress
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

// ✅ Validate and save the user's name
function saveName() {
    const nameInput = document.getElementById('user-name').value.trim();
    if (nameInput.length >= 2) {
        userResponses['Nome'] = nameInput;
        nextScreen('age-screen');  // ✅ FIXED: Moves to the age screen
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

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
        "Ouvir e entender": "assets/videos/listening.mp4",
        "Falta de vocabulário": "assets/videos/vocabulary.mp4"
    };

    const selectedChallenges = userResponses['challenges'] || [];
    const selectedVideos = selectedChallenges.map(challenge => videoMap[challenge]);

    if (selectedVideos.length === 0) {
        alert("Nenhum vídeo disponível.");
        nextScreen('summary-screen');
        return;
    }

    let currentVideoIndex = 0;
    const videoElement = document.getElementById('story-video');

    function playVideo(index) {
        if (index >= selectedVideos.length) {
            nextScreen('summary-screen');
            return;
        }
        videoElement.src = selectedVideos[index];
        videoElement.muted = false;
        videoElement.play();
    }

    videoElement.onclick = (event) => {
        const clickX = event.clientX;
        const screenWidth = window.innerWidth;

        if (clickX > screenWidth / 2) {
            currentVideoIndex++;
            playVideo(currentVideoIndex);
        } else if (currentVideoIndex > 0) {
            currentVideoIndex--;
            playVideo(currentVideoIndex);
        }
    };

    videoElement.onended = () => {
        currentVideoIndex++;
        playVideo(currentVideoIndex);
    };

    playVideo(currentVideoIndex);
}

// ✅ Finish onboarding
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}
