class QuizEngine {
    constructor() {
        this.subjectId = new URLSearchParams(window.location.search).get('subject');
        this.subject = subjectsData[this.subjectId];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isAnswered = false;

        if (!this.subject) {
            alert('Materia no encontrada');
            window.location.href = 'dashboard.html';
            return;
        }

        this.init();
    }

    init() {
        document.getElementById('subject-name').textContent = this.subject.name;
        document.getElementById('total-questions').textContent = this.subject.quiz.length;
        this.updateProgress();
        this.showQuestion();
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const mins = Math.floor(this.timer / 60).toString().padStart(2, '0');
            const secs = (this.timer % 60).toString().padStart(2, '0');
            document.getElementById('timer-display').textContent = `${mins}:${secs}`;
        }, 1000);
    }

    showQuestion() {
        this.isAnswered = false;
        const qData = this.subject.quiz[this.currentQuestionIndex];
        document.getElementById('question-text').textContent = qData.q;
        document.getElementById('current-index').textContent = this.currentQuestionIndex + 1;

        const optionsGrid = document.getElementById('options-grid');
        optionsGrid.innerHTML = '';

        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <span class="option-letter" style="font-weight: bold; color: var(--primary)">${String.fromCharCode(65 + idx)}</span>
                <span>${opt}</span>
            `;
            btn.onclick = () => this.handleAnswer(idx);
            optionsGrid.appendChild(btn);
        });

        document.getElementById('feedback-area').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
    }

    handleAnswer(idx) {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const qData = this.subject.quiz[this.currentQuestionIndex];
        const btns = document.querySelectorAll('.option-btn');

        if (idx === qData.correct) {
            this.score++;
            btns[idx].classList.add('correct');
        } else {
            btns[idx].classList.add('wrong');
            btns[qData.correct].classList.add('correct');
        }

        this.showFeedback(idx === qData.correct);
        document.getElementById('next-btn').style.display = 'block';
    }

    showFeedback(isCorrect) {
        const feedbackArea = document.getElementById('feedback-area');
        const qData = this.subject.quiz[this.currentQuestionIndex];

        feedbackArea.style.display = 'block';
        feedbackArea.innerHTML = `
            <div class="rationale">
                <h4>${isCorrect ? '¡Correcto!' : 'Incorrecto'}</h4>
                <p>${qData.rationale}</p>
            </div>
        `;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.subject.quiz.length) {
            this.updateProgress();
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    updateProgress() {
        const percent = ((this.currentQuestionIndex) / this.subject.quiz.length) * 100;
        document.getElementById('progress-bar').style.width = `${percent}%`;
    }

    finishQuiz() {
        clearInterval(this.timerInterval);
        const container = document.getElementById('quiz-view');
        container.innerHTML = `
            <div class="results-view animate-in" style="text-align: center;">
                <h2 style="font-size: 3rem; margin-bottom: 2rem;">¡Completado!</h2>
                <div class="score-circle" style="
                    width: 200px; 
                    height: 200px; 
                    border-radius: 50%; 
                    border: 8px solid var(--primary); 
                    display: flex; 
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center; 
                    margin: 0 auto 2rem;
                    background: rgba(0, 243, 255, 0.05);
                ">
                    <span style="font-size: 3rem; font-weight: 800;">${this.score}</span>
                    <span style="color: var(--text-muted)">de ${this.subject.quiz.length}</span>
                </div>
                <p style="font-size: 1.25rem; color: var(--text-muted); margin-bottom: 3rem;">
                    Tiempo total: ${document.getElementById('timer-display').textContent}
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <a href="dashboard.html" class="btn-next" style="text-decoration: none; background: transparent; border: 1px solid var(--primary); color: var(--primary)">Volver al Inicio</a>
                    <button onclick="location.reload()" class="btn-next">Reintentar</button>
                </div>
            </div>
        `;
    }
}

// Iniciar motor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.quizEngine = new QuizEngine();
});
