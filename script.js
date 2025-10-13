import { quizTopics } from './quizData.js'

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 0;
let startTime = null;
let isMarkingPhase = false;
let markingIndex = 0;
let selectedTopics = new Set();

function initializeTopicSelection() {
  const topicsGrid = document.getElementById('topics-grid');
  topicsGrid.innerHTML = '';
  
  for (const [topicId, topic] of Object.entries(quizTopics)) {
    const topicItem = document.createElement('div');
    topicItem.className = 'topic-item';
    topicItem.onclick = () => toggleTopic(topicId, topicItem);
    
    topicItem.innerHTML = `
      <div class="topic-checkbox"></div>
      <span class="topic-label">${topic.title}</span>
    `;
    
    topicsGrid.appendChild(topicItem);
  }
  
  updateStartButton();
}

function toggleTopic(topicId, topicElement) {
  const checkbox = topicElement.querySelector('.topic-checkbox');
  
  if (selectedTopics.has(topicId)) {
    selectedTopics.delete(topicId);
    topicElement.classList.remove('selected');
    checkbox.classList.remove('checked');
  } else {
    selectedTopics.add(topicId);
    topicElement.classList.add('selected');
    checkbox.classList.add('checked');
  }
  
  updateStartButton();
}

function updateStartButton() {
  const startBtn = document.getElementById('start-quiz-btn');
  startBtn.disabled = selectedTopics.size === 0;
}

function startQuiz() {
  if (selectedTopics.size === 0) {
    alert('Please select at least one topic');
    return;
  }
  
  // Get settings
  const questionCount = parseInt(document.getElementById('question-count').value) || 10;
  const timerSetting = parseInt(document.getElementById('timer-setting').value) || 600;
  const difficulty = document.getElementById('difficulty').value || 'medium';
  const generatePrint = document.getElementById('generate-print').checked;
  
  const allQuestions = [];
  const selectedTopicsArray = Array.from(selectedTopics);
  
  // Calculate how many questions to take from each topic
  const baseQuestionsPerTopic = Math.floor(questionCount / selectedTopicsArray.length);
  const remainder = questionCount % selectedTopicsArray.length;
  
  selectedTopicsArray.forEach((topicId, index) => {
    const topic = quizTopics[topicId];
    if (topic && topic.generator) {
      // Give extra questions to the first few topics if there's a remainder
      const questionsNeeded = baseQuestionsPerTopic + (index < remainder ? 1 : 0);
      
      // Generate exactly the number of questions needed for this topic
      const questions = topic.generator(questionsNeeded);
      allQuestions.push(...questions);
    }
  });
  
  // Shuffle all questions
  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
  
  currentQuiz = {
    title: `Custom Quiz (${Array.from(selectedTopics).map(id => quizTopics[id].title).join(', ')})`,
    questions: shuffledQuestions,
    settings: {
      questionCount,
      timerSetting,
      difficulty,
      generatePrint
    }
  };
  
  userAnswers = new Array(currentQuiz.questions.length).fill(null);
  timeRemaining = timerSetting;
  startTime = new Date();
  
  // Create question navigation
  createQuestionNavigation();
  
  // Hide topic selection, show quiz
  document.getElementById('topic-selection').classList.add('hidden');
  document.getElementById('quiz-header').classList.remove('hidden');
  document.getElementById('question-container').classList.remove('hidden');
  document.getElementById('navigation').classList.remove('hidden');
  
  document.getElementById('quiz-title').textContent = currentQuiz.title;
  
  if (timerSetting > 0) {
    startTimer();
  } else {
    document.getElementById('timer').textContent = 'No Timer';
  }
  
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
  updateQuestionNavigation();
  
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
  updateQuestionNavigation();
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
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
  selectedTopics.clear();
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('topic-selection').classList.remove('hidden');
  document.getElementById('navigation').style.display = 'flex';
  
  // Reset topic selection UI
  initializeTopicSelection();
}

function printResults() {
  if (!currentQuiz.settings.generatePrint) {
    alert('Printable results were disabled for this quiz');
    return;
  }
  
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

// Question Navigation Functions
function toggleQuestionNav() {
  const navPanel = document.getElementById('question-nav-panel');
  const overlay = document.querySelector('.overlay') || createOverlay();
  
  navPanel.classList.toggle('show');
  overlay.classList.toggle('show');
}

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.onclick = closeQuestionNav;
  document.body.appendChild(overlay);
  return overlay;
}

function closeQuestionNav() {
  const navPanel = document.getElementById('question-nav-panel');
  const overlay = document.querySelector('.overlay');
  
  navPanel.classList.remove('show');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

function createQuestionNavigation() {
  const questionGrid = document.getElementById('question-grid');
  questionGrid.innerHTML = '';
  
  currentQuiz.questions.forEach((_, index) => {
    const questionBtn = document.createElement('button');
    questionBtn.className = 'question-number-btn';
    questionBtn.textContent = index + 1;
    questionBtn.onclick = () => navigateToQuestion(index);
    
    updateQuestionButtonState(questionBtn, index);
    questionGrid.appendChild(questionBtn);
  });
}

function updateQuestionButtonState(button, index) {
  // Remove all state classes
  button.classList.remove('current', 'answered', 'marked');
  
  // Add current class if this is the current question
  if (index === currentQuestionIndex) {
    button.classList.add('current');
  }
  
  // Add answered class if user has answered this question
  if (userAnswers[index] !== null) {
    button.classList.add('answered');
  }
}

function navigateToQuestion(index) {
  if (isMarkingPhase) return;
  
  currentQuestionIndex = index;
  displayQuestion();
  updateQuestionNavigation();
  closeQuestionNav();
}

function updateQuestionNavigation() {
  const buttons = document.querySelectorAll('.question-number-btn');
  buttons.forEach((button, index) => {
    updateQuestionButtonState(button, index);
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('topic-selection').classList.remove('hidden');
  initializeTopicSelection();
  
  // Add event listeners
  document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('prev-btn').addEventListener('click', previousQuestion);
  document.getElementById('continue-btn').addEventListener('click', closeFeedback);
  document.getElementById('try-again-btn').addEventListener('click', restartQuiz);
  document.getElementById('print-btn').addEventListener('click', printResults);
  
  // New event listeners for question navigation
  document.getElementById('nav-toggle-btn').addEventListener('click', toggleQuestionNav);
  document.getElementById('close-nav-panel').addEventListener('click', closeQuestionNav);
  
  // Settings validation
  document.getElementById('question-count').addEventListener('change', function() {
    const value = parseInt(this.value);
    if (value < 5) this.value = 5;
  });
});