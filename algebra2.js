// indices.js - Laws of Indices Question Generator
 function generateIndicesQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = ['multiplication', 'division', 'power-of-power', 'power-of-one', 'all'];
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'multiplication':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'division':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    case 'power-of-power':
      questionTypes = Array.from({ length: count }, () => 2);
      break;
    case 'power-of-one':
      questionTypes = Array.from({ length: count }, () => 3);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 4));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generateMultiplicationLawQuestion();
        case 1:
          return generateDivisionLawQuestion();
        case 2:
          return generatePowerOfPowerQuestion();
        case 3:
          return generatePowerOfOneQuestion();
        default:
          return generateMultiplicationLawQuestion();
      }
    } catch (error) {
      console.error('Error generating question:', error);
      return {
        question: 'Simplify: \\(x^2 \\times x^3\\)',
        options: ['\\(x^5\\)', '\\(x^6\\)', '\\(x^{23}\\)', '\\(2x^5\\)'],
        correct: 0,
        explanation: 'Using the multiplication law: \\(x^2 \\times x^3 = x^{2+3} = x^5\\)'
      };
    }
  });
}

// LAW 1: Multiplication Law - a^m × a^n = a^(m+n)
function generateMultiplicationLawQuestion() {
  const bases = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'q'];
  const base = bases[Math.floor(Math.random() * bases.length)];
  
  // Generate powers (avoiding 0 and 1 to make it more interesting)
  const power1 = Math.floor(Math.random() * 7) + 2; // 2 to 8
  const power2 = Math.floor(Math.random() * 7) + 2; // 2 to 8
  const correctAnswer = power1 + power2;
  
  // Sometimes include three terms
  if (Math.random() > 0.5) {
    const power3 = Math.floor(Math.random() * 5) + 2;
    const correctAnswer3 = power1 + power2 + power3;
    const { options, correctIndex } = generateOptions(`${base}^{${correctAnswer3}}`, base, [power1, power2, power3], 'multiply');
    
    return {
      question: `Simplify: \\(${base}^{${power1}} \\times ${base}^{${power2}} \\times ${base}^{${power3}}\\)`,
      options: options,
      correct: correctIndex,
      explanation: `
<div><strong>Law:</strong> Multiplication Law - \\(a^m \\times a^n = a^{m+n}\\)</div>
<div>When multiplying powers with the same base, add the exponents</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^{${power1}} \\times ${base}^{${power2}} \\times ${base}^{${power3}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Base is the same: \\(${base}\\)</div>
<div>Add the exponents: \\(${power1} + ${power2} + ${power3} = ${correctAnswer3}\\)</div>
<div>Answer: \\(${base}^{${correctAnswer3}}\\)</div>
      `.trim()
    };
  }
  
  const variations = [
    { expr: `${base}^{${power1}} \\times ${base}^{${power2}}`, type: 'basic' },
    { expr: `${base}^{${power2}} \\times ${base}^{${power1}}`, type: 'reversed' },
  ];
  
  const selectedVar = variations[Math.floor(Math.random() * variations.length)];
  const { options, correctIndex } = generateOptions(`${base}^{${correctAnswer}}`, base, [power1, power2], 'multiply');
  
  return {
    question: `Simplify: \\(${selectedVar.expr}\\)`,
    options: options,
    correct: correctIndex,
    explanation: `
<div><strong>Law:</strong> Multiplication Law - \\(a^m \\times a^n = a^{m+n}\\)</div>
<div>When multiplying powers with the same base, add the exponents</div>
<div></div>
<div><strong>Given:</strong> \\(${selectedVar.expr}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Base is the same: \\(${base}\\)</div>
<div>Add the exponents: \\(${power1} + ${power2} = ${correctAnswer}\\)</div>
<div>Answer: \\(${base}^{${correctAnswer}}\\)</div>
    `.trim()
  };
}

// LAW 2: Division Law - a^m ÷ a^n = a^(m-n)
function generateDivisionLawQuestion() {
  const bases = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'q'];
  const base = bases[Math.floor(Math.random() * bases.length)];
  
  // Ensure power1 > power2 for positive results
  const power2 = Math.floor(Math.random() * 5) + 2; // 2 to 6
  const power1 = power2 + Math.floor(Math.random() * 5) + 1; // Always greater
  const correctAnswer = power1 - power2;
  
  const expression = `\\frac{${base}^{${power1}}}{${base}^{${power2}}}`;
  const expressionAlt = `${base}^{${power1}} \\div ${base}^{${power2}}`;
  const result = `${base}^{${correctAnswer}}`;
  
  const useFormat = Math.random() > 0.5 ? expression : expressionAlt;
  const { options, correctIndex } = generateOptions(result, base, [power1, power2], 'divide');
  
  return {
    question: `Simplify: \\(${useFormat}\\)`,
    options: options,
    correct: correctIndex,
    explanation: `
<div><strong>Law:</strong> Division Law - \\(a^m \\div a^n = a^{m-n}\\)</div>
<div>When dividing powers with the same base, subtract the exponents</div>
<div></div>
<div><strong>Given:</strong> \\(${useFormat}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Base is the same: \\(${base}\\)</div>
<div>Subtract the exponents: \\(${power1} - ${power2} = ${correctAnswer}\\)</div>
<div>Answer: \\(${result}\\)</div>
    `.trim()
  };
}

// LAW 3: Power of a Power - (a^m)^n = a^(m×n)
function generatePowerOfPowerQuestion() {
  const bases = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'q'];
  const base = bases[Math.floor(Math.random() * bases.length)];
  
  const innerPower = Math.floor(Math.random() * 6) + 2; // 2 to 7
  const outerPower = Math.floor(Math.random() * 5) + 2; // 2 to 6
  const correctAnswer = innerPower * outerPower;
  
  const expression = `(${base}^{${innerPower}})^{${outerPower}}`;
  const result = `${base}^{${correctAnswer}}`;
  
  const { options, correctIndex } = generateOptions(result, base, [innerPower, outerPower], 'power');
  
  return {
    question: `Simplify: \\(${expression}\\)`,
    options: options,
    correct: correctIndex,
    explanation: `
<div><strong>Law:</strong> Power of a Power - \\((a^m)^n = a^{m \\times n}\\)</div>
<div>When raising a power to another power, multiply the exponents</div>
<div></div>
<div><strong>Given:</strong> \\(${expression}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Multiply the exponents: \\(${innerPower} \\times ${outerPower} = ${correctAnswer}\\)</div>
<div>Answer: \\(${result}\\)</div>
    `.trim()
  };
}

// LAW 4: Power of One - a^1 = a
function generatePowerOfOneQuestion() {
  const bases = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'q'];
  const numericBases = ['5', '7', '10', '12'];
  const allBases = [...bases, ...numericBases];
  const base = allBases[Math.floor(Math.random() * allBases.length)];
  
  const questionTypes = [
    {
      type: 'direct',
      question: `Simplify: \\(${base}^1\\)`,
      answer: base,
      explanation: `
<div><strong>Law:</strong> Power of One - \\(a^1 = a\\)</div>
<div>Any number or variable raised to the power of 1 equals itself</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^1\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Using the power of one law: \\(${base}^1 = ${base}\\)</div>
      `.trim()
    },
    {
      type: 'in-expression',
      question: `What is the value of the exponent in: \\(${base}^n = ${base}\\)?`,
      answer: '1',
      explanation: `
<div><strong>Law:</strong> Power of One - \\(a^1 = a\\)</div>
<div>Any number or variable raised to the power of 1 equals itself</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^n = ${base}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>For \\(${base}^n\\) to equal \\(${base}\\), the exponent \\(n\\) must be \\(1\\)</div>
<div>Answer: \\(n = 1\\)</div>
      `.trim()
    }
  ];
  
  const selected = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  if (selected.type === 'direct') {
    const wrongOptions = [
      `${base}^0`,
      `1`,
      `${base}^2`,
    ];
    
    let options = [selected.answer, ...wrongOptions];
    options = shuffleArray(options);
    const correctIndex = options.indexOf(selected.answer);
    
    return {
      question: selected.question,
      options: options.map(opt => `\\(${opt}\\)`),
      correct: correctIndex,
      explanation: selected.explanation
    };
  } else {
    let options = ['0', '1', '2', `${base}`];
    options = shuffleArray(options);
    const correctIndex = options.indexOf('1');
    
    return {
      question: selected.question,
      options: options.map(opt => `\\(${opt}\\)`),
      correct: correctIndex,
      explanation: selected.explanation
    };
  }
}

// HELPER FUNCTIONS

function generateOptions(correctAnswer, base, powers, operation) {
  const options = new Set([correctAnswer]);
  
  // Generate wrong options based on common mistakes
  if (operation === 'multiply') {
    // Common mistake: multiply the exponents instead of adding
    const wrongPower1 = powers[0] * (powers[1] || powers[1]);
    options.add(`${base}^{${wrongPower1}}`);
    
    // Common mistake: multiply base and keep one exponent
    if (isNaN(base)) {
      options.add(`${powers[0]}${base}^{${powers[1]}}`);
    }
    
    // Common mistake: wrong arithmetic
    const wrongSum = powers.reduce((a, b) => a + b, 0) + 1;
    options.add(`${base}^{${wrongSum}}`);
    
    // Additional wrong option
    const wrongSum2 = powers.reduce((a, b) => a + b, 0) - 1;
    if (wrongSum2 > 0) options.add(`${base}^{${wrongSum2}}`);
    
  } else if (operation === 'divide') {
    // Common mistake: add instead of subtract
    const wrongPower1 = powers[0] + powers[1];
    options.add(`${base}^{${wrongPower1}}`);
    
    // Common mistake: wrong order of subtraction
    const wrongPower2 = powers[1] - powers[0];
    if (wrongPower2 > 0) {
      options.add(`${base}^{${wrongPower2}}`);
    } else if (wrongPower2 < 0) {
      options.add(`${base}^{${Math.abs(wrongPower2)}}`);
    }
    
    // Common mistake: divide the exponents
    if (powers[0] % powers[1] === 0) {
      const wrongPower3 = powers[0] / powers[1];
      if (wrongPower3 !== powers[0] - powers[1]) {
        options.add(`${base}^{${wrongPower3}}`);
      }
    }
    
    // Additional wrong option
    const wrongDiff = powers[0] - powers[1] + 1;
    if (wrongDiff > 0) options.add(`${base}^{${wrongDiff}}`);
    
  } else if (operation === 'power') {
    // Common mistake: add instead of multiply
    const wrongPower1 = powers[0] + powers[1];
    options.add(`${base}^{${wrongPower1}}`);
    
    // Common mistake: keep one of the powers
    options.add(`${base}^{${powers[0]}}`);
    options.add(`${base}^{${powers[1]}}`);
    
    // Common mistake: wrong arithmetic
    const wrongProduct = powers[0] * powers[1] + 1;
    options.add(`${base}^{${wrongProduct}}`);
  }
  
  // Convert to array and take first 4 unique options
  let optionsArray = Array.from(options);
  
  // If we don't have 4 options, add more generic wrong options
  while (optionsArray.length < 4) {
    const randomPower = Math.floor(Math.random() * 20) + 1;
    const newOption = `${base}^{${randomPower}}`;
    if (!optionsArray.includes(newOption) && newOption !== correctAnswer) {
      optionsArray.push(newOption);
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