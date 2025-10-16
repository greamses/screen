const {
  quizTopics: topics,
  quizCategories: categories,
  getAllQuizTopics: getAllTopics,
  getTopicsByCategory: getTopicsByCat,
  getCategoryForTopic: getCategoryForTop,
  getTopicInfo: getTopicInf,
  getAllCategories: getAllCats,
  getCategoryInfo: getCategoryInf
} = window.quizData;

const timerDropdown = document.getElementById('timer-dropdown');
const selectedTimerOption = timerDropdown ? timerDropdown.querySelector('.dropdown-option.selected') : null;
const timerSetting = selectedTimerOption ? parseInt(selectedTimerOption.getAttribute('data-value')) : 1200;

const questionCountInput = document.getElementById('question-count');
const difficultyInput = document.getElementById('difficulty');
const generatePrintInput = document.getElementById('generate-print');

let questionCount = questionCountInput ? parseInt(questionCountInput.value) || 10 : 10;
let difficulty = difficultyInput ? difficultyInput.value || 'medium' : 'medium';
let generatePrint = generatePrintInput ? generatePrintInput.checked : true;

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 0;
let startTime = null;
let isMarkingPhase = false;
let markingIndex = 0;
let selectedTopics = new Set();

let searchTerm = '';
let sortBy = 'alphabetical';

// MathJax loading states
let mathJaxReady = false;
let domContentLoaded = false;
let initializationPending = false;

// Add missing function definitions
function getAllCategories() {
  return getAllCats();
}

function getTopicsByCategory(category) {
  return getTopicsByCat(category);
}

function getCategoryInfo(category) {
  return getCategoryInf(category);
}

function getTopicInfo(topicId) {
  return getTopicInf(topicId);
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
  
  refreshCategoryProgress();
  updateStartButton();
}

function refreshCategoryProgress() {
  const categories = getAllCats();
  
  categories.forEach(category => {
    const categoryTopics = getTopicsByCat(category);
    const selectedInCategory = categoryTopics.filter(topicId =>
      selectedTopics.has(topicId)
    ).length;
    const progressPercent = (selectedInCategory / categoryTopics.length) * 100;
    
    const categoryHeader = document.querySelector(`.category-header[data-category="${category}"]`);
    if (categoryHeader) {
      const progressFill = categoryHeader.querySelector('.category-progress-fill');
      const progressText = categoryHeader.querySelector('.category-progress span');
      
      if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
      }
      if (progressText) {
        progressText.textContent = `${selectedInCategory}/${categoryTopics.length}`;
      }
    }
  });
}

function getFilteredAndSortedTopics() {
  const allTopics = getAllTopics();
  
  let filteredTopics = allTopics.filter(topicId => {
    const topic = getTopicInf(topicId);
    return topic && (
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  if (sortBy === 'alphabetical') {
    filteredTopics.sort((a, b) => {
      const topicA = getTopicInf(a);
      const topicB = getTopicInf(b);
      return topicA.title.localeCompare(topicB.title);
    });
  } else if (sortBy === 'category') {
    const categories = getAllCats();
    const categorizedTopics = {};
    
    categories.forEach(category => {
      categorizedTopics[category] = getTopicsByCat(category)
        .filter(topicId => filteredTopics.includes(topicId))
        .sort((a, b) => {
          const topicA = getTopicInf(a);
          const topicB = getTopicInf(b);
          return topicA.title.localeCompare(topicB.title);
        });
    });
    
    filteredTopics = [];
    categories.forEach(category => {
      if (categorizedTopics[category].length > 0) {
        filteredTopics = filteredTopics.concat(categorizedTopics[category]);
      }
    });
  }
  
  return filteredTopics;
}

function startQuiz() {
  if (selectedTopics.size === 0) {
    alert('Please select at least one topic');
    return;
  }
  
  updateQuestionCount();
  
  const difficultyInput = document.getElementById('difficulty');
  const generatePrintInput = document.getElementById('generate-print');
  
  const currentDifficulty = difficultyInput ? difficultyInput.value || 'medium' : 'medium';
  const currentGeneratePrint = generatePrintInput ? generatePrintInput.checked : true;
  const currentTimerSetting = getCurrentTimerSetting();
  
  const allQuestions = [];
  const selectedTopicsArray = Array.from(selectedTopics);
  
  const baseQuestionsPerTopic = Math.floor(questionCount / selectedTopicsArray.length);
  const remainder = questionCount % selectedTopicsArray.length;
  
  let totalAvailableQuestions = 0;
  selectedTopicsArray.forEach(topicId => {
    const topic = getTopicInf(topicId);
    if (topic && topic.generator) {
      totalAvailableQuestions += 10;
    }
  });
  
  if (totalAvailableQuestions < questionCount) {
    alert(`Not enough questions available. Maximum available: ${totalAvailableQuestions}`);
    return;
  }
  
  selectedTopicsArray.forEach((topicId, index) => {
    const topic = getTopicInf(topicId);
    if (topic && topic.generator) {
      const questionsNeeded = baseQuestionsPerTopic + (index < remainder ? 1 : 0);
      
      try {
        const questions = topic.generator(questionsNeeded);
        if (questions && questions.length > 0) {
          allQuestions.push(...questions);
        }
      } catch (error) {
        console.error('Error generating questions for topic:', topicId, error);
      }
    }
  });
  
  if (allQuestions.length === 0) {
    alert('Could not generate any questions. Please try different topics.');
    return;
  }
  
  if (allQuestions.length < questionCount) {
    console.warn(`Requested ${questionCount} questions but only got ${allQuestions.length}`);
  }
  
  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, questionCount);
  
  currentQuiz = {
    title: `Custom Quiz (${Array.from(selectedTopics).map(id => getTopicInf(id).title).join(', ')})`,
    questions: shuffledQuestions,
    settings: {
      questionCount: shuffledQuestions.length,
      timerSetting: currentTimerSetting,
      difficulty: currentDifficulty,
      generatePrint: currentGeneratePrint
    }
  };
  
  userAnswers = new Array(currentQuiz.questions.length).fill(null);
  timeRemaining = currentTimerSetting;
  startTime = new Date();
  
  createQuestionNavigation();
  
  document.getElementById('topic-selection').classList.add('hidden');
  document.getElementById('quiz-header').classList.remove('hidden');
  document.getElementById('question-container').classList.remove('hidden');
  document.getElementById('navigation').classList.remove('hidden');
  
  document.getElementById('quiz-title').textContent = currentQuiz.title;
  
  if (currentTimerSetting > 0) {
    startTimer();
  } else {
    document.getElementById('timer').textContent = 'No Timer';
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  
  currentQuestionIndex = 0;
  displayQuestion();
}

function setupSearch() {
  const topicSearch = document.getElementById('topic-search');
  const clearSearch = document.getElementById('clear-search');
  
  initializeAllDropdowns();
  
  if (topicSearch) {
    let searchTimeout;
    topicSearch.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchTerm = this.value;
        initializeTopicSelection();
      }, 300);
    });
    
    topicSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        topicSearch.value = '';
        searchTerm = '';
        initializeTopicSelection();
      }
    });
  }
  
  if (clearSearch) {
    clearSearch.addEventListener('click', function() {
      if (topicSearch) {
        topicSearch.value = '';
        searchTerm = '';
        initializeTopicSelection();
        topicSearch.focus();
      }
    });
  }
}

function startTimer() {
  updateTimerDisplay();
  
  if (getCurrentTimerSetting() === 0) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    return;
  }
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      handleTimeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;
  
  if (timeRemaining === 0 && getCurrentTimerSetting() === 0) {
    timerElement.textContent = 'No Timer';
    timerElement.classList.remove('time-warning', 'pulse', 'time-expired');
    return;
  }
  
  if (timeRemaining <= 0) {
    timerElement.textContent = '00:00';
    timerElement.classList.add('time-warning', 'time-expired');
    return;
  }
  
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  timerElement.textContent = timeString;
  
  if (timeRemaining < 60) {
    timerElement.classList.add('time-warning', 'pulse');
  } else if (timeRemaining < 300) {
    timerElement.classList.add('time-warning');
    timerElement.classList.remove('pulse');
  } else {
    timerElement.classList.remove('time-warning', 'pulse', 'time-expired');
  }
}

function updateNavigation() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressInfo = document.getElementById('progress-info');
  
  if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
  
  if (nextBtn) {
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
      nextBtn.innerHTML = '<i class="fas fa-check"></i>';
      nextBtn.className = 'btn btn-success';
      nextBtn.title = 'Submit Quiz';
    } else {
      nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
      nextBtn.className = 'btn';
      nextBtn.title = 'Next Question';
    }
    nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
  }
  
  if (progressInfo) {
    const answered = userAnswers.filter(answer => answer !== null).length;
    progressInfo.textContent = `${answered} of ${currentQuiz.questions.length} answered`;
  }
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
      timerInterval = null;
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

function closeFeedback() {
  const feedbackPanel = document.getElementById('feedback-panel');
  if (feedbackPanel) feedbackPanel.classList.remove('show');
  
  markingIndex++;
  setTimeout(() => {
    markNextQuestion();
  }, 500);
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

function initializeCustomDropdown() {
  const dropdown = document.getElementById('sort-dropdown');
  if (!dropdown) return;
  
  const selected = dropdown.querySelector('.dropdown-selected');
  const options = dropdown.querySelector('.dropdown-options');
  const selectedText = document.getElementById('selected-sort');
  const optionElements = dropdown.querySelectorAll('.dropdown-option');
  
  selected.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = selected.classList.contains('active');
    
    closeAllDropdowns();
    
    if (!isActive) {
      selected.classList.add('active');
      options.classList.add('show');
    } else {
      closeDropdown();
    }
  });
  
  optionElements.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = option.getAttribute('data-value');
      const text = option.textContent;
      
      selectedText.textContent = text;
      sortBy = value;
      
      optionElements.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      closeDropdown();
      initializeTopicSelection();
    });
  });
  
  document.addEventListener('click', closeDropdown);
  
  function closeDropdown() {
    selected.classList.remove('active');
    options.classList.remove('show');
  }
  
  function closeAllDropdowns() {
    document.querySelectorAll('.custom-dropdown .dropdown-selected').forEach(el => {
      el.classList.remove('active');
    });
    document.querySelectorAll('.custom-dropdown .dropdown-options').forEach(el => {
      el.classList.remove('show');
    });
  }
  
  const initialOption = dropdown.querySelector(`[data-value="${sortBy}"]`);
  if (initialOption) {
    selectedText.textContent = initialOption.textContent;
    optionElements.forEach(opt => opt.classList.remove('selected'));
    initialOption.classList.add('selected');
  }
}

const additionalStyles = `
.loading {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--color-neutral-500);
    font-style: italic;
}

#topic-search {
    position: relative;
}

#topic-search:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

@media (max-width: 768px) {
    .dropdown-options {
        position: fixed;
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 50vh;
        border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        transform: translateY(100%);
    }
    
    .dropdown-options.show {
        transform: translateY(0);
    }
    
    .dropdown-option {
        padding: 14px var(--spacing-lg);
        font-size: var(--font-size-base);
    }
}
`;

function formatTimeForDisplay(seconds) {
  if (seconds === 0) return 'No Timer';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} Hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} Minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} Second${seconds > 1 ? 's' : ''}`;
  }
}

function handleTimeUp() {
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.classList.add('time-expired');
    timerElement.textContent = 'TIME UP!';
  }
  
  showTimeUpModal();
}

const timerStyles = `
.timer {
    transition: all 0.3s ease;
    font-weight: var(--font-weight-semibold);
}

.timer.time-warning {
    background: var(--color-warning-light) !important;
    color: var(--color-warning-dark) !important;
    border-color: var(--color-warning) !important;
}

.timer.time-warning.pulse {
    animation: pulse 1s infinite;
}

.timer.time-expired {
    background: var(--color-danger-light) !important;
    color: var(--color-danger) !important;
    border-color: var(--color-danger) !important;
    animation: shake 0.5s ease;
}

.result-icon {
    margin-left: var(--spacing-sm);
    font-size: var(--font-size-sm);
}

.option.correct .result-icon {
    color: var(--color-success);
}

.option.incorrect .result-icon {
    color: var(--color-danger);
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.05);
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.timer-dropdown .dropdown-option[data-value="0"] {
    color: var(--color-text-light);
    font-style: italic;
}

.timer-dropdown .dropdown-option[data-value="0"] .timer-value {
    display: none;
}

.timer-quick-select {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    flex-wrap: wrap;
}

.timer-quick-btn {
    padding: 4px 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    background: var(--color-white);
    color: var(--color-text-light);
    font-size: var(--font-size-xs);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.timer-quick-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.timer-quick-btn.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.loading .fa-spinner {
    margin-right: var(--spacing-sm);
}

.error .fa-exclamation-triangle {
    margin-right: var(--spacing-sm);
    color: var(--color-warning);
}
`;

function initializeAllDropdowns() {
  initializeCustomDropdown();
  initializeTimerDropdown();
}

const timerStyleSheet = document.createElement('style');
timerStyleSheet.textContent = timerStyles;
document.head.appendChild(timerStyleSheet);

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

function closeAllDropdowns() {
  try {
    const sortDropdown = document.getElementById('sort-dropdown');
    if (sortDropdown) {
      const sortSelected = sortDropdown.querySelector('.dropdown-selected');
      const sortOptions = sortDropdown.querySelector('.dropdown-options');
      
      if (sortSelected && sortSelected.classList.contains('active')) {
        sortSelected.classList.remove('active');
      }
      if (sortOptions && sortOptions.classList.contains('show')) {
        sortOptions.classList.remove('show');
      }
    }
    
    const timerDropdown = document.getElementById('timer-dropdown');
    if (timerDropdown) {
      const timerSelected = timerDropdown.querySelector('.dropdown-selected');
      const timerOptions = timerDropdown.querySelector('.dropdown-options');
      
      if (timerSelected && timerSelected.classList.contains('active')) {
        timerSelected.classList.remove('active');
      }
      if (timerOptions && timerOptions.classList.contains('show')) {
        timerOptions.classList.remove('show');
      }
    }
    
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
      const selected = dropdown.querySelector('.dropdown-selected');
      const options = dropdown.querySelector('.dropdown-options');
      
      if (selected && selected.classList.contains('active')) {
        selected.classList.remove('active');
      }
      if (options && options.classList.contains('show')) {
        options.classList.remove('show');
      }
    });
    
  } catch (error) {
    console.warn('Error closing dropdowns:', error);
  }
}

document.addEventListener('click', function(event) {
  if (!event.target.closest('.custom-dropdown')) {
    closeAllDropdowns();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeAllDropdowns();
  }
});

window.addEventListener('blur', function() {
  closeAllDropdowns();
});

document.addEventListener('touchstart', function(event) {
  if (!event.target.closest('.custom-dropdown')) {
    closeAllDropdowns();
  }
});

function initializeTimerDropdown() {
  const dropdown = document.getElementById('timer-dropdown');
  if (!dropdown) return;
  
  const selected = dropdown.querySelector('.dropdown-selected');
  const options = dropdown.querySelector('.dropdown-options');
  const selectedText = document.getElementById('selected-timer');
  const optionElements = dropdown.querySelectorAll('.dropdown-option');
  
  selected.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = selected.classList.contains('active');
    
    closeAllDropdowns();
    
    if (!isActive) {
      selected.classList.add('active');
      options.classList.add('show');
    } else {
      closeTimerDropdown();
    }
  });
  
  optionElements.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = parseInt(option.getAttribute('data-value'));
      const text = option.textContent;
      
      selectedText.textContent = text;
      
      optionElements.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      closeTimerDropdown();
    });
  });
  
  function closeTimerDropdown() {
    selected.classList.remove('active');
    options.classList.remove('show');
  }
  
  const initialOption = dropdown.querySelector('[data-value="1200"]');
  if (initialOption) {
    selectedText.textContent = initialOption.textContent;
    optionElements.forEach(opt => opt.classList.remove('selected'));
    initialOption.classList.add('selected');
  }
}

function getCurrentTimerSetting() {
  const timerDropdown = document.getElementById('timer-dropdown');
  if (timerDropdown) {
    const selectedOption = timerDropdown.querySelector('.dropdown-option.selected');
    return selectedOption ? parseInt(selectedOption.getAttribute('data-value')) : 1200;
  }
  return 1200;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  isMarkingPhase = false;
  markingIndex = 0;
  selectedTopics.clear();
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('topic-selection').classList.remove('hidden');
  document.getElementById('navigation').style.display = 'flex';
  
  searchTerm = '';
  sortBy = 'alphabetical';
  const topicSearch = document.getElementById('topic-search');
  if (topicSearch) topicSearch.value = '';
  
  resetTimerDropdown();
  
  initializeAllDropdowns();
  
  initializeTopicSelection();
}

function resetTimerDropdown() {
  const timerDropdown = document.getElementById('timer-dropdown');
  if (timerDropdown) {
    const selectedText = timerDropdown.querySelector('#selected-timer');
    const optionElements = timerDropdown.querySelectorAll('.dropdown-option');
    const defaultOption = timerDropdown.querySelector('[data-value="1200"]');
    
    if (selectedText && defaultOption) {
      selectedText.textContent = defaultOption.textContent;
      optionElements.forEach(opt => opt.classList.remove('selected'));
      defaultOption.classList.add('selected');
    }
  }
}

function debugTimer() {
  const timerSetting = getCurrentTimerSetting();
  console.log('Current timer setting:', timerSetting);
}

function renderTopicsByCategory(filteredTopics, topicsGrid) {
  const categories = getAllCategories();
  
  let hasAnyTopics = false;
  
  categories.forEach(category => {
    const categoryTopics = getTopicsByCategory(category)
      .filter(topicId => filteredTopics.includes(topicId));
    
    if (categoryTopics.length > 0) {
      hasAnyTopics = true;
      const categoryInfo = getCategoryInfo(category);
      
      const selectedInCategory = categoryTopics.filter(topicId =>
        selectedTopics.has(topicId)
      ).length;
      const progressPercent = (selectedInCategory / categoryTopics.length) * 100;
      
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'category-header';
      categoryHeader.setAttribute('data-category', category.toLowerCase().replace(/\s+/g, '-'));
      categoryHeader.innerHTML = `
        <div class="category-title">
          <i class="fas fa-${categoryInfo.icon || 'folder'}"></i> ${categoryInfo.name}
        </div>
        <div class="category-progress">
          <div class="category-progress-bar">
            <div class="category-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <span>${selectedInCategory}/${categoryTopics.length}</span>
        </div>
      `;
      topicsGrid.appendChild(categoryHeader);
      
      categoryTopics.forEach(topicId => {
        const topicElement = createTopicElement(topicId);
        if (topicElement) {
          topicsGrid.appendChild(topicElement);
        }
      });
    }
  });
  
  if (!hasAnyTopics) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <i class="fas fa-search" style="font-size: 2rem; margin-bottom: var(--spacing-md); color: var(--color-text-lighter);"></i>
      <p style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">No topics found</p>
      <p style="color: var(--color-text-light);">Try a different search term or clear your search</p>
    `;
    topicsGrid.appendChild(noResults);
  }
}

function renderTopicsAlphabetically(filteredTopics, topicsGrid) {
  filteredTopics.forEach(topicId => {
    const topicElement = createTopicElement(topicId);
    if (topicElement) {
      topicsGrid.appendChild(topicElement);
    }
  });
}

function createQuestionNavigation() {
  const questionGrid = document.getElementById('question-grid');
  if (!questionGrid) return;
  
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
  button.classList.remove('current', 'answered', 'marked');
  
  if (index === currentQuestionIndex) {
    button.classList.add('current');
  }
  
  if (userAnswers[index] !== null) {
    button.classList.add('answered');
  }
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

function updateStartButton() {
  const startBtn = document.getElementById('start-quiz-btn');
  if (startBtn) {
    startBtn.disabled = selectedTopics.size === 0;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateQuestionCount() {
  const questionCountInput = document.getElementById('question-count');
  if (questionCountInput) {
    let value = parseInt(questionCountInput.value);
    
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    if (value > 200) {
      value = 200;
    }
    
    questionCountInput.value = value;
    questionCount = value;
  }
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
    option.classList.remove('correct', 'incorrect');
    
    const existingIcons = option.querySelectorAll('.result-icon');
    existingIcons.forEach(icon => icon.remove());
    
    if (index === correctAnswer) {
      option.classList.add('correct');
      option.innerHTML += '<span class="result-icon"><i class="fas fa-check-circle"></i></span>';
    } else if (index === userAnswer && userAnswer !== correctAnswer) {
      option.classList.add('incorrect');
      option.innerHTML += '<span class="result-icon"><i class="fas fa-times-circle"></i></span>';
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
  
  if (correctAnswerText) correctAnswerText.innerHTML = question.options[question.correct];
  if (feedbackExplanation) feedbackExplanation.innerHTML = question.explanation;
  
  if (feedbackPanel) feedbackPanel.classList.add('show');
  
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function showTimeUpModal() {
  const modal = document.createElement('div');
  modal.className = 'time-up-modal';
  modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-icon"><i class="fas fa-clock"></i></div>
                <h3>Time's Up!</h3>
                <p>The quiz will now be automatically submitted and graded.</p>
                <button class="btn btn-primary" id="proceed-grading">Proceed to Grading</button>
            </div>
        </div>
    `;
  
  document.body.appendChild(modal);
  
  const modalStyles = `
        .time-up-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-lg);
        }
        
        .modal-content {
            background: var(--bg-primary);
            padding: var(--spacing-3xl);
            border-radius: var(--border-radius-2xl);
            text-align: center;
            max-width: 400px;
            width: 100%;
            box-shadow: var(--shadow-lg);
            animation: slideUp 0.3s ease;
        }
        
        .modal-icon {
            font-size: 3rem;
            margin-bottom: var(--spacing-lg);
            color: var(--color-warning);
            animation: bounce 0.5s ease;
        }
        
        .modal-content h3 {
            color: var(--color-danger);
            margin-bottom: var(--spacing-md);
            font-size: var(--font-size-xl);
        }
        
        .modal-content p {
            color: var(--color-text-light);
            margin-bottom: var(--spacing-xl);
            line-height: 1.5;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
  
  document.getElementById('proceed-grading').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(styleSheet);
    startMarking();
  });
  
  setTimeout(() => {
    if (document.body.contains(modal)) {
      document.body.removeChild(modal);
      document.head.removeChild(styleSheet);
      startMarking();
    }
  }, 5000);
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
      <p><strong>Your Answer:</strong> ${userAnswer !== null ? question.options[userAnswer] : 'Not answered'} ${isCorrect ? '<i class="fas fa-check" style="color: green;"></i>' : '<i class="fas fa-times" style="color: red;"></i>'}</p>
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

// MathJax Integration Functions
function initializeWhenReady() {
  if (mathJaxReady && domContentLoaded && !initializationPending) {
    initializationPending = true;
    
    hideMathJaxOverlay();
    initializeApp();
  }
}

function configureMathJax() {
  if (window.MathJax) {
    console.log('MathJax already loaded, configuring...');
    window.MathJax = {
      startup: {
        pageReady: () => {
          console.log('MathJax startup complete');
          mathJaxReady = true;
          if (window.onMathJaxReady) {
            window.onMathJaxReady();
          }
          initializeWhenReady();
          return window.MathJax.startup.defaultPageReady();
        }
      },
      tex: {
        inlineMath: [
          ['\\(', '\\)']
        ],
        displayMath: [
          ['\\[', '\\]']
        ],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
        renderActions: {
          addMenu: [0, '', '']
        }
      },
      // Add error handling
      loader: {
        load: ['[tex]/ams'],
        source: {
          '[tex]/ams': 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-ams.js'
        }
      }
    };
  } else {
    console.warn('MathJax not found, loading dynamically...');
    loadMathJaxDynamically();
  }
}

function loadMathJaxDynamically() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.id = 'MathJax-script';
  script.async = true;
  
  script.onload = () => {
    console.log('MathJax dynamically loaded');
    // Reconfigure after dynamic load
    configureMathJax();
  };
  
  script.onerror = () => {
    console.error('Failed to load MathJax dynamically');
    mathJaxReady = true; // Proceed without MathJax
    initializeWhenReady();
  };
  
  document.head.appendChild(script);
}

function waitForMathJax() {
  return new Promise((resolve) => {
    if (window.MathJax && mathJaxReady) {
      console.log('MathJax already loaded and ready');
      hideMathJaxOverlay(); // Hide overlay if already ready
      resolve();
      return;
    }
    
    // Show loading overlay when waiting for MathJax
    const overlay = createLoadingOverlay();
    
    // Check if MathJax is already in the process of loading
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
      console.log('MathJax startup promise found, waiting...');
      window.MathJax.startup.promise
        .then(() => {
          console.log('MathJax startup promise resolved');
          mathJaxReady = true;
          hideMathJaxOverlay();
          resolve();
        })
        .catch(error => {
          console.warn('MathJax startup promise rejected:', error);
          mathJaxReady = true; // Proceed without MathJax
          hideMathJaxOverlay();
          resolve();
        });
    } else if (window.MathJax && window.MathJax.typesetPromise) {
      // MathJax is loaded but startup might be complete
      console.log('MathJax typesetPromise available');
      mathJaxReady = true;
      hideMathJaxOverlay();
      resolve();
    } else {
      // MathJax not loaded yet, set up polling
      console.log('Setting up MathJax polling');
      let attempts = 0;
      const maxAttempts = 30; // 15 seconds max
      
      const checkMathJax = () => {
        attempts++;
        
        if (window.MathJax && (window.MathJax.typesetPromise || window.MathJax.typeset)) {
          console.log(`MathJax ready after ${attempts} attempts`);
          mathJaxReady = true;
          hideMathJaxOverlay();
          resolve();
          return;
        }
        
        if (attempts >= maxAttempts) {
          console.warn('MathJax loading timeout - proceeding without it');
          mathJaxReady = true; // Proceed without MathJax
          hideMathJaxOverlay();
          showFallbackWarning();
          resolve();
          return;
        }
        
        setTimeout(checkMathJax, 500);
      };
      
      checkMathJax();
    }
  });
}

function displayQuestion() {
  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    console.error('No questions available to display');
    hideMathJaxOverlay(); // Ensure overlay is hidden on error
    return;
  }
  
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
    
    if (!isMarkingPhase) {
      optionDiv.onclick = () => selectOption(index);
    }
    
    if (userAnswers[currentQuestionIndex] === index) {
      optionDiv.classList.add('selected');
    }
    
    optionsContainer.appendChild(optionDiv);
  });
  
  updateNavigation();
  updateQuestionNavigation();
  
  // Show loading state while rendering MathJax
  const questionContainer = document.getElementById('question-container');
  if (questionContainer) {
    questionContainer.classList.add('mathjax-loading');
  }
  
  safeRenderMathJax().then(() => {
    console.log('Question displayed with MathJax or fallback');
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
      questionContainer.classList.remove('mathjax-loading');
      questionContainer.style.visibility = 'visible';
    }
  }).catch(error => {
    console.error('Error in displayQuestion MathJax:', error);
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
      questionContainer.classList.remove('mathjax-loading');
      questionContainer.style.visibility = 'visible';
    }
  });
}

function initializeApp() {
  console.log('Initializing app with MathJax ready:', mathJaxReady);
  
  const topicSelection = document.getElementById('topic-selection');
  const questionContainer = document.getElementById('question-container');
  
  if (topicSelection) topicSelection.style.visibility = 'hidden';
  if (questionContainer) questionContainer.style.visibility = 'hidden';
  
  setupSearch();
  initializeTopicSelection();
  
  updateQuestionCount();
  
  const questionCountInput = document.getElementById('question-count');
  if (questionCountInput) {
    questionCountInput.addEventListener('input', updateQuestionCount);
    questionCountInput.addEventListener('change', updateQuestionCount);
  }
  
  const startQuizBtn = document.getElementById('start-quiz-btn');
  if (startQuizBtn) startQuizBtn.addEventListener('click', startQuiz);
  
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
  
  const prevBtn = document.getElementById('prev-btn');
  if (prevBtn) prevBtn.addEventListener('click', previousQuestion);
  
  const continueBtn = document.getElementById('continue-btn');
  if (continueBtn) continueBtn.addEventListener('click', closeFeedback);
  
  const tryAgainBtn = document.getElementById('try-again-btn');
  if (tryAgainBtn) tryAgainBtn.addEventListener('click', restartQuiz);
  
  const printBtn = document.getElementById('print-btn');
  if (printBtn) printBtn.addEventListener('click', printResults);
  
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  if (navToggleBtn) navToggleBtn.addEventListener('click', toggleQuestionNav);
  
  const closeNavPanel = document.getElementById('close-nav-panel');
  if (closeNavPanel) closeNavPanel.addEventListener('click', closeQuestionNav);
  
  if (questionCountInput) {
    questionCountInput.addEventListener('change', function() {
      updateQuestionCount();
      const value = parseInt(this.value);
      if (value < 1) this.value = 1;
      if (value > 200) this.value = 200;
    });
  }
  
  setTimeout(() => {
    if (topicSelection) {
      topicSelection.classList.remove('hidden');
      topicSelection.style.visibility = 'visible';
    }
    console.log('App initialization complete');
  }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
  domContentLoaded = true;
  
  configureMathJax();
  
  waitForMathJax().then(() => {
    initializeWhenReady();
  });
});

const loadingStyles = `
#topic-selection,
#question-container {
  visibility: hidden;
}

.mathjax-loading {
  opacity: 0.7;
  pointer-events: none;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
}

.loading-overlay.hidden {
  display: none;
}

.loading-spinner {
  margin-bottom: var(--spacing-lg);
  font-size: 2rem;
  color: var(--color-primary);
}

.topic-description mjx-container,
.topic-title mjx-container {
  display: inline-block;
  vertical-align: middle;
}

.topic-description mjx-container {
  font-size: 0.9em;
}

.topic-item {
  position: relative;
}

.topic-content mjx-container {
  line-height: 1.3;
}
`;

const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet);

function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div>Loading MathJax...</div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function initializeTopicSelection() {
  const topicsGrid = document.getElementById('topics-grid');
  
  if (!topicsGrid) {
    console.error('Topics grid element not found');
    hideMathJaxOverlay(); // Ensure overlay is hidden on error
    return;
  }
  
  topicsGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading topics...</div>';
  
  setTimeout(() => {
    try {
      const filteredTopics = getFilteredAndSortedTopics();
      
      if (filteredTopics.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
          <i class="fas fa-search" style="font-size: 2rem; margin-bottom: var(--spacing-md); color: var(--color-text-lighter);"></i>
          <p style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">No topics found</p>
          <p style="color: var(--color-text-light);">Try a different search term or clear your search</p>
        `;
        topicsGrid.innerHTML = '';
        topicsGrid.appendChild(noResults);
        hideMathJaxOverlay(); // Hide overlay for no results
        return;
      }
      
      topicsGrid.innerHTML = '';
      if (sortBy === 'category') {
        renderTopicsByCategory(filteredTopics, topicsGrid);
      } else {
        renderTopicsAlphabetically(filteredTopics, topicsGrid);
      }
      
      updateStartButton();
      
      const topicItems = topicsGrid.querySelectorAll('.topic-item');
      topicItems.forEach((item, index) => {
        if (item && item.style) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 50);
        }
      });
      
      // Render MathJax and hide overlay when complete
      safeRenderMathJax().then(() => {
        console.log('Topic selection MathJax complete');
      });
      
    } catch (error) {
      console.error('Error initializing topic selection:', error);
      topicsGrid.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> Error loading topics. Please refresh the page.</div>';
      hideMathJaxOverlay(); // Hide overlay on error
    }
  }, 100);
}

function renderMathJaxInTopics() {
  if (!window.MathJax || !mathJaxReady) {
    console.log('MathJax not ready for topic descriptions');
    return;
  }
  
  setTimeout(() => {
    const topicDescriptions = document.querySelectorAll('.topic-description');
    const topicTitles = document.querySelectorAll('.topic-title');
    
    const mathElements = [];
    
    topicDescriptions.forEach(desc => {
      if (desc.innerHTML && containsMath(desc.innerHTML)) {
        mathElements.push(desc);
      }
    });
    
    topicTitles.forEach(title => {
      if (title.innerHTML && containsMath(title.innerHTML)) {
        mathElements.push(title);
      }
    });
    
    if (mathElements.length > 0) {
      console.log(`Rendering MathJax for ${mathElements.length} topic elements`);
      
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise(mathElements)
          .then(() => {
            console.log('MathJax rendered in topic descriptions');
          })
          .catch(error => {
            console.warn('Error rendering MathJax in topics:', error);
          });
      } else if (window.MathJax.typeset) {
        window.MathJax.typeset(mathElements);
      }
    }
  }, 200);
}

function containsMath(text) {
  if (!text) return false;
  
  const mathPatterns = [
    /\\\(.*?\\\)/g,
    /\\\[.*?\\\]/g,
    /\$.*?\$/g,
    /\\begin\{.*?\}.*?\\end\{.*?\}/g,
    /\\[a-zA-Z]+\{/g
  ];
  
  return mathPatterns.some(pattern => pattern.test(text));
}

function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text;
  
  try {
    const mathRegex = /\\\(.*?\\\)|\\\[.*?\\\]|\$.*?\$|\\begin\{.*?\}.*?\\end\{.*?\}|\\[a-zA-Z]+\{.*?\}/g;
    const mathParts = [];
    let mathIndex = 0;
    
    const textWithPlaceholders = text.replace(mathRegex, (match) => {
      const placeholder = `__MATH_${mathIndex}__`;
      mathParts.push(match);
      mathIndex++;
      return placeholder;
    });
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const highlightedText = textWithPlaceholders.replace(regex, '<mark>$1</mark>');
    
    const finalText = highlightedText.replace(/__MATH_(\d+)__/g, (match, index) => {
      return mathParts[parseInt(index)] || match;
    });
    
    return finalText;
  } catch (e) {
    console.warn('Error highlighting text:', e);
    return text;
  }
}

function createTopicElement(topicId) {
  const topic = getTopicInf(topicId);
  if (!topic) return null;
  
  const category = getCategoryForTop(topicId);
  
  const topicItem = document.createElement('div');
  topicItem.className = 'topic-item';
  topicItem.setAttribute('data-category', category);
  topicItem.setAttribute('data-topic-id', topicId);
  
  if (selectedTopics.has(topicId)) {
    topicItem.classList.add('selected');
  }
  topicItem.onclick = () => toggleTopic(topicId, topicItem);
  
  const highlightedTitle = highlightText(topic.title, searchTerm);
  const highlightedDescription = highlightText(topic.description, searchTerm);
  
  topicItem.innerHTML = `
    <div class="topic-checkbox ${selectedTopics.has(topicId) ? 'checked' : ''}"></div>
    <div class="topic-content">
      <span class="topic-title">${highlightedTitle}</span>
      <span class="topic-description">${highlightedDescription}</span>
      <span class="topic-category" data-category="${category}">${category}</span>
    </div>
  `;
  
  return topicItem;
}

function renderMathJax() {
  if (!window.MathJax || !mathJaxReady) {
    console.log('MathJax not available, skipping rendering');
    return Promise.resolve();
  }
  
  return new Promise((resolve) => {
    const renderWithRetry = (retryCount = 0) => {
      const maxRetries = 2;
      
      try {
        const elements = [
          document.getElementById('question-text'),
          document.getElementById('options'),
          document.getElementById('correct-answer-text'),
          document.getElementById('feedback-explanation')
        ].filter(el => el && el.innerHTML);
        
        const topicDescriptions = document.querySelectorAll('.topic-description');
        const topicTitles = document.querySelectorAll('.topic-title');
        
        const allMathElements = [...elements, ...topicDescriptions, ...topicTitles];
        
        if (allMathElements.length === 0) {
          resolve();
          return;
        }
        
        console.log(`Rendering MathJax for ${allMathElements.length} elements, attempt ${retryCount + 1}`);
        
        if (window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise(allMathElements)
            .then(() => {
              console.log('MathJax rendering complete');
              resolve();
            })
            .catch(error => {
              console.warn(`MathJax typeset error (attempt ${retryCount + 1}):`, error);
              if (retryCount < maxRetries) {
                console.log(`Retrying MathJax rendering... (${retryCount + 1}/${maxRetries})`);
                setTimeout(() => renderWithRetry(retryCount + 1), 500);
              } else {
                console.warn('Max retries reached, proceeding without MathJax');
                resolve();
              }
            });
        } else if (window.MathJax.typeset) {
          window.MathJax.typeset(allMathElements);
          resolve();
        } else {
          resolve();
        }
      } catch (error) {
        console.error('Unexpected error in renderMathJax:', error);
        resolve();
      }
    };
    
    // Small delay to ensure DOM is updated
    setTimeout(() => renderWithRetry(), 100);
  });
}

const originalSetupSearch = setupSearch;
setupSearch = function() {
  originalSetupSearch.apply(this, arguments);
  
  const topicSearch = document.getElementById('topic-search');
  const clearSearch = document.getElementById('clear-search');
  
  if (topicSearch) {
    let searchTimeout;
    topicSearch.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchTerm = this.value;
        initializeTopicSelection();
        
        setTimeout(() => {
          if (window.MathJax && mathJaxReady) {
            renderMathJaxInTopics();
          }
        }, 400);
      }, 300);
    });
  }
};

const originalInitializeCustomDropdown = initializeCustomDropdown;
initializeCustomDropdown = function() {
  originalInitializeCustomDropdown.apply(this, arguments);
  
  const dropdown = document.getElementById('sort-dropdown');
  if (!dropdown) return;
  
  const optionElements = dropdown.querySelectorAll('.dropdown-option');
  
  optionElements.forEach(option => {
    const originalClick = option.onclick;
    option.onclick = function(e) {
      if (originalClick) originalClick.call(this, e);
      
      setTimeout(() => {
        if (window.MathJax && mathJaxReady) {
          renderMathJaxInTopics();
        }
      }, 400);
    };
  });
};

function createLoadingOverlay() {
  const existingOverlay = document.querySelector('.loading-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div>Loading MathJax...</div>
    <div class="loading-progress" style="margin-top: 10px; font-size: 0.8em;">
      If this takes too long, <button onclick="skipMathJax()" style="background: none; border: none; color: #007bff; cursor: pointer; text-decoration: underline;">skip math rendering</button>
    </div>
  `;
  document.body.appendChild(overlay);
  
  // Auto-hide timeout as backup
  overlay.autoHideTimeout = setTimeout(() => {
    if (document.body.contains(overlay)) {
      console.log('Auto-hiding MathJax overlay after timeout');
      hideMathJaxOverlay();
    }
  }, 10000); // 10 second timeout
  
  return overlay;
}

function hideMathJaxOverlay() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    // Clear the auto-hide timeout if it exists
    if (overlay.autoHideTimeout) {
      clearTimeout(overlay.autoHideTimeout);
    }
    
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        overlay.remove();
      }
    }, 300);
  }
}

function skipMathJax() {
  console.log('User skipped MathJax loading');
  mathJaxReady = true;
  
  // Immediately apply fallback to all visible math elements
  applyMathFallbackToAll();
  
  hideMathJaxOverlay();
  initializeApp();
}

function applyMathFallbackToAll() {
  console.log('Applying math fallback to all elements');
  
  // Apply fallback to question elements if they exist
  const mathElements = [
    document.getElementById('question-text'),
    document.getElementById('options'),
    document.getElementById('correct-answer-text'),
    document.getElementById('feedback-explanation')
  ].filter(el => el);
  
  mathElements.forEach(displayMathFallback);
  
  // Apply fallback to topic elements
  const topicElements = document.querySelectorAll('.topic-description, .topic-title');
  topicElements.forEach(displayMathFallback);
  
  console.log(`Applied fallback to ${mathElements.length + topicElements.length} elements`);
}


function safeRenderMathJax() {
  const overlay = document.querySelector('.loading-overlay');
  
  // If user explicitly skipped, immediately use fallback
  if (window.mathJaxSkipped) {
    applyMathFallbackToAll();
    hideMathJaxOverlay();
    return Promise.resolve();
  }
  
  return renderMathJax()
    .then(() => {
      console.log('MathJax rendering completed successfully');
      hideMathJaxOverlay();
      
      // Double-check if any LaTeX remains and apply fallback if needed
      setTimeout(() => checkForRemainingLatex(), 1000);
    })
    .catch(error => {
      console.error('MathJax rendering failed, using fallback:', error);
      applyMathFallbackToAll();
      hideMathJaxOverlay();
    });
}

function checkForRemainingLatex() {
  // Check if there's still LaTeX code visible in key elements
  const elementsToCheck = [
    document.getElementById('question-text'),
    document.getElementById('options'),
    ...document.querySelectorAll('.topic-description, .topic-title')
  ].filter(el => el);
  
  let hasRemainingLatex = false;
  
  elementsToCheck.forEach(element => {
    if (containsLaTeX(element.innerHTML)) {
      console.log('Found remaining LaTeX after MathJax render, applying fallback');
      displayMathFallback(element);
      hasRemainingLatex = true;
    }
  });
  
  if (hasRemainingLatex) {
    showFallbackWarning();
  }
}

function containsLaTeX(text) {
  if (!text) return false;
  
  const latexPatterns = [
    /\\\(/,
    /\\\)/,
    /\\\[/,
    /\\\]/,
    /\$\$/,
    /\\frac\{/,
    /\\sqrt\{/,
    /\\[a-zA-Z]+\{/
  ];
  
  return latexPatterns.some(pattern => pattern.test(text));
}

function skipMathJax() {
  console.log('User skipped MathJax loading');
  mathJaxReady = true;
  window.mathJaxSkipped = true; // Global flag
  
  // Immediately apply fallback to all visible math elements
  applyMathFallbackToAll();
  
  hideMathJaxOverlay();
  initializeApp();
}

const originalDisplayQuestion = displayQuestion;
displayQuestion = function() {
  const questionContainer = document.getElementById('question-container');
  if (questionContainer) {
    questionContainer.classList.add('mathjax-loading');
  }
  
  originalDisplayQuestion.apply(this, arguments);
  
  // If MathJax was skipped, immediately apply fallback
  if (window.mathJaxSkipped) {
    setTimeout(() => {
      const questionText = document.getElementById('question-text');
      const options = document.getElementById('options');
      if (questionText) displayMathFallback(questionText);
      if (options) {
        const optionElements = options.querySelectorAll('.option');
        optionElements.forEach(displayMathFallback);
      }
    }, 100);
  }
};

const originalInitializeTopicSelection = initializeTopicSelection;
initializeTopicSelection = function() {
  originalInitializeTopicSelection.apply(this, arguments);
  
  // If MathJax was skipped, immediately apply fallback to topics
  if (window.mathJaxSkipped) {
    setTimeout(() => {
      const topicDescriptions = document.querySelectorAll('.topic-description');
      const topicTitles = document.querySelectorAll('.topic-title');
      topicDescriptions.forEach(displayMathFallback);
      topicTitles.forEach(displayMathFallback);
    }, 200);
  }
};

function displayMathFallback(element) {
  if (!element || !element.innerHTML) return;
  
  let content = element.innerHTML;
  
  const replacements = [
  // Remove LaTeX delimiters
  [/\\\(/g, '('],
  [/\\\)/g, ')'],
  [/\\\[/g, ''],
  [/\\\]/g, ''],
  
  // Remove dollar sign delimiters
  [/\$\$(.*?)\$\$/g, '$1'],
  [/\$(.*?)\$/g, '$1'],
  
  // Fractions
  [/\\frac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)'],
  [/\\dfrac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)'],
  [/\\tfrac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)'],
  
  // Roots
  [/\\sqrt\{(.*?)\}/g, '√($1)'],
  [/\\sqrt\[(.*?)\]\{(.*?)\}/g, '√[$1]($2)'],
  
  // Greek letters
  [/\\pi/g, 'π'],
  [/\\theta/g, 'θ'],
  [/\\alpha/g, 'α'],
  [/\\beta/g, 'β'],
  [/\\gamma/g, 'γ'],
  [/\\Delta/g, 'Δ'],
  [/\\delta/g, 'δ'],
  [/\\epsilon/g, 'ε'],
  [/\\zeta/g, 'ζ'],
  [/\\eta/g, 'η'],
  [/\\iota/g, 'ι'],
  [/\\kappa/g, 'κ'],
  [/\\lambda/g, 'λ'],
  [/\\mu/g, 'μ'],
  [/\\nu/g, 'ν'],
  [/\\xi/g, 'ξ'],
  [/\\rho/g, 'ρ'],
  [/\\sigma/g, 'σ'],
  [/\\tau/g, 'τ'],
  [/\\phi/g, 'φ'],
  [/\\chi/g, 'χ'],
  [/\\psi/g, 'ψ'],
  [/\\omega/g, 'ω'],
  
  // Math operators
  [/\\times/g, '×'],
  [/\\div/g, '÷'],
  [/\\cdot/g, '·'],
  [/\\pm/g, '±'],
  [/\\mp/g, '∓'],
  
  // Relations
  [/\\leq/g, '≤'],
  [/\\geq/g, '≥'],
  [/\\neq/g, '≠'],
  [/\\approx/g, '≈'],
  [/\\equiv/g, '≡'],
  [/\\propto/g, '∝'],
  [/\\sim/g, '∼'],
  
  // Sets
  [/\\in/g, '∈'],
  [/\\notin/g, '∉'],
  [/\\subset/g, '⊂'],
  [/\\subseteq/g, '⊆'],
  [/\\supset/g, '⊃'],
  [/\\supseteq/g, '⊇'],
  [/\\cup/g, '∪'],
  [/\\cap/g, '∩'],
  [/\\emptyset/g, '∅'],
  
  // Arrows
  [/\\to/g, '→'],
  [/\\rightarrow/g, '→'],
  [/\\leftarrow/g, '←'],
  [/\\Rightarrow/g, '⇒'],
  [/\\Leftarrow/g, '⇐'],
  [/\\leftrightarrow/g, '↔'],
  
  // Calculus
  [/\\int/g, '∫'],
  [/\\sum/g, '∑'],
  [/\\prod/g, '∏'],
  [/\\lim/g, 'lim'],
  [/\\partial/g, '∂'],
  [/\\nabla/g, '∇'],
  
  // Logic
  [/\\forall/g, '∀'],
  [/\\exists/g, '∃'],
  [/\\land/g, '∧'],
  [/\\lor/g, '∨'],
  [/\\neg/g, '¬'],
  [/\\implies/g, '⇒'],
  
  // Other symbols
  [/\\infty/g, '∞'],
  [/\\angle/g, '∠'],
  [/\\triangle/g, '△'],
  [/\\circ/g, '°'],
  [/\\degree/g, '°'],
  [/\\prime/g, "'"],
  [/\\ell/g, 'ℓ'],
  
  // Text formatting
  [/\\text\{(.*?)\}/g, '$1'],
  [/\\textbf\{(.*?)\}/g, '<strong>$1</strong>'],
  [/\\textit\{(.*?)\}/g, '<em>$1</em>'],
  
  // Spaces
  [/\\,/g, ' '],
  [/\\;/g, '  '],
  [/\\quad/g, '    '],
  [/\\qquad/g, '        '],
  
  // Remove other LaTeX commands but keep their content
  [/\\[a-zA-Z]+\{(.*?)\}/g, '$1'],
  
  // Remove standalone LaTeX commands without content
  [/\\[a-zA-Z]+/g, ''],
  
  // Clean up extra spaces
  [/\s+/g, ' '],
  [/\(\s+/g, '('],
  [/\s+\)/g, ')']
];
  
  try {
    // Process multiple times to handle nested commands
    let previousContent;
    let iterations = 0;
    const maxIterations = 5;
    
    do {
      previousContent = content;
      iterations++;
      
      replacements.forEach(([pattern, replacement]) => {
        content = content.replace(pattern, replacement);
      });
      
      // Stop if no more changes or too many iterations
      if (content === previousContent || iterations >= maxIterations) {
        break;
      }
    } while (true);
    
    // Final cleanup
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .trim();
    
    element.innerHTML = content;
    
  } catch (error) {
    console.warn('Error applying MathJax fallback:', error);
    // Basic cleanup as last resort
    element.innerHTML = element.innerHTML
      .replace(/\\[a-zA-Z]+\{.*?\}/g, '')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\[/g, '')
      .replace(/\\\]/g, '')
      .replace(/\$\$(.*?)\$\$/g, '$1')
      .replace(/\$(.*?)\$/g, '$1');
  }
}

function safeRenderMathJax() {
  const overlay = document.querySelector('.loading-overlay');
  
  return renderMathJax()
    .then(() => {
      console.log('MathJax rendering completed successfully');
      hideMathJaxOverlay();
    })
    .catch(error => {
      console.error('MathJax rendering failed, using fallback:', error);
      
      // Apply fallback to all math elements
      const mathElements = [
        document.getElementById('question-text'),
        document.getElementById('options'),
        document.getElementById('correct-answer-text'),
        document.getElementById('feedback-explanation')
      ].filter(el => el);
      
      mathElements.forEach(displayMathFallback);
      
      const topicElements = document.querySelectorAll('.topic-description, .topic-title');
      topicElements.forEach(displayMathFallback);
      
      // Show fallback warning but still hide overlay
      showFallbackWarning();
      hideMathJaxOverlay();
    });
}

function showFallbackWarning() {
  // Remove existing warning
  const existingWarning = document.querySelector('.mathjax-fallback-warning');
  if (existingWarning) {
    existingWarning.remove();
  }
  
  const warning = document.createElement('div');
  warning.className = 'mathjax-fallback-warning';
  warning.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    Math rendering simplified. Some equations may not display perfectly. Try reloading to fix this problem.
  `;
  
  // Insert at the top of the main content
  const mainContent = document.querySelector('.container') || document.body;
  mainContent.insertBefore(warning, mainContent.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(warning)) {
      warning.style.opacity = '0';
      warning.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        if (document.body.contains(warning)) {
          warning.remove();
        }
      }, 500);
    }
  }, 5000);
}