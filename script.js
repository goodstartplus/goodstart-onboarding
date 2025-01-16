let userResponses = {};
let currentStep = 0;
const totalSteps = 7;

// ✅ Screen Navigation
function nextScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    updateProgress();
}

function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

// ✅ Load Personalized Videos with Web Stories Style
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
    const videoElement = document.getElementById('story-video');
    
    let currentVideoIndex = 0;

    function playVideo(index) {
        if (index >= selectedVideos.length) {
            nextScreen('summary-screen');
            return;
        }

        videoElement.src = selectedVideos[index];
        videoElement.play();

        videoElement.onclick = (e) => {
            const clickX = e.offsetX;
            clickX > videoElement.clientWidth / 2 ? playVideo(++currentVideoIndex) : playVideo(--currentVideoIndex);
        };

        videoElement.onended = () => playVideo(++currentVideoIndex);
    }

    playVideo(currentVideoIndex);
}
