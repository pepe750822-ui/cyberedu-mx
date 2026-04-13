// ===== SIMULADOR SIMPLE - ECOEMS 1000 =====

// Variables globales
let currentSubjectKey = '';
let currentSubindex = 0;
let currentQuestion = 0;
let quizQuestions = [];
let userAnswers = [];
let quizScore = 0;
let selectedAnswer = null;
let timerInterval = null;
let timeLeft = 120; // 2 minutos por quiz

// Inicializar
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log("🚀 Inicializando Simulador Simple");

    // Generar preguntas
    if (typeof generateAllQuestions === 'function') {
        generateAllQuestions();
    }

    // Renderizar todas las materias
    renderAllSubjects();
    loadProgress();
    updateGlobalStats();
}

// ===== RENDERIZAR DASHBOARD =====
function renderAllSubjects() {
    const container = document.getElementById('subjects-list');
    container.innerHTML = '';

    for (const subjectKey in subjectsData) {
        const subject = subjectsData[subjectKey];

        // Contenedor de materia
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-section';
        subjectCard.innerHTML = `
            <div class="subject-header" style="border-left: 4px solid ${subject.color}">
                <div class="subject-info">
                    <h3><i class="fas ${subject.icon}"></i> ${subject.name.toUpperCase()}</h3>
                    <p>${subject.desc}</p>
                    <span class="subject-count">${subject.subindices.length} subíndices • ${subject.subindices.length * 10} preguntas</span>
                </div>
            </div>
            <div class="subindices-list" id="subindices-${subjectKey}">
                <!-- Se agregan aquí -->
            </div>
        `;

        container.appendChild(subjectCard);

        // Agregar subíndices
        const subindicesList = document.getElementById(`subindices-${subjectKey}`);
        subject.subindices.forEach((subindexName, idx) => {
            const subindexItem = document.createElement('div');
            subindexItem.className = 'subindex-item';
            subindexItem.dataset.completed = 'false';

            subindexItem.innerHTML = `
                <div class="subindex-info">
                    <i class="far fa-circle status-icon"></i>
                    <div class="subindex-text">
                        <strong>${subindexName}</strong>
                        <span class="subindex-meta">10 preguntas</span>
                    </div>
                </div>
                <button class="cyber-btn compact" onclick="startQuiz('${subjectKey}', ${idx})">
                    <i class="fas fa-play"></i> Iniciar
                </button>
            `;

            subindicesList.appendChild(subindexItem);
        });
    }
}

// ===== INICIAR QUIZ =====
function startQuiz(subjectKey, subindexIdx) {
    console.log(`📝 Iniciando quiz: ${subjectKey}, subíndice ${subindexIdx}`);

    currentSubjectKey = subjectKey;
    currentSubindex = subindexIdx;
    currentQuestion = 0;
    quizScore = 0;
    userAnswers = [];
    selectedAnswer = null;

    const subject = subjectsData[subjectKey];

    // Obtener 10 preguntas del subíndice
    const questionsPerSubindex = 10;
    const startIdx = subindexIdx * questionsPerSubindex;
    const endIdx = startIdx + questionsPerSubindex;
    quizQuestions = subject.quiz.slice(startIdx, endIdx);

    if (quizQuestions.length === 0) {
        alert("⚠️ No hay preguntas disponibles para este subíndice");
        return;
    }

    // Actualizar UI
    document.getElementById('quiz-subject-title').textContent = subject.name.toUpperCase();
    document.getElementById('quiz-subindex-title').textContent = subject.subindices[subindexIdx];

    // Mostrar modal
    document.getElementById('quiz-modal').classList.remove('hidden');
    document.getElementById('dashboard').style.filter = 'blur(5px)';

    // Iniciar timer
    timeLeft = 120;
    startTimer();

    // Mostrar primera pregunta
    showQuestion();
}

// ===== MOSTRAR PREGUNTA =====
function showQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        finishQuiz();
        return;
    }

    const question = quizQuestions[currentQuestion];

    // Actualizar contadores
    document.getElementById('quiz-counter').textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
    document.getElementById('current-q-num').textContent = currentQuestion + 1;
    document.getElementById('quiz-score').textContent = `✓ ${quizScore}/${quizQuestions.length}`;

    // Mostrar pregunta
    document.getElementById('question-text').textContent = question.q;

    // Renderizar opciones
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    question.options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + idx)}</span> ${option}`;
        btn.onclick = () => selectOption(idx, btn);
        container.appendChild(btn);
    });

    // Resetear feedback y botones
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('submit-btn').classList.remove('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    selectedAnswer = null;
}

// ===== SELECCIONAR OPCIÓN =====
function selectOption(idx, btnElement) {
    // Limpiar selecciones previas
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));

    // Marcar selección
    btnElement.classList.add('selected');
    selectedAnswer = idx;
}

// ===== ENVIAR RESPUESTA =====
function submitAnswer() {
    if (selectedAnswer === null) {
        alert("⚠️ Por favor selecciona una respuesta");
        return;
    }

    const question = quizQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    // Guardar respuesta
    userAnswers[currentQuestion] = selectedAnswer;
    if (isCorrect) quizScore++;

    // Mostrar retroalimentación visual
    const options = document.querySelectorAll('.option-btn');
    options[question.correct].classList.add('correct');
    if (!isCorrect) {
        options[selectedAnswer].classList.add('incorrect');
    }

    // Mostrar feedback textual
    const feedbackEl = document.getElementById('feedback');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');

    feedbackEl.classList.remove('hidden', 'correct', 'incorrect');
    feedbackEl.classList.add(isCorrect ? 'correct' : 'incorrect');
    feedbackIcon.textContent = isCorrect ? '✓' : '✗';
    feedbackText.innerHTML = `
        <strong>${isCorrect ? '¡Correcto!' : 'Incorrecto'}</strong><br>
        ${question.rationale || 'Explicación no disponible.'}
    `;

    // Cambiar botones
    document.getElementById('submit-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');

    // Deshabilitar opciones
    options.forEach(btn => btn.disabled = true);

    // Actualizar contador
    document.getElementById('quiz-score').textContent = `✓ ${quizScore}/${quizQuestions.length}`;
}

// ===== SIGUIENTE PREGUNTA =====
function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// ===== FINALIZAR QUIZ =====
function finishQuiz() {
    stopTimer();

    const percentage = Math.round((quizScore / quizQuestions.length) * 100);

    // Confeti si pasó
    if (percentage >= 70) {
        triggerConfetti();
    }

    // Guardar progreso
    saveProgress(currentSubjectKey, currentSubindex, quizScore, quizQuestions.length);

    // Mostrar resultado
    alert(`✅ Quiz Completado!\n\nPuntaje: ${quizScore}/${quizQuestions.length} (${percentage}%)`);

    closeQuiz();
    updateGlobalStats();
}

// ===== CERRAR QUIZ =====
function closeQuiz() {
    document.getElementById('quiz-modal').classList.add('hidden');
    document.getElementById('dashboard').style.filter = 'none';
    stopTimer();

    // Actualizar vista del dashboard
    renderAllSubjects();
    loadProgress();
}

// ===== TIMER =====
function startTimer() {
    stopTimer();
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            stopTimer();
            alert("⏰ Tiempo agotado!");
            finishQuiz();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('quiz-timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ===== PROGRESO =====
function saveProgress(subjectKey, subindexIdx, score, total) {
    const progress = JSON.parse(localStorage.getItem('ecoems_progress') || '{}');

    if (!progress[subjectKey]) progress[subjectKey] = {};

    progress[subjectKey][subindexIdx] = {
        completed: true,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toISOString()
    };

    localStorage.setItem('ecoems_progress', JSON.stringify(progress));
}

function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('ecoems_progress') || '{}');

    for (const subjectKey in progress) {
        for (const subindexIdx in progress[subjectKey]) {
            const data = progress[subjectKey][subindexIdx];

            // Actualizar UI
            const subindicesList = document.getElementById(`subindices-${subjectKey}`);
            if (subindicesList) {
                const items = subindicesList.querySelectorAll('.subindex-item');
                if (items[subindexIdx]) {
                    const item = items[subindexIdx];
                    item.dataset.completed = 'true';
                    item.querySelector('.status-icon').className = 'fas fa-check-circle status-icon completed';
                    item.querySelector('.subindex-meta').textContent = `${data.score}/${data.total} (${data.percentage}%)`;
                }
            }
        }
    }
}

function updateGlobalStats() {
    const progress = JSON.parse(localStorage.getItem('ecoems_progress') || '{}');

    let totalCompleted = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const subjectKey in progress) {
        for (const subindexIdx in progress[subjectKey]) {
            const data = progress[subjectKey][subindexIdx];
            totalCompleted++;
            totalCorrect += data.score;
            totalQuestions += data.total;
        }
    }

    document.getElementById('global-completed').textContent = `${totalCompleted * 10}/1060`;

    if (totalQuestions > 0) {
        const accuracy = Math.round((totalCorrect / totalQuestions) * 100);
        document.getElementById('global-accuracy').textContent = `${accuracy}%`;
    }
}

function resetAllProgress() {
    if (confirm('⚠️ ¿Seguro que quieres reiniciar TODO el progreso?')) {
        localStorage.removeItem('ecoems_progress');
        renderAllSubjects();
        updateGlobalStats();
        alert('✅ Progreso reiniciado');
    }
}

function showOnlyIncomplete() {
    alert('🚧 Función en desarrollo');
}
