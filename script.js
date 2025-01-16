// ✅ Global Variables
let userResponses = {};
let currentStep = 0;
const totalSteps = 6;

// ✅ Navigation between screens and updating the progress bar
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

// ✅ Update Progress Bar
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    if (currentStep < totalSteps) currentStep++;
}

// ✅ Show "Continuar" button after 5 seconds or when the video ends
document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.querySelector('#intro-video-screen video');
    const continueButton = document.getElementById('continue-intro');

    continueButton.style.display = 'none';

    // Show button after 5 seconds
    setTimeout(() => {
        continueButton.style.display = 'block';
    }, 5000);

    // Show button when the video ends
    if (introVideo) {
        introVideo.onended = () => {
            continueButton.style.display = 'block';
        };
    }

    // Move to the next screen on button click
    continueButton.addEventListener('click', () => {
        nextScreen('name-screen');
    });
});

// ✅ Save the user's name and move to the next screen
function saveName() {
    const nameInput = document.getElementById('user-name').value.trim();
    if (nameInput.length >= 2) {
        userResponses['nome'] = nameInput;
        nextScreen('age-screen');
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

// ✅ Save single-choice answers (e.g., age)
function saveAnswer(question, answer) {
    userResponses[question] = answer;

    const flow = {
        'idade': 'study-method-screen'
    };

    nextScreen(flow[question]);
}

// ✅ Toggle checkbox selection
function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    option.classList.toggle('checked', checkbox.checked);
}

// ✅ Save checkbox responses and move to the next screen
function saveCheckboxes(question) {
    const checkedOptions = document.querySelectorAll(`#${question}-screen input[type="checkbox"]:checked`);
    const values = Array.from(checkedOptions).map(cb => cb.value);

    if (values.length === 0) {
        alert("Por favor, selecione pelo menos uma opção.");
        return;
    }

    userResponses[question] = values;

    const flow = {
        'metodo-estudo': 'reason-screen',
        'motivo': () => {
            loadPersonalizedVideos();
            return 'personalized-videos-screen';
        }
    };

    const next = flow[question];
    nextScreen(typeof next === 'function' ? next() : next);
}

// ✅ Load and play personalized videos based on user selections
function loadPersonalizedVideos() {
    const videoMap = {
        "Férias no exterior": "assets/videos/travel.mp4",
        "Trabalho": "assets/videos/work.mp4",
        "Morar no exterior": "assets/videos/live_abroad.mp4"
    };

    const selectedReasons = userResponses['motivo'] || [];
    const selectedVideos = selectedReasons.map(reason => videoMap[reason]).filter(Boolean);

    if (selectedVideos.length === 0) {
        alert("Nenhum vídeo disponível para as seleções feitas.");
        nextScreen('summary-screen');
        return;
    }

    let currentVideoIndex = 0;
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.style.width = "100%";

    const videosContainer = document.getElementById('videos-container');
    videosContainer.innerHTML = "";
    videosContainer.appendChild(videoElement);

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

// ✅ Show personalized summary based on user input
function showSummary() {
    const { nome, idade, 'metodo-estudo': estudo, motivo } = userResponses;

    const summaryText = `
        ${nome}, aqui está o seu resumo:
        - Idade: ${idade}
        - Método de estudo: ${estudo ? estudo.join(', ') : 'Não informado'}
        - Motivo para aprender inglês: ${motivo ? motivo.join(', ') : 'Não informado'}
    `;

    document.getElementById('summary-content').innerText = summaryText;
    document.getElementById('summary-name').innerText = nome;
}

// ✅ Finish onboarding and redirect to the platform
function finishOnboarding() {
    alert("Parabéns! Você concluiu o onboarding. Redirecionando...");
    window.location.href = "https://goodstart.com.br";
}
