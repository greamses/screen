// algebraic.js
export function generateAlgebraicExpressionQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = ['like-terms', 'unlike-terms', 'substitution', 'simplification', 'all'];
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'like-terms':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'unlike-terms':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    case 'substitution':
      questionTypes = Array.from({ length: count }, () => 2);
      break;
    case 'simplification':
      questionTypes = Array.from({ length: count }, () => 3);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 4));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generateLikeTermsQuestion();
        case 1:
          return generateUnlikeTermsQuestion();
        case 2:
          return generateSubstitutionQuestion();
        case 3:
          return generateSimplificationQuestion();
        default:
          return generateLikeTermsQuestion();
      }
    } catch (error) {
      console.error('Error generating question:', error);
      // Return a fallback question
      return {
        question: 'Simplify: \\(2x + 3x\\)',
        options: ['\\(5x\\)', '\\(6x\\)', '\\(5\\)', '\\(6\\)'],
        correct: 0,
        explanation: 'Combine like terms: \\(2x + 3x = 5x\\)'
      };
    }
  });
}

function generateLikeTermsQuestion() {
  const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
  const coefficients = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const variable = variables[Math.floor(Math.random() * variables.length)];
  
  // Generate like terms (same variable, different coefficients)
  const coef1 = coefficients[Math.floor(Math.random() * coefficients.length)];
  const coef2 = coefficients[Math.floor(Math.random() * coefficients.length)];
  const coef3 = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  const result = coef1 + coef2 + coef3;
  
  // Format expressions without showing coefficient 1
  const formatTerm = (coef, varName) => coef === 1 ? varName : `${coef}${varName}`;
  
  const expressions = [
    `${formatTerm(coef1, variable)} + ${formatTerm(coef2, variable)} + ${formatTerm(coef3, variable)}`,
    `${formatTerm(coef2, variable)} + ${formatTerm(coef1, variable)} + ${formatTerm(coef3, variable)}`,
    `${formatTerm(coef3, variable)} + ${formatTerm(coef2, variable)} + ${formatTerm(coef1, variable)}`
  ];
  
  const expression = expressions[Math.floor(Math.random() * expressions.length)];
  const resultExpr = result === 1 ? variable : `${result}${variable}`;
  
  const { options, correctIndex } = generateAlgebraicOptions(resultExpr, 'expression');
  
  return {
    question: `Simplify the expression: \\(${expression}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Rule:</strong> Like terms have the same variable and can be combined by adding their coefficients</div>
<div></div>
<div><strong>Given:</strong> \\(${expression}\\)</div>
<div>All terms have the same variable "${variable}"</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Add the coefficients: ${coef1} + ${coef2} + ${coef3} = ${result}</div>
<div>Simplified expression: \\(${resultExpr}\\)</div>
    `.trim()
  };
}

function generateUnlikeTermsQuestion() {
  const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
  const coefficients = [1, 2, 3, 4, 5, 6, 7];
  
  // Select 3 different variables
  const shuffledVars = [...variables].sort(() => Math.random() - 0.5).slice(0, 3);
  const var1 = shuffledVars[0];
  const var2 = shuffledVars[1];
  const var3 = shuffledVars[2];
  
  const coef1 = coefficients[Math.floor(Math.random() * coefficients.length)];
  const coef2 = coefficients[Math.floor(Math.random() * coefficients.length)];
  const coef3 = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  // Format expressions without showing coefficient 1
  const formatTerm = (coef, varName) => coef === 1 ? varName : `${coef}${varName}`;
  
  const expressions = [
    `${formatTerm(coef1, var1)} + ${formatTerm(coef2, var2)} + ${formatTerm(coef3, var3)}`,
    `${formatTerm(coef2, var2)} + ${formatTerm(coef1, var1)} + ${formatTerm(coef3, var3)}`,
    `${formatTerm(coef3, var3)} + ${formatTerm(coef2, var2)} + ${formatTerm(coef1, var1)}`
  ];
  
  const expression = expressions[Math.floor(Math.random() * expressions.length)];
  
  return {
    question: `Identify whether the terms in \\(${expression}\\) are like or unlike terms`,
    options: ['Like terms', 'Unlike terms', 'Some are like terms', 'Cannot be determined'],
    correct: 1, // Unlike terms
    explanation: `
<div><strong>Definition:</strong></div>
<div>- Like terms: Terms that have the same variables raised to the same powers</div>
<div>- Unlike terms: Terms that have different variables or different powers</div>
<div></div>
<div><strong>Analysis:</strong></div>
<div>Expression: \\(${expression}\\)</div>
<div>• Term 1: \\(${formatTerm(coef1, var1)}\\) (variable: ${var1})</div>
<div>• Term 2: \\(${formatTerm(coef2, var2)}\\) (variable: ${var2})</div>
<div>• Term 3: \\(${formatTerm(coef3, var3)}\\) (variable: ${var3})</div>
<div></div>
<div>All three terms have <strong>different variables</strong>, so they are <strong>unlike terms</strong></div>
<div>Unlike terms cannot be combined or simplified further</div>
    `.trim()
  };
}

function generateSubstitutionQuestion() {
  const variables = ['x', 'y', 'a', 'b', 'm', 'n'];
  const variable = variables[Math.floor(Math.random() * variables.length)];
  const values = [2, 3, 4, 5, 6, 7, 8];
  const value = values[Math.floor(Math.random() * values.length)];
  
  // Format expressions without showing coefficient 1 or power of 1
  const formatExpr = (expr, varName) => {
    return expr
      .replace(new RegExp(`1${varName}`, 'g'), varName) // Remove coefficient 1
      .replace(new RegExp(`${varName}1`, 'g'), varName); // Remove power 1 (though we don't use power 1 in our expressions)
  };
  
  // Generate different expression types
  const expressionTypes = [
    { 
      expr: formatExpr(`3${variable} + 5`, variable), 
      result: 3 * value + 5,
      steps: [`3 \\times ${value} + 5`, `${3 * value} + 5`, `${3 * value + 5}`]
    },
    { 
      expr: formatExpr(`2${variable}^2 - 4`, variable), 
      result: 2 * value * value - 4,
      steps: [`2 \\times ${value}^2 - 4`, `2 \\times ${value * value} - 4`, `${2 * value * value} - 4`, `${2 * value * value - 4}`]
    },
    { 
      expr: formatExpr(`5${variable} + 2${variable} - 3`, variable), 
      result: 7 * value - 3,
      steps: [`(5 + 2)${variable} - 3`, `7${variable} - 3`, `7 \\times ${value} - 3`, `${7 * value} - 3`, `${7 * value - 3}`]
    },
    { 
      expr: formatExpr(`4(${variable} + 2)`, variable), 
      result: 4 * (value + 2),
      steps: [`4 \\times (${value} + 2)`, `4 \\times ${value + 2}`, `${4 * (value + 2)}`]
    },
    { 
      expr: formatExpr(`${variable}^2 + 3${variable} + 1`, variable), 
      result: value * value + 3 * value + 1,
      steps: [`${value}^2 + 3 \\times ${value} + 1`, `${value * value} + ${3 * value} + 1`, `${value * value + 3 * value} + 1`, `${value * value + 3 * value + 1}`]
    },
    { 
      expr: formatExpr(`${variable} + 2${variable} + 3`, variable), 
      result: 3 * value + 3,
      steps: [`(1 + 2)${variable} + 3`, `3${variable} + 3`, `3 \\times ${value} + 3`, `${3 * value} + 3`, `${3 * value + 3}`]
    }
  ];
  
  const selectedExpr = expressionTypes[Math.floor(Math.random() * expressionTypes.length)];
  
  const { options, correctIndex } = generateAlgebraicOptions(selectedExpr.result, 'number');
  
  return {
    question: `Evaluate the expression \\(${selectedExpr.expr}\\) when \\(${variable} = ${value}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Substitute the given value for the variable and simplify</div>
<div></div>
<div><strong>Given:</strong> \\(${selectedExpr.expr}\\), \\(${variable} = ${value}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Replace \\(${variable}\\) with \\(${value}\\):</div>
${selectedExpr.steps.map(step => `<div>\\(${step}\\)</div>`).join('')}
<div>Final answer: \\(${selectedExpr.result}\\)</div>
    `.trim()
  };
}

function generateSimplificationQuestion() {
  const variables = ['x', 'y', 'a', 'b'];
  const coefficients = [1, 2, 3, 4, 5, 6, 7, 8];
  
  const var1 = variables[Math.floor(Math.random() * variables.length)];
  let var2 = variables[Math.floor(Math.random() * variables.length)];
  
  // Ensure we have different variables
  while (var2 === var1) {
    var2 = variables[Math.floor(Math.random() * variables.length)];
  }
  
  // Generate coefficients
  const coef1 = coefficients[Math.floor(Math.random() * coefficients.length)];
  const coef2 = coefficients[Math.floor(Math.random() * coefficients.length)];
  const coef3 = coefficients[Math.floor(Math.random() * coefficients.length)];
  const coef4 = coefficients[Math.floor(Math.random() * coefficients.length)];
  
  const sum1 = coef1 + coef3;
  const sum2 = coef2 + coef4;
  const diff = coef4 - coef3;
  
  // Format expressions without showing coefficient 1 and handle operators properly
  const formatTerm = (coef, varName) => {
    if (coef === 0) return '';
    if (coef === 1) return varName;
    if (coef === -1) return `-${varName}`;
    return `${coef}${varName}`;
  };
  
  function formatExpression(terms) {
    const nonZeroTerms = terms.filter(term => term !== '');
    if (nonZeroTerms.length === 0) return '0';
    
    // Handle the first term separately
    let expression = nonZeroTerms[0];
    
    // Handle subsequent terms with proper operators
    for (let i = 1; i < nonZeroTerms.length; i++) {
      const term = nonZeroTerms[i];
      if (term.startsWith('-')) {
        expression += ` - ${term.substring(1)}`;
      } else {
        expression += ` + ${term}`;
      }
    }
    
    return expression;
  }
  
  const expressions = [
    {
      expr: formatExpression([formatTerm(coef1, var1), formatTerm(coef2, var2), formatTerm(coef3, var1), formatTerm(coef4, var2)]),
      result: formatExpression([formatTerm(sum1, var1), formatTerm(sum2, var2)]),
      steps: [
        `\\text{Group like terms: } (${formatTerm(coef1, var1)} + ${formatTerm(coef3, var1)}) + (${formatTerm(coef2, var2)} + ${formatTerm(coef4, var2)})`,
        `\\text{Combine coefficients: } (${coef1} + ${coef3})${var1} + (${coef2} + ${coef4})${var2}`,
        `\\text{Calculate: } ${formatTerm(sum1, var1)} + ${formatTerm(sum2, var2)}`
      ]
    },
    {
      expr: formatExpression([formatTerm(coef1, var1), formatTerm(coef2, var1), formatTerm(-coef3, var2), formatTerm(coef4, var2)]),
      result: formatExpression([formatTerm(coef1 + coef2, var1), formatTerm(diff, var2)]),
      steps: [
        `\\text{Group like terms: } (${formatTerm(coef1, var1)} + ${formatTerm(coef2, var1)}) + (${formatTerm(coef4, var2)} - ${formatTerm(coef3, var2)})`,
        `\\text{Combine coefficients: } (${coef1} + ${coef2})${var1} + (${coef4} - ${coef3})${var2}`,
        `\\text{Calculate: } ${formatTerm(coef1 + coef2, var1)} + ${formatTerm(diff, var2)}`
      ]
    }
  ];
  
  const selectedExpr = expressions[Math.floor(Math.random() * expressions.length)];
  
  const { options, correctIndex } = generateAlgebraicOptions(selectedExpr.result, 'expression');
  
  return {
    question: `Simplify the expression: \\(${selectedExpr.expr}\\)`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Combine like terms (terms with the same variables)</div>
<div></div>
<div><strong>Given:</strong> \\(${selectedExpr.expr}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
${selectedExpr.steps.map(step => `<div>\\(${step}\\)</div>`).join('')}
<div>Final simplified expression: \\(${selectedExpr.result}\\)</div>
    `.trim()
  };
}

// IMPROVED HELPER FUNCTIONS - HUMAN-LIKE WRONG ANSWERS

function generateAlgebraicOptions(correctValue, type = 'expression') {
  if (type === 'number') {
    return generateNumericalOptions(correctValue);
  } else {
    return generateExpressionOptions(correctValue);
  }
}

function generateNumericalOptions(correctValue) {
  const correctNum = Number(correctValue);
  const wrongValues = new Set();
  
  // Common human calculation errors
  const strategies = [
    // Order of operations errors
    () => {
      // For expressions like 3x + 5 when x=2: might do 3*(2+5)=21 instead of 3*2+5=11
      if (correctNum > 10) return Math.floor(correctNum * 1.5);
      return correctNum + 8;
    },
    
    // Sign errors
    () => -correctNum,
    () => correctNum - 10,
    
    // Multiplication instead of addition
    () => {
      const factors = findFactors(correctNum);
      return factors.length > 1 ? factors[0] * factors[1] : correctNum * 2;
    },
    
    // Off-by-one errors
    () => correctNum + 1,
    () => correctNum - 1,
    () => correctNum + 2,
    
    // Partial calculation
    () => Math.floor(correctNum / 2),
    () => correctNum * 1.5,
  ];
  
  for (const strategy of strategies) {
    if (wrongValues.size >= 3) break;
    try {
      const wrongValue = strategy();
      if (wrongValue !== correctNum && !wrongValues.has(wrongValue)) {
        wrongValues.add(wrongValue);
      }
    } catch (error) {
      continue;
    }
  }
  
  const wrongArray = Array.from(wrongValues).slice(0, 3);
  const options = [correctNum, ...wrongArray];
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctNum);
  
  return {
    options: shuffledOptions.map(opt => `\\(${opt}\\)`),
    correctIndex: correctIndex
  };
}

function generateExpressionOptions(correctExpr) {
  const wrongExpressions = new Set();
  
  try {
    const terms = parseExpression(correctExpr);
    
    // COMMON HUMAN MISTAKE STRATEGIES
    const strategies = [
      // 1. Combine all coefficients (like 5x + 5y - 8x → 13x + 5y)
      () => combineAllCoefficients(terms),
      
      // 2. Wrong sign handling (like 5x + 5y - 8x → -3x + 5y OR -3x - 5y)
      () => wrongSignHandling(terms),
      
      // 3. Multiply variables (like 5x + 5y - 8x → -18xy)
      () => multiplyVariables(terms),
      
      // 4. Partial combination (like 5x + 5y - 8x → 2xy)
      () => partialCombination(terms),
      
      // 5. Drop terms
      () => dropTerms(terms),
      
      // 6. Wrong order of operations
      () => wrongOrderOfOperations(terms),
      
      // 7. Coefficient addition errors
      () => coefficientAdditionErrors(terms),
      
      // 8. Treat different variables as same
      () => treatVariablesAsSame(terms),
    ];
    
    // Generate wrong answers
    for (const strategy of strategies) {
      if (wrongExpressions.size >= 3) break;
      try {
        const wrongExpr = strategy();
        if (wrongExpr && wrongExpr !== correctExpr && !wrongExpressions.has(wrongExpr)) {
          wrongExpressions.add(wrongExpr);
        }
      } catch (error) {
        continue;
      }
    }
    
  } catch (error) {
    console.error('Error generating expression options:', error);
  }
  
  // Add realistic fallbacks
  const realisticFallbacks = [
    '13x + 5y',    // Adding all coefficients positively
    '-3x + 5y',    // Correct combination but might be a distractor
    '2x + 10y',    // Wrong coefficient combination
    '5x + 13y',    // Swapped coefficients
    '-8x + 10y',   // Only combined some terms
    '18xy',        // Multiplied everything
    '3x + 5y',     // Partial calculation
  ];
  
  for (const fallback of realisticFallbacks) {
    if (wrongExpressions.size >= 3) break;
    if (fallback !== correctExpr && !wrongExpressions.has(fallback)) {
      wrongExpressions.add(fallback);
    }
  }
  
  const wrongArray = Array.from(wrongExpressions).slice(0, 3);
  const options = [correctExpr, ...wrongArray];
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctExpr);
  
  return {
    options: shuffledOptions.map(opt => `\\(${opt}\\)`),
    correctIndex: correctIndex
  };
}

// HUMAN-LIKE WRONG ANSWER GENERATORS

function combineAllCoefficients(terms) {
  // Like: 5x + 5y - 8x → 13x + 5y (adding all coefficients as positive)
  const positiveSum = terms.reduce((sum, term) => sum + Math.abs(term.coefficient), 0);
  const negativeSum = terms.reduce((sum, term) => sum + (term.coefficient < 0 ? term.coefficient : 0), 0);
  
  // Use the first variable for the wrongly combined term
  const mainVar = terms[0].variable;
  const otherTerms = terms.filter(term => term.variable !== mainVar);
  
  let result = '';
  
  if (Math.random() > 0.5) {
    // Strategy A: Add all coefficients as positive
    result = `${positiveSum}${mainVar}`;
  } else {
    // Strategy B: Add positive and negative coefficients separately but wrong
    result = `${positiveSum + negativeSum}${mainVar}`;
  }
  
  // Add remaining terms
  otherTerms.forEach(term => {
    if (term.coefficient > 0) {
      result += ` + ${Math.abs(term.coefficient)}${term.variable}`;
    } else {
      result += ` - ${Math.abs(term.coefficient)}${term.variable}`;
    }
  });
  
  return result;
}

function wrongSignHandling(terms) {
  // Like: 5x + 5y - 8x → -3x - 5y (wrong sign on the second term)
  const likeTerms = groupLikeTerms(terms);
  const newTerms = [];
  
  likeTerms.forEach(group => {
    const sum = group.terms.reduce((total, term) => total + term.coefficient, 0);
    // 50% chance to flip the sign
    const finalCoefficient = Math.random() > 0.5 ? sum : -sum;
    if (finalCoefficient !== 0) {
      newTerms.push({ coefficient: finalCoefficient, variable: group.variable });
    }
  });
  
  return formatTerms(newTerms);
}

function multiplyVariables(terms) {
  // Like: 5x + 5y - 8x → -18xy (multiplying variables instead of combining like terms)
  const coefficientProduct = terms.reduce((product, term) => product * Math.abs(term.coefficient), 1);
  const sign = terms.reduce((product, term) => product * Math.sign(term.coefficient), 1);
  
  // Combine all variables into one product
  const allVars = [...new Set(terms.map(term => term.variable))].join('');
  const finalCoefficient = sign * coefficientProduct;
  
  if (finalCoefficient === 1) return allVars;
  if (finalCoefficient === -1) return `-${allVars}`;
  return `${finalCoefficient}${allVars}`;
}

function partialCombination(terms) {
  // Like: 5x + 5y - 8x → 2xy (partial combination with variable multiplication)
  if (terms.length < 2) return null;
  
  // Combine first two terms in some wrong way
  const coef1 = terms[0].coefficient;
  const coef2 = terms[1].coefficient;
  const var1 = terms[0].variable;
  const var2 = terms[1].variable;
  
  const strategies = [
    () => `${coef1 + coef2}${var1}${var2}`,                    // 5x + 5y → 10xy
    () => `${coef1 - coef2}${var1}${var2}`,                   // 5x + 5y → 0xy (but we'll handle this)
    () => `${Math.abs(coef1 - coef2)}${var1}${var2}`,         // 5x - 8x → 3xy
    () => `${coef1}${var1}${var2} + ${coef2}${var2}`,         // Mixed wrong combination
  ];
  
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  let result = strategy();
  
  // Add remaining terms if any
  if (terms.length > 2) {
    for (let i = 2; i < terms.length; i++) {
      const term = terms[i];
      if (term.coefficient > 0) {
        result += ` + ${Math.abs(term.coefficient)}${term.variable}`;
      } else {
        result += ` - ${Math.abs(term.coefficient)}${term.variable}`;
      }
    }
  }
  
  return result;
}

function dropTerms(terms) {
  // Simply drop one term
  if (terms.length <= 1) return null;
  
  const indexToDrop = Math.floor(Math.random() * terms.length);
  const newTerms = terms.filter((_, index) => index !== indexToDrop);
  
  return formatTerms(newTerms);
}

function wrongOrderOfOperations(terms) {
  // Apply operations in wrong order
  let result = terms[0].coefficient;
  
  for (let i = 1; i < terms.length; i++) {
    if (Math.random() > 0.5) {
      result *= terms[i].coefficient; // Multiply instead of add
    } else {
      result += terms[i].coefficient; // Add coefficients regardless of variables
    }
  }
  
  // Use the first variable
  if (result === 1) return terms[0].variable;
  if (result === -1) return `-${terms[0].variable}`;
  return `${result}${terms[0].variable}`;
}

function coefficientAdditionErrors(terms) {
  // Add coefficients incorrectly
  const likeTerms = groupLikeTerms(terms);
  const newTerms = [];
  
  likeTerms.forEach(group => {
    let sum = group.terms.reduce((total, term) => total + term.coefficient, 0);
    
    // Common errors: add 1, subtract 1, double, halve
    const errors = [
      () => sum + 1,
      () => sum - 1,
      () => sum * 2,
      () => Math.floor(sum / 2),
      () => -sum
    ];
    
    const errorFn = errors[Math.floor(Math.random() * errors.length)];
    sum = errorFn();
    
    if (sum !== 0) {
      newTerms.push({ coefficient: sum, variable: group.variable });
    }
  });
  
  return formatTerms(newTerms);
}

function treatVariablesAsSame(terms) {
  // Treat all variables as the same
  const totalCoefficient = terms.reduce((sum, term) => sum + term.coefficient, 0);
  const firstVar = terms[0].variable;
  
  if (totalCoefficient === 1) return firstVar;
  if (totalCoefficient === -1) return `-${firstVar}`;
  return `${totalCoefficient}${firstVar}`;
}

// HELPER FUNCTIONS

function groupLikeTerms(terms) {
  const groups = {};
  
  terms.forEach(term => {
    if (!groups[term.variable]) {
      groups[term.variable] = [];
    }
    groups[term.variable].push(term);
  });
  
  return Object.keys(groups).map(variable => ({
    variable,
    terms: groups[variable]
  }));
}

function parseExpression(expr) {
  const terms = [];
  
  // Simple parser for expressions like "5x + 3y - 2x"
  const termParts = expr.split(/(?=[+-])/).filter(part => part.trim() !== '');
  
  termParts.forEach(part => {
    part = part.trim();
    let coefficient, variable;
    
    if (part.startsWith('+') || part.startsWith('-')) {
      const sign = part.startsWith('+') ? 1 : -1;
      const rest = part.slice(1).trim();
      
      if (rest.match(/^\d/)) {
        // Has coefficient
        const match = rest.match(/^(\d+)([a-z])/);
        if (match) {
          coefficient = sign * parseInt(match[1]);
          variable = match[2];
        }
      } else {
        // No coefficient (like +x or -y)
        coefficient = sign * 1;
        variable = rest;
      }
    } else {
      // First term, no sign
      if (part.match(/^\d/)) {
        const match = part.match(/^(\d+)([a-z])/);
        if (match) {
          coefficient = parseInt(match[1]);
          variable = match[2];
        }
      } else {
        // Just variable (like x)
        coefficient = 1;
        variable = part;
      }
    }
    
    if (coefficient !== undefined && variable) {
      terms.push({ coefficient, variable });
    }
  });
  
  return terms;
}

function formatTerms(terms) {
  if (terms.length === 0) return '0';
  
  const formatted = [];
  terms.forEach(term => {
    if (term.coefficient === 1) {
      formatted.push(term.variable);
    } else if (term.coefficient === -1) {
      formatted.push('-' + term.variable);
    } else {
      formatted.push(term.coefficient + term.variable);
    }
  });
  
  let result = formatted[0];
  for (let i = 1; i < formatted.length; i++) {
    if (formatted[i].startsWith('-')) {
      result += ' - ' + formatted[i].slice(1);
    } else {
      result += ' + ' + formatted[i];
    }
  }
  
  return result;
}

function findFactors(num) {
  const factors = [];
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      factors.push(i, num / i);
    }
  }
  return factors.length > 0 ? factors : [1, num];
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateSimilarExpressions(correctExpr) {
  const similar = new Set();
  
  try {
    // Parse the expression to understand its structure
    const terms = correctExpr.split(/ \+ | - /).filter(term => term !== '');
    
    if (terms.length >= 2) {
      // Strategy 1: Swap terms
      const swapped = terms[1] + ' + ' + terms[0];
      if (swapped !== correctExpr) similar.add(swapped);
      
      // Strategy 2: Change coefficients slightly
      terms.forEach((term, index) => {
        const match = term.match(/^(-?\d*)([a-z])$/);
        if (match) {
          const [, coefStr, variable] = match;
          let currentCoef;
          
          if (coefStr === '' || coefStr === '-') {
            currentCoef = coefStr === '-' ? -1 : 1;
          } else {
            currentCoef = parseInt(coefStr);
          }
          
          // Generate variations with different coefficients
          const variations = [currentCoef + 1, currentCoef - 1, currentCoef + 2];
          for (const modifiedCoef of variations) {
            if (modifiedCoef !== 0 && modifiedCoef !== currentCoef) {
              const modifiedTerm = modifiedCoef === 1 ? variable : 
                                 modifiedCoef === -1 ? `-${variable}` : 
                                 `${modifiedCoef}${variable}`;
              const modifiedTerms = [...terms];
              modifiedTerms[index] = modifiedTerm;
              const modifiedExpr = modifiedTerms.join(' + ').replace(/\+ -/g, '- ');
              if (modifiedExpr !== correctExpr) similar.add(modifiedExpr);
            }
          }
        }
      });
      
      // Strategy 3: Add extra terms
      const extraTermExpr = correctExpr + ' + 2z';
      similar.add(extraTermExpr);
      
      // Strategy 4: Remove terms (if we have more than 2 terms)
      if (terms.length > 2) {
        const removedTermExpr = terms.slice(0, 2).join(' + ');
        if (removedTermExpr !== correctExpr) similar.add(removedTermExpr);
      }
    }
    
    // Strategy 5: Common wrong answers based on expression patterns
    if (correctExpr.includes('+')) {
      // Add wrong answer that adds coefficients incorrectly
      const wrongAdd = correctExpr.replace(/(\d)([a-z])/g, (match, num, varName) => {
        return (parseInt(num) + 1) + varName;
      });
      if (wrongAdd !== correctExpr) similar.add(wrongAdd);
    }
    
  } catch (error) {
    console.error('Error generating similar expressions:', error);
  }
  
  // Add fallback wrong answers
  similar.add('2x + y');
  similar.add('x + 2y'); 
  similar.add('3x + 3y');
  similar.add('x + y + z');
  
  return Array.from(similar).filter(expr => expr !== correctExpr).slice(0, 3);
}

function generateFallbackWrongExpression(correctExpr, index) {
  const fallbacks = [
    '2x + y',
    'x + 2y',
    '3x + 3y', 
    'x + y + z',
    '2x + 2y',
    'x + 3y',
    '4x + y'
  ];
  
  return fallbacks[index % fallbacks.length];
}
