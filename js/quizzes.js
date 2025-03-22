/**
 * Future Academy - Quizzes & Tests JavaScript
 * Handles quiz filtering, taking quizzes, tracking progress, and results
 */

document.addEventListener('DOMContentLoaded', () => {
    initQuizFilters();
    initQuizStart();
    initCategoryFilter();
    
    // For demo purposes: initialize recent attempts functionality
    initRecentAttempts();
});

/**
 * Quiz Data
 * Sample quiz data for demonstration purposes
 */
const quizData = {
    'math-101': {
        title: 'Basic Algebra Concepts',
        category: 'mathematics',
        difficulty: 'beginner',
        timeLimit: 10 * 60, // 10 minutes in seconds
        questions: [
            {
                question: 'Solve for x: 2x + 5 = 13',
                options: ['x = 4', 'x = 5', 'x = 6', 'x = 8'],
                correctAnswer: 0,
                explanation: '2x + 5 = 13\n2x = 8\nx = 4'
            },
            {
                question: 'If y = 3x - 7, and x = 5, what is the value of y?',
                options: ['y = 8', 'y = 7', 'y = 10', 'y = 8.5'],
                correctAnswer: 0,
                explanation: 'y = 3(5) - 7 = 15 - 7 = 8'
            },
            {
                question: 'Which expression is equivalent to 2(x + 3) - 4?',
                options: ['2x + 2', '2x + 6 - 4', '2x + 2 - 4', '2x + 6'],
                correctAnswer: 1,
                explanation: '2(x + 3) - 4 = 2x + 6 - 4 = 2x + 2'
            },
            {
                question: 'Solve for x: 3(x - 2) = 15',
                options: ['x = 7', 'x = 5', 'x = 9', 'x = 11'],
                correctAnswer: 0,
                explanation: '3(x - 2) = 15\nx - 2 = 5\nx = 7'
            },
            {
                question: 'Factor the expression: x² - 9',
                options: ['(x + 3)(x - 3)', '(x + 3)²', '(x - 3)²', '(x - 3)(x - 3)'],
                correctAnswer: 0,
                explanation: 'x² - 9 = x² - 3² = (x + 3)(x - 3)'
            }
        ]
    },
    
    'sci-101': {
        title: 'Introduction to Physics',
        category: 'science',
        difficulty: 'beginner',
        timeLimit: 15 * 60, // 15 minutes in seconds
        questions: [
            {
                question: 'What is the SI unit of force?',
                options: ['Watt', 'Newton', 'Joule', 'Pascal'],
                correctAnswer: 1,
                explanation: 'The SI unit of force is the Newton (N).'
            },
            {
                question: 'What does the formula E = mc² represent?',
                options: [
                    'Theory of Relativity', 
                    'Conservation of Energy', 
                    'Mass-Energy Equivalence', 
                    'Gravitational Constant'
                ],
                correctAnswer: 2,
                explanation: 'E = mc² is the formula for mass-energy equivalence, derived from Einstein\'s theory of relativity.'
            },
            {
                question: 'Which of the following is NOT a type of fundamental force in physics?',
                options: [
                    'Gravitational Force', 
                    'Electromagnetic Force', 
                    'Nuclear Force', 
                    'Centrifugal Force'
                ],
                correctAnswer: 3,
                explanation: 'Centrifugal force is not a fundamental force, but rather a fictitious or inertial force that appears in a rotating reference frame.'
            }
        ]
    }
    
    // More quizzes would be defined here
};

// Current quiz state
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizTimer = null;
let timeRemaining = 0;

/**
 * Quiz Filters
 * Handle filtering of quizzes by category and difficulty
 */
function initQuizFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const quizCards = document.querySelectorAll('.quiz-card');
    
    // Apply filters when changed
    categoryFilter.addEventListener('change', applyFilters);
    difficultyFilter.addEventListener('change', applyFilters);
    
    // Filter function
    function applyFilters() {
        const categoryValue = categoryFilter.value;
        const difficultyValue = difficultyFilter.value;
        
        quizCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardDifficulty = card.getAttribute('data-difficulty');
            
            const matchesCategory = categoryValue === 'all' || cardCategory === categoryValue;
            const matchesDifficulty = difficultyValue === 'all' || cardDifficulty === difficultyValue;
            
            if (matchesCategory && matchesDifficulty) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Initialize "Load More" button
    const loadMoreBtn = document.getElementById('load-more-quizzes');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // In a real app, this would load more quizzes from the server
            // For this demo, we'll just show a message
            loadMoreBtn.textContent = 'No More Quizzes Available';
            loadMoreBtn.disabled = true;
        });
    }
}

/**
 * Category Cards Filter
 * Handle filtering when clicking on category cards
 */
function initCategoryFilter() {
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryFilter = document.getElementById('category-filter');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category && categoryFilter) {
                categoryFilter.value = category;
                // Trigger change event to apply filter
                const event = new Event('change');
                categoryFilter.dispatchEvent(event);
                
                // Scroll to quizzes section
                document.querySelector('.available-quizzes').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Quiz Start Functionality
 * Initialize the quiz taking functionality
 */
function initQuizStart() {
    const startButtons = document.querySelectorAll('.start-quiz-btn');
    
    startButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quizId = button.getAttribute('data-quiz-id');
            startQuiz(quizId);
        });
    });
    
    // Set up navigation and submission
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const submitBtn = document.getElementById('submit-quiz');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', navigateToPrevQuestion);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', navigateToNextQuestion);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuiz);
    }
    
    // Results page buttons
    const retryBtn = document.getElementById('retry-quiz');
    const backToQuizzesBtn = document.getElementById('back-to-quizzes');
    
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (currentQuiz) {
                startQuiz(currentQuiz);
            }
        });
    }
    
    if (backToQuizzesBtn) {
        backToQuizzesBtn.addEventListener('click', () => {
            hideSection('quiz-results');
            showSection('quiz-categories');
            showSection('available-quizzes');
            showSection('recent-attempts');
        });
    }
}

/**
 * Start a quiz
 * @param {string} quizId - The ID of the quiz to start
 */
function startQuiz(quizId) {
    // Get quiz data
    const quiz = quizData[quizId];
    if (!quiz) {
        console.error('Quiz not found:', quizId);
        return;
    }
    
    // Set current quiz and reset state
    currentQuiz = quizId;
    currentQuestionIndex = 0;
    userAnswers = new Array(quiz.questions.length).fill(null);
    
    // Update UI elements
    document.getElementById('quiz-title').textContent = quiz.title;
    document.getElementById('total-questions').textContent = quiz.questions.length;
    
    // Hide other sections and show quiz
    hideSection('quiz-categories');
    hideSection('available-quizzes');
    hideSection('recent-attempts');
    hideSection('quiz-results');
    showSection('active-quiz');
    
    // Start timer
    startTimer(quiz.timeLimit);
    
    // Show first question
    showQuestion(0);
}

/**
 * Show a specific question
 * @param {number} index - The index of the question to show
 */
function showQuestion(index) {
    const quiz = quizData[currentQuiz];
    if (!quiz || index < 0 || index >= quiz.questions.length) {
        return;
    }
    
    const question = quiz.questions[index];
    currentQuestionIndex = index;
    
    // Update question text and navigation
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-question').textContent = index + 1;
    
    // Previous/next button states
    document.getElementById('prev-question').disabled = index === 0;
    
    // Show/hide next and submit buttons based on question
    if (index === quiz.questions.length - 1) {
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('submit-quiz').style.display = 'block';
    } else {
        document.getElementById('next-question').style.display = 'block';
        document.getElementById('submit-quiz').style.display = 'none';
    }
    
    // Generate options
    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    
    question.options.forEach((option, optionIndex) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        
        // Check if this option was previously selected
        if (userAnswers[index] === optionIndex) {
            optionElement.classList.add('selected');
        }
        
        optionElement.innerHTML = `
            <input type="radio" id="option-${optionIndex}" name="question-${index}" 
                value="${optionIndex}" ${userAnswers[index] === optionIndex ? 'checked' : ''}>
            <label for="option-${optionIndex}">${option}</label>
        `;
        
        optionsList.appendChild(optionElement);
        
        // Add click handler
        optionElement.addEventListener('click', () => {
            // Remove selection from all options
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selection to clicked option
            optionElement.classList.add('selected');
            
            // Store user's answer
            userAnswers[index] = optionIndex;
        });
    });
}

/**
 * Navigate to previous question
 */
function navigateToPrevQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

/**
 * Navigate to next question
 */
function navigateToNextQuestion() {
    const quiz = quizData[currentQuiz];
    if (currentQuestionIndex < quiz.questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    }
}

/**
 * Start the quiz timer
 * @param {number} seconds - The time limit in seconds
 */
function startTimer(seconds) {
    // Clear any existing timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    timeRemaining = seconds;
    updateTimerDisplay();
    
    quizTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            submitQuiz(true); // Auto-submit when time's up
        }
    }, 1000);
}

/**
 * Update the timer display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = display;
    
    // Add warning class if less than 1 minute remaining
    if (timeRemaining < 60) {
        document.getElementById('timer-display').classList.add('warning');
    } else {
        document.getElementById('timer-display').classList.remove('warning');
    }
}

/**
 * Submit the quiz and show results
 * @param {boolean} timeUp - Whether submission is due to time running out
 */
function submitQuiz(timeUp = false) {
    // Stop the timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Calculate score
    const quiz = quizData[currentQuiz];
    let correctCount = 0;
    
    for (let i = 0; i < quiz.questions.length; i++) {
        if (userAnswers[i] === quiz.questions[i].correctAnswer) {
            correctCount++;
        }
    }
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    
    // Hide quiz and show results
    hideSection('active-quiz');
    showSection('quiz-results');
    
    // Update results UI
    document.getElementById('correct-answers').textContent = correctCount;
    document.getElementById('total-answers').textContent = quiz.questions.length;
    document.getElementById('score-text').textContent = score + '%';
    
    // Set the score message based on score
    let scoreMessage = '';
    if (score >= 90) {
        scoreMessage = 'Excellent! You\'ve mastered this topic.';
    } else if (score >= 75) {
        scoreMessage = 'Good job! You have a solid understanding.';
    } else if (score >= 60) {
        scoreMessage = 'Not bad! Keep practicing to improve.';
    } else {
        scoreMessage = 'You might want to review this topic again.';
    }
    
    if (timeUp) {
        scoreMessage = 'Time\'s up! ' + scoreMessage;
    }
    
    document.getElementById('score-message').textContent = scoreMessage;
    
    // Animate score circle
    const scoreCircle = document.getElementById('score-circle');
    scoreCircle.setAttribute('stroke-dasharray', `${score}, 100`);
    
    // Set circle color based on score
    if (score >= 90) {
        scoreCircle.style.stroke = '#28a745'; // Excellent
    } else if (score >= 75) {
        scoreCircle.style.stroke = '#4a6bfa'; // Good
    } else if (score >= 60) {
        scoreCircle.style.stroke = '#ffc107'; // Needs improvement
    } else {
        scoreCircle.style.stroke = '#dc3545'; // Poor
    }
    
    // Generate question review
    generateQuestionReview(quiz, userAnswers);
    
    // Save quiz attempt to localStorage
    saveQuizAttempt(quiz, score);
}

/**
 * Generate the question review section in results
 * @param {Object} quiz - The quiz object
 * @param {Array} answers - Array of user answers
 */
function generateQuestionReview(quiz, answers) {
    const reviewContainer = document.getElementById('questions-review');
    reviewContainer.innerHTML = '';
    
    quiz.questions.forEach((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <div class="review-question">
                <span class="question-number">${index + 1}.</span>
                <span class="question-text">${question.question}</span>
                <span class="result-icon">${isCorrect ? '✓' : '✗'}</span>
            </div>
            <div class="review-answers">
                <div class="your-answer">
                    <span class="answer-label">Your answer:</span>
                    <span class="answer-text">${userAnswer !== null ? question.options[userAnswer] : 'Not answered'}</span>
                </div>
                ${!isCorrect ? `
                    <div class="correct-answer">
                        <span class="answer-label">Correct answer:</span>
                        <span class="answer-text">${question.options[question.correctAnswer]}</span>
                    </div>
                ` : ''}
                <div class="explanation">
                    <span class="explanation-label">Explanation:</span>
                    <span class="explanation-text">${question.explanation}</span>
                </div>
            </div>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
}

/**
 * Save quiz attempt to localStorage
 * @param {Object} quiz - The quiz object
 * @param {number} score - The score percentage
 */
function saveQuizAttempt(quiz, score) {
    // Get existing attempts or initialize empty array
    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    
    // Add new attempt
    attempts.unshift({
        quizId: currentQuiz,
        title: quiz.title,
        score: score,
        date: new Date().toISOString(),
        timeTaken: formatTimeTaken(quiz.timeLimit - timeRemaining)
    });
    
    // Keep only the most recent 10 attempts
    const limitedAttempts = attempts.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('quizAttempts', JSON.stringify(limitedAttempts));
}

/**
 * Format time taken in seconds to MM:SS
 * @param {number} seconds - The time taken in seconds
 * @return {string} Formatted time
 */
function formatTimeTaken(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Recent Attempts Functionality
 * Initialize functionality for the recent attempts section
 */
function initRecentAttempts() {
    // Add event listeners to view results and retry buttons
    const viewResultsButtons = document.querySelectorAll('.view-results-btn');
    const retryButtons = document.querySelectorAll('.retry-btn');
    
    viewResultsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quizId = button.getAttribute('data-quiz-id');
            
            // In a real app, this would load the saved results from localStorage
            // For this demo, we'll just show a simulated result
            alert('In a real application, this would display the saved results for quiz: ' + quizId);
        });
    });
    
    retryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quizId = button.getAttribute('data-quiz-id');
            startQuiz(quizId);
        });
    });
}

/**
 * Helper function to hide a section
 * @param {string} id - The ID of the section to hide
 */
function hideSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Helper function to show a section
 * @param {string} id - The ID of the section to show
 */
function showSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
} 