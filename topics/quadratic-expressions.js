// quadratic.js
function generateQuadraticExpressionQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = ['perfect-squares', 'difference-squares', 'factors', 'all'];
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'perfect-squares':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'difference-squares':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    case 'factors':
      questionTypes = Array.from({ length: count }, () => 2);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 3));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generatePerfectSquareQuestion();
        case 1:
          return generateDifferenceOfSquaresQuestion();
        case 2:
          return generateFactorsQuestion();
        default:
          return generatePerfectSquareQuestion();
      }
    } catch (error) {
      console.error('Error generating quadratic question:', error);
      // Return a fallback question
      return {
        question: 'Factor: \\(x^2 + 6x + 9\\)',
        options: ['\\((x + 3)^2\\)', '\\((x + 2)^2\\)', '\\((x + 3)(x - 3)\\)', '\\((x + 6)^2\\)'],
        correct: 0,
        explanation: 'This is a perfect square trinomial: \\(x^2 + 6x + 9 = (x + 3)^2\\)'
      };
    }
  });
}

function generatePerfectSquareQuestion() {
  const coefficients = [1, 2, 3, 4, 5];
  const a = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  // Generate random integer roots
  let root1;
  do {
    root1 = Math.floor(Math.random() * 10) - 5; // -5 to 5
  } while (root1 === 0);
  
  // Expand (ax + b)^2 where b = -root1
  const b = -root1;
  const expandedA = a * a;
  const expandedB = 2 * a * b;
  const expandedC = b * b;
  
  const expression = formatQuadratic(expandedA, expandedB, expandedC);
  const factoredForm = `(${formatTerm(a, 'x')} ${b >= 0 ? '+' : '-'} ${Math.abs(b)})^2`;
  
  const { options, correctIndex } = generateQuadraticOptions(factoredForm, 'perfect-square', expression);
  
  return {
    question: `Factor: \\(${expression}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Perfect Square Trinomial Pattern:</strong> \\((ax + b)^2 = a^2x^2 + 2abx + b^2\\)</div>
<div></div>
<div><strong>Given:</strong> \\(${expression}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Identify the pattern:</div>
<div>\\(a^2 = ${expandedA}\\) → \\(a = ${a}\\)</div>
<div>\\(b^2 = ${expandedC}\\) → \\(b = ${Math.abs(b)}\\)</div>
<div>\\(2ab = ${expandedB}\\) → \\(2 × ${a} × ${Math.abs(b)} = ${expandedB}\\) ✓</div>
<div></div>
<div><strong>Factored form:</strong> \\(${factoredForm}\\)</div>
    `.trim()
  };
}

function generateDifferenceOfSquaresQuestion() {
  const coefficients = [1, 2, 3, 4, 5];
  const a = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  // Generate random integer for difference of squares: a^2x^2 - b^2
  let b;
  do {
    b = Math.floor(Math.random() * 8) + 1; // 1 to 8
  } while (b === 0);
  
  const expression = formatQuadratic(a * a, 0, -b * b);
  const factoredForm = `(${formatTerm(a, 'x')} + ${b})(${formatTerm(a, 'x')} - ${b})`;
  
  const { options, correctIndex } = generateQuadraticOptions(factoredForm, 'difference-squares', expression);
  
  return {
    question: `Factor: \\(${expression}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Difference of Squares Pattern:</strong> \\(a^2x^2 - b^2 = (ax + b)(ax - b)\\)</div>
<div></div>
<div><strong>Given:</strong> \\(${expression}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Identify the pattern:</div>
<div>\\(a^2 = ${a * a}\\) → \\(a = ${a}\\)</div>
<div>\\(b^2 = ${b * b}\\) → \\(b = ${b}\\)</div>
<div></div>
<div><strong>Factored form:</strong> \\(${factoredForm}\\)</div>
<div></div>
<div><strong>Verification:</strong> \\((ax + b)(ax - b) = a^2x^2 - b^2 = ${a * a}x^2 - ${b * b}\\)</div>
    `.trim()
  };
}

function generateFactorsQuestion() {
  const coefficients = [1, 2, 3, 4, 5];
  const a = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  // Generate random integer roots
  let root1, root2;
  do {
    root1 = Math.floor(Math.random() * 8) - 4; // -4 to 4
    root2 = Math.floor(Math.random() * 8) - 4; // -4 to 4
  } while (root1 === 0 || root2 === 0 || root1 === root2);
  
  // Expand a(x - r1)(x - r2)
  const expandedA = a;
  const expandedB = -a * (root1 + root2);
  const expandedC = a * root1 * root2;
  
  const expression = formatQuadratic(expandedA, expandedB, expandedC);
  const factoredForm = formatFactoredForm(a, root1, root2);
  
  const { options, correctIndex } = generateQuadraticOptions(factoredForm, 'factors', expression);
  
  return {
    question: `Factor: \\(${expression}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Factoring Quadratic Trinomials:</strong> Find two numbers that multiply to ac and add to b</div>
<div></div>
<div><strong>Given:</strong> \\(${expression}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(a = ${expandedA}, b = ${expandedB}, c = ${expandedC}\\)</div>
<div>We need two numbers that:</div>
<div>• Multiply to \\(a × c = ${expandedA} × ${expandedC} = ${expandedA * expandedC}\\)</div>
<div>• Add to \\(b = ${expandedB}\\)</div>
<div></div>
<div>The numbers are \\(${-root1 * a}\\) and \\(${-root2 * a}\\) because:</div>
<div>\\(${-root1 * a} × ${-root2 * a} = ${expandedA * expandedC}\\)</div>
<div>\\(${-root1 * a} + ${-root2 * a} = ${expandedB}\\)</div>
<div></div>
<div><strong>Factored form:</strong> \\(${factoredForm}\\)</div>
<div></div>
<div><strong>Roots:</strong> \\(x = ${-root1}\\) and \\(x = ${-root2}\\)</div>
    `.trim()
  };
}

// IMPROVED HELPER FUNCTIONS - BINOMIAL DISTRIBUTION OPTIONS

function generateQuadraticOptions(correctValue, type, expression) {
  const wrongExpressions = new Set();
  
  try {
    // Parse the correct factored form to understand its structure
    const correctFactors = parseFactoredForm(correctValue);
    
    // Generate binomial distribution options with conflicting signs and coefficients
    const strategies = [
      // Strategy 1: Swap signs in one factor
      () => swapSignsInFactors(correctFactors),
      
      // Strategy 2: Use wrong coefficient pairs with same sum/product relationships
      () => wrongCoefficientPairs(correctFactors, expression),
      
      // Strategy 3: Mix signs from different patterns
      () => mixedSignPatterns(correctFactors),
      
      // Strategy 4: Close but wrong factor pairs
      () => closeFactorPairs(correctFactors),
    ];
    
    // Generate wrong answers
    for (const strategy of strategies) {
      if (wrongExpressions.size >= 3) break;
      try {
        const wrongExpr = strategy();
        if (wrongExpr && wrongExpr !== correctValue && !wrongExpressions.has(wrongExpr) && 
            isValidBinomial(wrongExpr)) {
          wrongExpressions.add(wrongExpr);
        }
      } catch (error) {
        continue;
      }
    }
    
  } catch (error) {
    console.error('Error generating quadratic options:', error);
  }
  
  // Ensure we have exactly 3 wrong options
  while (wrongExpressions.size < 3) {
    const fallback = generateBinomialFallback(correctValue);
    if (fallback && fallback !== correctValue && !wrongExpressions.has(fallback)) {
      wrongExpressions.add(fallback);
    }
  }
  
  const wrongArray = Array.from(wrongExpressions).slice(0, 3);
  const options = [correctValue, ...wrongArray];
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctValue);
  
  return {
    options: shuffledOptions.map(opt => `\\(${opt}\\)`),
    correctIndex: correctIndex
  };
}

// BINOMIAL DISTRIBUTION STRATEGIES

function swapSignsInFactors(correctFactors) {
  if (correctFactors.length !== 2) return null;
  
  const factor1 = {...correctFactors[0]};
  const factor2 = {...correctFactors[1]};
  
  // Randomly choose which sign pattern to use
  const patterns = [
    // Both signs negative
    () => {
      factor1.constant = -Math.abs(factor1.constant);
      factor2.constant = -Math.abs(factor2.constant);
    },
    // Mixed signs (opposite of correct)
    () => {
      factor1.constant = -factor1.constant;
      factor2.constant = -factor2.constant;
    },
    // One sign flipped
    () => {
      if (Math.random() > 0.5) {
        factor1.constant = -factor1.constant;
      } else {
        factor2.constant = -factor2.constant;
      }
    }
  ];
  
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  pattern();
  
  return formatFactors([factor1, factor2]);
}

function wrongCoefficientPairs(correctFactors, expression) {
  if (correctFactors.length !== 2) return null;
  
  // Parse the original expression to get coefficients
  const coeffs = parseQuadraticExpression(expression);
  if (!coeffs) return null;
  
  const {a, b, c} = coeffs;
  const factor1 = {...correctFactors[0]};
  const factor2 = {...correctFactors[1]};
  
  // Find numbers that have similar sum/product relationships but are wrong
  const targetSum = -b/a;
  const targetProduct = c/a;
  
  // Generate wrong pairs that are mathematically plausible
  const wrongPairs = [
    // Same sum, wrong product
    {num1: factor1.constant + 1, num2: factor2.constant - 1},
    {num1: factor1.constant - 1, num2: factor2.constant + 1},
    {num1: factor1.constant + 2, num2: factor2.constant - 2},
    // Same product, wrong sum  
    {num1: -factor1.constant, num2: -factor2.constant},
    {num1: factor2.constant, num2: factor1.constant}
  ];
  
  for (const pair of wrongPairs) {
    const sum = pair.num1 + pair.num2;
    const product = pair.num1 * pair.num2;
    
    // Check if this pair is different from correct but still plausible
    if (Math.abs(sum - targetSum) <= 3 && Math.abs(product - targetProduct) <= 10 && 
        (sum !== targetSum || product !== targetProduct)) {
      factor1.constant = -pair.num1;
      factor2.constant = -pair.num2;
      return formatFactors([factor1, factor2]);
    }
  }
  
  return null;
}

function mixedSignPatterns(correctFactors) {
  if (correctFactors.length !== 2) return null;
  
  const factor1 = {...correctFactors[0]};
  const factor2 = {...correctFactors[1]};
  
  // Mix sign patterns that students commonly confuse
  const patterns = [
    // Perfect square pattern when it's not
    () => {
      const avg = (factor1.constant + factor2.constant) / 2;
      return `(${formatTerm(factor1.coefficient, 'x')} + ${Math.round(avg)})^2`;
    },
    // Difference of squares pattern when it's not
    () => {
      if (factor1.coefficient === factor2.coefficient) {
        const constant = Math.max(Math.abs(factor1.constant), Math.abs(factor2.constant));
        return `(${formatTerm(factor1.coefficient, 'x')} + ${constant})(${formatTerm(factor1.coefficient, 'x')} - ${constant})`;
      }
      return null;
    }
  ];
  
  for (const pattern of patterns) {
    const result = pattern();
    if (result) return result;
  }
  
  return null;
}

function closeFactorPairs(correctFactors) {
  if (correctFactors.length !== 2) return null;
  
  const factor1 = {...correctFactors[0]};
  const factor2 = {...correctFactors[1]};
  
  // Generate factors that are numerically close but wrong
  const variations = [
    {const1: factor1.constant + 1, const2: factor2.constant},
    {const1: factor1.constant, const2: factor2.constant + 1},
    {const1: factor1.constant - 1, const2: factor2.constant},
    {const1: factor1.constant, const2: factor2.constant - 1},
    {const1: factor1.constant + 1, const2: factor2.constant - 1},
    {const1: factor1.constant - 1, const2: factor2.constant + 1}
  ];
  
  const variation = variations[Math.floor(Math.random() * variations.length)];
  factor1.constant = variation.const1;
  factor2.constant = variation.const2;
  
  return formatFactors([factor1, factor2]);
}

function generateBinomialFallback(correctValue) {
  // Generate common binomial patterns as fallbacks
  const patterns = [
    '(x + 1)(x + 2)',
    '(x - 1)(x - 2)',
    '(x + 1)(x - 2)',
    '(x - 1)(x + 2)',
    '(2x + 1)(x + 1)',
    '(2x - 1)(x - 1)',
    '(x + 3)^2',
    '(x - 3)^2'
  ];
  
  // Filter out the correct value and return a random different one
  const available = patterns.filter(pattern => pattern !== correctValue);
  return available[Math.floor(Math.random() * available.length)];
}

function isValidBinomial(expression) {
  // Basic validation to ensure it's a proper binomial product
  if (!expression) return false;
  if (!expression.includes('(') || !expression.includes(')')) return false;
  if (expression.includes('NaN')) return false;
  
  try {
    const factors = parseFactoredForm(expression);
    return factors.length === 2 && 
           factors.every(factor => !isNaN(factor.coefficient) && !isNaN(factor.constant));
  } catch (error) {
    return false;
  }
}

function parseQuadraticExpression(expression) {
  // Parse quadratic expression of form ax² + bx + c
  const match = expression.match(/^(-?\d*)x\^2\s*([+-]\s*\d*)x\s*([+-]\s*\d+)$/);
  if (!match) return null;
  
  const a = match[1] === '' || match[1] === '-' ? (match[1] === '-' ? -1 : 1) : parseInt(match[1]);
  const b = parseInt(match[2].replace(/\s+/g, ''));
  const c = parseInt(match[3].replace(/\s+/g, ''));
  
  if (isNaN(a) || isNaN(b) || isNaN(c)) return null;
  
  return {a, b, c};
}

// HELPER FUNCTIONS FOR QUADRATICS

function formatQuadratic(a, b, c) {
  let expression = '';
  
  // Format ax² term
  if (a !== 0) {
    if (a === 1) expression += 'x^2';
    else if (a === -1) expression += '-x^2';
    else expression += `${a}x^2`;
  }
  
  // Format bx term
  if (b !== 0) {
    if (b > 0 && expression !== '') expression += ' + ';
    else if (b < 0 && expression !== '') expression += ' - ';
    else if (b < 0) expression += '-';
    
    const absB = Math.abs(b);
    if (absB === 1) expression += 'x';
    else expression += `${absB}x`;
  }
  
  // Format constant term
  if (c !== 0) {
    if (c > 0 && expression !== '') expression += ' + ';
    else if (c < 0 && expression !== '') expression += ' - ';
    else if (c < 0) expression += '-';
    
    expression += `${Math.abs(c)}`;
  }
  
  return expression;
}

function formatFactoredForm(a, root1, root2) {
  const factor1 = { coefficient: a, constant: -a * root1 };
  const factor2 = { coefficient: 1, constant: -root2 };
  
  return formatFactors([factor1, factor2]);
}

function formatFactor(factor) {
  const { coefficient, constant } = factor;
  
  let term = '';
  
  // Handle coefficient
  if (coefficient === 1) {
    term = 'x';
  } else if (coefficient === -1) {
    term = '-x';
  } else {
    term = `${coefficient}x`;
  }
  
  // Handle constant
  if (constant > 0) {
    term += ` + ${constant}`;
  } else if (constant < 0) {
    term += ` - ${Math.abs(constant)}`;
  }
  
  return term;
}

function formatFactors(factors) {
  return factors.map(factor => `(${formatFactor(factor)})`).join('');
}

function parseFactoredForm(factoredForm) {
  const factors = [];
  
  // Simple parser for forms like (2x + 3)(x - 4)
  const factorRegex = /\(([^)]+)\)/g;
  let match;
  
  while ((match = factorRegex.exec(factoredForm)) !== null) {
    const factorStr = match[1].replace(/\s+/g, '');
    let coefficient = 1;
    let constant = 0;
    
    // Handle coefficient
    if (factorStr.startsWith('-x')) {
      coefficient = -1;
    } else if (factorStr.startsWith('x')) {
      coefficient = 1;
    } else {
      const coefMatch = factorStr.match(/^(-?\d*)x/);
      if (coefMatch) {
        coefficient = coefMatch[1] === '' || coefMatch[1] === '-' ? 
                     (coefMatch[1] === '-' ? -1 : 1) : parseInt(coefMatch[1]);
      }
    }
    
    // Handle constant
    const constantMatch = factorStr.match(/x([+-]\d+)$/);
    if (constantMatch) {
      constant = parseInt(constantMatch[1]);
    } else if (!factorStr.includes('x')) {
      // No x term, just constant
      constant = parseInt(factorStr);
      coefficient = 0;
    }
    
    if (!isNaN(coefficient) && !isNaN(constant)) {
      factors.push({ coefficient, constant });
    }
  }
  
  return factors;
}

function formatTerm(coef, variable) {
  if (coef === 1) return variable;
  if (coef === -1) return `-${variable}`;
  return `${coef}${variable}`;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}