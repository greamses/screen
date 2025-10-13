export function generateAdvancedIndicesQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = [
    'zero-power', 
    'negative-power', 
    'fractional-power', 
    'combined-laws',
    'all'
  ];
  
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'zero-power':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'negative-power':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    case 'fractional-power':
      questionTypes = Array.from({ length: count }, () => 2);
      break;
    case 'combined-laws':
      questionTypes = Array.from({ length: count }, () => 3);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 4));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generateZeroPowerQuestion();
        case 1:
          return generateNegativePowerQuestion();
        case 2:
          return generateFractionalPowerQuestion();
        case 3:
          return generateCombinedLawsQuestion();
        default:
          return generateZeroPowerQuestion();
      }
    } catch (error) {
      console.error('Error generating advanced question:', error);
      return {
        question: 'Evaluate: \\(5^0\\)',
        options: ['\\(0\\)', '\\(1\\)', '\\(5\\)', '\\(10\\)'],
        correct: 1,
        explanation: 'Using the zero power law: \\(a^0 = 1\\) for any non-zero \\(a\\)'
      };
    }
  });
}

// LAW 5: Zero Power Law - a^0 = 1 (where a ≠ 0)
function generateZeroPowerQuestion() {
  const bases = [
    { base: '2', type: 'numeric' },
    { base: '5', type: 'numeric' },
    { base: '10', type: 'numeric' },
    { base: 'x', type: 'variable' },
    { base: 'y', type: 'variable' },
    { base: 'a', type: 'variable' },
    { base: '7', type: 'numeric' },
    { base: '13', type: 'numeric' }
  ];
  
  const selectedBase = bases[Math.floor(Math.random() * bases.length)];
  
  const questionTypes = [
    {
      type: 'direct',
      question: `Evaluate: \\(${selectedBase.base}^0\\)`,
      answer: '1',
      explanation: `
<div><strong>Law:</strong> Zero Power Law - \\(a^0 = 1\\) (where \\(a \\neq 0\\))</div>
<div>Any non-zero number or variable raised to the power of 0 equals 1</div>
<div></div>
<div><strong>Given:</strong> \\(${selectedBase.base}^0\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Using the zero power law: \\(${selectedBase.base}^0 = 1\\)</div>
      `.trim()
    },
    {
      type: 'expression',
      question: `Simplify: \\(${selectedBase.base}^3 \\times ${selectedBase.base}^0\\)`,
      answer: `${selectedBase.base}^3`,
      explanation: `
<div><strong>Laws Used:</strong></div>
<div>1. Zero Power Law - \\(a^0 = 1\\)</div>
<div>2. Multiplication Law - \\(a^m \\times a^n = a^{m+n}\\)</div>
<div></div>
<div><strong>Given:</strong> \\(${selectedBase.base}^3 \\times ${selectedBase.base}^0\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>First, apply zero power law: \\(${selectedBase.base}^0 = 1\\)</div>
<div>Then: \\(${selectedBase.base}^3 \\times 1 = ${selectedBase.base}^3\\)</div>
<div>Alternatively, using multiplication law: \\(${selectedBase.base}^{3+0} = ${selectedBase.base}^3\\)</div>
      `.trim()
    },
    {
      type: 'equation',
      question: `Solve for n: \\(${selectedBase.base}^n = 1\\)`,
      answer: '0',
      explanation: `
<div><strong>Law:</strong> Zero Power Law - \\(a^0 = 1\\) (where \\(a \\neq 0\\))</div>
<div></div>
<div><strong>Given:</strong> \\(${selectedBase.base}^n = 1\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>We know that \\(${selectedBase.base}^0 = 1\\)</div>
<div>Therefore, for \\(${selectedBase.base}^n = 1\\), \\(n\\) must be 0</div>
<div>Answer: \\(n = 0\\)</div>
      `.trim()
    }
  ];
  
  const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  if (selectedType.type === 'direct') {
    const wrongOptions = ['0', selectedBase.base, `\\frac{1}{${selectedBase.base}}`];
    let options = [selectedType.answer, ...wrongOptions];
    options = shuffleArray(options);
    const correctIndex = options.indexOf(selectedType.answer);
    
    return {
      question: selectedType.question,
      options: options.map(opt => `\\(${opt}\\)`),
      correct: correctIndex,
      explanation: selectedType.explanation
    };
  } else {
    const { options, correctIndex } = generateAdvancedOptions(
      selectedType.answer, 
      selectedBase.base, 
      selectedType.type
    );
    
    return {
      question: selectedType.question,
      options: options,
      correct: correctIndex,
      explanation: selectedType.explanation
    };
  }
}

// LAW 6: Negative Power Law - a^(-n) = 1/(a^n)
function generateNegativePowerQuestion() {
  const bases = ['x', 'y', 'a', 'b', '2', '3', '5', '10'];
  const base = bases[Math.floor(Math.random() * bases.length)];
  
  const power = Math.floor(Math.random() * 5) + 2; // 2 to 6
  
  const questionTypes = [
    {
      type: 'direct-negative',
      question: `Simplify: \\(${base}^{-${power}}\\)`,
      answer: `\\frac{1}{${base}^{${power}}}`,
      explanation: `
<div><strong>Law:</strong> Negative Power Law - \\(a^{-n} = \\frac{1}{a^n}\\)</div>
<div>A negative exponent means the reciprocal of the base raised to the positive exponent</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^{-${power}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Using negative power law: \\(${base}^{-${power}} = \\frac{1}{${base}^{${power}}}\\)</div>
      `.trim()
    },
    {
      type: 'reciprocal',
      question: `Write with a positive exponent: \\(\\frac{1}{${base}^{${power}}}\\)`,
      answer: `${base}^{-${power}}`,
      explanation: `
<div><strong>Law:</strong> Negative Power Law - \\(\\frac{1}{a^n} = a^{-n}\\)</div>
<div>The reciprocal of a power can be written with a negative exponent</div>
<div></div>
<div><strong>Given:</strong> \\(\\frac{1}{${base}^{${power}}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Using negative power law: \\(\\frac{1}{${base}^{${power}}} = ${base}^{-${power}}\\)</div>
      `.trim()
    },
    {
      type: 'combined-negative',
      question: `Simplify: \\(${base}^{${power}} \\times ${base}^{-${power}}\\)`,
      answer: '1',
      explanation: `
<div><strong>Laws Used:</strong></div>
<div>1. Negative Power Law - \\(a^{-n} = \\frac{1}{a^n}\\)</div>
<div>2. Multiplication Law - \\(a^m \\times a^n = a^{m+n}\\)</div>
<div>3. Zero Power Law - \\(a^0 = 1\\)</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^{${power}} \\times ${base}^{-${power}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Method 1 - Using multiplication law:</div>
<div>\\(${base}^{${power}} \\times ${base}^{-${power}} = ${base}^{${power} + (-${power})} = ${base}^0 = 1\\)</div>
<div></div>
<div>Method 2 - Using negative power law:</div>
<div>\\(${base}^{${power}} \\times ${base}^{-${power}} = ${base}^{${power}} \\times \\frac{1}{${base}^{${power}}} = 1\\)</div>
      `.trim()
    }
  ];
  
  const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const { options, correctIndex } = generateAdvancedOptions(
    selectedType.answer, 
    base, 
    selectedType.type,
    power
  );
  
  return {
    question: selectedType.question,
    options: options,
    correct: correctIndex,
    explanation: selectedType.explanation
  };
}

// LAW 7: Fractional Power Law - a^(1/n) = √[n](a) and a^(m/n) = (√[n](a))^m
function generateFractionalPowerQuestion() {
  const bases = ['x', 'y', 'a', 'b', '8', '16', '27', '32', '64', '125'];
  const base = bases[Math.floor(Math.random() * bases.length)];
  
  const isNumeric = !isNaN(parseInt(base));
  
  const questionTypes = [
    {
      type: 'square-root',
      question: `Express in radical form: \\(${base}^{\\frac{1}{2}}\\)`,
      answer: `\\sqrt{${base}}`,
      explanation: `
<div><strong>Law:</strong> Fractional Power Law - \\(a^{\\frac{1}{n}} = \\sqrt[n]{a}\\)</div>
<div>A fractional exponent with numerator 1 represents a root</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^{\\frac{1}{2}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Using fractional power law: \\(${base}^{\\frac{1}{2}} = \\sqrt{${base}}\\)</div>
      `.trim()
    },
    {
      type: 'cube-root',
      question: `Express in radical form: \\(${base}^{\\frac{1}{3}}\\)`,
      answer: `\\sqrt[3]{${base}}`,
      explanation: `
<div><strong>Law:</strong> Fractional Power Law - \\(a^{\\frac{1}{n}} = \\sqrt[n]{a}\\)</div>
<div>A fractional exponent with numerator 1 represents a root</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^{\\frac{1}{3}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Using fractional power law: \\(${base}^{\\frac{1}{3}} = \\sqrt[3]{${base}}\\)</div>
      `.trim()
    },
    {
      type: 'rational-exponent',
      question: `Express in radical form: \\(${base}^{\\frac{2}{3}}\\)`,
      answer: isNumeric ? 
        `(\\sqrt[3]{${base}})^2` : 
        `\\sqrt[3]{${base}^2}`,
      explanation: `
<div><strong>Law:</strong> Fractional Power Law - \\(a^{\\frac{m}{n}} = (\\sqrt[n]{a})^m = \\sqrt[n]{a^m}\\)</div>
<div>A fractional exponent represents a power and a root</div>
<div></div>
<div><strong>Given:</strong> \\(${base}^{\\frac{2}{3}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Using fractional power law:</div>
<div>\\(${base}^{\\frac{2}{3}} = (\\sqrt[3]{${base}})^2\\) or \\(\\sqrt[3]{${base}^2}\\)</div>
      `.trim()
    }
  ];
  
  const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const { options, correctIndex } = generateAdvancedOptions(
    selectedType.answer, 
    base, 
    selectedType.type
  );
  
  return {
    question: selectedType.question,
    options: options,
    correct: correctIndex,
    explanation: selectedType.explanation
  };
}

// Combined application of multiple laws
function generateCombinedLawsQuestion() {
  const bases = ['x', 'y', 'a', 'b'];
  const base = bases[Math.floor(Math.random() * bases.length)];
  
  const power1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
  const power2 = Math.floor(Math.random() * 3) + 2; // 2 to 4
  const power3 = Math.floor(Math.random() * 2) + 1; // 1 to 2
  
  const questionTypes = [
    {
      type: 'complex-multiplication',
      question: `Simplify: \\(\\frac{${base}^{${power1}} \\times ${base}^{${power2}}}{${base}^{${power3}}}\\)`,
      answer: `${base}^{${power1 + power2 - power3}}`,
      explanation: `
<div><strong>Laws Used:</strong></div>
<div>1. Multiplication Law - \\(a^m \\times a^n = a^{m+n}\\)</div>
<div>2. Division Law - \\(a^m \\div a^n = a^{m-n}\\)</div>
<div></div>
<div><strong>Given:</strong> \\(\\frac{${base}^{${power1}} \\times ${base}^{${power2}}}{${base}^{${power3}}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Step 1: Multiply numerator: \\(${base}^{${power1}} \\times ${base}^{${power2}} = ${base}^{${power1 + power2}}\\)</div>
<div>Step 2: Divide by denominator: \\(${base}^{${power1 + power2}} \\div ${base}^{${power3}} = ${base}^{${power1 + power2 - power3}}\\)</div>
<div>Answer: \\(${base}^{${power1 + power2 - power3}}\\)</div>
      `.trim()
    },
    {
      type: 'power-of-power-complex',
      question: `Simplify: \\((${base}^{${power1}})^{${power2}} \\times ${base}^{${power3}}\\)`,
      answer: `${base}^{${power1 * power2 + power3}}`,
      explanation: `
<div><strong>Laws Used:</strong></div>
<div>1. Power of a Power - \\((a^m)^n = a^{m \\times n}\\)</div>
<div>2. Multiplication Law - \\(a^m \\times a^n = a^{m+n}\\)</div>
<div></div>
<div><strong>Given:</strong> \\((${base}^{${power1}})^{${power2}} \\times ${base}^{${power3}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Step 1: Apply power of power: \\((${base}^{${power1}})^{${power2}} = ${base}^{${power1 * power2}}\\)</div>
<div>Step 2: Multiply: \\(${base}^{${power1 * power2}} \\times ${base}^{${power3}} = ${base}^{${power1 * power2 + power3}}\\)</div>
<div>Answer: \\(${base}^{${power1 * power2 + power3}}\\)</div>
      `.trim()
    },
    {
      type: 'mixed-laws',
      question: `Simplify: \\(\\frac{(${base}^{${power1}})^{${power2}}}{${base}^{${power3}} \\times ${base}^{${power1}}}\\)`,
      answer: `${base}^{${power1 * power2 - power3 - power1}}`,
      explanation: `
<div><strong>Laws Used:</strong></div>
<div>1. Power of a Power - \\((a^m)^n = a^{m \\times n}\\)</div>
<div>2. Multiplication Law - \\(a^m \\times a^n = a^{m+n}\\)</div>
<div>3. Division Law - \\(a^m \\div a^n = a^{m-n}\\)</div>
<div></div>
<div><strong>Given:</strong> \\(\\frac{(${base}^{${power1}})^{${power2}}}{${base}^{${power3}} \\times ${base}^{${power1}}}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Step 1: Numerator: \\((${base}^{${power1}})^{${power2}} = ${base}^{${power1 * power2}}\\)</div>
<div>Step 2: Denominator: \\(${base}^{${power3}} \\times ${base}^{${power1}} = ${base}^{${power3 + power1}}\\)</div>
<div>Step 3: Division: \\(${base}^{${power1 * power2}} \\div ${base}^{${power3 + power1}} = ${base}^{${power1 * power2 - (power3 + power1)}}\\)</div>
<div>Answer: \\(${base}^{${power1 * power2 - power3 - power1}}\\)</div>
      `.trim()
    }
  ];
  
  const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const { options, correctIndex } = generateAdvancedOptions(
    selectedType.answer, 
    base, 
    selectedType.type,
    { power1, power2, power3 }
  );
  
  return {
    question: selectedType.question,
    options: options,
    correct: correctIndex,
    explanation: selectedType.explanation
  };
}

// HELPER FUNCTIONS

function generateAdvancedOptions(correctAnswer, base, questionType, additionalData = null) {
  const options = new Set([correctAnswer]);
  
  // Generate wrong options based on question type and common mistakes
  if (questionType === 'direct' || questionType === 'expression' || questionType === 'equation') {
    // Zero power law wrong options
    options.add('0');
    options.add(base);
    options.add(`${base}^1`);
    options.add(`\\frac{1}{${base}}`);
    
  } else if (questionType.includes('negative')) {
    // Negative power law wrong options
    if (questionType === 'direct-negative') {
      options.add(`${base}^{${additionalData}}`);
      options.add(`-${base}^{${additionalData}}`);
      options.add(`\\frac{1}{${base}^{-${additionalData}}}`);
    } else if (questionType === 'reciprocal') {
      options.add(`${base}^{${additionalData}}`);
      options.add(`\\frac{1}{${base}^{-${additionalData}}}`);
      options.add(`-${base}^{${additionalData}}`);
    } else if (questionType === 'combined-negative') {
      options.add('0');
      options.add(`${base}^{${additionalData * 2}}`);
      options.add(`${base}^{-${additionalData * 2}}`);
    }
    
  } else if (questionType.includes('root')) {
    // Fractional power law wrong options
    if (questionType === 'square-root') {
      options.add(`${base}^{2}`);
      options.add(`\\frac{${base}}{2}`);
      options.add(`\\sqrt[3]{${base}}`);
    } else if (questionType === 'cube-root') {
      options.add(`${base}^{3}`);
      options.add(`\\frac{${base}}{3}`);
      options.add(`\\sqrt{${base}}`);
    } else if (questionType === 'rational-exponent') {
      options.add(`${base}^{\\frac{3}{2}}`);
      options.add(`\\sqrt{${base}^{3}}`);
      options.add(`(\\sqrt{${base}})^3`);
    }
    
  } else if (questionType.includes('complex') || questionType.includes('mixed')) {
    // Combined laws wrong options
    const { power1, power2, power3 } = additionalData;
    
    if (questionType === 'complex-multiplication') {
      // Common mistakes: wrong operations
      options.add(`${base}^{${power1 * power2 - power3}}`);
      options.add(`${base}^{${power1 + power2 + power3}}`);
      options.add(`${base}^{${power1 * power2 * power3}}`);
    } else if (questionType === 'power-of-power-complex') {
      options.add(`${base}^{${(power1 + power2) * power3}}`);
      options.add(`${base}^{${power1 * power2 * power3}}`);
      options.add(`${base}^{${power1 + power2 + power3}}`);
    } else if (questionType === 'mixed-laws') {
      options.add(`${base}^{${power1 * power2 + power3 + power1}}`);
      options.add(`${base}^{${power1 + power2 + power3}}`);
      options.add(`${base}^{${power1 * power2 * power3 * power1}}`);
    }
  }
  
  // Convert to array and ensure we have exactly 4 options
  let optionsArray = Array.from(options);
  
  // Add generic wrong options if needed
  const genericWrongOptions = [
    `${base}^2`,
    `${base}^0`,
    `\\frac{1}{${base}}`,
    `${base}^{-1}`,
    '0',
    '1'
  ];
  
  while (optionsArray.length < 4) {
    const randomOption = genericWrongOptions[Math.floor(Math.random() * genericWrongOptions.length)];
    if (!optionsArray.includes(randomOption) && randomOption !== correctAnswer) {
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

// Export all individual functions for testing
export {
  generateZeroPowerQuestion,
  generateNegativePowerQuestion,
  generateFractionalPowerQuestion,
  generateCombinedLawsQuestion
};