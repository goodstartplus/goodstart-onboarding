
let userResponses = {};
let videoIndex = 0;
let selectedVideos = [];
let currentStep = 0;
const totalSteps = 7;

function nextScreen(screenId) {
    if (screenId !== 'personalized-videos-screen') {
        stopVideoPlayback();  // 🛑 Stop video only when leaving video screen
    }
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    updateProgress();
    window.scrollTo(0, 0);
}

function stopVideoPlayback() {
    const video = document.getElementById('story-video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}

function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    currentStep++;
}

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
    option.offsetHeight;
}

function saveCheckboxes(question) {
    const checkedOptions = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    if (checkedOptions.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }
    userResponses[question] = Array.from(checkedOptions).map(cb => cb.value);

    if (question === 'challenges') {
        loadPersonalizedVideos();
        nextScreen('personalized-videos-screen');
    } else {
        const next = question === 'study-method' ? 'challenges-screen' : 'summary-screen';
        nextScreen(next);
    }
}

function loadPersonalizedVideos() {
    const videoMap = {
        'Falta de prática': 'practice1.mp4',
        'Medo de falar': 'fear1.mp4',
        'Pronúncia': 'pronunciation1.mp4',
        'Ouvir e entender': 'listening1.mp4',
        'Vocabulário': 'vocabulary1.mp4'
    };
    selectedVideos = userResponses['challenges'].map(challenge => `assets/videos/${videoMap[challenge]}`);
    renderProgressBar();
    playVideo(videoIndex);
}

function renderProgressBar() {
    const progressContainer = document.getElementById('video-progress-container');
    progressContainer.innerHTML = '';
    selectedVideos.forEach(() => {
        const segment = document.createElement('div');
        segment.className = 'progress-bar-segment';
        progressContainer.appendChild(segment);
    });
}

function playVideo(index) {
    if (index >= selectedVideos.length) {
        nextScreen('summary-screen');
        return;
    }
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = `<video id="story-video" src="${selectedVideos[index]}" autoplay></video>`;
    updateProgressBar(index);
    const video = document.getElementById('story-video');
    video.muted = false;
    video.onended = () => playVideo(++videoIndex);
}

function updateProgressBar(index) {
    const segments = document.querySelectorAll('.progress-bar-segment');
    segments.forEach((seg, i) => {
        seg.classList.toggle('completed', i < index);
    });
}

function handleVideoTap(event) {
    const x = event.clientX || event.touches[0].clientX;
    if (x > window.innerWidth / 2) {
        playVideo(++videoIndex);
    } else if (videoIndex > 0) {
        playVideo(--videoIndex);
    }
}

window.onload = function() {
    const introVideo = document.querySelector('#intro-video-screen video');
    if (introVideo) {
        introVideo.onended = showContinueButton;
        setTimeout(showContinueButton, 5000);
    }
};

function showContinueButton() {
    const continueButton = document.getElementById('continue-intro');
    if (continueButton) {
        continueButton.style.display = 'block';
    }
}

function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}


function saveCheckboxes(question) {
    const checkedOptions = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    if (checkedOptions.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }
    userResponses[question] = Array.from(checkedOptions).map(cb => cb.value);

    if (question === 'study-method') {
        nextScreen('trust-screen');  // 👈 Redirect to new trust screen
    } else if (question === 'challenges') {
        loadPersonalizedVideos();
        nextScreen('personalized-videos-screen');
    }
}



function generateSummary() {
    const name = userResponses['nome'] || 'Vamos construir um plano para você';
    const idade = userResponses['idade'] || 'Não informado';
    const estudo = userResponses['study-method'] ? userResponses['study-method'].join('; ') : 'Não informado';
    const dificuldades = userResponses['challenges'] ? userResponses['challenges'].join('; ') : 'Não informado';

    document.getElementById('summary-heading').innerText = `${name}, Vamos construir um plano para você!`;

    const summaryHTML = `
        <p>👉 <strong>Idade:</strong> ${idade}</p>
        <p>👉 <strong>Estudou:</strong> ${estudo}</p>
        <p>👉 <strong>Maiores dificuldades:</strong> ${dificuldades}</p>
    `;

    document.getElementById('summary-content').innerHTML = summaryHTML;
}

function nextScreen(screenId) {
    if (screenId === 'summary-screen') {
        generateSummary();
    }
    if (screenId !== 'personalized-videos-screen') {
        stopVideoPlayback();
    }
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    updateProgress();
    window.scrollTo(0, 0);
}

let currentSlide = 0;
let totalSlides = 4;

function moveCarousel(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;

    const button = document.getElementById('carousel-button');
    button.innerText = (currentSlide === totalSlides - 1) ? 'Pronto(a) para esta jornada?' : 'Próximo';
    if (currentSlide === totalSlides - 1) {
        button.onclick = () => nextScreen('celebration-video-screen');
    } else {
        button.onclick = nextCarouselSlide;
    }
}

function nextCarouselSlide() {
    if (currentSlide < totalSlides - 1) {
        moveCarousel(currentSlide + 1);
    }
}

let startX = 0;
let endX = 0;

document.querySelector('.carousel').addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.querySelector('.carousel').addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    if (startX - endX > 50) {
        nextCarouselSlide();
    } else if (endX - startX > 50 && currentSlide > 0) {
        moveCarousel(currentSlide - 1);
    }
}



window.onload = function() {
    const introVideo = document.querySelector('#intro-video-screen video');
    const continueButton = document.getElementById('continue-intro');

    continueButton.addEventListener('click', () => {
        introVideo.muted = false;
        introVideo.play();
    });
};




