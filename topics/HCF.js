// factorization.js
function generateFactorizationQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = ['prime-factors', 'square-cube-roots', 'index-notation', 'prime-composite', 'all'];
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'prime-factors':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'square-cube-roots':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    case 'index-notation':
      questionTypes = Array.from({ length: count }, () => 2);
      break;
    case 'prime-composite':
      questionTypes = Array.from({ length: count }, () => 3);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 4));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generatePrimeFactorsQuestion();
        case 1:
          return generateSquareCubeRootsQuestion();
        case 2:
          return generateIndexNotationQuestion();
        case 3:
          return generatePrimeCompositeQuestion();
        default:
          return generatePrimeFactorsQuestion();
      }
    } catch (error) {
      console.error('Error generating factorization question:', error);
      // Return a fallback question
      return {
        question: 'Express 100 as a product of its prime factors.',
        options: ['2 × 2 × 5 × 5', '2 × 5 × 10', '4 × 25', '2 × 50'],
        correct: 0,
        explanation: '100 = 2 × 2 × 5 × 5 = 2² × 5²'
      };
    }
  });
}

function generatePrimeFactorsQuestion() {
  const number = generateNumberInRange();
  const primeFactors = getPrimeFactors(number);
  const primeFactorsString = formatPrimeFactors(primeFactors);
  
  const correctAnswer = primeFactorsString;
  
  const { options, correctIndex } = generateFactorizationOptions(
    correctAnswer,
    number,
    'prime-factors'
  );
  
  return {
    question: `Express ${number} as a product of its prime factors.`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Step-by-step solution:</strong></div>
<div>${generatePrimeFactorizationSteps(number)}</div>
<div><strong>Prime factors:</strong> ${number} = ${primeFactorsString}</div>
    `.trim()
  };
}

function generateSquareCubeRootsQuestion() {
  // Generate numbers that have nice square or cube roots
  const number = generateNumberWithNiceRoots();
  const rootType = Math.random() > 0.5 ? 'square' : 'cube';
  
  let question, correctAnswer;
  const primeFactors = getPrimeFactors(number);
  
  if (rootType === 'square') {
    question = `Find the square root of ${number} using prime factorization.`;
    const sqrt = Math.sqrt(number);
    correctAnswer = `√${number} = ${Number.isInteger(sqrt) ? sqrt : formatRootFromFactors(primeFactors, 'square')}`;
  } else {
    question = `Find the cube root of ${number} using prime factorization.`;
    const cbrt = Math.cbrt(number);
    correctAnswer = `∛${number} = ${Number.isInteger(cbrt) ? cbrt : formatRootFromFactors(primeFactors, 'cube')}`;
  }
  
  const { options, correctIndex } = generateFactorizationOptions(
    correctAnswer,
    number,
    'roots'
  );
  
  return {
    question,
    options,
    correct: correctIndex,
    explanation: generateRootExplanation(number, rootType, primeFactors)
  };
}

function generateIndexNotationQuestion() {
  const number = generateNumberInRange();
  const primeFactors = getPrimeFactors(number);
  const indexNotation = convertToIndexNotation(primeFactors);
  
  const correctAnswer = indexNotation;
  
  const { options, correctIndex } = generateFactorizationOptions(
    correctAnswer,
    number,
    'index'
  );
  
  return {
    question: `Express ${number} in index notation using prime factors.`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Step-by-step solution:</strong></div>
<div>${generatePrimeFactorizationSteps(number)}</div>
<div><strong>Prime factors:</strong> ${formatPrimeFactors(primeFactors)}</div>
<div><strong>Index notation:</strong> ${number} = ${indexNotation}</div>
    `.trim()
  };
}

function generatePrimeCompositeQuestion() {
  const number = generateNumberInRange();
  const isPrime = isPrimeNumber(number);
  
  const question = `Is ${number} a prime or composite number?`;
  const correctAnswer = isPrime ? 'Prime' : 'Composite';
  
  const { options, correctIndex } = generatePrimeCompositeOptions(number, isPrime);
  
  return {
    question,
    options,
    correct: correctIndex,
    explanation: generatePrimeCompositeExplanation(number, isPrime)
  };
}

// HELPER FUNCTIONS

function generateNumberInRange() {
  // Generate random number between 50 and 500
  return Math.floor(Math.random() * 451) + 50;
}

function generateNumberWithNiceRoots() {
  // Generate numbers that have integer or simplified roots
  const perfectSquares = [64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484];
  const perfectCubes = [64, 125, 216, 343];
  const numbersWithSimpleRoots = [72, 98, 108, 128, 147, 162, 180, 200, 242, 245, 250, 270, 288, 294, 320, 338, 350, 363, 375, 384, 392, 405, 432, 441, 448, 450, 468, 480, 486, 490, 500];
  
  const allNumbers = [...perfectSquares, ...perfectCubes, ...numbersWithSimpleRoots];
  return allNumbers[Math.floor(Math.random() * allNumbers.length)];
}

function getPrimeFactors(n) {
  const factors = [];
  let number = n;
  
  // Handle 2 separately
  while (number % 2 === 0) {
    factors.push(2);
    number = number / 2;
  }
  
  // Handle odd factors
  for (let i = 3; i <= Math.sqrt(number); i += 2) {
    while (number % i === 0) {
      factors.push(i);
      number = number / i;
    }
  }
  
  // If remaining number is prime
  if (number > 2) {
    factors.push(number);
  }
  
  return factors;
}

function formatPrimeFactors(factors) {
  return factors.join(' × ');
}

function convertToIndexNotation(factors) {
  const factorCount = {};
  
  factors.forEach(factor => {
    factorCount[factor] = (factorCount[factor] || 0) + 1;
  });
  
  const parts = [];
  for (const [factor, count] of Object.entries(factorCount)) {
    if (count === 1) {
      parts.push(factor);
    } else {
      parts.push(`${factor}^${count}`);
    }
  }
  
  return parts.join(' × ');
}

function isPrimeNumber(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  
  return true;
}

function formatRootFromFactors(factors, rootType) {
  const factorCount = {};
  
  factors.forEach(factor => {
    factorCount[factor] = (factorCount[factor] || 0) + 1;
  });
  
  const insideRoot = [];
  const outsideRoot = [];
  
  for (const [factor, count] of Object.entries(factorCount)) {
    const rootDivisor = rootType === 'square' ? 2 : 3;
    const quotient = Math.floor(count / rootDivisor);
    const remainder = count % rootDivisor;
    
    if (quotient > 0) {
      outsideRoot.push(quotient === 1 ? factor : `${factor}^${quotient}`);
    }
    
    if (remainder > 0) {
      insideRoot.push(remainder === 1 ? factor : `${factor}^${remainder}`);
    }
  }
  
  if (outsideRoot.length === 0) {
    return `√${insideRoot.join(' × ')}`;
  }
  
  const outside = outsideRoot.join(' × ');
  if (insideRoot.length === 0) {
    return outside;
  }
  
  return `${outside}√${insideRoot.join(' × ')}`;
}

// OPTIONS GENERATION

function generateFactorizationOptions(correctAnswer, number, type) {
  const wrongAnswers = new Set();
  
  try {
    const primeFactors = getPrimeFactors(number);
    
    // Generate wrong answers based on type
    switch (type) {
      case 'prime-factors':
        generatePrimeFactorsWrongAnswers(wrongAnswers, number, primeFactors);
        break;
      case 'roots':
        generateRootsWrongAnswers(wrongAnswers, number, primeFactors);
        break;
      case 'index':
        generateIndexWrongAnswers(wrongAnswers, number, primeFactors);
        break;
    }
    
  } catch (error) {
    console.error('Error generating factorization options:', error);
  }
  
  // Ensure we have exactly 3 wrong options
  while (wrongAnswers.size < 3) {
    const fallback = generateFactorizationFallback(number, type);
    if (fallback && fallback !== correctAnswer && !wrongAnswers.has(fallback)) {
      wrongAnswers.add(fallback);
    }
  }
  
  const wrongArray = Array.from(wrongAnswers).slice(0, 3);
  const options = [correctAnswer, ...wrongArray];
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  
  return {
    options: shuffledOptions,
    correctIndex: correctIndex
  };
}

function generatePrimeCompositeOptions(number, isPrime) {
  const correctAnswer = isPrime ? 'Prime' : 'Composite';
  const wrongAnswers = new Set();
  
  // Always include the opposite answer
  wrongAnswers.add(isPrime ? 'Composite' : 'Prime');
  
  // Add other plausible wrong answers
  const additionalWrong = ['Neither', 'Both', 'Undefined'];
  additionalWrong.forEach(answer => {
    if (wrongAnswers.size < 3) {
      wrongAnswers.add(answer);
    }
  });
  
  const wrongArray = Array.from(wrongAnswers).slice(0, 3);
  const options = [correctAnswer, ...wrongArray];
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  
  return {
    options: shuffledOptions,
    correctIndex: correctIndex
  };
}

function generatePrimeFactorsWrongAnswers(wrongAnswers, number, primeFactors) {
  const strategies = [
    // Include composite factors
    () => {
      const composites = getCompositeFactors(number);
      if (composites.length > 0) {
        const randomComposite = composites[Math.floor(Math.random() * composites.length)];
        const remaining = number / randomComposite;
        return `${randomComposite} × ${remaining}`;
      }
      return null;
    },
    // Wrong prime factors
    () => {
      const wrongPrimes = [...primeFactors];
      // Replace one prime with another small prime
      const index = Math.floor(Math.random() * wrongPrimes.length);
      const replacementPrimes = [2, 3, 5, 7, 11].filter(p => p !== wrongPrimes[index]);
      if (replacementPrimes.length > 0) {
        wrongPrimes[index] = replacementPrimes[Math.floor(Math.random() * replacementPrimes.length)];
        return wrongPrimes.join(' × ');
      }
      return null;
    },
    // Missing a factor
    () => {
      if (primeFactors.length > 2) {
        return primeFactors.slice(0, -1).join(' × ');
      }
      return null;
    },
    // Extra factor
    () => {
      const extraFactors = [2, 3, 5, 7];
      const extraFactor = extraFactors[Math.floor(Math.random() * extraFactors.length)];
      return [...primeFactors, extraFactor].join(' × ');
    }
  ];
  
  for (const strategy of strategies) {
    if (wrongAnswers.size >= 3) break;
    try {
      const wrongAnswer = strategy();
      if (wrongAnswer && !wrongAnswers.has(wrongAnswer)) {
        wrongAnswers.add(wrongAnswer);
      }
    } catch (error) {
      continue;
    }
  }
}

function generateRootsWrongAnswers(wrongAnswers, number, primeFactors) {
  const sqrt = Math.sqrt(number);
  const cbrt = Math.cbrt(number);
  
  const strategies = [
    // Simple miscalculation
    () => `√${number} = ${Math.floor(sqrt) + 1}`,
    () => `√${number} = ${Math.floor(sqrt) - 1}`,
    () => `∛${number} = ${Math.floor(cbrt) + 1}`,
    () => `∛${number} = ${Math.floor(cbrt) - 1}`,
    // Wrong simplification
    () => {
      const wrongFactors = [...primeFactors];
      if (wrongFactors.length > 1) {
        wrongFactors[0] = wrongFactors[0] + 1;
        return formatRootFromFactors(wrongFactors, 'square');
      }
      return null;
    }
  ];
  
  for (const strategy of strategies) {
    if (wrongAnswers.size >= 3) break;
    try {
      const wrongAnswer = strategy();
      if (wrongAnswer && !wrongAnswers.has(wrongAnswer)) {
        wrongAnswers.add(wrongAnswer);
      }
    } catch (error) {
      continue;
    }
  }
}

function generateIndexWrongAnswers(wrongAnswers, number, primeFactors) {
  const strategies = [
    // Wrong exponents
    () => {
      const factorCount = {};
      primeFactors.forEach(factor => {
        factorCount[factor] = (factorCount[factor] || 0) + 1;
      });
      
      const parts = [];
      for (const [factor, count] of Object.entries(factorCount)) {
        parts.push(`${factor}^${count + 1}`);
      }
      return parts.join(' × ');
    },
    // Mixed notation
    () => {
      const factorCount = {};
      primeFactors.forEach(factor => {
        factorCount[factor] = (factorCount[factor] || 0) + 1;
      });
      
      const factors = Object.entries(factorCount);
      if (factors.length > 1) {
        const parts = [];
        // Use index notation for first, expanded for others
        parts.push(`${factors[0][0]}^${factors[0][1]}`);
        for (let i = 1; i < factors.length; i++) {
          parts.push(Array(factors[i][1]).fill(factors[i][0]).join(' × '));
        }
        return parts.join(' × ');
      }
      return null;
    },
    // Include composite numbers
    () => {
      const composites = getCompositeFactors(number);
      if (composites.length > 0) {
        const composite = composites[Math.floor(Math.random() * composites.length)];
        const remaining = number / composite;
        return `${composite} × ${convertToIndexNotation(getPrimeFactors(remaining))}`;
      }
      return null;
    }
  ];
  
  for (const strategy of strategies) {
    if (wrongAnswers.size >= 3) break;
    try {
      const wrongAnswer = strategy();
      if (wrongAnswer && !wrongAnswers.has(wrongAnswer)) {
        wrongAnswers.add(wrongAnswer);
      }
    } catch (error) {
      continue;
    }
  }
}

function generateFactorizationFallback(number, type) {
  const fallbacks = {
    'prime-factors': [
      `${number} = 1 × ${number}`,
      `${number} = 2 × ${number / 2}`,
      `${number} = ${Math.floor(number/2)} × 2`
    ],
    'roots': [
      `√${number} = ${Math.floor(Math.sqrt(number))}`,
      `√${number} = ${Math.ceil(Math.sqrt(number))}`,
      `∛${number} = ${Math.floor(Math.cbrt(number))}`
    ],
    'index': [
      `${number} = ${number}`,
      `${number} = 2^${Math.log2(number).toFixed(1)}`,
      `${number} = 10^${Math.log10(number).toFixed(1)}`
    ]
  };
  
  const typeFallbacks = fallbacks[type] || fallbacks['prime-factors'];
  return typeFallbacks[Math.floor(Math.random() * typeFallbacks.length)];
}

// EXPLANATION GENERATORS

function generatePrimeFactorizationSteps(number) {
  const steps = [];
  let current = number;
  let divisor = 2;
  
  steps.push(`Start with ${number}`);
  
  while (current > 1) {
    if (current % divisor === 0) {
      steps.push(`${current} ÷ ${divisor} = ${current / divisor}`);
      current = current / divisor;
    } else {
      divisor++;
    }
  }
  
  return steps.join('<br>');
}

function generateRootExplanation(number, rootType, primeFactors) {
  const factorCount = {};
  primeFactors.forEach(factor => {
    factorCount[factor] = (factorCount[factor] || 0) + 1;
  });
  
  let explanation = `<div><strong>Step-by-step solution:</strong></div>`;
  explanation += `<div>Prime factors of ${number}: ${formatPrimeFactors(primeFactors)}</div>`;
  explanation += `<div>Index notation: ${convertToIndexNotation(primeFactors)}</div>`;
  
  if (rootType === 'square') {
    explanation += `<div>For square root, group factors in pairs:</div>`;
    const pairs = [];
    const remaining = [];
    
    for (const [factor, count] of Object.entries(factorCount)) {
      const pairsCount = Math.floor(count / 2);
      const rem = count % 2;
      
      if (pairsCount > 0) {
        pairs.push(`${factor}^${pairsCount * 2}`);
      }
      if (rem > 0) {
        remaining.push(`${factor}^${rem}`);
      }
    }
    
    if (pairs.length > 0) {
      explanation += `<div>Perfect squares: ${pairs.join(' × ')}</div>`;
    }
    if (remaining.length > 0) {
      explanation += `<div>Remaining inside root: ${remaining.join(' × ')}</div>`;
    }
  } else {
    explanation += `<div>For cube root, group factors in triples:</div>`;
    const triples = [];
    const remaining = [];
    
    for (const [factor, count] of Object.entries(factorCount)) {
      const triplesCount = Math.floor(count / 3);
      const rem = count % 3;
      
      if (triplesCount > 0) {
        triples.push(`${factor}^${triplesCount * 3}`);
      }
      if (rem > 0) {
        remaining.push(`${factor}^${rem}`);
      }
    }
    
    if (triples.length > 0) {
      explanation += `<div>Perfect cubes: ${triples.join(' × ')}</div>`;
    }
    if (remaining.length > 0) {
      explanation += `<div>Remaining inside root: ${remaining.join(' × ')}</div>`;
    }
  }
  
  return explanation;
}

function generatePrimeCompositeExplanation(number, isPrime) {
  if (isPrime) {
    return `
<div><strong>Explanation:</strong></div>
<div>${number} is a prime number because:</div>
<div>• It has exactly two distinct positive divisors: 1 and ${number}</div>
<div>• It cannot be formed by multiplying two smaller natural numbers</div>
<div>• When testing divisibility by primes less than √${number} ≈ ${Math.sqrt(number).toFixed(1)}, no divisors are found</div>
    `.trim();
  } else {
    const factors = getPrimeFactors(number);
    return `
<div><strong>Explanation:</strong></div>
<div>${number} is a composite number because:</div>
<div>• It has more than two positive divisors</div>
<div>• It can be expressed as a product of smaller numbers: ${formatPrimeFactors(factors)}</div>
<div>• Some divisors of ${number} include: 1, ${factors[0]}, ..., ${number}</div>
    `.trim();
  }
}

function getCompositeFactors(n) {
  const composites = [];
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      composites.push(i);
      if (i !== n / i) {
        composites.push(n / i);
      }
    }
  }
  return composites.filter(f => !isPrimeNumber(f));
}

// UTILITY FUNCTIONS

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Update quiz configuration
const factorizationTopics = {
  'prime-factors': {
    title: 'Prime Factorization',
    description: 'Express numbers as products of prime factors',
    generator: (count) => generateFactorizationQuestions(count, 'prime-factors')
  },
  'square-cube-roots': {
    title: 'Square and Cube Roots using Prime Factors',
    description: 'Find square roots and cube roots using prime factorization',
    generator: (count) => generateFactorizationQuestions(count, 'square-cube-roots')
  },
  'index-notation': {
    title: 'Index Notation with Prime Factors',
    description: 'Express numbers in index notation using prime factors',
    generator: (count) => generateFactorizationQuestions(count, 'index-notation')
  },
  'prime-composite': {
    title: 'Prime and Composite Numbers',
    description: 'Identify whether numbers are prime or composite',
    generator: (count) => generateFactorizationQuestions(count, 'prime-composite')
  },
  'all-factorization': {
    title: 'All Factorization Topics',
    description: 'Mixed questions on factorization topics',
    generator: (count) => generateFactorizationQuestions(count, 'all')
  }
};

// Add to existing quiz configuration
Object.assign(quizTopics, factorizationTopics);

// Add factorization to number theory or create new category
if (!quizCategories['number-theory']) {
  quizCategories['number-theory'] = {
    title: 'Number Theory',
    description: 'Questions about numbers and their properties',
    topics: []
  };
}

quizCategories['number-theory'].topics.push(
  'prime-factors',
  'square-cube-roots',
  'index-notation',
  'prime-composite',
  'all-factorization'
);

// Export factorization functions
window.factorizationFunctions = {
  generateFactorizationQuestions,
  generatePrimeFactorsQuestion,
  generateSquareCubeRootsQuestion,
  generateIndexNotationQuestion,
  generatePrimeCompositeQuestion
};