// ✅ Global Variables
let userResponses = {};
let currentStep = 0;
const totalSteps = 9;

// ✅ Navigation Between Screens
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

// ✅ Toggle Checkbox
function toggleCheckbox(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    option.classList.toggle('checked', checkbox.checked);
}

// ✅ Save Checkbox Responses
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

// ✅ Load and Play Personalized Videos (Web Stories)
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

    let currentVideoIndex = 0;
    const videoElement = document.getElementById('story-video');

    function playVideo(index) {
        if (index >= selectedVideos.length) {
            nextScreen('summary-screen');
            return;
        }

        videoElement.src = selectedVideos[index];
        videoElement.load();
        videoElement.play();

        videoElement.onclick = (e) => {
            if (e.offsetX > videoElement.clientWidth / 2) {
                currentVideoIndex++;
            } else {
                currentVideoIndex = Math.max(0, currentVideoIndex - 1);
            }
            playVideo(currentVideoIndex);
        };

        videoElement.onended = () => {
            currentVideoIndex++;
            playVideo(currentVideoIndex);
        };
    }

    playVideo(currentVideoIndex);
}

// ✅ Show Personalized Summary
function showSummary() {
    const { nome, idade, 'study-method': estudo, reason, challenges } = userResponses;

    const summaryText = `
        ${nome}, aqui está o seu resumo:
        - Idade: ${idade}
        - Como estudou inglês: ${estudo.join(', ')}
        - Motivos: ${reason.join(', ')}
        - Desafios: ${challenges.join(', ')}
    `;

    document.getElementById('summary-content').innerText = summaryText;
    document.getElementById('summary-name').innerText = nome;
}

// ✅ Final Step: Redirect to Platform
function finishOnboarding() {
    window.location.href = "https://goodstart.com.br";
}
