function generateQuadraticQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = [
    'factoring',
    'quadratic-formula',
    'completing-square',
    'difference-squares',
    'perfect-squares',
    'word-problems',
    'all'
  ];
  
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'factoring':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'quadratic-formula':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    case 'completing-square':
      questionTypes = Array.from({ length: count }, () => 2);
      break;
    case 'difference-squares':
      questionTypes = Array.from({ length: count }, () => 3);
      break;
    case 'perfect-squares':
      questionTypes = Array.from({ length: count }, () => 4);
      break;
    case 'word-problems':
      questionTypes = Array.from({ length: count }, () => 5);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 6));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generateFactoringQuestion();
        case 1:
          return generateQuadraticFormulaQuestion();
        case 2:
          return generateCompletingSquareQuestion();
        case 3:
          return generateDifferenceOfSquaresQuestion();
        case 4:
          return generatePerfectSquareQuestion();
        case 5:
          return generateWordProblemQuestion();
        default:
          return generateFactoringQuestion();
      }
    } catch (error) {
      console.error('Error generating quadratic question:', error);
      return {
        question: 'Solve by factoring: \\(x^2 + 5x + 6 = 0\\)',
        options: ['\\(x = -2, -3\\)', '\\(x = 2, 3\\)', '\\(x = -1, -6\\)', '\\(x = 1, 6\\)'],
        correct: 0,
        explanation: 'The equation factors as \\((x + 2)(x + 3) = 0\\), so solutions are \\(x = -2\\) and \\(x = -3\\)'
      };
    }
  });
}

// Helper function to format quadratic equations
function formatQuadratic(a, b, c) {
  let equation = '';
  
  // Handle x² term
  if (a === 1) {
    equation += 'x^2';
  } else if (a === -1) {
    equation += '-x^2';
  } else {
    equation += `${a}x^2`;
  }
  
  // Handle x term
  if (b > 0) {
    equation += ` + ${b === 1 ? '' : b}x`;
  } else if (b < 0) {
    equation += ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;
  }
  
  // Handle constant term
  if (c > 0) {
    equation += ` + ${c}`;
  } else if (c < 0) {
    equation += ` - ${Math.abs(c)}`;
  }
  
  return equation;
}

// Helper function to get factored form
function getFactoredForm(a, b, c, roots) {
  if (a === 1) {
    return `(x ${roots[0] >= 0 ? '-' : '+'} ${Math.abs(roots[0])})(x ${roots[1] >= 0 ? '-' : '+'} ${Math.abs(roots[1])})`;
  } else {
    // For a ≠ 1, we need to find factors
    const factor1 = gcd(a, roots[0]);
    const factor2 = gcd(a, roots[1]);
    return `(${a/factor1}x ${roots[0] >= 0 ? '-' : '+'} ${Math.abs(roots[0])})(${a/factor2}x ${roots[1] >= 0 ? '-' : '+'} ${Math.abs(roots[1])})`;
  }
}

// GCD helper function
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Generate random integer roots first, then create equation
function generateQuadraticWithIntegerRoots() {
  // Generate random integer roots between -8 and 8, excluding 0
  let root1, root2;
  do {
    root1 = Math.floor(Math.random() * 17) - 8; // -8 to 8
    root2 = Math.floor(Math.random() * 17) - 8; // -8 to 8
  } while (root1 === 0 || root2 === 0);
  
  // Random a coefficient (1, 2, or 3 for simplicity)
  const a = [1, 2, 3][Math.floor(Math.random() * 3)];
  
  // Calculate b and c using Vieta's formulas: 
  // For roots r1 and r2: x² - (r1 + r2)x + (r1 * r2) = 0
  // So for a(x² + bx + c): b = -a(r1 + r2), c = a(r1 * r2)
  const b = -a * (root1 + root2);
  const c = a * (root1 * root2);
  
  return { a, b, c, roots: [root1, root2] };
}

// Factoring quadratic equations
function generateFactoringQuestion() {
  const { a, b, c, roots } = generateQuadraticWithIntegerRoots();
  
  const questionTypes = [
    {
      type: 'solve-factoring',
      question: `Solve by factoring: \\(${formatQuadratic(a, b, c)} = 0\\)`,
      answer: `x = ${roots[0]}, ${roots[1]}`,
      explanation: `
<div><strong>Step 1: Factor the quadratic</strong></div>
<div>\\(${formatQuadratic(a, b, c)} = ${getFactoredForm(a, b, c, roots)}\\)</div>
<div></div>
<div><strong>Step 2: Set each factor equal to zero</strong></div>
<div>\\(x ${roots[0] >= 0 ? '-' : '+'} ${Math.abs(roots[0])} = 0\\) → \\(x = ${roots[0]}\\)</div>
<div>\\(x ${roots[1] >= 0 ? '-' : '+'} ${Math.abs(roots[1])} = 0\\) → \\(x = ${roots[1]}\\)</div>
<div></div>
<div><strong>Solution:</strong> \\(x = ${roots[0]}, ${roots[1]}\\)</div>
      `.trim()
    },
    {
      type: 'find-factors',
      question: `Factor completely: \\(${formatQuadratic(a, b, c)}\\)`,
      answer: getFactoredForm(a, b, c, roots),
      explanation: `
<div><strong>Factoring Process:</strong></div>
<div>We need two numbers that multiply to \\(${a * c}\\) and add to \\(${b}\\)</div>
<div>Numbers: ${-a * roots[0]} and ${-a * roots[1]}</div>
<div></div>
<div><strong>Factored form:</strong> \\(${getFactoredForm(a, b, c, roots)}\\)</div>
      `.trim()
    }
  ];
  
  const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const { options, correctIndex } = generateQuadraticOptions(
    selectedType.answer,
    selectedType.type,
    { a, b, c, roots }
  );
  
  return {
    question: selectedType.question,
    options: options,
    correct: correctIndex,
    explanation: selectedType.explanation
  };
}

// Quadratic formula questions
function generateQuadraticFormulaQuestion() {
  const { a, b, c, roots } = generateQuadraticWithIntegerRoots();
  
  const question = `Solve using the quadratic formula: \\(${formatQuadratic(a, b, c)} = 0\\)`;
  
  const discriminant = b * b - 4 * a * c;
  const explanation = `
<div><strong>Quadratic Formula:</strong> \\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)</div>
<div></div>
<div><strong>Given:</strong> \\(a = ${a}, b = ${b}, c = ${c}\\)</div>
<div></div>
<div><strong>Step 1: Calculate discriminant</strong></div>
<div>\\(D = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}\\)</div>
<div></div>
<div><strong>Step 2: Apply quadratic formula</strong></div>
<div>\\(x = \\frac{-(${b}) \\pm \\sqrt{${discriminant}}}{2(${a})}\\)</div>
<div>\\(x = \\frac{${-b} \\pm ${Math.sqrt(discriminant)}}{${2 * a}}\\)</div>
<div></div>
<div><strong>Step 3: Calculate both solutions</strong></div>
<div>\\(x_1 = \\frac{${-b} + ${Math.sqrt(discriminant)}}{${2 * a}} = ${roots[0]}\\)</div>
<div>\\(x_2 = \\frac{${-b} - ${Math.sqrt(discriminant)}}{${2 * a}} = ${roots[1]}\\)</div>
<div></div>
<div><strong>Solution:</strong> \\(x = ${roots[0]}, ${roots[1]}\\)</div>
  `.trim();
  
  const { options, correctIndex } = generateQuadraticOptions(
    `x = ${roots[0]}, ${roots[1]}`,
    'quadratic-formula',
    { a, b, c, roots }
  );
  
  return {
    question: question,
    options: options,
    correct: correctIndex,
    explanation: explanation
  };
}

// Difference of squares questions
function generateDifferenceOfSquaresQuestion() {
  // Generate random integers for difference of squares: a² - b² = (a-b)(a+b)
  const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const b = Math.floor(Math.random() * (a - 1)) + 1; // 1 to a-1
  
  const questionTypes = [
    {
      type: 'factor-difference',
      question: `Factor: \\(${a*a} - ${b*b}\\)`,
      answer: `(${a} - ${b})(${a} + ${b})`,
      explanation: `
<div><strong>Difference of Squares Formula:</strong> \\(a^2 - b^2 = (a - b)(a + b)\\)</div>
<div></div>
<div>\\(${a*a} - ${b*b} = ${a}^2 - ${b}^2\\)</div>
<div>\\(= (${a} - ${b})(${a} + ${b})\\)</div>
      `.trim()
    },
    {
      type: 'solve-difference',
      question: `Solve: \\(x^2 - ${b*b} = 0\\)`,
      answer: `x = ${b}, -${b}`,
      explanation: `
<div><strong>Difference of Squares:</strong> \\(x^2 - ${b*b} = x^2 - ${b}^2\\)</div>
<div>\\(= (x - ${b})(x + ${b}) = 0\\)</div>
<div></div>
<div><strong>Solutions:</strong></div>
<div>\\(x - ${b} = 0\\) → \\(x = ${b}\\)</div>
<div>\\(x + ${b} = 0\\) → \\(x = -${b}\\)</div>
<div></div>
<div><strong>Solution:</strong> \\(x = ${b}, -${b}\\)</div>
      `.trim()
    }
  ];
  
  const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const { options, correctIndex } = generateQuadraticOptions(
    selectedType.answer,
    'difference-squares',
    { a, b }
  );
  
  return {
    question: selectedType.question,
    options: options,
    correct: correctIndex,
    explanation: selectedType.explanation
  };
}

// Perfect square questions
function generatePerfectSquareQuestion() {
  // Generate random integers for perfect square: (a ± b)² = a² ± 2ab + b²
  const a = Math.floor(Math.random() * 6) + 2; // 2 to 7
  const b = Math.floor(Math.random() * 4) + 1; // 1 to 4
  const sign = Math.random() > 0.5 ? '+' : '-';
  
  const expanded = sign === '+' ? 
    `x^2 + ${2*a*b}x + ${a*a + b*b + 2*a*b}` : 
    `x^2 - ${2*a*b}x + ${a*a + b*b - 2*a*b}`;
  
  const factored = sign === '+' ? 
    `(x + ${a + b})^2` : 
    `(x - ${a + b})^2`;
  
  const question = `Factor the perfect square: \\(${expanded}\\)`;
  
  const explanation = `
<div><strong>Perfect Square Formula:</strong> \\((a \\pm b)^2 = a^2 \\pm 2ab + b^2\\)</div>
<div></div>
<div><strong>Given:</strong> \\(${expanded}\\)</div>
<div></div>
<div><strong>Recognize pattern:</strong></div>
<div>First term: \\(x^2\\) = \\((x)^2\\)</div>
<div>Last term: \\(${sign === '+' ? a*a + b*b + 2*a*b : a*a + b*b - 2*a*b}\\) = \\((${a + b})^2\\)</div>
<div>Middle term: \\(${sign === '+' ? 2*a*b : -2*a*b}x\\) = \\(${sign} 2(x)(${a + b})\\)</div>
<div></div>
<div><strong>Factored form:</strong> \\(${factored}\\)</div>
  `.trim();
  
  const { options, correctIndex } = generateQuadraticOptions(
    factored,
    'perfect-square',
    { a, b, sign }
  );
  
  return {
    question: question,
    options: options,
    correct: correctIndex,
    explanation: explanation
  };
}

// Completing the square questions
function generateCompletingSquareQuestion() {
  // Generate simple perfect square to start
  const n = Math.floor(Math.random() * 5) + 2; // 2 to 6
  const equation = `x^2 + ${2*n}x + ${n*n} = 0`;
  
  const question = `Solve by completing the square: \\(${equation}\\)`;
  
  const explanation = `
<div><strong>Step 1: Move constant to right side</strong></div>
<div>\\(x^2 + ${2*n}x = -${n*n}\\)</div>
<div></div>
<div><strong>Step 2: Complete the square</strong></div>
<div>Take half of ${2*n}, square it: \\((\\frac{${2*n}}{2})^2 = (${n})^2 = ${n*n}\\)</div>
<div>Add to both sides: \\(x^2 + ${2*n}x + ${n*n} = -${n*n} + ${n*n}\\)</div>
<div>\\((x + ${n})^2 = 0\\)</div>
<div></div>
<div><strong>Step 3: Solve</strong></div>
<div>\\(x + ${n} = 0\\)</div>
<div>\\(x = -${n}\\)</div>
<div></div>
<div><strong>Solution:</strong> \\(x = -${n}\\) (double root)</div>
  `.trim();
  
  const { options, correctIndex } = generateQuadraticOptions(
    `x = -${n}`,
    'completing-square',
    { n }
  );
  
  return {
    question: question,
    options: options,
    correct: correctIndex,
    explanation: explanation
  };
}

// Word problems
function generateWordProblemQuestion() {
  const problems = [
    {
      type: 'area',
      question: `The area of a rectangle is 24 square units. If the length is 2 units more than the width, find the dimensions.`,
      equation: 'w(w + 2) = 24',
      solution: 'Width = 4, Length = 6',
      explanation: `
<div><strong>Let width = w, length = w + 2</strong></div>
<div>Area: \\(w(w + 2) = 24\\)</div>
<div>\\(w^2 + 2w - 24 = 0\\)</div>
<div>\\((w + 6)(w - 4) = 0\\)</div>
<div>\\(w = -6\\) or \\(w = 4\\)</div>
<div>Width cannot be negative, so \\(w = 4\\)</div>
<div>Length = \\(4 + 2 = 6\\)</div>
<div><strong>Answer:</strong> Width = 4 units, Length = 6 units</div>
      `.trim()
    },
    {
      type: 'consecutive',
      question: `The product of two consecutive integers is 42. Find the integers.`,
      equation: 'n(n + 1) = 42',
      solution: '6 and 7, or -7 and -6',
      explanation: `
<div><strong>Let integers be n and n + 1</strong></div>
<div>\\(n(n + 1) = 42\\)</div>
<div>\\(n^2 + n - 42 = 0\\)</div>
<div>\\((n + 7)(n - 6) = 0\\)</div>
<div>\\(n = -7\\) or \\(n = 6\\)</div>
<div><strong>Solutions:</strong> 6 and 7, or -7 and -6</div>
      `.trim()
    }
  ];
  
  const selected = problems[Math.floor(Math.random() * problems.length)];
  const { options, correctIndex } = generateQuadraticOptions(
    selected.solution,
    'word-problem',
    selected
  );
  
  return {
    question: selected.question,
    options: options,
    correct: correctIndex,
    explanation: selected.explanation
  };
}

// Options generator for quadratic questions
function generateQuadraticOptions(correctAnswer, questionType, data) {
  const options = new Set([correctAnswer]);
  
  if (questionType === 'solve-factoring' || questionType === 'quadratic-formula') {
    // Common mistakes: wrong signs, wrong order
    const [root1, root2] = data.roots;
    options.add(`x = ${root2}, ${root1}`);
    options.add(`x = ${-root1}, ${-root2}`);
    options.add(`x = ${root1 + 1}, ${root2 + 1}`);
    
  } else if (questionType === 'find-factors') {
    // Wrong factoring attempts
    options.add(`(x + ${data.roots[0]})(x + ${data.roots[1]})`);
    options.add(`(x - ${data.roots[0]})(x - ${data.roots[1]})`);
    options.add(`(x + ${data.a})(${data.a}x + ${data.c/data.a})`);
    
  } else if (questionType === 'difference-squares') {
    // Wrong difference of squares attempts
    options.add(`(${data.a} + ${data.b})^2`);
    options.add(`(${data.a} - ${data.b})^2`);
    options.add(`(${data.a} + ${data.b})(${data.a} - ${data.b + 1})`);
    
  } else if (questionType === 'perfect-square') {
    // Wrong perfect square attempts
    const n = data.a + data.b;
    options.add(`(x + ${n - 1})^2`);
    options.add(`(x - ${n - 1})^2`);
    options.add(`(x + ${n})(x - ${n})`);
    
  } else if (questionType === 'completing-square') {
    // Wrong completing square attempts
    options.add(`x = ${data.n}`);
    options.add(`x = ${-data.n - 1}`);
    options.add(`x = ${data.n + 1}`);
    
  } else if (questionType === 'word-problem') {
    // Wrong word problem answers
    if (data.type === 'area') {
      options.add('Width = 3, Length = 8');
      options.add('Width = 6, Length = 4');
      options.add('Width = 2, Length = 12');
    } else if (data.type === 'consecutive') {
      options.add('7 and 8');
      options.add('5 and 6');
      options.add('-6 and -5');
    }
  }
  
  // Convert to array and ensure we have exactly 4 options
  let optionsArray = Array.from(options);
  
  // Add generic wrong options if needed
  const genericWrongOptions = [
    'x = 0, 1',
    'x = 1, 2', 
    'x = -1, -2',
    'No solution',
    'x = 0',
    'x = 1'
  ];
  
  while (optionsArray.length < 4) {
    const randomOption = genericWrongOptions[Math.floor(Math.random() * genericWrongOptions.length)];
    if (!optionsArray.includes(randomOption)) {
      optionsArray.push(randomOption);
    }
  }
  
  // Ensure we have exactly 4 options
  optionsArray = optionsArray.slice(0, 4);
  
  // Shuffle and find correct index
  const shuffledOptions = shuffleArray(optionsArray);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  
  return {
    options: shuffledOptions.map(opt => `\\(${opt}\\)`),
    correctIndex: correctIndex
  };
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

window.quadraticAlgebra = {
  generateQuadraticQuestions,
  generateFactoringQuestion,
  generateQuadraticFormulaQuestion,
  generateCompletingSquareQuestion,
  generateDifferenceOfSquaresQuestion,
  generatePerfectSquareQuestion,
  generateWordProblemQuestion
};