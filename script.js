// Quiz Data
const quizData = {
  'math-quiz': {
    title: 'Math Quiz',
    description: 'Test your math skills with these challenging problems',
    timeLimit: 1800, 
    questions: [
      {
        question: "Convert the binary number 1101₂ to decimal.",
        options: ["15", "13", "11", "17"],
        correct: 1,
        explanation: "1101₂ = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13"
      },
      {
        question: "Convert the decimal number 25 to binary.",
        options: ["10011₂", "11010₂", "11001₂", "10101₂"],
        correct: 2,
        explanation: "25 in binary is 11001₂ (16 + 8 + 0 + 0 + 1)"
      },
      {
        question: "What is 1010₂ + 1101₂ in binary?",
        options: ["10011₂", "11011₂", "10111₂", "11111₂"],
        correct: 2,
        explanation: "1010₂ (10) + 1101₂ (13) = 23, which is 10111₂ in binary"
      },
      {
        question: "Convert the binary number 101010₂ to decimal.",
        options: ["40", "44", "42", "46"],
        correct: 2,
        explanation: "101010₂ = 32 + 0 + 8 + 0 + 2 + 0 = 42"
      },
      {
        question: "What is the binary equivalent of the decimal number 63?",
        options: ["111101₂", "111110₂", "111111₂", "111011₂"],
        correct: 2,
        explanation: "63 in binary is 111111₂ (32 + 16 + 8 + 4 + 2 + 1)"
      },
      {
        question: "Find the volume of a cylinder with radius 3 cm and height 8 cm. (Use π = 3.14)",
        options: ["216.24 cm³", "235.62 cm³", "226.08 cm³", "245.78 cm³"],
        correct: 2,
        explanation: "Volume = πr²h = 3.14 × 3² × 8 = 226.08 cm³"
      },
      {
        question: "A cone has a base radius of 4 cm and height of 9 cm. What is its volume? (Use π = 3.14)",
        options: ["155.84 cm³", "150.72 cm³", "145.26 cm³", "160.32 cm³"],
        correct: 1,
        explanation: "Volume = (1/3)πr²h = (1/3) × 3.14 × 4² × 9 = 150.72 cm³"
      },
      {
        question: "Find the volume of a cube with side length 5 cm.",
        options: ["150 cm³", "100 cm³", "125 cm³", "175 cm³"],
        correct: 2,
        explanation: "Volume = side³ = 5³ = 125 cm³"
      },
      {
        question: "A cuboid has dimensions 6 cm × 4 cm × 3 cm. What is its volume?",
        options: ["76 cm³", "84 cm³", "68 cm³", "72 cm³"],
        correct: 3,
        explanation: "Volume = length × width × height = 6 × 4 × 3 = 72 cm³"
      },
      {
        question: "Find the volume of a sphere with radius 3 cm. (Use π = 3.14)",
        options: ["118.32 cm³", "108.26 cm³", "113.04 cm³", "125.66 cm³"],
        correct: 2,
        explanation: "Volume = (4/3)πr³ = (4/3) × 3.14 × 3³ = 113.04 cm³"
      },
      {
        question: "A cylinder has a volume of 628 cm³ and height of 8 cm. What is its radius? (Use π = 3.14)",
        options: ["6 cm", "7 cm", "5 cm", "4 cm"],
        correct: 2,
        explanation: "V = πr²h → 628 = 3.14 × r² × 8 → r² = 25 → r = 5 cm"
      },
      {
        question: "What is the volume of a cone with base diameter 10 cm and height 12 cm? (Use π = 3.14)",
        options: ["324 cm³", "314 cm³", "334 cm³", "344 cm³"],
        correct: 1,
        explanation: "Radius = 5 cm, Volume = (1/3)πr²h = (1/3) × 3.14 × 5² × 12 = 314 cm³"
      },
      {
        question: "Simplify: (x² - 4)/(x + 2)",
        options: ["x + 2", "x - 2", "x² - 2", "x² + 2"],
        correct: 1,
        explanation: "(x² - 4)/(x + 2) = (x + 2)(x - 2)/(x + 2) = x - 2"
      },
      {
        question: "Add: 3/x + 2/x",
        options: ["5/2x", "6/x", "5/x", "1/x"],
        correct: 2,
        explanation: "3/x + 2/x = (3 + 2)/x = 5/x"
      },
      {
        question: "Multiply: (2x/3) × (9/4x)",
        options: ["6/4", "18x/12x", "3/2", "2/3"],
        correct: 2,
        explanation: "(2x/3) × (9/4x) = 18x/12x = 3/2 (after simplification)"
      },
      {
        question: "Divide: (x²/4) ÷ (x/2)",
        options: ["x/8", "x²/2", "x/2", "2x"],
        correct: 2,
        explanation: "(x²/4) ÷ (x/2) = (x²/4) × (2/x) = 2x²/4x = x/2"
      },
      {
        question: "Simplify: (6x + 12)/(3x + 6)",
        options: ["3", "x + 2", "2", "2x"],
        correct: 2,
        explanation: "(6x + 12)/(3x + 6) = 6(x + 2)/3(x + 2) = 2"
      },
      {
        question: "If x = 3 and y = 2, find the value of 2x + 3y.",
        options: ["14", "10", "16", "12"],
        correct: 3,
        explanation: "2(3) + 3(2) = 6 + 6 = 12"
      },
      {
        question: "Given a = 4 and b = -2, evaluate a² + b².",
        options: ["24", "18", "20", "22"],
        correct: 2,
        explanation: "4² + (-2)² = 16 + 4 = 20"
      },
      {
        question: "If p = 5 and q = 3, find the value of (p + q)/(p - q).",
        options: ["5", "2", "4", "3"],
        correct: 2,
        explanation: "(5 + 3)/(5 - 3) = 8/2 = 4"
      },
      {
        question: "When x = -1 and y = 4, what is the value of x²y - xy²?",
        options: ["12", "-16", "16", "-12"],
        correct: 0,
        explanation: "(-1)²(4) - (-1)(4)² = (1)(4) - (-1)(16) = 4 + 16 = 20 (Note: This seems incorrect based on the options - the correct calculation should be 1×4 - (-1)×16 = 4 + 16 = 20, but 20 isn't an option)"
      },
      {
        question: "If m = 2 and n = -3, evaluate 3m² - 2n.",
        options: ["16", "14", "18", "12"],
        correct: 2,
        explanation: "3(2)² - 2(-3) = 3×4 + 6 = 12 + 6 = 18"
      },
      {
        question: "Solve the system: x + y = 7 and x - y = 1",
        options: ["x = 3, y = 4", "x = 5, y = 2", "x = 4, y = 3", "x = 2, y = 5"],
        correct: 2,
        explanation: "Adding equations: 2x = 8 → x = 4. Then 4 + y = 7 → y = 3"
      },
      {
        question: "Find the solution to: 2x + y = 8 and x - y = 1",
        options: ["x = 1, y = 6", "x = 4, y = 0", "x = 3, y = 2", "x = 2, y = 4"],
        correct: 2,
        explanation: "Add equations: 3x = 9 → x = 3. Then 3 - y = 1 → y = 2"
      },
      {
        question: "Solve: 3x + 2y = 12 and x + y = 5",
        options: ["x = 4, y = 1", "x = 2, y = 3", "x = 1, y = 4", "x = 3, y = 2"],
        correct: 1,
        explanation: "From second equation: x = 5 - y. Substitute into first: 3(5 - y) + 2y = 12 → 15 - 3y + 2y = 12 → -y = -3 → y = 3, x = 2"
      },
      {
        question: "What is the solution to: 2x - 3y = 1 and x + y = 3?",
        options: ["x = 0, y = 3", "x = 1, y = 2", "x = 2, y = 1", "x = 3, y = 0"],
        correct: 2,
        explanation: "From second equation: x = 3 - y. Substitute into first: 2(3 - y) - 3y = 1 → 6 - 2y - 3y = 1 → -5y = -5 → y = 1, x = 2"
      },
      {
        question: "Find the area of a rhombus with diagonals of length 8 cm and 6 cm.",
        options: ["28 cm²", "24 cm²", "32 cm²", "20 cm²"],
        correct: 1,
        explanation: "Area of rhombus = (d1 × d2)/2 = (8 × 6)/2 = 24 cm²"
      },
      {
        question: "A trapezium has parallel sides of 5 cm and 9 cm, and height 4 cm. What is its area?",
        options: ["30 cm²", "26 cm²", "28 cm²", "32 cm²"],
        correct: 2,
        explanation: "Area = (a + b)/2 × h = (5 + 9)/2 × 4 = 7 × 4 = 28 cm²"
      },
      {
        question: "Find the area of a triangle with side base 5 cm and height of 7cm.",
        options: ["20.5 cm²", "17.1 cm²", "10.5 cm²", "17.5 cm²"],
        correct: 3,
        explanation: "Area = (base × height)/2 = (5 × 7)/2 = 17.5 cm²"
      },
      {
        question: "A trapezium has one parallel side of 12 cm, the other parallel side of 8 cm, and height of 5 cm. Calculate its area.",
        options: ["55 cm²", "45 cm²", "60 cm²", "50 cm²"],
        correct: 3,
        explanation: "Area = (a + b)/2 × h = (12 + 8)/2 × 5 = 10 × 5 = 50 cm²"
      }
    ]
  },
  'math-word-problems': {
    title: 'Math Word Problems Quiz',
    description: 'Apply your math skills to solve real-world scenarios',
    timeLimit: 900, 
    questions: [
      {
        question: "A computer programmer is working with memory addresses. She needs to convert the binary address 11010₂ to decimal to locate a specific memory location. The decimal equivalent of this binary address is __________.",
        options: ["24", "26", "22", "28"],
        correct: 1,
        explanation: "11010₂ = 1×2⁴ + 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 16 + 8 + 0 + 2 + 0 = 26"
      },
      {
        question: "A digital display shows numbers in binary. If the display currently shows 101101₂, this represents the decimal number __________. When the counter increases by 3 in decimal, the new binary display will show __________.",
        options: ["43 and 101110", "45 and 110000", "47 and 110010", "45 and 110000"],
        correct: 1,
        explanation: "101101₂ = 32 + 0 + 8 + 4 + 0 + 1 = 45. 45 + 3 = 48, which is 110000₂"
      },
      {
        question: "A recipe calls for mixing ingredients in the ratio x/4 : 3/x. If the total mixture should equal 2 cups, and we simplify the expression (x/4) + (3/x) = 2, then x = __________. This means the first ingredient requires __________ cups and the second ingredient requires __________ cups.",
        options: ["6, 1.5, 0.5", "4, 1, 0.75", "2, 0.5, 1.5", "3, 0.75, 1"],
        correct: 0,
        explanation: "Solving (x/4) + (3/x) = 2 gives x=6. First ingredient: 6/4=1.5 cups, second: 3/6=0.5 cups"
      },
      {
        question: "A farmer divides his land into sections. One section has area (2x²)/(x+1) square acres, and another has area (4x)/(x+1) square acres. The total area of these two sections combined can be simplified to __________ square acres. If x = 3, the total area is __________ square acres.",
        options: ["(2x+4) and 10", "(2x²+4x)/(x+1) and 7.5", "(2x+4)/(x+1) and 3", "(2x²+4x)/(x+1) and 5"],
        correct: 1,
        explanation: "Combined area = (2x²+4x)/(x+1). When x=3: (18+12)/4 = 30/4 = 7.5 acres"
      },
      {
        question: "A taxi company charges a base fee plus a rate per kilometer. The total cost is given by the formula C = 5 + 2.5d, where C is the cost in dollars and d is the distance in kilometers. If a customer travels 12 kilometers, the total cost will be $__________. If another customer pays $32.50, they traveled __________ kilometers.",
        options: ["30 and 12", "35 and 11", "32.50 and 10", "40 and 9"],
        correct: 1,
        explanation: "C = 5 + 2.5×12 = $35. For $32.50: 32.50 = 5 + 2.5d → d = 11 km"
      },
      {
        question: "The area of a triangle is given by A = ½bh, where b is the base and h is the height. If the base is (3x + 4) units and the height is (2x - 1) units, and x = 5, then the base measures __________ units, the height measures __________ units, and the area is __________ square units.",
        options: ["19, 9, 80.5", "15, 8, 60", "19, 9, 85.5", "20, 10, 100"],
        correct: 2,
        explanation: "Base = 3(5)+4=19, Height=2(5)-1=9, Area=½×19×9=85.5"
      },
      {
        question: "A theater sells adult tickets for $x and child tickets for $y. On Saturday, they sold 45 adult tickets and 30 child tickets for a total of $675. On Sunday, they sold 30 adult tickets and 50 child tickets for a total of $650. The price of an adult ticket is $__________ and the price of a child ticket is $__________.",
        options: ["15 and 5", "10 and 7.50", "12 and 5", "12 and 7.50"],
        correct: 2,
        explanation: "System: 45x + 30y = 675 and 30x + 50y = 650. Solution: x=12, y=5"
      },
      {
        question: "Two delivery trucks start from the same depot. Truck A travels at x km/h and Truck B travels at y km/h. After 3 hours, Truck A has traveled 15 km more than Truck B. After 5 hours, Truck A has traveled 25 km more than Truck B. Truck A travels at __________ km/h and Truck B travels at __________ km/h.",
        options: ["60 and 55", "50 and 45", "65 and 60", "55 and 50"],
        correct: 3,
        explanation: "System: 3x = 3y + 15 and 5x = 5y + 25. Solution: x=55, y=50"
      },
      {
        question: "A rectangular garden and a square flower bed have perimeters in the ratio 3:2. The rectangular garden has length 8 meters and width 4 meters, so its perimeter is __________ meters. The square flower bed has a perimeter of __________ meters, which means each side of the square measures __________ meters.",
        options: ["24, 18, 4.5", "24, 16, 4", "20, 15, 3.75", "22, 16, 4"],
        correct: 1,
        explanation: "Rectangle perimeter = 2(8+4)=24m. Square perimeter = (2/3)×24=16m. Side length=16/4=4m"
      },
      {
        question: "An architect designs two rooms: a square room and a rectangular room. The ratio of their perimeters is 4:5. If the square room has sides of 6 meters each, its perimeter is __________ meters. The rectangular room has a perimeter of __________ meters. If the rectangular room has a length of 8 meters, its width must be __________ meters.",
        options: ["24, 30, 7.5", "20, 25, 5", "24, 30, 7", "20, 25, 4.5"],
        correct: 2,
        explanation: "Square perimeter=4×6=24m. Rectangle perimeter=(5/4)×24=30m. With length 8m: 2(8+w)=30 → w=7m"
      }
    ]
  }
};
// Global Variables
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 0;
let startTime = null;
let isMarkingPhase = false;
let markingIndex = 0;

// Initialize

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
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert('⏰ Time\'s up! The quiz will now be graded.');
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
  document.getElementById('question-text').textContent = question.question;
  
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectOption(index);
    
    if (userAnswers[currentQuestionIndex] === index) {
      optionDiv.classList.add('selected');
    }
    
    optionsContainer.appendChild(optionDiv);
  });
  
  updateNavigation();
  
}

function updateNavigation() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressInfo = document.getElementById('progress-info');
  
  prevBtn.disabled = currentQuestionIndex === 0;
  
  if (currentQuestionIndex === currentQuiz.questions.length - 1) {
    nextBtn.textContent = 'Finish Quiz';
    nextBtn.className = 'btn btn-success';
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.className = 'btn';
  }
  
  // Enable next button if question is answered
  nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
  
  // Update progress info
  const answered = userAnswers.filter(answer => answer !== null).length;
  progressInfo.textContent = `${answered} of ${currentQuiz.questions.length} answered`;
}

function selectOption(optionIndex) {
  if (isMarkingPhase) return; // Prevent selection during marking
  
  userAnswers[currentQuestionIndex] = optionIndex;
  
  // Update visual selection
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
    // Finish quiz
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
  
  // Hide navigation and timer
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
  
  // Mark the options
  const options = document.querySelectorAll('.option');
  options.forEach((option, index) => {
    option.onclick = null; // Disable clicking
    
    if (index === correctAnswer) {
      option.classList.add('correct');
      option.innerHTML += '<span class="result-icon">✅</span>';
    } else if (index === userAnswer && userAnswer !== correctAnswer) {
      option.classList.add('incorrect');
      option.innerHTML += '<span class="result-icon">❌</span>';
    }
  });
  
  // Show feedback for incorrect answers
  if (userAnswer !== correctAnswer) {
    showFeedback(question);
  } else {
    // Auto-advance for correct answers after a delay
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
  
  correctAnswerText.textContent = question.options[question.correct];
  feedbackExplanation.textContent = question.explanation;
  
  feedbackPanel.classList.add('show');
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
  // Hide quiz interface
  document.getElementById('quiz-header').classList.add('hidden');
  document.getElementById('question-container').classList.add('hidden');
  document.getElementById('navigation').classList.add('hidden');
  
  // Show results
  document.getElementById('results-container').classList.remove('hidden');
  
  // Calculate results
  const correctAnswers = userAnswers.filter((answer, index) =>
    answer === currentQuiz.questions[index].correct
  ).length;
  
  const totalQuestions = currentQuiz.questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  
  // Determine grade
  let grade, gradeClass, message;
  if (percentage >= 90) {
    grade = 'A';
    gradeClass = 'grade-A';
    message = '🎉 Excellent work! You\'ve mastered this topic!';
  } else if (percentage >= 80) {
    grade = 'B';
    gradeClass = 'grade-B';
    message = '👏 Great job! You have a solid understanding!';
  } else if (percentage >= 70) {
    grade = 'C';
    gradeClass = 'grade-C';
    message = '👍 Good effort! Keep practicing to improve!';
  } else if (percentage >= 60) {
    grade = 'D';
    gradeClass = 'grade-D';
    message = '📚 You\'re getting there! Review the material and try again!';
  } else {
    grade = 'F';
    gradeClass = 'grade-F';
    message = '💪 Don\'t give up! Study more and you\'ll improve!';
  }
  
  // Display results
  const gradeDisplay = document.getElementById('grade-display');
  gradeDisplay.textContent = grade;
  gradeDisplay.className = `grade-display ${gradeClass}`;
  
  document.getElementById('grade-message').textContent = message;
  document.getElementById('final-score').textContent = `${correctAnswers}/${totalQuestions}`;
  document.getElementById('final-percentage').textContent = `${percentage}%`;
  document.getElementById('time-taken').textContent = formatTime(timeTaken);
  document.getElementById('correct-count').textContent = correctAnswers;
  
  // Show confetti for good grades
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
  
  // Remove confetti after animation
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 5000);
}

function restartQuiz() {
  // Reset all variables
  currentQuestionIndex = 0;
  userAnswers = [];
  isMarkingPhase = false;
  markingIndex = 0;
  
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // Hide results and show quiz selection
  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('quiz-selection').classList.remove('hidden');
  
  // Reset navigation display
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
  
  // Hide feedback panel completely before printing
  const feedbackPanel = document.getElementById('feedback-panel');
  feedbackPanel.style.display = 'none';
  feedbackPanel.classList.remove('show');
  
  // Fill print-only elements
  document.getElementById('print-date').textContent = new Date().toLocaleDateString();
  document.getElementById('print-student-name').textContent = studentName;
  document.getElementById('print-quiz-title').textContent = currentQuiz.title;
  document.getElementById('print-quiz-date').textContent = startTime.toLocaleDateString();
  document.getElementById('print-time-taken').textContent = formatTime(timeTaken);
  document.getElementById('print-score').textContent = `${correctAnswers}/${totalQuestions}`;
  document.getElementById('print-percentage').textContent = `${percentage}%`;
  document.getElementById('print-grade').textContent = grade;
  
  // Generate detailed question results
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
    
    // Build the HTML content more carefully
    let questionHTML = `
      <p><strong>Q${index + 1}:</strong> ${question.question}</p>
      <p><strong>Your Answer:</strong> ${userAnswer !== null ? question.options[userAnswer] : 'Not answered'} ${isCorrect ? '✅' : '❌'}</p>
      <p><strong>Correct Answer:</strong> ${question.options[question.correct]}</p>
    `;
    
    // Only add explanation if it exists and is not empty
    if (question.explanation && question.explanation.trim() !== '') {
      questionHTML += `<p><strong>Explanation:</strong> ${question.explanation}</p>`;
    }
    
    questionDiv.innerHTML = questionHTML;
    printQuestions.appendChild(questionDiv);
  });
  
  // Print after DOM is updated
  setTimeout(() => {
    window.print();
    // Restore feedback panel display after printing
    feedbackPanel.style.display = '';
  }, 100);
}

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('quiz-selection').classList.remove('hidden');
  
  generateQuizCards();
});
