// Configuration and Constants
const CONFIG = {
  DEFAULT_TIMER: 1200,
  DEFAULT_QUESTION_COUNT: 10,
  MAX_QUESTION_COUNT: 200,
  MIN_QUESTION_COUNT: 1,
  DEFAULT_DIFFICULTY: 'medium',
  DEFAULT_GENERATE_PRINT: true,
  MATHJAX_TIMEOUT: 15000,
  MAX_RETRIES: 5
};

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

// State Management
class QuizState {
  constructor() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.timerInterval = null;
    this.timeRemaining = 0;
    this.startTime = null;
    this.isMarkingPhase = false;
    this.markingIndex = 0;
    this.selectedTopics = new Set();
    this.searchTerm = '';
    this.sortBy = 'alphabetical';
    this.mathJaxReady = false;
    this.domContentLoaded = false;
    this.initializationPending = false;
    this.mathJaxSkipped = false;
  }
  
  resetQuiz() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.isMarkingPhase = false;
    this.markingIndex = 0;
    this.timeRemaining = 0;
    this.startTime = null;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

const state = new QuizState();

// DOM Elements Cache
class DOMCache {
  constructor() {
    this.elements = {};
  }
  
  get(id) {
    if (!this.elements[id]) {
      this.elements[id] = document.getElementById(id);
    }
    return this.elements[id];
  }
  
  clear() {
    this.elements = {};
  }
}

const dom = new DOMCache();

// Utility Functions
const Utils = {
  formatTime(seconds) {
    if (seconds === 0) return 'No Timer';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },
  
  formatTimeForDisplay(seconds) {
    if (seconds === 0) return 'No Timer';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) return `${hours} Hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} Minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} Second${seconds > 1 ? 's' : ''}`;
  },
  
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  containsMath(text) {
    if (!text) return false;
    const mathPatterns = [
      /\\\(.*?\\\)/g, /\\\[.*?\\\]/g, /\$.*?\$/g,
      /\\begin\{.*?\}.*?\\end\{.*?\}/g, /\\[a-zA-Z]+\{/g
    ];
    return mathPatterns.some(pattern => pattern.test(text));
  },
  
  highlightText(text, searchTerm) {
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
      
      return highlightedText.replace(/__MATH_(\d+)__/g, (match, index) => {
        return mathParts[parseInt(index)] || match;
      });
    } catch (e) {
      console.warn('Error highlighting text:', e);
      return text;
    }
  }
};

// Quiz Data Access Layer
const QuizData = {
  getAllCategories: () => getAllCats(),
  
  getTopicsByCategory: (category) => getTopicsByCat(category),
  
  getCategoryInfo: (category) => getCategoryInf(category),
  
  getTopicInfo: (topicId) => getTopicInf(topicId),
  
  getFilteredAndSortedTopics() {
    const allTopics = getAllTopics();
    
    let filteredTopics = allTopics.filter(topicId => {
      const topic = this.getTopicInfo(topicId);
      return topic && (
        topic.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    });
    
    if (state.sortBy === 'alphabetical') {
      filteredTopics.sort((a, b) => {
        const topicA = this.getTopicInfo(a);
        const topicB = this.getTopicInfo(b);
        return topicA.title.localeCompare(topicB.title);
      });
    } else if (state.sortBy === 'category') {
      const categories = this.getAllCategories();
      const categorizedTopics = {};
      
      categories.forEach(category => {
        categorizedTopics[category] = this.getTopicsByCategory(category)
          .filter(topicId => filteredTopics.includes(topicId))
          .sort((a, b) => {
            const topicA = this.getTopicInfo(a);
            const topicB = this.getTopicInfo(b);
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
};

// Topic Selection Management
const TopicManager = {
  toggleTopic(topicId, topicElement) {
    const checkbox = topicElement.querySelector('.topic-checkbox');
    
    if (state.selectedTopics.has(topicId)) {
      state.selectedTopics.delete(topicId);
      topicElement.classList.remove('selected');
      checkbox.classList.remove('checked');
    } else {
      state.selectedTopics.add(topicId);
      topicElement.classList.add('selected');
      checkbox.classList.add('checked');
    }
    
    this.refreshCategoryProgress();
    this.updateStartButton();
  },
  
  refreshCategoryProgress() {
    const categories = QuizData.getAllCategories();
    
    categories.forEach(category => {
      const categoryTopics = QuizData.getTopicsByCategory(category);
      const selectedInCategory = categoryTopics.filter(topicId =>
        state.selectedTopics.has(topicId)
      ).length;
      const progressPercent = (selectedInCategory / categoryTopics.length) * 100;
      
      const categoryHeader = document.querySelector(`.category-header[data-category="${category}"]`);
      if (categoryHeader) {
        const progressFill = categoryHeader.querySelector('.category-progress-fill');
        const progressText = categoryHeader.querySelector('.category-progress span');
        
        if (progressFill) progressFill.style.width = `${progressPercent}%`;
        if (progressText) progressText.textContent = `${selectedInCategory}/${categoryTopics.length}`;
      }
    });
  },
  
  updateStartButton() {
    const startBtn = dom.get('start-quiz-btn');
    if (startBtn) startBtn.disabled = state.selectedTopics.size === 0;
  },
  
  createTopicElement(topicId) {
    const topic = QuizData.getTopicInfo(topicId);
    if (!topic) return null;
    
    const category = getCategoryForTop(topicId);
    
    const topicItem = document.createElement('div');
    topicItem.className = 'topic-item';
    topicItem.setAttribute('data-category', category);
    topicItem.setAttribute('data-topic-id', topicId);
    
    if (state.selectedTopics.has(topicId)) {
      topicItem.classList.add('selected');
    }
    
    topicItem.onclick = () => this.toggleTopic(topicId, topicItem);
    
    const highlightedTitle = Utils.highlightText(topic.title, state.searchTerm);
    const highlightedDescription = Utils.highlightText(topic.description, state.searchTerm);
    
    topicItem.innerHTML = `
      <div class="topic-checkbox ${state.selectedTopics.has(topicId) ? 'checked' : ''}"></div>
      <div class="topic-content">
        <span class="topic-title">${highlightedTitle}</span>
        <span class="topic-description">${highlightedDescription}</span>
        <span class="topic-category" data-category="${category}">${category}</span>
      </div>
    `;
    
    return topicItem;
  },
  
  renderTopicsByCategory(filteredTopics, topicsGrid) {
    const categories = QuizData.getAllCategories();
    let hasAnyTopics = false;
    
    categories.forEach(category => {
      const categoryTopics = QuizData.getTopicsByCategory(category)
        .filter(topicId => filteredTopics.includes(topicId));
      
      if (categoryTopics.length > 0) {
        hasAnyTopics = true;
        this.renderCategoryHeader(category, categoryTopics, topicsGrid);
        
        categoryTopics.forEach(topicId => {
          const topicElement = this.createTopicElement(topicId);
          if (topicElement) topicsGrid.appendChild(topicElement);
        });
      }
    });
    
    if (!hasAnyTopics) this.renderNoResults(topicsGrid);
  },
  
  renderCategoryHeader(category, categoryTopics, topicsGrid) {
    const categoryInfo = QuizData.getCategoryInfo(category);
    const selectedInCategory = categoryTopics.filter(topicId =>
      state.selectedTopics.has(topicId)
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
  },
  
  renderTopicsAlphabetically(filteredTopics, topicsGrid) {
    filteredTopics.forEach(topicId => {
      const topicElement = this.createTopicElement(topicId);
      if (topicElement) topicsGrid.appendChild(topicElement);
    });
  },
  
  renderNoResults(topicsGrid) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <i class="fas fa-search"></i>
      <p>No topics found</p>
      <p>Try a different search term or clear your search</p>
    `;
    topicsGrid.innerHTML = '';
    topicsGrid.appendChild(noResults);
  },
  
  initializeTopicSelection() {
    const topicsGrid = dom.get('topics-grid');
    if (!topicsGrid) {
      console.error('Topics grid element not found');
      MathJaxManager.hideOverlay();
      return;
    }
    
    topicsGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading topics...</div>';
    
    setTimeout(() => {
      try {
        const filteredTopics = QuizData.getFilteredAndSortedTopics();
        
        if (filteredTopics.length === 0) {
          this.renderNoResults(topicsGrid);
          MathJaxManager.hideOverlay();
          return;
        }
        
        topicsGrid.innerHTML = '';
        
        if (state.sortBy === 'category') {
          this.renderTopicsByCategory(filteredTopics, topicsGrid);
        } else {
          this.renderTopicsAlphabetically(filteredTopics, topicsGrid);
        }
        
        this.updateStartButton();
        this.animateTopicItems();
        MathJaxManager.safeRenderMathJax();
        
      } catch (error) {
        console.error('Error initializing topic selection:', error);
        topicsGrid.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> Error loading topics. Please refresh the page.</div>';
        MathJaxManager.hideOverlay();
      }
    }, 100);
  },
  
  animateTopicItems() {
    const topicItems = document.querySelectorAll('.topic-item');
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
  }
};

// Timer Management
const TimerManager = {
  getCurrentTimerSetting() {
    const timerDropdown = dom.get('timer-dropdown');
    if (timerDropdown) {
      const selectedOption = timerDropdown.querySelector('.dropdown-option.selected');
      return selectedOption ? parseInt(selectedOption.getAttribute('data-value')) : CONFIG.DEFAULT_TIMER;
    }
    return CONFIG.DEFAULT_TIMER;
  },
  
  startTimer() {
    this.updateTimerDisplay();
    
    if (this.getCurrentTimerSetting() === 0) {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
      }
      return;
    }
    
    if (state.timerInterval) clearInterval(state.timerInterval);
    
    state.timerInterval = setInterval(() => {
      state.timeRemaining--;
      this.updateTimerDisplay();
      
      if (state.timeRemaining <= 0) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        this.handleTimeUp();
      }
    }, 1000);
  },
  
  updateTimerDisplay() {
    const timerElement = dom.get('timer');
    if (!timerElement) return;
    
    if (state.timeRemaining === 0 && this.getCurrentTimerSetting() === 0) {
      timerElement.textContent = 'No Timer';
      timerElement.classList.remove('time-warning', 'pulse', 'time-expired');
      return;
    }
    
    if (state.timeRemaining <= 0) {
      timerElement.textContent = '00:00';
      timerElement.classList.add('time-warning', 'time-expired');
      return;
    }
    
    const timeString = Utils.formatTime(state.timeRemaining);
    timerElement.textContent = timeString;
    
    if (state.timeRemaining < 60) {
      timerElement.classList.add('time-warning', 'pulse');
    } else if (state.timeRemaining < 300) {
      timerElement.classList.add('time-warning');
      timerElement.classList.remove('pulse');
    } else {
      timerElement.classList.remove('time-warning', 'pulse', 'time-expired');
    }
  },
  
  handleTimeUp() {
    const timerElement = dom.get('timer');
    if (timerElement) {
      timerElement.classList.add('time-expired');
      timerElement.textContent = 'TIME UP!';
    }
    this.showTimeUpModal();
  },
  
  showTimeUpModal() {
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
    
    document.getElementById('proceed-grading').addEventListener('click', () => {
      document.body.removeChild(modal);
      QuizManager.startMarking();
    });
    
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
        QuizManager.startMarking();
      }
    }, 5000);
  }
};

// Quiz Management
const QuizManager = {
  startQuiz() {
    if (state.selectedTopics.size === 0) {
      alert('Please select at least one topic');
      return;
    }
    
    this.updateQuestionCount();
    
    const selectedTopicsArray = Array.from(state.selectedTopics);
    const allQuestions = this.generateQuestions(selectedTopicsArray);
    
    if (allQuestions.length === 0) {
      alert('Could not generate any questions. Please try different topics.');
      return;
    }
    
    this.setupQuizState(allQuestions, selectedTopicsArray);
    this.showQuizInterface();
    TimerManager.startTimer();
    
    state.currentQuestionIndex = 0;
    this.displayQuestion();
  },
  
  generateQuestions(selectedTopicsArray) {
    const allQuestions = [];
    const baseQuestionsPerTopic = Math.floor(state.questionCount / selectedTopicsArray.length);
    const remainder = state.questionCount % selectedTopicsArray.length;
    
    // Check total available questions
    let totalAvailableQuestions = 0;
    selectedTopicsArray.forEach(topicId => {
      const topic = QuizData.getTopicInfo(topicId);
      if (topic && topic.generator) totalAvailableQuestions += 10;
    });
    
    if (totalAvailableQuestions < state.questionCount) {
      alert(`Not enough questions available. Maximum available: ${totalAvailableQuestions}`);
      return [];
    }
    
    // Generate questions for each topic
    selectedTopicsArray.forEach((topicId, index) => {
      const topic = QuizData.getTopicInfo(topicId);
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
    
    return allQuestions.sort(() => Math.random() - 0.5).slice(0, state.questionCount);
  },
  
  setupQuizState(allQuestions, selectedTopicsArray) {
    const difficultyInput = dom.get('difficulty');
    const generatePrintInput = dom.get('generate-print');
    
    state.currentQuiz = {
      title: `Custom Quiz (${Array.from(state.selectedTopics).map(id => QuizData.getTopicInfo(id).title).join(', ')})`,
      questions: allQuestions,
      settings: {
        questionCount: allQuestions.length,
        timerSetting: TimerManager.getCurrentTimerSetting(),
        difficulty: difficultyInput ? difficultyInput.value || CONFIG.DEFAULT_DIFFICULTY : CONFIG.DEFAULT_DIFFICULTY,
        generatePrint: generatePrintInput ? generatePrintInput.checked : CONFIG.DEFAULT_GENERATE_PRINT
      }
    };
    
    state.userAnswers = new Array(state.currentQuiz.questions.length).fill(null);
    state.timeRemaining = state.currentQuiz.settings.timerSetting;
    state.startTime = new Date();
  },
  
  showQuizInterface() {
    this.createQuestionNavigation();
    
    dom.get('topic-selection').classList.add('hidden');
    dom.get('quiz-header').classList.remove('hidden');
    dom.get('question-container').classList.remove('hidden');
    dom.get('navigation').classList.remove('hidden');
    
    dom.get('quiz-title').textContent = state.currentQuiz.title;
  },
  
  displayQuestion() {
    if (!state.currentQuiz?.questions?.length) {
      console.error('No questions available to display');
      MathJaxManager.hideOverlay();
      return;
    }
    
    const question = state.currentQuiz.questions[state.currentQuestionIndex];
    
    dom.get('question-number').textContent =
      `${state.currentQuestionIndex + 1} / ${state.currentQuiz.questions.length}`;
    dom.get('question-text').innerHTML = question.question;
    
    this.renderOptions(question);
    this.updateNavigation();
    this.updateQuestionNavigation();
    
    MathJaxManager.safeRenderMathJax();
  },
  
  renderOptions(question) {
    const optionsContainer = dom.get('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option';
      optionDiv.innerHTML = option;
      
      if (!state.isMarkingPhase) {
        optionDiv.onclick = () => this.selectOption(index);
      }
      
      if (state.userAnswers[state.currentQuestionIndex] === index) {
        optionDiv.classList.add('selected');
      }
      
      optionsContainer.appendChild(optionDiv);
    });
  },
  
  selectOption(optionIndex) {
    if (state.isMarkingPhase) return;
    
    state.userAnswers[state.currentQuestionIndex] = optionIndex;
    
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
      option.classList.remove('selected');
      if (index === optionIndex) option.classList.add('selected');
    });
    
    this.updateNavigation();
    this.updateQuestionNavigation();
  },
  
  nextQuestion() {
    if (state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
      state.currentQuestionIndex++;
      this.displayQuestion();
    } else {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
      }
      this.startMarking();
    }
  },
  
  previousQuestion() {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      this.displayQuestion();
    }
  },
  
  startMarking() {
    state.isMarkingPhase = true;
    state.markingIndex = 0;
    state.currentQuestionIndex = 0;
    
    dom.get('navigation').style.display = 'none';
    dom.get('timer').textContent = 'Reviewing...';
    
    this.markNextQuestion();
  },
  
  markNextQuestion() {
    if (state.markingIndex >= state.currentQuiz.questions.length) {
      this.showResults();
      return;
    }
    
    state.currentQuestionIndex = state.markingIndex;
    this.displayQuestion();
    this.markCurrentQuestion();
  },
  
  markCurrentQuestion() {
    const question = state.currentQuiz.questions[state.currentQuestionIndex];
    const userAnswer = state.userAnswers[state.currentQuestionIndex];
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
      this.showFeedback(question);
    } else {
      setTimeout(() => {
        state.markingIndex++;
        this.markNextQuestion();
      }, 1500);
    }
  },
  
  showFeedback(question) {
    const feedbackPanel = dom.get('feedback-panel');
    const correctAnswerText = dom.get('correct-answer-text');
    const feedbackExplanation = dom.get('feedback-explanation');
    
    if (correctAnswerText) correctAnswerText.innerHTML = question.options[question.correct];
    if (feedbackExplanation) feedbackExplanation.innerHTML = question.explanation;
    
    if (feedbackPanel) feedbackPanel.classList.add('show');
    
    if (window.MathJax) MathJax.typesetPromise();
  },
  
  showResults() {
    dom.get('quiz-header').classList.add('hidden');
    dom.get('question-container').classList.add('hidden');
    dom.get('navigation').classList.add('hidden');
    dom.get('results-container').classList.remove('hidden');
    
    const correctAnswers = state.userAnswers.filter((answer, index) =>
      answer === state.currentQuiz.questions[index].correct
    ).length;
    
    const totalQuestions = state.currentQuiz.questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - state.startTime) / 1000);
    
    const { grade, gradeClass, message } = this.calculateGrade(percentage);
    
    this.updateResultsDisplay(correctAnswers, totalQuestions, percentage, grade, gradeClass, message, timeTaken);
    
    if (percentage >= 80) this.showConfetti();
  },
  
  calculateGrade(percentage) {
    if (percentage >= 90) return { grade: 'A', gradeClass: 'grade-A', message: ' Excellent work! You\'ve mastered this topic!' };
    if (percentage >= 80) return { grade: 'B', gradeClass: 'grade-B', message: ' Great job! You have a solid understanding!' };
    if (percentage >= 70) return { grade: 'C', gradeClass: 'grade-C', message: ' Good effort! Keep practicing to improve!' };
    if (percentage >= 60) return { grade: 'D', gradeClass: 'grade-D', message: ' You\'re getting there! Review the material and try again!' };
    return { grade: 'F', gradeClass: 'grade-F', message: ' Don\'t give up! Study more and you\'ll improve!' };
  },
  
  updateResultsDisplay(correctAnswers, totalQuestions, percentage, grade, gradeClass, message, timeTaken) {
    const gradeDisplay = dom.get('grade-display');
    gradeDisplay.textContent = grade;
    gradeDisplay.className = `grade-display ${gradeClass}`;
    
    dom.get('grade-message').textContent = message;
    dom.get('final-score').textContent = `${correctAnswers}/${totalQuestions}`;
    dom.get('final-percentage').textContent = `${percentage}%`;
    dom.get('time-taken').textContent = Utils.formatTime(timeTaken);
    dom.get('correct-count').textContent = correctAnswers;
  },
  
  showConfetti() {
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
    
    setTimeout(() => document.body.removeChild(confettiContainer), 5000);
  },
  
  createQuestionNavigation() {
    const questionGrid = dom.get('question-grid');
    if (!questionGrid) return;
    
    questionGrid.innerHTML = '';
    
    state.currentQuiz.questions.forEach((_, index) => {
      const questionBtn = document.createElement('button');
      questionBtn.className = 'question-number-btn';
      questionBtn.textContent = index + 1;
      questionBtn.onclick = () => this.navigateToQuestion(index);
      
      this.updateQuestionButtonState(questionBtn, index);
      questionGrid.appendChild(questionBtn);
    });
  },
  
  navigateToQuestion(index) {
    if (state.isMarkingPhase) return;
    
    state.currentQuestionIndex = index;
    this.displayQuestion();
    this.updateQuestionNavigation();
    this.closeQuestionNav();
  },
  
  updateQuestionButtonState(button, index) {
    button.classList.remove('current', 'answered', 'marked');
    
    if (index === state.currentQuestionIndex) button.classList.add('current');
    if (state.userAnswers[index] !== null) button.classList.add('answered');
  },
  
  updateQuestionNavigation() {
    const buttons = document.querySelectorAll('.question-number-btn');
    buttons.forEach((button, index) => this.updateQuestionButtonState(button, index));
  },
  
  updateNavigation() {
    const prevBtn = dom.get('prev-btn');
    const nextBtn = dom.get('next-btn');
    const progressInfo = dom.get('progress-info');
    
    if (prevBtn) prevBtn.disabled = state.currentQuestionIndex === 0;
    
    if (nextBtn) {
      if (state.currentQuestionIndex === state.currentQuiz.questions.length - 1) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i>';
        nextBtn.className = 'btn btn-success';
        nextBtn.title = 'Submit Quiz';
      } else {
        nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
        nextBtn.className = 'btn';
        nextBtn.title = 'Next Question';
      }
      nextBtn.disabled = state.userAnswers[state.currentQuestionIndex] === null;
    }
    
    if (progressInfo) {
      const answered = state.userAnswers.filter(answer => answer !== null).length;
      progressInfo.textContent = `${answered} of ${state.currentQuiz.questions.length} answered`;
    }
  },
  
  updateQuestionCount() {
    const questionCountInput = dom.get('question-count');
    if (questionCountInput) {
      let value = parseInt(questionCountInput.value);
      value = Utils.clamp(value, CONFIG.MIN_QUESTION_COUNT, CONFIG.MAX_QUESTION_COUNT);
      questionCountInput.value = value;
      state.questionCount = value;
    }
  },
  
  closeFeedback() {
    const feedbackPanel = dom.get('feedback-panel');
    if (feedbackPanel) feedbackPanel.classList.remove('show');
    
    state.markingIndex++;
    setTimeout(() => {
      this.markNextQuestion();
    }, 500);
  },
  
};

// MathJax Management - Fixed Version
const MathJaxManager = {
  configureMathJax() {
    // Check if MathJax is already loaded
    if (window.MathJax) {
      console.log('MathJax already loaded, configuring...');
      this.setupMathJaxConfig();
      return;
    }
    
    // Set up configuration before loading
    this.setupMathJaxConfig();
    this.loadMathJaxDynamically();
  },
  
  setupMathJaxConfig() {
    window.MathJax = {
      startup: {
        pageReady: () => {
          console.log('MathJax pageReady called');
          state.mathJaxReady = true;
          MathJaxManager.hideOverlay();
          AppInitializer.initializeWhenReady();
          return window.MathJax.startup.defaultPageReady();
        }
      },
      tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        renderActions: {
          addMenu: [0, '', '']
        }
      },
      loader: {
        load: ['[tex]/ams'],
        source: {
          '[tex]/ams': 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-ams.js'
        }
      },
      svg: {
        fontCache: 'global'
      }
    };
  },
  
  loadMathJaxDynamically() {
    console.log('Loading MathJax dynamically...');
    
    // Remove existing MathJax script if present
    const existingScript = document.getElementById('MathJax-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.id = 'MathJax-script';
    script.async = true;
    
    script.onload = () => {
      console.log('MathJax script loaded successfully');
      // Configuration is already set, just wait for initialization
    };
    
    script.onerror = (error) => {
      console.error('Failed to load MathJax dynamically:', error);
      state.mathJaxReady = true;
      state.mathJaxSkipped = true;
      this.hideOverlay();
      AppInitializer.initializeWhenReady();
    };
    
    document.head.appendChild(script);
  },
  
  waitForMathJax() {
    return new Promise((resolve) => {
      console.log('Waiting for MathJax, ready state:', state.mathJaxReady);
      
      if (state.mathJaxReady || state.mathJaxSkipped) {
        console.log('MathJax already ready or skipped');
        this.hideOverlay();
        resolve();
        return;
      }
      
      this.createLoadingOverlay();
      
      // Check if MathJax is already initialized
      if (window.MathJax?.startup?.promise) {
        console.log('MathJax startup promise found');
        window.MathJax.startup.promise
          .then(() => {
            console.log('MathJax startup completed');
            state.mathJaxReady = true;
            this.hideOverlay();
            resolve();
          })
          .catch((error) => {
            console.error('MathJax startup failed:', error);
            state.mathJaxReady = true;
            this.hideOverlay();
            resolve();
          });
      } else {
        console.log('Polling for MathJax initialization');
        this.pollForMathJax(resolve);
      }
    });
  },
  
  pollForMathJax(resolve, attempts = 0) {
    const maxAttempts = 20; // Reduced from 30 to timeout faster
    
    if (window.MathJax && (window.MathJax.typesetPromise || window.MathJax.typeset)) {
      console.log('MathJax found after', attempts, 'attempts');
      state.mathJaxReady = true;
      this.hideOverlay();
      resolve();
      return;
    }
    
    if (attempts >= maxAttempts) {
      console.warn('MathJax loading timeout - proceeding without it');
      state.mathJaxReady = true;
      state.mathJaxSkipped = true;
      this.hideOverlay();
      this.showFallbackWarning();
      resolve();
      return;
    }
    
    console.log('MathJax poll attempt', attempts + 1);
    setTimeout(() => this.pollForMathJax(resolve, attempts + 1), 500);
  },
  
  safeRenderMathJax() {
    console.log('Safe render MathJax called, skipped:', state.mathJaxSkipped);
    
    if (state.mathJaxSkipped) {
      console.log('MathJax skipped, applying fallback');
      this.applyMathFallbackToAll();
      this.hideOverlay();
      return Promise.resolve();
    }
    
    if (!window.MathJax || !state.mathJaxReady) {
      console.log('MathJax not available, using fallback');
      this.applyMathFallbackToAll();
      return Promise.resolve();
    }
    
    return this.renderMathJax()
      .then(() => {
        console.log('MathJax render completed');
        this.hideOverlay();
        setTimeout(() => this.checkForRemainingLatex(), 1000);
      })
      .catch(error => {
        console.error('MathJax rendering failed, using fallback:', error);
        this.applyMathFallbackToAll();
        this.showFallbackWarning();
        this.hideOverlay();
      });
  },
  
  renderMathJax() {
    if (!window.MathJax || !state.mathJaxReady) {
      console.log('MathJax not ready for rendering');
      return Promise.resolve();
    }
    
    return new Promise((resolve) => {
      const renderWithRetry = (retryCount = 0) => {
        try {
          const elements = this.getMathElements();
          
          if (elements.length === 0) {
            console.log('No math elements found to render');
            resolve();
            return;
          }
          
          console.log('Rendering MathJax for', elements.length, 'elements');
          
          if (window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise(elements)
              .then(() => {
                console.log('MathJax typesetPromise completed');
                resolve();
              })
              .catch((error) => {
                console.error('MathJax typesetPromise error:', error);
                if (retryCount < CONFIG.MAX_RETRIES) {
                  console.log('Retrying MathJax render, attempt', retryCount + 1);
                  setTimeout(() => renderWithRetry(retryCount + 1), 500);
                } else {
                  console.log('Max retries reached, giving up');
                  resolve();
                }
              });
          } else if (window.MathJax.typeset) {
            console.log('Using MathJax.typeset');
            window.MathJax.typeset(elements);
            resolve();
          } else {
            console.log('No MathJax render method available');
            resolve();
          }
        } catch (error) {
          console.error('Unexpected error in renderMathJax:', error);
          resolve();
        }
      };
      
      // Short delay to ensure DOM is ready
      setTimeout(() => renderWithRetry(), 100);
    });
  },
  
  getMathElements() {
    const elements = [
      dom.get('question-text'),
      dom.get('options'),
      dom.get('correct-answer-text'),
      dom.get('feedback-explanation')
    ].filter(el => el && el.innerHTML);
    
    const topicDescriptions = document.querySelectorAll('.topic-description');
    const topicTitles = document.querySelectorAll('.topic-title');
    
    return [...elements, ...topicDescriptions, ...topicTitles];
  },
  
  skipMathJax() {
    console.log('Skip MathJax called');
    state.mathJaxReady = true;
    state.mathJaxSkipped = true;
    this.hideOverlay();
    this.forceMathFallback();
    
    // Re-initialize app without MathJax
    if (state.domContentLoaded) {
      AppInitializer.initializeApp();
    }
  },
  
  createLoadingOverlay() {
    const existingOverlay = document.querySelector('.mathjax-loading-overlay');
    if (existingOverlay) {
      console.log('Removing existing overlay');
      existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mathjax-loading-overlay';
    overlay.innerHTML = `
      <div class="mathjax-loading-content">
        <div class="mathjax-loading-spinner">
          <div class="mathjax-spinner-circle"></div>
          <div class="mathjax-spinner-inner">
            <i class="fas fa-square-root-variable"></i>
          </div>
        </div>
        
        <h3 class="mathjax-loading-title">
          Rendering Mathematical Equations
        </h3>
        
        <p class="mathjax-loading-description">
          Preparing complex mathematical notation and symbols for display. 
          This ensures all equations render correctly.
        </p>
        
        <div class="mathjax-progress-container">
          <div class="mathjax-progress-bar" id="mathjax-progress"></div>
        </div>
        
        <div class="mathjax-loading-stats">
          <div class="mathjax-stat">
            <span class="mathjax-stat-value" id="mathjax-equations">0</span>
            <span class="mathjax-stat-label">Equations</span>
          </div>
          <div class="mathjax-stat">
            <span class="mathjax-stat-value" id="mathjax-time">10s</span>
            <span class="mathjax-stat-label">Estimated</span>
          </div>
        </div>
        
        <div class="mathjax-fallback-option">
          <p>Taking longer than expected?</p>
          <button class="mathjax-skip-button" id="mathjax-skip-button">
            <i class="fas fa-forward"></i>
            Skip
          </button>
          <p class="mathjax-skip-note">
            Equations will display as plain text
          </p>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add click event to skip button
    const skipButton = document.getElementById('mathjax-skip-button');
    if (skipButton) {
      skipButton.onclick = () => this.skipMathJax();
    }
    
    // Add progress animation
    this.animateProgress();
    
    // Auto-hide timeout
    overlay.autoHideTimeout = setTimeout(() => {
      console.log('MathJax loading timeout reached');
      this.skipMathJax();
    }, CONFIG.MATHJAX_TIMEOUT);
    
    return overlay;
  },
  
  animateProgress() {
    const progressBar = document.getElementById('mathjax-progress');
    if (!progressBar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8;
      if (progress > 85) progress = 85; // Don't reach 100% until complete
      progressBar.style.width = `${progress}%`;
    }, 500);
    
    // Store interval ID to clear later
    progressBar.animationInterval = interval;
  },
  
  hideOverlay() {
    const overlays = document.querySelectorAll('.mathjax-loading-overlay, .loading-overlay');
    overlays.forEach(overlay => {
      // Clear progress animation
      const progressBar = overlay.querySelector('#mathjax-progress');
      if (progressBar?.animationInterval) {
        clearInterval(progressBar.animationInterval);
      }
      
      if (overlay.autoHideTimeout) {
        clearTimeout(overlay.autoHideTimeout);
      }
      
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        if (overlay.parentElement) {
          overlay.remove();
        }
      }, 300);
    });
  },
  
  forceMathFallback() {
    this.applyMathFallbackToAll();
  },
  
  applyMathFallbackToAll() {
    const elements = this.getMathElements();
    elements.forEach(element => {
      if (element) {
        this.displayMathFallback(element);
      }
    });
  },
  
  displayMathFallback(element) {
    if (!element?.innerHTML) return;
    
    let content = element.innerHTML;
    const replacements = this.getMathReplacements();
    
    try {
      let previousContent;
      let iterations = 0;
      
      do {
        previousContent = content;
        iterations++;
        
        replacements.forEach(([pattern, replacement]) => {
          try {
            content = content.replace(pattern, replacement);
          } catch (e) {
            console.warn('Replacement error:', e);
          }
        });
        
        if (content === previousContent || iterations >= 10) break;
      } while (true);
      
      // Final cleanup
      content = content
        .replace(/\\[a-zA-Z]+\{.*?\}/g, '')
        .replace(/\\[a-zA-Z]+/g, '')
        .replace(/\{/g, '').replace(/\}/g, '')
        .replace(/\s+/g, ' ').trim();
      
      element.innerHTML = content;
    } catch (error) {
      console.error('Error in displayMathFallback:', error);
      element.innerHTML = element.innerHTML
        .replace(/\\[a-zA-Z]+\{.*?\}/g, '')
        .replace(/\\[a-zA-Z]+/g, '')
        .replace(/\\\(/g, '(').replace(/\\\)/g, ')')
        .replace(/\\\[/g, '').replace(/\\\]/g, '')
        .replace(/\$\$(.*?)\$\$/g, '$1').replace(/\$(.*?)\$/g, '$1');
    }
  },
  
  getMathReplacements() {
    return [
      // LaTeX delimiters
      [/\\\(/g, '('],
      [/\\\)/g, ')'],
      [/\\\[/g, ''],
      [/\\\]/g, ''],
      [/\$\$(.*?)\$\$/g, '$1'],
      [/\$(.*?)\$/g, '$1'],
      
      // Fractions
      [/\\frac\{(.*?)\}\{(.*?)\}/g, '<sup>$1</sup>⁄<sub>$2</sub>'],
      [/\\dfrac\{(.*?)\}\{(.*?)\}/g, '<sup>$1</sup>⁄<sub>$2</sub>'],
      
      // Roots
      [/\\sqrt\{(.*?)\}/g, '√($1)'],
      [/\\sqrt\[(.*?)\]\{(.*?)\}/g, '√<sup>$1</sup>($2)'],
      
      // Greek letters
      [/\\pi/g, 'π'],
      [/\\theta/g, 'θ'],
      [/\\alpha/g, 'α'],
      [/\\beta/g, 'β'],
      [/\\gamma/g, 'γ'],
      [/\\Delta/g, 'Δ'],
      [/\\delta/g, 'δ'],
      
      // Math operators
      [/\\times/g, '×'],
      [/\\div/g, '÷'],
      [/\\cdot/g, '·'],
      [/\\pm/g, '±'],
      
      // Relations
      [/\\leq/g, '≤'],
      [/\\geq/g, '≥'],
      [/\\neq/g, '≠'],
      [/\\approx/g, '≈'],
      
      // Sets and calculus
      [/\\in/g, '∈'],
      [/\\infty/g, '∞'],
      [/\\int/g, '∫'],
      [/\\sum/g, '∑'],
      
      // Text formatting
      [/\\text\{(.*?)\}/g, '$1'],
      [/\\textbf\{(.*?)\}/g, '<strong>$1</strong>'],
      
      // Cleanup
      [/\\[a-zA-Z]+\{(.*?)\}/g, '$1'],
      [/\\[a-zA-Z]+/g, '']
    ];
  },
  
  checkForRemainingLatex() {
    const elementsToCheck = this.getMathElements();
    let hasRemainingLatex = false;
    
    elementsToCheck.forEach(element => {
      if (Utils.containsMath(element.innerHTML)) {
        this.displayMathFallback(element);
        hasRemainingLatex = true;
      }
    });
    
    if (hasRemainingLatex) this.showFallbackWarning();
  },
  
  showFallbackWarning() {
    const existingWarning = document.querySelector('.mathjax-fallback-warning');
    if (existingWarning) existingWarning.remove();
    
    const warning = document.createElement('div');
    warning.className = 'mathjax-fallback-warning';
    warning.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      Math rendering simplified. Some equations may not display perfectly.
    `;
    
    const mainContent = document.querySelector('.container') || document.body;
    const firstChild = mainContent.firstChild;
    if (firstChild) mainContent.insertBefore(warning, firstChild);
    
    setTimeout(() => {
      if (warning.parentElement) {
        warning.style.opacity = '0';
        setTimeout(() => warning.remove(), 300);
      }
    }, 5000);
  }
};

// UI Components
const UIComponents = {
  initializeDropdowns() {
    this.initializeSortDropdown();
    this.initializeTimerDropdown();
  },
  
  initializeSortDropdown() {
    const dropdown = dom.get('sort-dropdown');
    if (!dropdown) return;
    
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const selectedText = dom.get('selected-sort');
    const optionElements = dropdown.querySelectorAll('.dropdown-option');
    
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown(selected, options);
    });
    
    optionElements.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        
        selectedText.textContent = text;
        state.sortBy = value;
        
        optionElements.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        this.closeDropdown(selected, options);
        TopicManager.initializeTopicSelection();
      });
    });
  },
  
  initializeTimerDropdown() {
    const dropdown = dom.get('timer-dropdown');
    if (!dropdown) return;
    
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const selectedText = dom.get('selected-timer');
    const optionElements = dropdown.querySelectorAll('.dropdown-option');
    
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown(selected, options);
    });
    
    optionElements.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = parseInt(option.getAttribute('data-value'));
        const text = option.textContent;
        
        selectedText.textContent = text;
        optionElements.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        this.closeDropdown(selected, options);
      });
    });
  },
  
  toggleDropdown(selected, options) {
    const isActive = selected.classList.contains('active');
    this.closeAllDropdowns();
    
    if (!isActive) {
      selected.classList.add('active');
      options.classList.add('show');
    } else {
      this.closeDropdown(selected, options);
    }
  },
  
  closeDropdown(selected, options) {
    selected.classList.remove('active');
    options.classList.remove('show');
  },
  
  closeAllDropdowns() {
    document.querySelectorAll('.custom-dropdown .dropdown-selected').forEach(el => {
      el.classList.remove('active');
    });
    document.querySelectorAll('.custom-dropdown .dropdown-options').forEach(el => {
      el.classList.remove('show');
    });
  },
  
  setupSearch() {
    const topicSearch = dom.get('topic-search');
    const clearSearch = dom.get('clear-search');
    
    this.initializeDropdowns();
    
    if (topicSearch) {
      const debouncedSearch = Utils.debounce(() => {
        state.searchTerm = topicSearch.value;
        TopicManager.initializeTopicSelection();
      }, 300);
      
      topicSearch.addEventListener('input', debouncedSearch);
      
      topicSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          topicSearch.value = '';
          state.searchTerm = '';
          TopicManager.initializeTopicSelection();
        }
      });
    }
    
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        if (topicSearch) {
          topicSearch.value = '';
          state.searchTerm = '';
          TopicManager.initializeTopicSelection();
          topicSearch.focus();
        }
      });
    }
  },
  
  toggleQuestionNav() {
    const navPanel = dom.get('question-nav-panel');
    const overlay = document.querySelector('.overlay') || this.createOverlay();
    
    navPanel.classList.toggle('show');
    overlay.classList.toggle('show');
  },
  
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = this.closeQuestionNav;
    document.body.appendChild(overlay);
    return overlay;
  },
  
  closeQuestionNav() {
    const navPanel = dom.get('question-nav-panel');
    const overlay = document.querySelector('.overlay');
    
    if (navPanel) navPanel.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
  }
};

// App Initialization
const AppInitializer = {
  initializeWhenReady() {
    console.log('Initialize when ready called:', {
      mathJaxReady: state.mathJaxReady,
      domContentLoaded: state.domContentLoaded,
      initializationPending: state.initializationPending
    });
    
    if ((state.mathJaxReady || state.mathJaxSkipped) && state.domContentLoaded && !state.initializationPending) {
      state.initializationPending = true;
      console.log('Conditions met, initializing app');
      MathJaxManager.hideOverlay();
      this.initializeApp();
    } else {
      console.log('Conditions not met, waiting...');
      // If MathJax is taking too long, proceed anyway after a timeout
      setTimeout(() => {
        if (!state.initializationPending) {
          console.log('Fallback initialization after timeout');
          state.mathJaxReady = true;
          state.initializationPending = true;
          MathJaxManager.hideOverlay();
          this.initializeApp();
        }
      }, 5000);
    }
  },
  
  initializeApp() {
    console.log('Initializing app with MathJax ready:', state.mathJaxReady);
    
    this.setupEventListeners();
    this.initializeUI();
    
    setTimeout(() => {
      const topicSelection = dom.get('topic-selection');
      if (topicSelection) {
        topicSelection.classList.remove('hidden');
        topicSelection.style.visibility = 'visible';
      }
    }, 100);
  },
  
  setupEventListeners() {
    // Quiz controls
    this.bindEvent('start-quiz-btn', 'click', () => QuizManager.startQuiz());
    this.bindEvent('next-btn', 'click', () => QuizManager.nextQuestion());
    this.bindEvent('prev-btn', 'click', () => QuizManager.previousQuestion());
    this.bindEvent('continue-btn', 'click', () => QuizManager.closeFeedback());
    this.bindEvent('try-again-btn', 'click', () => this.restartQuiz());
    this.bindEvent('print-btn', 'click', () => this.printResults());
    
    // Navigation
    this.bindEvent('nav-toggle-btn', 'click', () => UIComponents.toggleQuestionNav());
    this.bindEvent('close-nav-panel', 'click', () => UIComponents.closeQuestionNav());
    
    // Question count
    const questionCountInput = dom.get('question-count');
    if (questionCountInput) {
      questionCountInput.addEventListener('change', () => QuizManager.updateQuestionCount());
    }
    
    // Global event listeners
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        UIComponents.closeAllDropdowns();
      }
    });
    
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') UIComponents.closeAllDropdowns();
    });
  },
  
  bindEvent(elementId, event, handler) {
    const element = dom.get(elementId);
    if (element) element.addEventListener(event, handler);
  },
  
  initializeUI() {
    UIComponents.setupSearch();
    TopicManager.initializeTopicSelection();
    QuizManager.updateQuestionCount();
  },
  
  restartQuiz() {
    state.resetQuiz();
    state.selectedTopics.clear();
    state.searchTerm = '';
    state.sortBy = 'alphabetical';
    
    const topicSearch = dom.get('topic-search');
    if (topicSearch) topicSearch.value = '';
    
    this.resetTimerDropdown();
    
    dom.get('results-container').classList.add('hidden');
    dom.get('topic-selection').classList.remove('hidden');
    dom.get('navigation').style.display = 'flex';
    
    UIComponents.initializeDropdowns();
    TopicManager.initializeTopicSelection();
  },
  
  resetTimerDropdown() {
    const timerDropdown = dom.get('timer-dropdown');
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
  },
  
  printResults() {
    if (!state.currentQuiz.settings.generatePrint) {
      alert('Printable results were disabled for this quiz');
      return;
    }
    
    // Print implementation would go here
    console.log('Print results functionality');
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
  state.domContentLoaded = true;
  
  // Start MathJax configuration
  MathJaxManager.configureMathJax();
  
  // Also set a timeout to proceed if MathJax takes too long
  setTimeout(() => {
    if (!state.mathJaxReady && !state.initializationPending) {
      console.log('DOM loaded but MathJax taking too long, proceeding without it');
      state.mathJaxSkipped = true;
      state.mathJaxReady = true;
      AppInitializer.initializeWhenReady();
    }
  }, 10000); // 10 second timeout
  
  // Wait for MathJax but with better error handling
  MathJaxManager.waitForMathJax().then(() => {
    console.log('MathJax wait completed');
    AppInitializer.initializeWhenReady();
  }).catch(error => {
    console.error('Error waiting for MathJax:', error);
    state.mathJaxReady = true;
    AppInitializer.initializeWhenReady();
  });
});

// Add global functions for HTML event handlers
window.toggleTopic = TopicManager.toggleTopic.bind(TopicManager);
window.selectOption = QuizManager.selectOption.bind(QuizManager);
window.navigateToQuestion = QuizManager.navigateToQuestion.bind(QuizManager);
window.toggleQuestionNav = UIComponents.toggleQuestionNav.bind(UIComponents);
window.closeQuestionNav = UIComponents.closeQuestionNav.bind(UIComponents);
window.skipMathJax = MathJaxManager.skipMathJax.bind(MathJaxManager);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    QuizState,
    Utils,
    QuizData,
    TopicManager,
    TimerManager,
    QuizManager,
    MathJaxManager,
    UIComponents,
    AppInitializer
  };
}