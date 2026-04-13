/**
 * SIMULADOR ECOEMS 1000 - v2.0 "Super Perrona"
 * Author: Antigravity
 */

// --- Global State ---
let currentSubject = null;
let currentSubindexIdx = -1;
let currentQuiz = [];
let currentQuestionIdx = 0;
let userScore = 0;
let selectedOptionIdx = null;
let progressData = {};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Initializing Super Perrona Simulator v2");
    loadProgress();
    renderSubjects();
    updateGlobalStats();
});

// --- Progress Management ---
function loadProgress() {
    const saved = localStorage.getItem('ecoems_v2_progress');
    progressData = saved ? JSON.parse(saved) : {};
}

function saveProgress(subjectKey, subindexIdx, score, total) {
    if (!progressData[subjectKey]) progressData[subjectKey] = {};

    // Only save if it's better than previous or doesn't exist
    const prev = progressData[subjectKey][subindexIdx];
    const newPercentage = Math.round((score / total) * 100);

    if (!prev || newPercentage > prev.percentage) {
        progressData[subjectKey][subindexIdx] = {
            score,
            total,
            percentage: newPercentage,
            completed: true,
            timestamp: Date.now()
        };
        localStorage.setItem('ecoems_v2_progress', JSON.stringify(progressData));
    }
}

function updateGlobalStats() {
    let totalCompleted = 0;
    let totalCorrect = 0;
    let totalTaken = 0;

    for (const subKey in progressData) {
        for (const idx in progressData[subKey]) {
            const data = progressData[subKey][idx];
            totalCompleted++;
            totalCorrect += data.score;
            totalTaken += data.total;
        }
    }

    const progressEl = document.getElementById('global-progress');
    const accuracyEl = document.getElementById('global-accuracy');

    if (progressEl) progressEl.textContent = `${totalCompleted * 10}/1060`;
    if (accuracyEl) {
        const accuracy = totalTaken > 0 ? Math.round((totalCorrect / totalTaken) * 100) : 0;
        accuracyEl.textContent = `${accuracy}%`;
    }
}

// --- Dashboard Rendering ---
function renderSubjects() {
    const grid = document.getElementById('subjects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const key in subjectsData) {
        const subject = subjectsData[key];
        const card = document.createElement('div');
        card.className = 'subject-card animate-fade';
        card.style.setProperty('--subject-color', subject.color);

        // Calculate subject completion
        const completedCount = progressData[key] ? Object.keys(progressData[key]).length : 0;
        const totalSubindices = subject.subindices.length;
        const progressPercent = (completedCount / totalSubindices) * 100;

        card.innerHTML = `
            <div class="subject-icon"><i class="fas ${subject.icon}"></i></div>
            <h3>${subject.name}</h3>
            <p>${subject.desc}</p>
            <div class="subject-meta">
                <span>${totalSubindices} TEMAS</span>
                <span>${completedCount}/${totalSubindices} LISTO</span>
            </div>
            <div class="subject-progress">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
        `;

        card.onclick = () => openSubindices(key);
        grid.appendChild(card);
    }
}

// --- Navigation / Modal Control ---
function openSubindices(subjectKey) {
    currentSubject = subjectKey;
    const subject = subjectsData[subjectKey];
    const modalView = document.getElementById('modal-view');

    const subindicesHtml = subject.subindices.map((name, idx) => {
        const isDone = progressData[subjectKey] && progressData[subjectKey][idx];
        const scoreInfo = isDone ? `<span class="text-muted" style="margin-right: 1rem;">${progressData[subjectKey][idx].score}/10</span>` : '';

        return `
            <div class="subindex-row">
                <div class="subindex-label">
                    <div class="subindex-check ${isDone ? 'completed' : ''}">
                        <i class="fas ${isDone ? 'fa-check' : 'fa-play'}" style="font-size: 0.8rem;"></i>
                    </div>
                    <strong>${name}</strong>
                </div>
                <div style="display: flex; align-items: center;">
                    ${scoreInfo}
                    <button class="btn-secondary" onclick="startQuiz('${subjectKey}', ${idx})">
                        ${isDone ? 'REPETIR' : 'COMENZAR'}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    modalView.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h2 class="gradient-text">${subject.name}</h2>
            <p class="text-muted">Elige un subíndice para practicar (10 preguntas).</p>
        </div>
        <div class="subindices-list">
            ${subindicesHtml}
        </div>
    `;

    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    // Refresh dashboard stats when closing
    renderSubjects();
    updateGlobalStats();
}

// --- Quiz Logic ---
function startQuiz(subjectKey, subindexIdx) {
    console.log(`Starting Quiz: ${subjectKey} - Subindex ${subindexIdx}`);
    currentSubject = subjectKey;
    currentSubindexIdx = subindexIdx;
    currentQuestionIdx = 0;
    userScore = 0;

    const subject = subjectsData[subjectKey];
    // Get questions for this subindex (10 questions per subindex)
    const start = subindexIdx * 10;
    currentQuiz = subject.quiz.slice(start, start + 10);

    if (currentQuiz.length === 0) {
        alert("Ops! No hay preguntas para este tema aún.");
        return;
    }

    renderQuestion();
}

function renderQuestion() {
    const question = currentQuiz[currentQuestionIdx];
    const modalView = document.getElementById('modal-view');
    selectedOptionIdx = null;

    modalView.innerHTML = `
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span class="text-muted" style="text-transform: uppercase; font-size: 0.8rem; font-weight: 800;">
                    ${subjectsData[currentSubject].name} • Tema ${currentSubindexIdx + 1}
                </span>
                <h2 style="font-size: 1.2rem; margin-top: 0.2rem;">${subjectsData[currentSubject].subindices[currentSubindexIdx]}</h2>
            </div>
            <div style="text-align: right;">
                <span class="gradient-text" style="font-size: 1.5rem; font-weight: 800;">${currentQuestionIdx + 1}/10</span>
            </div>
        </div>

        <div class="quiz-body">
            <div class="question-card animate-fade">
                <p class="question-text">${question.q}</p>
            </div>

            <div class="options-grid">
                ${question.options.map((opt, i) => `
                    <button class="option-btn animate-fade" style="animation-delay: ${i * 0.1}s" onclick="handleOptionClick(${i}, this)">
                        <span class="option-letter-v2">${String.fromCharCode(65 + i)}</span>
                        <span class="option-text-v2">${opt}</span>
                    </button>
                `).join('')}
            </div>

            <div id="feedback-area" class="hidden" style="margin-top: 1.5rem;">
                <!-- Result injected here -->
            </div>
        </div>
    `;
}

function handleOptionClick(idx, btn) {
    if (selectedOptionIdx !== null) return; // Prevent double clicking

    selectedOptionIdx = idx;
    const question = currentQuiz[currentQuestionIdx];
    const isCorrect = idx === question.correct;

    if (isCorrect) userScore++;

    // Visual feedback on buttons
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((b, i) => {
        b.disabled = true;
        if (i === question.correct) {
            b.classList.add('correct');
        } else if (i === idx) {
            b.classList.add('incorrect');
        } else {
            b.style.opacity = '0.5';
        }
    });

    // Show Feedback with a smooth entrance
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.classList.remove('hidden');
    feedbackArea.className = 'animate-fade';

    feedbackArea.innerHTML = `
        <div class="feedback-card-v2" style="border-left: 5px solid ${isCorrect ? 'var(--cyber-accent)' : 'var(--cyber-danger)'}">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                <div class="feedback-icon-v2 ${isCorrect ? 'correct' : 'incorrect'}">
                    <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                </div>
                <h4 style="color: ${isCorrect ? 'var(--cyber-accent)' : 'var(--cyber-danger)'}; font-size: 1.1rem; letter-spacing: 1px;">
                    ${isCorrect ? '¡CORRECTO!' : 'INCORRECTO'}
                </h4>
            </div>
            <p class="rationale-text-v2">${question.rationale}</p>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
                <button class="btn-primary v2-next" onclick="nextQuestion()">
                    ${currentQuestionIdx === 9 ? 'VER RESULTADOS' : 'SIGUIENTE PREGUNTA'} 
                    <i class="fas fa-chevron-right" style="margin-left: 0.5rem;"></i>
                </button>
            </div>
        </div>
    `;
}

function nextQuestion() {
    currentQuestionIdx++;
    if (currentQuestionIdx < 10) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const percentage = (userScore / 10) * 100;
    const modalView = document.getElementById('modal-view');

    // Save progress
    saveProgress(currentSubject, currentSubindexIdx, userScore, 10);

    if (percentage >= 70) {
        if (typeof triggerConfetti === 'function') triggerConfetti();
    }

    modalView.innerHTML = `
        <div style="text-align: center; padding: 2rem;" class="animate-fade">
            <i class="fas ${percentage >= 70 ? 'fa-trophy' : 'fa-graduation-cap'}" style="font-size: 5rem; color: var(--cyber-warning); margin-bottom: 2rem;"></i>
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">RESULTADOS</h2>
            <div style="font-size: 1.5rem; margin-bottom: 2rem;">
                <span class="gradient-text" style="font-size: 4rem; font-weight: 800;">${userScore}/10</span>
                <p class="text-muted">${percentage}% de efectividad</p>
            </div>
            
            <p style="max-width: 500px; margin: 0 auto 2.5rem auto; line-height: 1.8;">
                ${percentage >= 70
            ? '¡Nivel leyenda! Has dominado este tema. Sigue así para asegurar tu lugar en los mejores puestos.'
            : 'Buen esfuerzo, pero necesitas reforzar este tema. ¡Vuelve a intentarlo para mejorar tu puntuación!'}
            </p>

            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-secondary" onclick="openSubindices('${currentSubject}')">VOLVER A TEMAS</button>
                <button class="btn-primary" onclick="closeModal()">CERRAR</button>
            </div>
        </div>
    `;
}
