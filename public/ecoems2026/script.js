// ===== CONFIGURACIÓN INICIAL =====
let currentSubject = '';
let currentSubindex = 0;
let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;
let selectedAnswer = null;
let quizStarted = false;
let timer = null;
let timeLeft = 120; // 2 minutos por defecto
let userAnswers = []; // Array para guardar índices de respuestas seleccionadas
let quizData = [];    // Array de preguntas actuales
let allQuestions = []; // Todal de preguntas de la materia actual
let questionsPerSubindex = 10;
let isFullSimulation = false; // Flag para modo simulación completa

// ===== INICIALIZACIÓN DEL SIMULADOR =====
document.addEventListener('DOMContentLoaded', initSimulator);

function initSimulator() {
    console.log("🚀 CyberEduMX Simulator Logic Loaded");

    // Verificar si los datos están cargados
    if (typeof subjectsData === 'undefined' || typeof generateAllQuestions === 'undefined') {
        console.error("❌ Error: questions_data.js no se ha cargado correctamente.");
        alert("Error al cargar la base de datos de preguntas. Por favor recarga la p\u00e1gina.");
        return;
    }

    // Generar las preguntas (función que viene de questions_data.js)
    generateAllQuestions();

    // Configurar eventos y UI
    setupEventListeners();
    updateUserCount();
    updateGlobalStats();
    updateAllSubjectCards();

    // Verificar estado de recuperación si venimos de un reload accidental (futura implementación)
}

function setupEventListeners() {
    // Switch de modo aleatorio
    document.getElementById('randomize-mode')?.addEventListener('change', function (e) {
        if (e.target.checked) {
            // Lógica para re-aleatorizar si es necesario
            console.log("Modo aleatorio activado");
        }
    });

    // Prevención de salida accidental
    window.addEventListener('beforeunload', function (e) {
        if (quizStarted) {
            e.preventDefault();
            e.returnValue = 'Tienes un simulador en progreso. ¿Seguro que quieres salir?';
        }
    });
}

// ===== LÓGICA DEL QUIZ =====

function startQuiz(subjectId) {
    try {
        console.log("Mostrando selección de subíndices para:", subjectId);
        playSound('click');
        currentSubject = subjectId;

        // Verificar que existan datos
        if (!subjectsData || !subjectsData[subjectId]) {
            throw new Error("Datos de materia no encontrados para: " + subjectId);
        }

        const subject = subjectsData[subjectId];

        // Mostrar pantalla de selección de subíndices
        showSubindexSelection(subject);
    } catch (e) {
        console.error("Error en startQuiz:", e);
        alert("Ocurrió un error: " + e.message);
    }
}

function showSubindexSelection(subject) {
    // Actualizar título
    document.getElementById('subject-selection-title').textContent = subject.name.toUpperCase();
    document.getElementById('subject-selection-desc').textContent = `Selecciona un subíndice (10 preguntas cada uno)`;

    // Generar tarjetas de subíndices
    const container = document.getElementById('subindices-container');
    container.innerHTML = '';

    subject.subindices.forEach((subindexName, index) => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.cursor = 'pointer';
        card.onclick = () => startSubindexQuiz(currentSubject, index);

        card.innerHTML = `
            <div class="subject-header">
                <i class="fas fa-layer-group"></i>
                <h3>SUBÍNDICE ${index + 1}</h3>
            </div>
            <div class="subject-stats">
                <span class="stat"><i class="fas fa-list-ol"></i> 10 preguntas</span>
            </div>
            <p style="margin: 1rem 0; color: #94a3b8;">${subindexName}</p>
            <button class="cyber-btn" onclick="event.stopPropagation(); startSubindexQuiz('${currentSubject}', ${index})">
                <i class="fas fa-play"></i> INICIAR
            </button>
        `;

        container.appendChild(card);
    });

    // Mostrar sección
    showSection('subindex-section');
}

function startSubindexQuiz(subjectId, subindexIndex) {
    try {
        console.log(`Iniciando quiz: ${subjectId}, subíndice ${subindexIndex}`);
        playSound('click');
        isFullSimulation = false;
        currentSubject = subjectId;
        currentSubindex = subindexIndex;

        // Reiniciar variables de estado
        resetQuizState();

        // Preparar datos
        const subject = subjectsData[subjectId];
        allQuestions = [...subject.quiz];

        // Determinar preguntas para este subíndice
        const numSubindices = subject.subindices.length;
        questionsPerSubindex = Math.ceil(allQuestions.length / numSubindices) || 10;

        // Seleccionar el slice correspondiente al subíndice actual
        const startIndex = subindexIndex * questionsPerSubindex;
        let endIndex = startIndex + questionsPerSubindex;

        // Asegurar no desbordar
        if (endIndex > allQuestions.length) endIndex = allQuestions.length;

        quizData = allQuestions.slice(startIndex, endIndex);
        totalQuestions = quizData.length;

        if (totalQuestions === 0) {
            alert("⚠️ No hay preguntas disponibles para este subíndice.");
            return;
        }

        // Actualizar UI Header
        updateQuizHeader(subject.name, subject.subindices[subindexIndex]);

        // Mostrar sección
        showSection('quiz-section');
        startTimer();
        showQuestion();
    } catch (e) {
        console.error("Error FATAL en startSubindexQuiz:", e);
        alert("Ocurrió un error al iniciar el examen: " + e.message);
    }
}

function backToDashboard() {
    playSound('click');
    showSection('dashboard-section');
}

function startFullSimulation() {
    playSound('click');
    if (!confirm('⚠️ ¿Iniciar SIMULACIÓN COMPLETA?\n\nSe generará un examen de 50 preguntas aleatorias de TODAS las materias.\nTiempo límite: 60 minutos.')) {
        return;
    }

    isFullSimulation = true;
    resetQuizState();
    timeLeft = 3600; // 60 minutos

    // Recopilar preguntas de todas las materias
    let allAllQuestions = [];
    for (const key in subjectsData) {
        if (subjectsData[key].quiz) {
            allAllQuestions = allAllQuestions.concat(subjectsData[key].quiz);
        }
    }

    // Seleccionar 50 al azar
    // Simple shuffle y slice
    allAllQuestions.sort(() => Math.random() - 0.5);
    quizData = allAllQuestions.slice(0, 50);
    totalQuestions = quizData.length;

    // UI Update
    updateQuizHeader("SIMULACIÓN COMPLETA", "Examen General de Conocimientos");

    showSection('quiz-section');
    startTimer();
    showQuestion();
}

function resetQuizState() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    userAnswers = [];
    quizStarted = true;
    timeLeft = isFullSimulation ? 3600 : 120; // Reset por defecto
}

function updateQuizHeader(title, subtitle) {
    document.getElementById('subject-title').textContent = title;
    document.getElementById('subindex-title').textContent = subtitle;
    // Si existe elemento para subtítulo de resultados, actualizarlo también
    const resSubtitle = document.getElementById('results-subtitle');
    if (resSubtitle) resSubtitle.textContent = `${title} - ${subtitle}`;
}

function showQuestion() {
    if (currentQuestion >= totalQuestions) {
        finishQuiz();
        return;
    }

    const question = quizData[currentQuestion];

    // Contadores UI
    document.getElementById('question-counter').textContent = `Pregunta ${currentQuestion + 1}/${totalQuestions}`;
    document.getElementById('current-question').textContent = (currentQuestion + 1).toString().padStart(2, '0');

    // Texto Pregunta
    document.getElementById('question-text').textContent = question.q;

    // Barra de progreso del quiz
    const progressPercent = (currentQuestion / totalQuestions) * 100;
    document.getElementById('quiz-progress-fill').style.width = `${progressPercent}%`;
    document.getElementById('quiz-percentage').textContent = `${Math.round(progressPercent)}%`;

    // Opciones
    renderOptions(question);

    updateQuizButtons();
    hideExplanation();
}

function renderOptions(question) {
    console.log("🎯 renderOptions llamado con:", question);
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];

    question.options.forEach((optionText, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${optionText}</span>`;
        btn.dataset.index = index;
        btn.dataset.letter = letters[index];

        // Estado previo (si ya contestó y regresó)
        if (userAnswers[currentQuestion] !== undefined) {
            const answeredIndex = userAnswers[currentQuestion];

            if (index === answeredIndex) {
                btn.classList.add('selected');
                // Si ya se calificó (simulado inmediato), mostrar colores
                // En este diseño, se califica al dar "Enviar respuesta"
                // Podemos deducir si ya fue enviada si existe en userAnswers?
                // Asumiremos que si está en userAnswers, ya fue "enviada" para efectos visuales si queremos feedback inmediato
                // O si permitimos cambiar... Implementación actual: bloquear cambio tras enviar.
            }

            // Mostrar feedback si ya respondió
            if (index === question.correct) btn.classList.add('correct');
            if (index === answeredIndex && index !== question.correct) btn.classList.add('incorrect');
        }

        btn.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(btn);
    });
    console.log("✅ Opciones renderizadas exitosamente");
}

function selectAnswer(index) {
    // Si ya confirmó respuesta, no dejar cambiar
    if (document.getElementById('submit-btn').disabled && userAnswers[currentQuestion] !== undefined) return;

    playSound('click');
    selectedAnswer = index;

    // UI Update visual selection
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    const selectedBtn = document.querySelector(`.option-btn[data-index="${index}"]`);
    if (selectedBtn) selectedBtn.classList.add('selected');

    document.getElementById('submit-btn').disabled = false;
}

function submitAnswer() {
    if (selectedAnswer === null) return;

    // Guardar respuesta
    userAnswers[currentQuestion] = selectedAnswer;

    const question = quizData[currentQuestion];
    const isCorrect = (selectedAnswer === question.correct);

    if (isCorrect) {
        score++;
        playSound('correct');
        showXP();
    } else {
        playSound('wrong');
    }

    // Revelar colores
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => {
        const idx = parseInt(btn.dataset.index);
        if (idx === question.correct) btn.classList.add('correct');
        else if (idx === selectedAnswer) btn.classList.add('incorrect');
    });

    // Mostrar explicación
    showExplanation(question.rationale);

    document.getElementById('submit-btn').disabled = true;
    updateQuizButtons();
}

function showXP() {
    const xp = document.createElement('div');
    xp.className = 'xp-popup';
    xp.textContent = '+10 XP';

    // Posicionar cerca del botón seleccionado o centro
    const selectedBtn = document.querySelector('.option-btn.selected');
    if (selectedBtn) {
        const rect = selectedBtn.getBoundingClientRect();
        xp.style.left = `${rect.left + rect.width / 2 - 30}px`;
        xp.style.top = `${rect.top}px`;
    } else {
        xp.style.left = '50%';
        xp.style.top = '50%';
    }

    document.body.appendChild(xp);

    setTimeout(() => {
        xp.remove();
    }, 1000);
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        selectedAnswer = userAnswers[currentQuestion]; // Restaurar selección
        showQuestion();
    }
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        selectedAnswer = userAnswers[currentQuestion] !== undefined ? userAnswers[currentQuestion] : null;
        showQuestion();
    }
}

// ===== FINALIZAR Y RESULTADOS =====

function finishQuiz() {
    stopTimer();
    quizStarted = false;
    playSound('complete');

    // Calcular stats
    const percentage = Math.round((score / totalQuestions) * 100);
    const timeSpent = (isFullSimulation ? 3600 : 120) - timeLeft;

    // Renderizar Resultados UI
    const scoreCircle = document.querySelector('.score-progress');
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (percentage / 100) * circumference;

    scoreCircle.style.strokeDashoffset = offset;
    document.getElementById('final-score').textContent = percentage;

    document.getElementById('correct-answers').textContent = score;
    document.getElementById('incorrect-answers').textContent = totalQuestions - score;
    document.getElementById('total-time').textContent = formatTime(timeSpent);

    // Confetti si aprobó (>80%)
    if (percentage >= 80) {
        if (typeof confetti !== 'undefined' && confetti.start) {
            confetti.start(3000); // 3 segundos de lluvia
        }
    }

    // Guardar progreso
    if (!isFullSimulation) {
        saveProgress(currentSubject, currentSubindex, percentage, score, timeSpent);
    }

    showSection('results-section');
}

function reviewQuestions() {
    // Implementación de la vista de revisión "Super Perrona"
    // Generar un modal o una sección dinámica

    // Por simplicidad, usaremos el mismo contenedor del quiz pero en "modo revisión"
    // O mejor, creamos una lista scrolleable en la sección de resultados (o un overlay)

    // Vamos a crear dinámicamente un overlay
    let reviewOverlay = document.getElementById('review-overlay');
    if (!reviewOverlay) {
        reviewOverlay = document.createElement('div');
        reviewOverlay.id = 'review-overlay';
        reviewOverlay.className = 'cyber-overlay';
        document.body.appendChild(reviewOverlay);
    }

    let html = `
        <div class="review-modal">
            <div class="review-header">
                <h2>🔍 REVISIÓN DE RESPUESTAS</h2>
                <button onclick="closeReview()" class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="review-content">
    `;

    quizData.forEach((q, idx) => {
        const userAnswer = userAnswers[idx];
        const isCorrect = userAnswer === q.correct;
        const statusClass = isCorrect ? 'correct-block' : 'incorrect-block';
        const icon = isCorrect ? 'fa-check-circle' : 'fa-times-circle';

        html += `
            <div class="review-item ${statusClass}">
                <div class="review-item-header">
                    <span class="q-num">#${idx + 1}</span>
                    <span class="q-status"><i class="fas ${icon}"></i> ${isCorrect ? 'CORRECTA' : 'INCORRECTA'}</span>
                </div>
                <p class="q-text">${q.q}</p>
                <div class="q-answer-review">
                    <div class="user-sel">Tu respuesta: <strong>${q.options[userAnswer] || 'Sin responder'}</strong></div>
                    <div class="correct-sel">Correcta: <strong>${q.options[q.correct]}</strong></div>
                </div>
                <div class="q-rationale">
                    <i class="fas fa-info-circle"></i> ${q.rationale}
                </div>
            </div>
        `;
    });

    html += `</div></div>`;
    reviewOverlay.innerHTML = html;
    reviewOverlay.style.display = 'flex';
}

function closeReview() {
    const overlay = document.getElementById('review-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ===== FUNCIONES AUXILIARES UI Y LOGIC =====

function showSection(id) {
    document.querySelectorAll('section').forEach(s => {
        s.classList.remove('active-section');
        s.classList.add('hidden-section');
    });
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden-section');
        target.classList.add('active-section');
    }
}

function startTimer() {
    clearInterval(timer);
    const timerDisplay = document.getElementById('quiz-timer');

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 30) timerDisplay.style.color = '#ff0000';
        else timerDisplay.style.color = 'var(--cyber-light)'; // Restaurar color

        if (timeLeft <= 0) {
            finishQuiz();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function playSound(type) {
    // Si la función de sonido está activada en UI
    const sound = document.getElementById(`${type}-sound`);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play prevented"));
    }
}

function updateUserCount() {
    const el = document.getElementById('active-users');
    if (el) {
        // Simulación simple de cambio
        let count = parseInt(el.textContent.replace(/,/g, '')) || 2548;
        count += Math.floor(Math.random() * 5) - 2;
        el.textContent = count.toLocaleString();
        setTimeout(updateUserCount, 15000);
    }
}

function showExplanation(text) {
    const panel = document.getElementById('explanation-panel');
    const content = document.getElementById('explanation-content');
    if (panel && content) {
        content.textContent = text;
        panel.style.display = 'block';
    }
}

function hideExplanation() {
    const panel = document.getElementById('explanation-panel');
    if (panel) panel.style.display = 'none';
}

function updateQuizButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    if (prevBtn) prevBtn.disabled = (currentQuestion === 0);
    if (nextBtn) nextBtn.disabled = (currentQuestion === totalQuestions - 1);
    // submitBtn se maneja en selectAnswer/submitAnswer
}

// ===== PERSISTENCIA Y DASHBOARD =====

function saveProgress(subjectId, subindexIdx, percentage, scoreRaw, time) {
    const storeKey = 'cyberedu_progress_v2';
    let data = JSON.parse(localStorage.getItem(storeKey)) || {};

    if (!data[subjectId]) data[subjectId] = { completedSubindices: [], totalScore: 0, attempts: 0 };

    if (!data[subjectId].completedSubindices.includes(subindexIdx)) {
        data[subjectId].completedSubindices.push(subindexIdx);
    }

    data[subjectId].lastPercentage = percentage;
    data[subjectId].attempts++;

    localStorage.setItem(storeKey, JSON.stringify(data));
    updateGlobalStats();
    updateAllSubjectCards();
}

function updateGlobalStats() {
    // Calcular progreso global real basado en subíndices completados
    const storeKey = 'cyberedu_progress_v2';
    const data = JSON.parse(localStorage.getItem(storeKey)) || {};

    let totalSubindices = 0;
    let completedSubindices = 0;

    for (const key in subjectsData) {
        totalSubindices += subjectsData[key].subindices.length;
        if (data[key]) {
            completedSubindices += data[key].completedSubindices.length;
        }
    }

    const globalPercent = totalSubindices > 0 ? Math.round((completedSubindices / totalSubindices) * 100) : 0;
    const bar = document.querySelector('.progress-fill');
    const label = document.getElementById('global-progress');

    if (bar) bar.style.width = `${globalPercent}%`;
    if (label) label.textContent = `${globalPercent}%`;
}


function updateAllSubjectCards() {
    const storeKey = 'cyberedu_progress_v2';
    const data = JSON.parse(localStorage.getItem(storeKey)) || {};

    for (const key in subjectsData) {
        const card = document.querySelector(`.subject-card[data-subject="${key}"]`);
        if (card) {
            const subjectData = subjectsData[key];
            const saved = data[key];

            const total = subjectData.subindices.length;
            const completed = saved ? saved.completedSubindices.length : 0;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            const miniFill = card.querySelector('.mini-fill');
            const progressText = card.querySelector('.progress-text');

            if (miniFill) miniFill.style.width = `${pct}%`;
            if (progressText) progressText.textContent = `${pct}% completado`;
        }
    }
}

// Funciones de navegación (Back, Retry, etc)
function goBack() {
    if (quizStarted && !confirm("¿Abandonar simulador? Se perderá el progreso.")) return;
    stopTimer();
    quizStarted = false;
    showSection('dashboard-section');
}

function retrySubindex() {
    if (!isFullSimulation) {
        startQuiz(currentSubject);
    } else {
        startFullSimulation();
    }
}

function continueToNext() {
    // Lógica para ir al siguiente subíndice
    if (isFullSimulation) {
        goBack(); // En full sim no hay "siguiente"
        return;
    }

    const subject = subjectsData[currentSubject];
    if (currentSubindex < subject.subindices.length - 1) {
        currentSubindex++;
        startQuiz(currentSubject);
    } else {
        alert("¡Has completado todos los subíndices de esta materia!");
        goBack();
    }
}

function viewProgress() {
    alert("Función de progreso detallado próximamente (Ya puedes ver el progreso en las tarjetas)");
}

function resetProgress() {
    if (confirm("¿Borrar todo el progreso?")) {
        localStorage.removeItem('cyberedu_progress_v2');
        updateGlobalStats();
        updateAllSubjectCards();
    }
}

// Exponer globalmente lo necesario
window.startQuiz = startQuiz;
window.startFullSimulation = startFullSimulation;
window.goBack = goBack;
window.submitAnswer = submitAnswer;
window.prevQuestion = prevQuestion;
window.nextQuestion = nextQuestion;
window.showHint = () => alert("Pista: Lee con atención la pregunta y descarta las opciones ilógicas.");
window.retrySubindex = retrySubindex;
window.continueToNext = continueToNext;
window.reviewQuestions = reviewQuestions;
window.viewProgress = viewProgress;
window.resetProgress = resetProgress;
window.closeReview = closeReview;