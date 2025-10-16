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
  const allTopics = getAllTopics(); // Changed from getAllQuizTopics()
  
  let filteredTopics = allTopics.filter(topicId => {
    const topic = getTopicInf(topicId); // Changed from getTopicInfo()
    return topic && (
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  if (sortBy === 'alphabetical') {
    filteredTopics.sort((a, b) => {
      const topicA = getTopicInf(a); // Changed from getTopicInfo()
      const topicB = getTopicInf(b); // Changed from getTopicInfo()
      return topicA.title.localeCompare(topicB.title);
    });
  } else if (sortBy === 'category') {
    const categories = getAllCats(); // Changed from getAllCategories()
    const categorizedTopics = {};
    
    categories.forEach(category => {
      categorizedTopics[category] = getTopicsByCat(category) // Changed from getTopicsByCategory()
        .filter(topicId => filteredTopics.includes(topicId))
        .sort((a, b) => {
          const topicA = getTopicInf(a); // Changed from getTopicInfo()
          const topicB = getTopicInf(b); // Changed from getTopicInfo()
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
    const topic = getTopicInf(topicId); // Changed from getTopicInfo()
    if (topic && topic.generator) {
      totalAvailableQuestions += 10;
    }
  });
  
  if (totalAvailableQuestions < questionCount) {
    alert(`Not enough questions available. Maximum available: ${totalAvailableQuestions}`);
    return;
  }
  
  selectedTopicsArray.forEach((topicId, index) => {
    const topic = getTopicInf(topicId); // Changed from getTopicInfo()
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
    title: `Custom Quiz (${Array.from(selectedTopics).map(id => getTopicInf(id).title).join(', ')})`, // Changed from getTopicInfo()
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
  
  // Fix: Don't start timer if timer setting is 0
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
  
  // Fix: Handle timer display when no timer is set
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
      // Change to submit icon and styling
      nextBtn.innerHTML = '<i class="fas fa-check"></i>';
      nextBtn.className = 'btn btn-success';
      nextBtn.title = 'Submit Quiz';
    } else {
      // Change to next arrow icon and default styling
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
      
      // Calculate completion progress for this category
      const selectedInCategory = categoryTopics.filter(topicId =>
        selectedTopics.has(topicId)
      ).length;
      const progressPercent = (selectedInCategory / categoryTopics.length) * 100;
      
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'category-header';
      categoryHeader.setAttribute('data-category', category.toLowerCase().replace(/\s+/g, '-')); // Convert to lowercase with dashes
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
    const topic = getTopicInfo(topicId);
    if (topic && topic.generator) {
      totalAvailableQuestions += 10; //
    }
  });
  
  if (totalAvailableQuestions < questionCount) {
    alert(`Not enough questions available. Maximum available: ${totalAvailableQuestions}`);
    return;
  }
  
  selectedTopicsArray.forEach((topicId, index) => {
    const topic = getTopicInfo(topicId);
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
    title: `Custom Quiz (${Array.from(selectedTopics).map(id => getTopicInfo(id).title).join(', ')})`,
    questions: shuffledQuestions,
    settings: {
      questionCount: shuffledQuestions.length, // Use actual count
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
  
  // Fix: Initialize timer properly
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
    
    // Fix: Clear previous result icons
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
  
  // Fix: Properly handle the case where user didn't answer
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


let mathJaxReady = false;
let domContentLoaded = false;
let initializationPending = false;

function initializeWhenReady() {
  if (mathJaxReady && domContentLoaded && !initializationPending) {
    initializationPending = true;
    initializeApp();
  }
}

function configureMathJax() {
  if (window.MathJax) {
    window.MathJax = {
      startup: {
        pageReady: () => {
          console.log('MathJax is ready');
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
      }
    };
  } else {
    // If MathJax isn't available, proceed after a timeout
    console.warn('MathJax not found, proceeding without it');
    setTimeout(() => {
      mathJaxReady = true;
      initializeWhenReady();
    }, 1000);
  }
}

function waitForMathJax() {
  return new Promise((resolve) => {
    if (window.MathJax && mathJaxReady) {
      console.log('MathJax already loaded and ready');
      resolve();
      return;
    }
    
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
      window.MathJax.startup.promise.then(() => {
        mathJaxReady = true;
        resolve();
      }).catch(error => {
        console.warn('MathJax startup error:', error);
        mathJaxReady = true; // Proceed anyway
        resolve();
      });
    } else {
      // Set up a listener for when MathJax is ready
      window.onMathJaxReady = () => {
        mathJaxReady = true;
        resolve();
      };
      
      // Fallback: check every 500ms
      const checkInterval = setInterval(() => {
        if (window.MathJax && (window.MathJax.typesetPromise || window.MathJax.typeset)) {
          clearInterval(checkInterval);
          mathJaxReady = true;
          resolve();
        }
      }, 500);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('MathJax loading timeout - proceeding without it');
        mathJaxReady = true;
        resolve();
      }, 10000);
    }
  });
}

function displayQuestion() {
  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    console.error('No questions available to display');
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
  
  // Render MathJax and show content only when ready
  renderMathJax().then(() => {
    console.log('Question displayed with MathJax');
    // Ensure the question container is visible after MathJax renders
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
      questionContainer.style.visibility = 'visible';
    }
  }).catch(error => {
    console.error('Error rendering MathJax:', error);
    // Still show the content even if MathJax fails
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
      questionContainer.style.visibility = 'visible';
    }
  });
}

function initializeApp() {
  console.log('Initializing app with MathJax ready:', mathJaxReady);
  
  // Hide content initially
  const topicSelection = document.getElementById('topic-selection');
  const questionContainer = document.getElementById('question-container');
  
  if (topicSelection) topicSelection.style.visibility = 'hidden';
  if (questionContainer) questionContainer.style.visibility = 'hidden';
  
  setupSearch();
  initializeTopicSelection();
  
  // Fix: Initialize question count properly
  updateQuestionCount();
  
  // Add event listeners for input changes
  const questionCountInput = document.getElementById('question-count');
  if (questionCountInput) {
    questionCountInput.addEventListener('input', updateQuestionCount);
    questionCountInput.addEventListener('change', updateQuestionCount);
  }
  
  // Set up all other event listeners
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
  
  // Update the validation to use the new function
  if (questionCountInput) {
    questionCountInput.addEventListener('change', function() {
      updateQuestionCount();
      const value = parseInt(this.value);
      if (value < 1) this.value = 1;
      if (value > 200) this.value = 200;
    });
  }
  
  // Now show the topic selection after everything is initialized
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
  
  // Configure MathJax first
  configureMathJax();
  
  // Then wait for MathJax to be ready before initializing the app
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

const originalDisplayQuestion = displayQuestion;
displayQuestion = function() {
  // Add loading class during MathJax rendering
  const questionContainer = document.getElementById('question-container');
  if (questionContainer) {
    questionContainer.classList.add('mathjax-loading');
  }
  
  originalDisplayQuestion.apply(this, arguments);
};

const originalInitializeTopicSelection = initializeTopicSelection;
initializeTopicSelection = function() {
  originalInitializeTopicSelection.apply(this, arguments);
  
  // After topics are rendered, process any MathJax in topic descriptions
  setTimeout(() => {
    if (window.MathJax && mathJaxReady) {
      const topicDescriptions = document.querySelectorAll('.topic-description');
      if (topicDescriptions.length > 0) {
        renderMathJax();
      }
    }
  }, 500);
};




function initializeTopicSelection() {
  const topicsGrid = document.getElementById('topics-grid');
  
  if (!topicsGrid) {
    console.error('Topics grid element not found');
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
        return;
      }
      
      topicsGrid.innerHTML = '';
      if (sortBy === 'category') {
        renderTopicsByCategory(filteredTopics, topicsGrid);
      } else {
        renderTopicsAlphabetically(filteredTopics, topicsGrid);
      }
      
      updateStartButton();
      
      // Fix: Add animation with error handling
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
      
      // NEW: Render MathJax in topic descriptions after they're created
      renderMathJaxInTopics();
      
    } catch (error) {
      console.error('Error initializing topic selection:', error);
      topicsGrid.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> Error loading topics. Please refresh the page.</div>';
    }
  }, 100);
}

function renderMathJaxInTopics() {
  if (!window.MathJax || !mathJaxReady) {
    console.log('MathJax not ready for topic descriptions');
    return;
  }
  
  // Wait a bit for the DOM to be fully updated
  setTimeout(() => {
    const topicDescriptions = document.querySelectorAll('.topic-description');
    const topicTitles = document.querySelectorAll('.topic-title');
    
    const mathElements = [];
    
    // Collect all elements that might contain MathJax
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
  
  // Check for common math delimiters
  const mathPatterns = [
    /\\\(.*?\\\)/g,     // \( ... \)
    /\\\[.*?\\\]/g,     // \[ ... \]
    /\$.*?\$/g,         // $ ... $
    /\\begin\{.*?\}.*?\\end\{.*?\}/g,  // LaTeX environments
    /\\[a-zA-Z]+\{/g    // LaTeX commands
  ];
  
  return mathPatterns.some(pattern => pattern.test(text));
}

function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text;
  
  try {
    // More comprehensive math pattern matching
    const mathRegex = /\\\(.*?\\\)|\\\[.*?\\\]|\$.*?\$|\\begin\{.*?\}.*?\\end\{.*?\}|\\[a-zA-Z]+\{.*?\}/g;
    const mathParts = [];
    let mathIndex = 0;
    
    // Replace math content with placeholders
    const textWithPlaceholders = text.replace(mathRegex, (match) => {
      const placeholder = `__MATH_${mathIndex}__`;
      mathParts.push(match);
      mathIndex++;
      return placeholder;
    });
    
    // Apply highlighting to non-math text
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const highlightedText = textWithPlaceholders.replace(regex, '<mark>$1</mark>');
    
    // Restore math content
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
  if (!window.MathJax) {
    console.warn('MathJax not available');
    return Promise.resolve();
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Collect ALL elements that might contain MathJax
      const elements = [
        document.getElementById('question-text'),
        document.getElementById('options'),
        document.getElementById('correct-answer-text'),
        document.getElementById('feedback-explanation')
      ].filter(el => el && el.innerHTML);
      
      // Also include topic descriptions and titles if we're in topic selection
      const topicDescriptions = document.querySelectorAll('.topic-description');
      const topicTitles = document.querySelectorAll('.topic-title');
      
      // Filter only elements that actually contain math content
      const allMathElements = [...elements];
      
      topicDescriptions.forEach(desc => {
        if (desc.innerHTML && containsMath(desc.innerHTML)) {
          allMathElements.push(desc);
        }
      });
      
      topicTitles.forEach(title => {
        if (title.innerHTML && containsMath(title.innerHTML)) {
          allMathElements.push(title);
        }
      });
      
      if (allMathElements.length === 0) {
        resolve();
        return;
      }
      
      console.log(`Rendering MathJax for ${allMathElements.length} elements`);
      
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise(allMathElements)
          .then(() => {
            console.log('MathJax rendering complete for all elements');
            resolve();
          })
          .catch(error => {
            console.warn('MathJax typeset error:', error);
            if (window.MathJax.typeset) {
              window.MathJax.typeset(allMathElements);
            }
            resolve();
          });
      } else if (window.MathJax.typeset) {
        window.MathJax.typeset(allMathElements);
        resolve();
      } else {
        resolve();
      }
    }, 100);
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
        
        // Re-render MathJax after search results are displayed
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
      
      // Re-render MathJax after sorting
      setTimeout(() => {
        if (window.MathJax && mathJaxReady) {
          renderMathJaxInTopics();
        }
      }, 400);
    };
  });
};

const topicMathJaxStyles = `
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

/* Ensure MathJax doesn't break the topic item layout */
.topic-content mjx-container {
  line-height: 1.3;
}
`;

const topicStyleSheet = document.createElement('style');
topicStyleSheet.textContent = topicMathJaxStyles;
document.head.appendChild(topicStyleSheet);