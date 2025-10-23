// prime-factorization.js
function generateFactorizationQuestions(count = 10, questionType = 'all') {
  // Validate input parameters
  if (typeof count !== 'number' || count < 1 || count > 50) {
    count = 10;
  }
  
  const validQuestionTypes = ['product-prime-factors', 'index-notation', 'identify-primes', 'all'];
  if (!validQuestionTypes.includes(questionType)) {
    questionType = 'all';
  }
  
  let questionTypes;
  
  switch (questionType) {
    case 'product-prime-factors':
      questionTypes = Array.from({ length: count }, () => 0);
      break;
    case 'index-notation':
      questionTypes = Array.from({ length: count }, () => 1);
      break;
    case 'identify-primes':
      questionTypes = Array.from({ length: count }, () => 2);
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 3));
  }
  
  return questionTypes.map(type => {
    try {
      switch (type) {
        case 0:
          return generateProductPrimeFactorsQuestion();
        case 1:
          return generateIndexNotationQuestion();
        case 2:
          return generateIdentifyPrimesQuestion();
        default:
          return generateProductPrimeFactorsQuestion();
      }
    } catch (error) {
      console.error('Error generating factorization question:', error);
      // Return a fallback question
      return {
        question: 'Express 60 as a product of prime factors',
        options: ['\\(2^2 \\times 3 \\times 5\\)', '\\(2 \\times 3^2 \\times 5\\)', '\\(2 \\times 3 \\times 10\\)', '\\(4 \\times 3 \\times 5\\)'],
        correct: 0,
        explanation: 'Prime factorization: \\(60 = 2 \\times 30 = 2 \\times 2 \\times 15 = 2 \\times 2 \\times 3 \\times 5 = 2^2 \\times 3 \\times 5\\)'
      };
    }
  });
}

// Prime numbers between 1 and 20
const PRIMES_1_TO_20 = [2, 3, 5, 7, 11, 13, 17, 19];
const PRIMES_1_TO_100 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const COMPOSITES_1_TO_100 = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 68, 69, 70, 72, 74, 75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100];

function generateNumberWithPrimeFactors() {
  // Generate a number between 20 and 200 with at least 2 prime factors from 1-20
  let primeFactors = [];
  let number = 1;
  
  // Select 2-4 prime factors randomly
  const numFactors = 2 + Math.floor(Math.random() * 3); // 2 to 4
  
  for (let i = 0; i < numFactors; i++) {
    const prime = PRIMES_1_TO_20[Math.floor(Math.random() * PRIMES_1_TO_20.length)];
    const power = 1 + Math.floor(Math.random() * 3); // 1 to 3
    
    for (let j = 0; j < power; j++) {
      primeFactors.push(prime);
      number *= prime;
      
      // Stop if we exceed 200
      if (number > 200) {
        return generateNumberWithPrimeFactors(); // Retry
      }
    }
  }
  
  // Ensure number is at least 20
  if (number < 20) {
    return generateNumberWithPrimeFactors(); // Retry
  }
  
  return { number, primeFactors: primeFactors.sort((a, b) => a - b) };
}

function getPrimeFactorization(n) {
  const factors = [];
  let num = n;
  
  for (let i = 2; i <= num; i++) {
    while (num % i === 0) {
      factors.push(i);
      num /= i;
    }
  }
  
  return factors;
}

function formatPrimeFactorization(factors, useIndex = false) {
  // Count occurrences of each prime
  const factorCounts = {};
  factors.forEach(f => {
    factorCounts[f] = (factorCounts[f] || 0) + 1;
  });
  
  const sortedPrimes = Object.keys(factorCounts).map(Number).sort((a, b) => a - b);
  
  if (useIndex) {
    return sortedPrimes.map(prime => {
      const count = factorCounts[prime];
      return count > 1 ? `${prime}^${count}` : `${prime}`;
    }).join(' \\times ');
  } else {
    return factors.join(' \\times ');
  }
}

function generateProductPrimeFactorsQuestion() {
  const { number, primeFactors } = generateNumberWithPrimeFactors();
  const correctFactorization = formatPrimeFactorization(primeFactors, true);
  
  const { options, correctIndex } = generateProductOptions(number, primeFactors);
  
  return {
    question: `Express ${number} as a product of prime factors`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Prime Factorization of ${number}</strong></div>
<div></div>
<div>Step-by-step factorization:</div>
${generateFactorizationSteps(number)}
<div></div>
<div><strong>Answer:</strong> \\(${correctFactorization}\\)</div>
    `.trim()
  };
}

function generateIndexNotationQuestion() {
  const { number, primeFactors } = generateNumberWithPrimeFactors();
  const correctFactorization = formatPrimeFactorization(primeFactors, true);
  
  const { options, correctIndex } = generateIndexOptions(number, primeFactors);
  
  return {
    question: `Express ${number} as a product of prime factors in index notation`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Prime Factorization of ${number} in Index Notation</strong></div>
<div></div>
<div>Step-by-step factorization:</div>
${generateFactorizationSteps(number)}
<div></div>
<div><strong>Answer:</strong> \\(${correctFactorization}\\)</div>
    `.trim()
  };
}

function generateIdentifyPrimesQuestion() {
  // Generate 4 numbers: mix of primes and composites
  const numbers = [];
  const primes = [];
  
  // Add 2-3 primes
  const numPrimes = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numPrimes; i++) {
    const prime = PRIMES_1_TO_100[Math.floor(Math.random() * PRIMES_1_TO_100.length)];
    if (!numbers.includes(prime)) {
      numbers.push(prime);
      primes.push(prime);
    }
  }
  
  // Fill remaining with composites
  while (numbers.length < 4) {
    const composite = COMPOSITES_1_TO_100[Math.floor(Math.random() * COMPOSITES_1_TO_100.length)];
    if (!numbers.includes(composite)) {
      numbers.push(composite);
    }
  }
  
  // Shuffle numbers
  const shuffled = shuffleArray(numbers);
  const correctAnswer = primes.sort((a, b) => a - b).join(', ');
  
  const { options, correctIndex } = generatePrimeIdentificationOptions(shuffled, primes);
  
  return {
    question: `Which of the following numbers are prime? ${shuffled.join(', ')}`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Prime Numbers Identification</strong></div>
<div></div>
<div>A prime number has exactly two factors: 1 and itself.</div>
<div></div>
${shuffled.map(num => `<div>\\(${num}\\): ${isPrime(num) ? 'Prime' : `Composite (factors: ${getFactors(num).join(', ')})`}</div>`).join('')}
<div></div>
<div><strong>Prime numbers:</strong> ${correctAnswer}</div>
    `.trim()
  };
}

function generateFactorizationSteps(number) {
  let steps = '';
  let n = number;
  let divisor = 2;
  
  steps += `<div>\\(${number}\\)</div>`;
  
  while (n > 1) {
    if (n % divisor === 0) {
      n = n / divisor;
      steps += `<div>\\(= ${divisor} \\times ${n}\\)</div>`;
    } else {
      divisor++;
      if (divisor > n) break;
    }
  }
  
  return steps;
}

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  
  return true;
}

function getFactors(n) {
  const factors = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors;
}

// OPTIONS GENERATION

function generateProductOptions(number, correctFactors) {
  const correct = formatPrimeFactorization(correctFactors, true);
  const wrongOptions = new Set();
  
  // Strategy 1: Include one composite number
  const composite1 = generateCompositeOption(correctFactors);
  if (composite1 && composite1 !== correct) wrongOptions.add(composite1);
  
  // Strategy 2: Wrong exponents
  const wrongExponent = generateWrongExponentOption(correctFactors);
  if (wrongExponent && wrongExponent !== correct && !wrongOptions.has(wrongExponent)) {
    wrongOptions.add(wrongExponent);
  }
  
  // Strategy 3: Missing or extra prime
  const missingPrime = generateMissingPrimeOption(correctFactors);
  if (missingPrime && missingPrime !== correct && !wrongOptions.has(missingPrime)) {
    wrongOptions.add(missingPrime);
  }
  
  // Strategy 4: Swapped exponents
  const swappedExponent = generateSwappedExponentOption(correctFactors);
  if (swappedExponent && swappedExponent !== correct && !wrongOptions.has(swappedExponent)) {
    wrongOptions.add(swappedExponent);
  }
  
  // Fill with fallbacks if needed
  while (wrongOptions.size < 3) {
    const fallback = generateFallbackOption(correctFactors, number);
    if (fallback && fallback !== correct && !wrongOptions.has(fallback)) {
      wrongOptions.add(fallback);
    }
  }
  
  const allOptions = [correct, ...Array.from(wrongOptions).slice(0, 3)];
  const shuffled = shuffleArray(allOptions);
  
  return {
    options: shuffled.map(opt => `\\(${opt}\\)`),
    correctIndex: shuffled.indexOf(correct)
  };
}

function generateIndexOptions(number, correctFactors) {
  return generateProductOptions(number, correctFactors);
}

function generatePrimeIdentificationOptions(numbers, correctPrimes) {
  const correct = correctPrimes.sort((a, b) => a - b).join(', ');
  const wrongOptions = new Set();
  
  // Strategy 1: Include one composite as prime
  const composites = numbers.filter(n => !correctPrimes.includes(n));
  if (composites.length > 0) {
    const extra = [...correctPrimes, composites[0]].sort((a, b) => a - b).join(', ');
    wrongOptions.add(extra);
  }
  
  // Strategy 2: Missing one prime
  if (correctPrimes.length > 1) {
    const missing = correctPrimes.slice(1).join(', ');
    if (missing !== correct) wrongOptions.add(missing);
  }
  
  // Strategy 3: Wrong combination
  const shuffledNumbers = shuffleArray([...numbers]);
  const wrongCombo = shuffledNumbers.slice(0, correctPrimes.length).sort((a, b) => a - b).join(', ');
  if (wrongCombo !== correct) wrongOptions.add(wrongCombo);
  
  // Strategy 4: All numbers
  if (numbers.length > correctPrimes.length) {
    const allNums = numbers.sort((a, b) => a - b).join(', ');
    if (allNums !== correct) wrongOptions.add(allNums);
  }
  
  // Fill with fallbacks
  while (wrongOptions.size < 3) {
    const randomSelection = shuffleArray([...numbers]).slice(0, 1 + Math.floor(Math.random() * 3));
    const fallback = randomSelection.sort((a, b) => a - b).join(', ');
    if (fallback !== correct && !wrongOptions.has(fallback)) {
      wrongOptions.add(fallback);
    }
  }
  
  const allOptions = [correct, ...Array.from(wrongOptions).slice(0, 3)];
  const shuffled = shuffleArray(allOptions);
  
  return {
    options: shuffled,
    correctIndex: shuffled.indexOf(correct)
  };
}

function generateCompositeOption(factors) {
  // Replace one prime pair with their product (composite)
  const factorCounts = {};
  factors.forEach(f => {
    factorCounts[f] = (factorCounts[f] || 0) + 1;
  });
  
  const primes = Object.keys(factorCounts).map(Number).sort((a, b) => a - b);
  
  if (primes.length >= 2) {
    const idx1 = Math.floor(Math.random() * primes.length);
    const idx2 = (idx1 + 1) % primes.length;
    const p1 = primes[idx1];
    const p2 = primes[idx2];
    const composite = p1 * p2;
    
    // Create new factorization with composite
    const newFactors = {...factorCounts};
    newFactors[p1] = Math.max(0, (newFactors[p1] || 0) - 1);
    newFactors[p2] = Math.max(0, (newFactors[p2] || 0) - 1);
    newFactors[composite] = 1;
    
    // Clean up zeros
    Object.keys(newFactors).forEach(key => {
      if (newFactors[key] === 0) delete newFactors[key];
    });
    
    return Object.keys(newFactors).map(Number).sort((a, b) => a - b).map(prime => {
      const count = newFactors[prime];
      return count > 1 ? `${prime}^${count}` : `${prime}`;
    }).join(' \\times ');
  }
  
  return null;
}

function generateWrongExponentOption(factors) {
  const factorCounts = {};
  factors.forEach(f => {
    factorCounts[f] = (factorCounts[f] || 0) + 1;
  });
  
  const primes = Object.keys(factorCounts).map(Number);
  if (primes.length === 0) return null;
  
  const prime = primes[Math.floor(Math.random() * primes.length)];
  const wrongCounts = {...factorCounts};
  
  // Increase or decrease exponent by 1
  wrongCounts[prime] += Math.random() < 0.5 ? 1 : -1;
  if (wrongCounts[prime] <= 0) wrongCounts[prime] = 1;
  
  return Object.keys(wrongCounts).map(Number).sort((a, b) => a - b).map(p => {
    const count = wrongCounts[p];
    return count > 1 ? `${p}^${count}` : `${p}`;
  }).join(' \\times ');
}

function generateMissingPrimeOption(factors) {
  const factorCounts = {};
  factors.forEach(f => {
    factorCounts[f] = (factorCounts[f] || 0) + 1;
  });
  
  const primes = Object.keys(factorCounts).map(Number);
  if (primes.length <= 1) return null;
  
  // Remove one prime
  const removeIdx = Math.floor(Math.random() * primes.length);
  const newCounts = {...factorCounts};
  delete newCounts[primes[removeIdx]];
  
  return Object.keys(newCounts).map(Number).sort((a, b) => a - b).map(p => {
    const count = newCounts[p];
    return count > 1 ? `${p}^${count}` : `${p}`;
  }).join(' \\times ');
}

function generateSwappedExponentOption(factors) {
  const factorCounts = {};
  factors.forEach(f => {
    factorCounts[f] = (factorCounts[f] || 0) + 1;
  });
  
  const primes = Object.keys(factorCounts).map(Number);
  if (primes.length < 2) return null;
  
  const idx1 = Math.floor(Math.random() * primes.length);
  const idx2 = (idx1 + 1) % primes.length;
  
  const newCounts = {...factorCounts};
  const temp = newCounts[primes[idx1]];
  newCounts[primes[idx1]] = newCounts[primes[idx2]];
  newCounts[primes[idx2]] = temp;
  
  return Object.keys(newCounts).map(Number).sort((a, b) => a - b).map(p => {
    const count = newCounts[p];
    return count > 1 ? `${p}^${count}` : `${p}`;
  }).join(' \\times ');
}

function generateFallbackOption(factors, number) {
  // Generate random but plausible factorization
  const randomPrimes = [];
  let product = 1;
  
  for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
    const prime = PRIMES_1_TO_20[Math.floor(Math.random() * PRIMES_1_TO_20.length)];
    randomPrimes.push(prime);
    product *= prime;
  }
  
  if (product === number) return null;
  
  return formatPrimeFactorization(randomPrimes, true);
}

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
  'product-prime-factors': {
    title: 'Product of Prime Factors',
    description: 'Express numbers as products of prime factors',
    generator: (count) => generateFactorizationQuestions(count, 'product-prime-factors')
  },
  'index-notation': {
    title: 'Index Notation of Prime Factors',
    description: 'Express prime factorization in index/exponential form',
    generator: (count) => generateFactorizationQuestions(count, 'index-notation')
  },
  'identify-primes': {
    title: 'Identifying Prime Numbers',
    description: 'Identify prime numbers between 1 and 100',
    generator: (count) => generateFactorizationQuestions(count, 'identify-primes')
  },
  'all-factorization': {
    title: 'All Prime Factorization',
    description: 'Mixed questions on prime factorization',
    generator: (count) => generateFactorizationQuestions(count, 'all')
  }
};

// Export factorization functions
window.factorizationFunctions = {
  generateFactorizationQuestions,
  generateProductPrimeFactorsQuestion,
  generateIndexNotationQuestion,
  generateIdentifyPrimesQuestion
};