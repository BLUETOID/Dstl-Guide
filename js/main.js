// ===== Navigation Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close nav when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (navMenu && navToggle) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Scroll to Top Button =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Active Navigation Highlight =====
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== Quiz Manager Class =====
class QuizManager {
    constructor(containerId, questions) {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        
        if (this.container && this.questions.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.showStartScreen();
    }
    
    showStartScreen() {
        this.container.innerHTML = `
            <div class="quiz-header">
                <h3>Test Your Knowledge</h3>
                <p>Answer ${this.questions.length} questions to test your understanding of this unit.</p>
            </div>
            <div style="text-align: center;">
                <button class="start-quiz-btn" onclick="quiz.startQuiz()">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
            </div>
        `;
    }
    
    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.showQuestion();
    }
    
    showQuestion() {
        this.answered = false;
        const q = this.questions[this.currentQuestion];
        const letters = ['A', 'B', 'C', 'D'];
        
        this.container.innerHTML = `
            <div class="quiz-header">
                <h3>Question ${this.currentQuestion + 1} of ${this.questions.length}</h3>
            </div>
            <div class="question-card">
                <span class="question-number">Question ${this.currentQuestion + 1}</span>
                <p class="question-text">${q.question}</p>
                <div class="options-list">
                    ${q.options.map((opt, i) => `
                        <div class="option-item" onclick="quiz.selectOption(${i})">
                            <span class="option-letter">${letters[i]}</span>
                            <span class="option-text">${opt}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="feedback" style="margin-top: 20px;"></div>
            <div style="text-align: center; margin-top: 20px;">
                <button id="nextBtn" class="btn btn-secondary" style="display: none;" onclick="quiz.nextQuestion()">
                    ${this.currentQuestion < this.questions.length - 1 ? 'Next Question' : 'See Results'}
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    }
    
    selectOption(index) {
        if (this.answered) return;
        this.answered = true;
        
        const q = this.questions[this.currentQuestion];
        const options = this.container.querySelectorAll('.option-item');
        
        options.forEach((opt, i) => {
            opt.style.pointerEvents = 'none';
            if (i === q.correct) {
                opt.classList.add('correct');
            } else if (i === index) {
                opt.classList.add('incorrect');
            }
        });
        
        if (index === q.correct) {
            this.score++;
        }
        
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `
            <div class="info-box ${index === q.correct ? 'tip' : 'warning'}">
                <h4><i class="fas fa-${index === q.correct ? 'check-circle' : 'times-circle'}"></i> 
                    ${index === q.correct ? 'Correct!' : 'Incorrect'}</h4>
                <p>${q.explanation}</p>
            </div>
        `;
        
        document.getElementById('nextBtn').style.display = 'inline-flex';
    }
    
    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let icon, iconClass, message;
        
        if (percentage >= 80) {
            icon = 'trophy';
            iconClass = 'excellent';
            message = 'Excellent! You have mastered this topic!';
        } else if (percentage >= 60) {
            icon = 'thumbs-up';
            iconClass = 'good';
            message = 'Good job! Keep practicing to improve.';
        } else if (percentage >= 40) {
            icon = 'book';
            iconClass = 'average';
            message = 'Not bad! Review the material and try again.';
        } else {
            icon = 'redo';
            iconClass = 'poor';
            message = 'Keep studying! Practice makes perfect.';
        }
        
        this.container.innerHTML = `
            <div class="quiz-results">
                <div class="results-icon ${iconClass}">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="results-score">${this.score}/${this.questions.length}</div>
                <div class="results-message">${message}</div>
                <button class="retry-btn" onclick="quiz.startQuiz()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
});
