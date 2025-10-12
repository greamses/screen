import { quizData } from './quizData.js';

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 0;
let startTime = null;
let isMarkingPhase = false;
let markingIndex = 0;

function generateQuizCards() {
  const quizGrid = document.getElementById('quiz-grid');
  quizGrid.innerHTML = '';
  
  for (const [quizId, quiz] of Object.entries(quizData)) {
    const timeInMinutes = Math.floor(quiz.timeLimit / 60);
    
    const quizCard = document.createElement('div');
    quizCard.className = 'quiz-card';
    quizCard.onclick = () => selectQuiz(quizId);
    
    quizCard.innerHTML = `  
      <h3>${quiz.title}</h3>  
      <p>${quiz.description}</p>  
      <small>${quiz.questions.length} questions • ${timeInMinutes} minutes</small>  
    `;
    
    quizGrid.appendChild(quizCard);
  }
}

function selectQuiz(quizId) {
  currentQuiz = quizData[quizId];
  userAnswers = new Array(currentQuiz.questions.length).fill(null);
  timeRemaining = currentQuiz.timeLimit;
  startTime = new Date();

  document.getElementById('quiz-selection').classList.add('hidden');
  document.getElementById('quiz-header').classList.remove('hidden');
  document.getElementById('question-container').classList.remove('hidden');
  document.getElementById('navigation').classList.remove('hidden');

  document.getElementById('quiz-title').textContent = currentQuiz.title;
  startTimer();
  displayQuestion();
}

function startTimer() {
  updateTimerDisplay(); 
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {  
      clearInterval(timerInterval);  
      alert('Time\'s up! The quiz will now be graded.');  
      startMarking();  
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  document.getElementById('timer').textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function displayQuestion() {
  const question = currentQuiz.questions[currentQuestionIndex];

  document.getElementById('question-number').textContent =
    `${currentQuestionIndex + 1} / ${currentQuiz.questions.length}`;
  document.getElementById('question-text').innerHTML = question.question; 

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.innerHTML = option; 
    optionDiv.onclick = () => selectOption(index);

    if (userAnswers[currentQuestionIndex] === index) {  
      optionDiv.classList.add('selected');  
    }  
    
    optionsContainer.appendChild(optionDiv);
  });

  updateNavigation();
  
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function updateNavigation() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressInfo = document.getElementById('progress-info');

  prevBtn.disabled = currentQuestionIndex === 0;

  if (currentQuestionIndex === currentQuiz.questions.length - 1) {
    nextBtn.textContent = 'Submit';
    nextBtn.className = 'btn btn-success';
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.className = 'btn';
  }

  nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
  const answered = userAnswers.filter(answer => answer !== null).length;
  progressInfo.textContent = `${answered} of ${currentQuiz.questions.length} answered`;
}

function selectOption(optionIndex) {
  if (isMarkingPhase) return; 

  userAnswers[currentQuestionIndex] = optionIndex;

  const options = document.querySelectorAll('.option');
  options.forEach((option, index) => {
    option.classList.remove('selected');
    if (index === optionIndex) {
      option.classList.add('selected');
    }
  });

  updateNavigation();
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    clearInterval(timerInterval);
    startMarking();
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function startMarking() {
  isMarkingPhase = true;
  markingIndex = 0;
  currentQuestionIndex = 0;

  document.getElementById('navigation').style.display = 'none';
  document.getElementById('timer').textContent = 'Reviewing...';

  markNextQuestion();
}

function markNextQuestion() {
  if (markingIndex >= currentQuiz.questions.length) {
    showResults();
    return;
  }

  currentQuestionIndex = markingIndex;
  displayQuestion();

  const question = currentQuiz.questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];
  const correctAnswer = question.correct;

  const options = document.querySelectorAll('.option');
  options.forEach((option, index) => {
    option.onclick = null; 

    if (index === correctAnswer) {  
      option.classList.add('correct');  
      option.innerHTML += '<span class="result-icon">✅</span>';  
    } else if (index === userAnswer && userAnswer !== correctAnswer) {  
      option.classList.add('incorrect');  
      option.innerHTML += '<span class="result-icon">❌</span>';  
    }
  });

  if (userAnswer !== correctAnswer && userAnswer !== null) {
    showFeedback(question);
  } else {
    setTimeout(() => {
      markingIndex++;
      markNextQuestion();
    }, 1500);
  }
}

function showFeedback(question) {
  const feedbackPanel = document.getElementById('feedback-panel');
  const correctAnswerText = document.getElementById('correct-answer-text');
  const feedbackExplanation = document.getElementById('feedback-explanation');

  correctAnswerText.innerHTML = question.options[question.correct];
  feedbackExplanation.innerHTML = question.explanation;

  feedbackPanel.classList.add('show');
  
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function closeFeedback() {
  const feedbackPanel = document.getElementById('feedback-panel');
  feedbackPanel.classList.remove('show');

  markingIndex++;
  setTimeout(() => {
    markNextQuestion();
  }, 500);
}

function showResults() {
  document.getElementById('quiz-header').classList.add('hidden');
  document.getElementById('question-container').classList.add('hidden');
  document.getElementById('navigation').classList.add('hidden');

  document.getElementById('results-container').classList.remove('hidden');

  const correctAnswers = userAnswers.filter((answer, index) =>
    answer === currentQuiz.questions[index].correct
  ).length;

  const totalQuestions = currentQuiz.questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  let grade, gradeClass, message;
  if (percentage >= 90) {
    grade = 'A';
    gradeClass = 'grade-A';
    message = ' Excellent work! You\'ve mastered this topic!';
  } else if (percentage >= 80) {
    grade = 'B';
    gradeClass = 'grade-B';
    message = ' Great job! You have a solid understanding!';
  } else if (percentage >= 70) {
    grade = 'C';
    gradeClass = 'grade-C';
    message = ' Good effort! Keep practicing to improve!';
  } else if (percentage >= 60) {
    grade = 'D';
    gradeClass = 'grade-D';
    message = ' You\'re getting there! Review the material and try again!';
  } else {
    grade = 'F';
    gradeClass = 'grade-F';
    message = ' Don\'t give up! Study more and you\'ll improve!';
  }

  const gradeDisplay = document.getElementById('grade-display');
  gradeDisplay.textContent = grade;
  gradeDisplay.className = `grade-display ${gradeClass}`;

  document.getElementById('grade-message').textContent = message;
  document.getElementById('final-score').textContent = `${correctAnswers}/${totalQuestions}`;
  document.getElementById('final-percentage').textContent = `${percentage}%`;
  document.getElementById('time-taken').textContent = formatTime(timeTaken);
  document.getElementById('correct-count').textContent = correctAnswers;

  if (percentage >= 80) {
    showConfetti();
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti';
  document.body.appendChild(confettiContainer);

  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  for (let i = 0; i < 50; i++) {
    const confettiPiece = document.createElement('div');
    confettiPiece.className = 'confetti-piece';
    confettiPiece.style.left = Math.random() * 100 + '%';
    confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confettiPiece.style.animationDelay = Math.random() * 3 + 's';
    confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confettiContainer.appendChild(confettiPiece);
  }

  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 5000);
}

function restartQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  isMarkingPhase = false;
  markingIndex = 0;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('quiz-selection').classList.remove('hidden');

  document.getElementById('navigation').style.display = 'flex';
}

function printResults() {
  const studentName = document.getElementById('student-name').value || 'Anonymous';
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  const correctAnswers = userAnswers.filter((answer, index) =>
    answer === currentQuiz.questions[index].correct
  ).length;

  const totalQuestions = currentQuiz.questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  let grade;
  if (percentage >= 90) grade = 'A';
  else if (percentage >= 80) grade = 'B';
  else if (percentage >= 70) grade = 'C';
  else if (percentage >= 60) grade = 'D';
  else grade = 'F';

  document.getElementById('print-date').textContent = new Date().toLocaleDateString();
  document.getElementById('print-student-name').textContent = studentName;
  document.getElementById('print-quiz-title').textContent = currentQuiz.title;
  document.getElementById('print-quiz-date').textContent = startTime.toLocaleDateString();
  document.getElementById('print-time-taken').textContent = formatTime(timeTaken);
  document.getElementById('print-score').textContent = `${correctAnswers}/${totalQuestions}`;
  document.getElementById('print-percentage').textContent = `${percentage}%`;
  document.getElementById('print-grade').textContent = grade;

  const printQuestions = document.getElementById('print-questions');
  printQuestions.innerHTML = '<h3>Detailed Results:</h3>';

  currentQuiz.questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correct;

    const questionDiv = document.createElement('div');  
    questionDiv.style.marginBottom = '20px';  
    questionDiv.style.padding = '15px';  
    questionDiv.style.border = '1px solid #ddd';  
    questionDiv.style.borderRadius = '8px';  
    questionDiv.style.pageBreakInside = 'avoid';  
    
    let questionHTML = `  
      <p><strong>Q${index + 1}:</strong> ${question.question}</p>  
      <p><strong>Your Answer:</strong> ${userAnswer !== null ? question.options[userAnswer] : 'Not answered'} ${isCorrect ? '✅' : '❌'}</p>  
      <p><strong>Correct Answer:</strong> ${question.options[question.correct]}</p>  
    `;  
    
    if (question.explanation && question.explanation.trim() !== '') {  
      questionHTML += `<p><strong>Explanation:</strong> ${question.explanation}</p>`;  
    }  
    
    questionDiv.innerHTML = questionHTML;  
    printQuestions.appendChild(questionDiv);
  });

  setTimeout(() => {
    window.print();
  }, 100);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('quiz-selection').classList.remove('hidden');
  generateQuizCards();
  
  // Add event listeners
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('prev-btn').addEventListener('click', previousQuestion);
  document.getElementById('continue-btn').addEventListener('click', closeFeedback);
  document.getElementById('try-again-btn').addEventListener('click', restartQuiz);
  document.getElementById('print-btn').addEventListener('click', printResults);
});