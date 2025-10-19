// quadratic-equations.js
function generateQuadraticEquationQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = ['factorable', 'quadratic-formula', 'all'];
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'factorable':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'quadratic-formula':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 2));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generateFactorableEquationQuestion();
        case 1:
          return generateQuadraticFormulaQuestion();
        default:
          return generateFactorableEquationQuestion();
      }
    } catch (error) {
      console.error('Error generating quadratic equation question:', error);
      // Return a fallback question
      return {
        question: 'Solve: \\(x^2 + 5x + 6 = 0\\)',
        options: ['\\(x = -2, -3\\)', '\\(x = 2, 3\\)', '\\(x = -1, -6\\)', '\\(x = 1, 6\\)'],
        correct: 0,
        explanation: 'Factor: \\((x + 2)(x + 3) = 0\\) → \\(x = -2\\) or \\(x = -3\\)'
      };
    }
  });
}

function generateFactorableEquationQuestion() {
  const coefficients = [1, 2, 3, 4, 5];
  const a = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  // Generate random integer roots
  let root1, root2;
  do {
    root1 = Math.floor(Math.random() * 8) - 4; // -4 to 4
    root2 = Math.floor(Math.random() * 8) - 4; // -4 to 4
  } while (root1 === 0 || root2 === 0 || root1 === root2);
  
  // Expand a(x - r1)(x - r2) = 0
  const expandedA = a;
  const expandedB = -a * (root1 + root2);
  const expandedC = a * root1 * root2;
  
  const equation = formatQuadraticEquation(expandedA, expandedB, expandedC);
  const correctSolution = formatSolution(root1, root2);
  
  const { options, correctIndex } = generateEquationOptions(correctSolution, root1, root2, equation);
  
  return {
    question: `Solve: \\(${equation}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method: Factoring</strong></div>
<div></div>
<div><strong>Given:</strong> \\(${equation}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Factor the quadratic:</div>
<div>\\(${formatFactoredForm(a, root1, root2)} = 0\\)</div>
<div></div>
<div>Set each factor equal to zero:</div>
<div>\\(${formatTerm(a, 'x')} ${-a * root1 >= 0 ? '+' : '-'} ${Math.abs(a * root1)} = 0\\) → \\(x = ${root1}\\)</div>
<div>\\(x ${-root2 >= 0 ? '+' : '-'} ${Math.abs(root2)} = 0\\) → \\(x = ${root2}\\)</div>
<div></div>
<div><strong>Solutions:</strong> \\(x = ${root1}\\) and \\(x = ${root2}\\)</div>
    `.trim()
  };
}

function generateQuadraticFormulaQuestion() {
  const coefficients = [1, 2, 3, 4, 5];
  const a = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  // Generate roots that may not be integers to force quadratic formula
  let root1, root2;
  const useIntegerRoots = Math.random() > 0.5;
  
  if (useIntegerRoots) {
    do {
      root1 = Math.floor(Math.random() * 8) - 4;
      root2 = Math.floor(Math.random() * 8) - 4;
    } while (root1 === 0 || root2 === 0 || root1 === root2);
  } else {
    // Generate non-integer roots
    const discriminant = Math.floor(Math.random() * 20) + 5; // 5 to 24
    const sqrtDiscriminant = Math.sqrt(discriminant);
    root1 = (Math.floor(Math.random() * 6) - 3) + sqrtDiscriminant; // -3 to 2 + √d
    root2 = (Math.floor(Math.random() * 6) - 3) - sqrtDiscriminant; // -3 to 2 - √d
  }
  
  // Expand a(x - r1)(x - r2) = 0
  const expandedA = a;
  const expandedB = -a * (root1 + root2);
  const expandedC = a * root1 * root2;
  
  const equation = formatQuadraticEquation(expandedA, expandedB, expandedC);
  const correctSolution = formatSolution(root1, root2);
  
  const { options, correctIndex } = generateEquationOptions(correctSolution, root1, root2, equation);
  
  const discriminant = expandedB * expandedB - 4 * expandedA * expandedC;
  const sqrtDiscriminant = Math.sqrt(discriminant);
  
  return {
    question: `Solve: \\(${equation}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method: Quadratic Formula</strong></div>
<div>\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)</div>
<div></div>
<div><strong>Given:</strong> \\(${equation}\\)</div>
<div>\\(a = ${expandedA}, b = ${expandedB}, c = ${expandedC}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Discriminant: \\(b^2 - 4ac = (${expandedB})^2 - 4(${expandedA})(${expandedC}) = ${discriminant}\\)</div>
<div>\\(\\sqrt{\\text{discriminant}} = \\sqrt{${discriminant}} = ${formatSqrt(discriminant)}\\)</div>
<div></div>
<div>\\(x = \\frac{-(${expandedB}) \\pm ${formatSqrt(discriminant)}}{2(${expandedA})}\\)</div>
<div>\\(x = \\frac{${-expandedB} \\pm ${formatSqrt(discriminant)}}{${2 * expandedA}}\\)</div>
<div></div>
<div><strong>Solutions:</strong> \\(x = ${formatRoot(root1)}\\) and \\(x = ${formatRoot(root2)}\\)</div>
    `.trim()
  };
}

// EQUATION OPTIONS GENERATION

function generateEquationOptions(correctSolution, root1, root2, equation) {
  const wrongSolutions = new Set();
  
  try {
    // Parse the equation to understand coefficients
    const coeffs = parseQuadraticEquation(equation);
    if (!coeffs) throw new Error('Invalid equation');
    
    const {a, b, c} = coeffs;
    
    // Generate mathematically plausible wrong solutions
    const strategies = [
      // Wrong signs
      () => generateWrongSignSolutions(root1, root2),
      // Wrong factor pairs
      () => generateWrongFactorSolutions(a, b, c),
      // Calculation errors in quadratic formula
      () => generateCalculationErrorSolutions(a, b, c),
      // Mixed up sum and product
      () => generateSumProductErrorSolutions(root1, root2)
    ];
    
    // Generate wrong answers
    for (const strategy of strategies) {
      if (wrongSolutions.size >= 3) break;
      try {
        const wrongSolution = strategy();
        if (wrongSolution && wrongSolution !== correctSolution && 
            !wrongSolutions.has(wrongSolution) && isValidSolution(wrongSolution)) {
          wrongSolutions.add(wrongSolution);
        }
      } catch (error) {
        continue;
      }
    }
    
  } catch (error) {
    console.error('Error generating equation options:', error);
  }
  
  // Ensure we have exactly 3 wrong options
  while (wrongSolutions.size < 3) {
    const fallback = generateEquationFallback(root1, root2);
    if (fallback && fallback !== correctSolution && !wrongSolutions.has(fallback)) {
      wrongSolutions.add(fallback);
    }
  }
  
  const wrongArray = Array.from(wrongSolutions).slice(0, 3);
  const options = [correctSolution, ...wrongArray];
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctSolution);
  
  return {
    options: shuffledOptions.map(opt => `\\(${opt}\\)`),
    correctIndex: correctIndex
  };
}

function generateWrongSignSolutions(root1, root2) {
  const patterns = [
    `x = ${-root1}, ${-root2}`,                    // Both signs flipped
    `x = ${root1}, ${-root2}`,                     // One sign flipped
    `x = ${-root1}, ${root2}`,                     // Other sign flipped
    `x = ${Math.abs(root1)}, ${Math.abs(root2)}`,  // Both positive
  ];
  
  return patterns[Math.floor(Math.random() * patterns.length)];
}

function generateWrongFactorSolutions(a, b, c) {
  // Find wrong factor pairs that multiply to c and add to something close to b
  const targetSum = -b/a;
  const targetProduct = c/a;
  
  // Generate plausible wrong pairs
  const wrongPairs = [
    {r1: Math.floor(targetSum) + 1, r2: Math.floor(targetProduct / (Math.floor(targetSum) + 1))},
    {r1: Math.floor(targetSum) - 1, r2: Math.floor(targetProduct / (Math.floor(targetSum) - 1))},
    {r1: Math.floor(targetProduct / 2), r2: 2},
    {r1: -Math.floor(targetSum), r2: -Math.floor(targetProduct / Math.floor(targetSum))}
  ];
  
  for (const pair of wrongPairs) {
    if (pair.r1 !== 0 && pair.r2 !== 0 && pair.r1 !== pair.r2 && 
        Math.abs(pair.r1 + pair.r2 - targetSum) <= 3) {
      return `x = ${pair.r1}, ${pair.r2}`;
    }
  }
  
  return null;
}

function generateCalculationErrorSolutions(a, b, c) {
  const discriminant = b * b - 4 * a * c;
  
  // Common calculation errors in quadratic formula
  const errors = [
    // Forgot to divide by 2a
    () => {
      const num1 = -b + Math.sqrt(discriminant);
      const num2 = -b - Math.sqrt(discriminant);
      return `x = ${formatDecimal(num1)}, ${formatDecimal(num2)}`;
    },
    // Wrong sign in numerator
    () => {
      const num1 = b + Math.sqrt(discriminant);
      const num2 = b - Math.sqrt(discriminant);
      return `x = ${formatDecimal(num1/(2*a))}, ${formatDecimal(num2/(2*a))}`;
    },
    // Forgot the ±
    () => {
      const num = (-b + Math.sqrt(discriminant)) / (2 * a);
      return `x = ${formatDecimal(num)}`;
    },
    // Wrong discriminant calculation
    () => {
      const wrongDiscriminant = b * b + 4 * a * c; // Wrong sign
      const num1 = (-b + Math.sqrt(wrongDiscriminant)) / (2 * a);
      const num2 = (-b - Math.sqrt(wrongDiscriminant)) / (2 * a);
      return `x = ${formatDecimal(num1)}, ${formatDecimal(num2)}`;
    }
  ];
  
  const errorFn = errors[Math.floor(Math.random() * errors.length)];
  return errorFn();
}

function generateSumProductErrorSolutions(root1, root2) {
  // Common errors confusing sum and product of roots
  const errors = [
    `x = ${root1 + root2}, ${root1 * root2}`,           // Used sum and product as roots
    `x = ${-root1 - root2}, ${root1 * root2}`,          // Used negative sum and product
    `x = ${root1 + 1}, ${root2 + 1}`,                   // Off by one
    `x = ${root1 - 1}, ${root2 - 1}`                    // Off by one the other way
  ];
  
  return errors[Math.floor(Math.random() * errors.length)];
}

function generateEquationFallback(root1, root2) {
  const fallbacks = [
    `x = ${-root1}, ${-root2}`,
    `x = ${root1 + 1}, ${root2 + 1}`,
    `x = ${root1 - 1}, ${root2 - 1}`,
    `x = ${root2}, ${root1}`,  // Just swapped
    `x = ${Math.abs(root1)}, ${Math.abs(root2)}`
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// HELPER FUNCTIONS FOR QUADRATIC EQUATIONS

function formatQuadraticEquation(a, b, c) {
  let equation = '';
  
  // Format ax² term
  if (a !== 0) {
    if (a === 1) equation += 'x^2';
    else if (a === -1) equation += '-x^2';
    else equation += `${a}x^2`;
  }
  
  // Format bx term
  if (b !== 0) {
    if (b > 0 && equation !== '') equation += ' + ';
    else if (b < 0 && equation !== '') equation += ' - ';
    else if (b < 0) equation += '-';
    
    const absB = Math.abs(b);
    if (absB === 1) equation += 'x';
    else equation += `${absB}x`;
  }
  
  // Format constant term
  if (c !== 0) {
    if (c > 0 && equation !== '') equation += ' + ';
    else if (c < 0 && equation !== '') equation += ' - ';
    else if (c < 0) equation += '-';
    
    equation += `${Math.abs(c)}`;
  }
  
  return equation + ' = 0';
}

function formatSolution(root1, root2) {
  // Sort roots for consistent display
  const [r1, r2] = [root1, root2].sort((a, b) => a - b);
  return `x = ${formatRoot(r1)}, ${formatRoot(r2)}`;
}

function formatRoot(root) {
  if (Number.isInteger(root)) {
    return root.toString();
  } else {
    // Simplify common irrationals
    const simplified = simplifySurd(root);
    if (simplified) return simplified;
    return formatDecimal(root);
  }
}

function formatDecimal(num) {
  // Format to 2 decimal places, remove trailing .00
  const formatted = num.toFixed(2);
  return formatted.replace(/\.00$/, '');
}

function formatSqrt(value) {
  if (value < 0) return `\\sqrt{${value}}`;
  
  // Check for perfect squares
  const sqrt = Math.sqrt(value);
  if (Number.isInteger(sqrt)) {
    return sqrt.toString();
  }
  
  // Simplify surds
  for (let i = 2; i * i <= value; i++) {
    if (value % (i * i) === 0) {
      const coefficient = i;
      const remaining = value / (i * i);
      return `${coefficient}\\sqrt{${remaining}}`;
    }
  }
  
  return `\\sqrt{${value}}`;
}

function simplifySurd(root) {
  // Try to express as a ± b√c
  const rational = Math.round(root);
  if (Math.abs(root - rational) < 0.001) {
    return rational.toString();
  }
  
  // Check if it's of form (p ± √q)/r
  for (let r = 2; r <= 6; r++) {
    for (let p = -10; p <= 10; p++) {
      const discriminant = (root * r - p) ** 2;
      if (Math.abs(discriminant - Math.round(discriminant)) < 0.001 && Number.isInteger(Math.sqrt(Math.round(discriminant)))) {
        const q = Math.round(discriminant);
        const sqrtQ = Math.sqrt(q);
        if (Number.isInteger(sqrtQ)) {
          return `\\frac{${p} \\pm ${sqrtQ}}{${r}}`;
        }
      }
    }
  }
  
  return null;
}

function parseQuadraticEquation(equation) {
  // Parse equation of form ax² + bx + c = 0
  const cleaned = equation.replace(/\s+/g, '').replace('=0', '');
  const match = cleaned.match(/^(-?\d*)x\^2([+-]\d*)x([+-]\d+)$/);
  
  if (!match) return null;
  
  const a = match[1] === '' || match[1] === '-' ? (match[1] === '-' ? -1 : 1) : parseInt(match[1]);
  const b = parseInt(match[2]);
  const c = parseInt(match[3]);
  
  if (isNaN(a) || isNaN(b) || isNaN(c)) return null;
  
  return {a, b, c};
}

function isValidSolution(solution) {
  if (!solution) return false;
  if (solution.includes('NaN')) return false;
  if (!solution.includes('x =')) return false;
  
  try {
    // Basic validation - should have two numbers separated by comma
    const rootsMatch = solution.match(/x\s*=\s*([^,]+),\s*([^,]+)/);
    if (!rootsMatch) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

// Update quiz configuration
const quadraticEquationTopics = {
  'factorable-equations': {
    title: 'Factorable Quadratic Equations',
    description: 'Solve quadratic equations by factoring',
    generator: (count) => generateQuadraticEquationQuestions(count, 'factorable')
  },
  'quadratic-formula': {
    title: 'Quadratic Formula',
    description: 'Solve quadratic equations using the quadratic formula',
    generator: (count) => generateQuadraticEquationQuestions(count, 'quadratic-formula')
  },
  'all-quadratic-equations': {
    title: 'All Quadratic Equations',
    description: 'Mixed questions on solving quadratic equations',
    generator: (count) => generateQuadraticEquationQuestions(count, 'all')
  }
};

// Add to existing quiz configuration
Object.assign(quizTopics, quadraticEquationTopics);

// Add quadratic equations to algebra category
if (quizCategories.algebra) {
  quizCategories.algebra.topics.push(
    'factorable-equations',
    'quadratic-formula', 
    'all-quadratic-equations'
  );
}

// Export quadratic equation functions
window.quadraticEquationFunctions = {
  generateQuadraticEquationQuestions,
  generateFactorableEquationQuestion,
  generateQuadraticFormulaQuestion
};