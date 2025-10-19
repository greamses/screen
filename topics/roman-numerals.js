 function generateRomanNumeralQuestions(count = 10, questionType = 'all') {
  let questionTypes;
  

  switch (questionType) {
    case 'conversion':

      questionTypes = Array.from({length: count}, (_, i) => Math.floor(Math.random() * 2));
      break;
    case 'arithmetic':
      // Only arithmetic questions (addition, subtraction)
      questionTypes = Array.from({length: count}, (_, i) => 2 + Math.floor(Math.random() * 2));
      break;
    case 'comparison':
      // Only comparison and ordering questions
      questionTypes = Array.from({length: count}, (_, i) => 4 + Math.floor(Math.random() * 2));
      break;
    case 'all':
    default:
      // All question types (0-5)
      questionTypes = Array.from({length: count}, (_, i) => Math.floor(Math.random() * 6));
  }

  const questions = questionTypes.map(questionType => {
    switch (questionType) {
      case 0: return generateRomanToDecimalQuestion();
      case 1: return generateDecimalToRomanQuestion();
      case 2: return generateRomanAdditionQuestion();
      case 3: return generateRomanSubtractionQuestion();
      case 4: return generateRomanComparisonQuestion();
      case 5: return generateRomanOrderingQuestion();
      default: return generateRomanToDecimalQuestion();
    }
  });

  return questions;
}

// All your existing functions remain exactly the same...
function generateRomanToDecimalQuestion() {
  const decimalValue = 5 + Math.floor(Math.random() * 495); // 5 to 499
  const romanNum = decimalToRoman(decimalValue);

  const { options, correctIndex } = generateDecimalOptionsWithIndex(decimalValue);

  const templates = [
    `Convert the Roman numeral ${romanNum} to decimal.`,
    `What is the decimal equivalent of the Roman numeral ${romanNum}?`,
    `Express ${romanNum} in base \\(10\\) form.`,
    `Translate the Roman numeral ${romanNum} to its decimal representation.`,
    `Find the decimal form of the Roman numeral ${romanNum}.`,
    `How is ${romanNum} represented in the decimal number system?`,
    `Convert ${romanNum} from Roman numeral notation to decimal notation.`,
    `What decimal number corresponds to the Roman numeral ${romanNum}?`,
    `Determine the decimal value for the Roman numeral ${romanNum}.`,
    `Write ${romanNum} as a decimal number.`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateRomanToDecimalExplanation(romanNum, decimalValue)
  };
}

function generateDecimalToRomanQuestion() {
  const decimalNum = 5 + Math.floor(Math.random() * 495); // 5 to 499
  const romanValue = decimalToRoman(decimalNum);
  
  const { options, correctIndex } = generateRomanOptionsWithIndex(romanValue);
  
  const templates = [
    `Convert the decimal number \\(${decimalNum}\\) to Roman numerals.`,
    `What is the Roman numeral equivalent of the decimal number \\(${decimalNum}\\)?`,
    `Express \\(${decimalNum}\\) in Roman numeral form.`,
    `Translate the decimal value \\(${decimalNum}\\) to its Roman numeral representation.`,
    `Find the Roman numeral form of the decimal number \\(${decimalNum}\\).`,
    `How is \\(${decimalNum}\\) represented in Roman numerals?`,
    `Convert \\(${decimalNum}\\) from decimal notation to Roman numeral notation.`,
    `What Roman numeral corresponds to the decimal number \\(${decimalNum}\\)?`,
    `Determine the Roman numeral for the decimal value \\(${decimalNum}\\).`,
    `Write \\(${decimalNum}\\) as a Roman numeral.`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateDecimalToRomanExplanation(decimalNum, romanValue)
  };
}

function generateRomanAdditionQuestion() {
  const num1 = 5 + Math.floor(Math.random() * 95); // 5 to 99
  const num2 = 5 + Math.floor(Math.random() * 95); // 5 to 99
  const roman1 = decimalToRoman(num1);
  const roman2 = decimalToRoman(num2);
  const sum = num1 + num2;
  const romanSum = decimalToRoman(sum);
  
  const { options, correctIndex } = generateRomanOptionsWithIndex(romanSum);
  
  const templates = [
    `What is ${roman1} + ${roman2} in Roman numerals?`,
    `Calculate the sum of ${roman1} and ${roman2} in Roman numerals.`,
    `Add the Roman numerals ${roman1} and ${roman2}. What is the result?`,
    `Find the result of adding ${roman1} to ${roman2}.`,
    `Perform Roman numeral addition: ${roman1} + ${roman2} = ?`,
    `What Roman numeral do you get when you add ${roman1} and ${roman2}?`,
    `Compute the sum of these Roman numerals: ${roman1} and ${roman2}`,
    `Add these two Roman numerals together: ${roman1} + ${roman2}`,
    `Determine the total when ${roman1} is added to ${roman2}`,
    `Solve this Roman numeral addition problem: ${roman1} + ${roman2}`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateRomanAdditionExplanation(roman1, roman2, num1, num2, romanSum, sum)
  };
}

function generateRomanSubtractionQuestion() {
  const num1 = 20 + Math.floor(Math.random() * 180); // 20 to 199
  const num2 = 5 + Math.floor(Math.random() * Math.min(num1 - 5, 95)); // 5 to min(num1-5, 99)
  const roman1 = decimalToRoman(num1);
  const roman2 = decimalToRoman(num2);
  const difference = num1 - num2;
  const romanDiff = decimalToRoman(difference);
  
  const { options, correctIndex } = generateRomanOptionsWithIndex(romanDiff);
  
  const templates = [
    `What is ${roman1} - ${roman2} in Roman numerals?`,
    `Calculate the difference of ${roman1} minus ${roman2}.`,
    `Subtract the Roman numeral ${roman2} from ${roman1}. What is the result?`,
    `Find the result of ${roman1} - ${roman2}.`,
    `Perform Roman numeral subtraction: ${roman1} - ${roman2} = ?`,
    `What Roman numeral do you get when you subtract ${roman2} from ${roman1}?`,
    `Compute the difference of these Roman numerals: ${roman1} minus ${roman2}`,
    `Subtract these Roman numerals: ${roman1} - ${roman2}`,
    `Determine the result when ${roman2} is subtracted from ${roman1}`,
    `Solve this Roman numeral subtraction problem: ${roman1} - ${roman2}`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateRomanSubtractionExplanation(roman1, roman2, num1, num2, romanDiff, difference)
  };
}

function generateRomanComparisonQuestion() {
  const num1 = 10 + Math.floor(Math.random() * 190); // 10 to 199
  let num2 = 10 + Math.floor(Math.random() * 190);
  
  // Ensure they're different
  while (num2 === num1) {
    num2 = 10 + Math.floor(Math.random() * 190);
  }
  
  const roman1 = decimalToRoman(num1);
  const roman2 = decimalToRoman(num2);
  
  const correctAnswer = num1 > num2 ? `${roman1} > ${roman2}` : `${roman1} < ${roman2}`;
  const wrongAnswer1 = num1 > num2 ? `${roman1} < ${roman2}` : `${roman1} > ${roman2}`;
  const wrongAnswer2 = `${roman1} = ${roman2}`;
  
  // Generate two additional comparison pairs for wrong options
  const num3 = 10 + Math.floor(Math.random() * 190);
  const num4 = 10 + Math.floor(Math.random() * 190);
  const roman3 = decimalToRoman(num3);
  const roman4 = decimalToRoman(num4);
  const wrongAnswer3 = num3 > num4 ? `${roman3} < ${roman4}` : `${roman3} > ${roman4}`;
  
  let options = [correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3];
  
  // Ensure unique options
  options = [...new Set(options)];
  while (options.length < 4) {
    const extraNum1 = 10 + Math.floor(Math.random() * 190);
    const extraNum2 = 10 + Math.floor(Math.random() * 190);
    const extraRoman1 = decimalToRoman(extraNum1);
    const extraRoman2 = decimalToRoman(extraNum2);
    const extraOption = extraNum1 > extraNum2 ? `${extraRoman1} < ${extraRoman2}` : `${extraRoman1} > ${extraRoman2}`;
    if (!options.includes(extraOption)) {
      options.push(extraOption);
    }
  }
  
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  
  const templates = [
    `Which comparison is correct?`,
    `Select the true statement about these Roman numerals.`,
    `Which of the following is a correct comparison?`,
    `Identify the correct relationship between these Roman numerals.`,
    `Which statement correctly compares these Roman numerals?`,
    `Choose the accurate comparison.`,
    `Which inequality or equality is true?`,
    `Select the correct comparison between Roman numerals.`,
    `Which of these statements is mathematically correct?`,
    `Determine the correct relationship.`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: shuffledOptions,
    correct: correctIndex,
    explanation: generateRomanComparisonExplanation(roman1, roman2, num1, num2, correctAnswer)
  };
}

function generateRomanOrderingQuestion() {
  // Generate 4 different numbers
  const numbers = [];
  while (numbers.length < 4) {
    const num = 10 + Math.floor(Math.random() * 190);
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  
  const romans = numbers.map(n => decimalToRoman(n));
  
  // Determine ordering (ascending or descending)
  const isAscending = Math.random() > 0.5;
  
  const sortedNumbers = [...numbers].sort((a, b) => isAscending ? a - b : b - a);
  const correctOrder = sortedNumbers.map(n => decimalToRoman(n)).join(', ');
  
  // Generate wrong options by shuffling
  const wrongOptions = [];
  for (let i = 0; i < 3; i++) {
    let shuffled;
    do {
      shuffled = shuffleArray([...sortedNumbers]).map(n => decimalToRoman(n)).join(', ');
    } while (shuffled === correctOrder || wrongOptions.includes(shuffled));
    wrongOptions.push(shuffled);
  }
  
  let options = [correctOrder, ...wrongOptions];
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctOrder);
  
  const orderWord = isAscending ? 'ascending' : 'descending';
  const orderSymbol = isAscending ? 'smallest to largest' : 'largest to smallest';
  
  const romansList = romans.join(', ');
  
  const templates = [
    `Arrange these Roman numerals in ${orderWord} order: ${romansList}`,
    `Order these Roman numerals from ${orderSymbol}: ${romansList}`,
    `Which sequence shows these Roman numerals in ${orderWord} order? ${romansList}`,
    `Sort these Roman numerals in ${orderWord} order: ${romansList}`,
    `What is the correct ${orderWord} ordering of: ${romansList}?`,
    `Place these Roman numerals in ${orderWord} sequence: ${romansList}`,
    `Organize these Roman numerals from ${orderSymbol}: ${romansList}`,
    `Which arrangement is ${orderWord} order for: ${romansList}?`,
    `Sequence these Roman numerals from ${orderSymbol}: ${romansList}`,
    `Determine the ${orderWord} order of: ${romansList}`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: shuffledOptions,
    correct: correctIndex,
    explanation: generateRomanOrderingExplanation(romans, numbers, sortedNumbers, isAscending)
  };
}

// All your helper functions remain exactly the same...
function decimalToRoman(num) {
  const values = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];
  
  let result = '';
  let remaining = num;
  
  for (const { value, numeral } of values) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  
  return result;
}

function romanToDecimal(roman) {
  const values = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000
  };
  
  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = values[roman[i]];
    const next = values[roman[i + 1]];
    
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  
  return total;
}

function generateDecimalOptionsWithIndex(correctValue) {
  const offsets = [-7, -3, 5, 12];
  const wrongValues = offsets.map(offset => {
    const wrongValue = correctValue + offset;
    return wrongValue > 0 ? wrongValue : null;
  }).filter(Boolean);

  const uniqueWrongValues = [...new Set(wrongValues)].slice(0, 3);
  
  let options = [`\\(${correctValue}\\)`, ...uniqueWrongValues.map(v => `\\(${v}\\)`)];
  
  while (options.length < 4) {
    const additionalOffset = [2, 4, 8, 15][options.length - 1] || 10;
    const additionalValue = correctValue + additionalOffset;
    const formattedValue = `\\(${additionalValue}\\)`;
    if (!options.includes(formattedValue) && additionalValue > 0) {
      options.push(formattedValue);
    }
  }

  const correctAnswer = `\\(${correctValue}\\)`;
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    options: shuffledOptions,
    correctIndex: correctIndex
  };
}

function generateRomanOptionsWithIndex(correctRoman) {
  const correctValue = romanToDecimal(correctRoman);
  
  const offsets = [-7, -3, 5, 12];
  const wrongValues = offsets.map(offset => {
    const wrongValue = correctValue + offset;
    return wrongValue > 0 && wrongValue < 1000 ? decimalToRoman(wrongValue) : null;
  }).filter(Boolean);

  const uniqueWrongOptions = [...new Set(wrongValues)]
    .filter(opt => opt !== correctRoman)
    .slice(0, 3);

  let options = [correctRoman, ...uniqueWrongOptions];
  
  while (options.length < 4) {
    const additionalOffset = [2, 4, 8, 15][options.length - 1] || 10;
    const additionalValue = correctValue + additionalOffset;
    if (additionalValue > 0 && additionalValue < 1000) {
      const additionalRoman = decimalToRoman(additionalValue);
      if (!options.includes(additionalRoman)) {
        options.push(additionalRoman);
      }
    }
  }

  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctRoman);

  return {
    options: shuffledOptions,
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

function generateRomanToDecimalExplanation(roman, decimal) {
  const breakdown = [];
  let remaining = roman;
  let total = 0;
  
  const values = {
    'M': 1000, 'CM': 900, 'D': 500, 'CD': 400,
    'C': 100, 'XC': 90, 'L': 50, 'XL': 40,
    'X': 10, 'IX': 9, 'V': 5, 'IV': 4, 'I': 1
  };
  
  for (const [numeral, value] of Object.entries(values)) {
    while (remaining.startsWith(numeral)) {
      breakdown.push(`${numeral} = ${value}`);
      total += value;
      remaining = remaining.slice(numeral.length);
    }
  }

  return `
<div>Step-by-step conversion:</div>
<div>Roman numeral: ${roman}</div>
<div>Breaking down the numeral:</div>
${breakdown.map(b => `<div>${b}</div>`).join('')}
<div>Add all values: ${breakdown.map(b => b.split(' = ')[1]).join(' + ')} = ${total}</div>
<div>Final answer: \\(${decimal}\\)</div>
  `.trim();
}

function generateDecimalToRomanExplanation(decimal, roman) {
  const steps = [];
  let remaining = decimal;
  
  const values = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];
  
  for (const { value, numeral } of values) {
    while (remaining >= value) {
      steps.push(`${remaining} ≥ ${value}, write ${numeral} (remaining: ${remaining - value})`);
      remaining -= value;
    }
  }

  return `
<div>Step-by-step conversion:</div>
<div>Decimal: \\(${decimal}\\)</div>
<div>Use largest Roman numeral values first:</div>
${steps.map(s => `<div>${s}</div>`).join('')}
<div>Final answer: ${roman}</div>
  `.trim();
}

function generateRomanAdditionExplanation(roman1, roman2, num1, num2, romanSum, sum) {
  return `
<div>Step-by-step addition:</div>
<div>First convert to decimal:</div>
<div>${roman1} = \\(${num1}\\)</div>
<div>${roman2} = \\(${num2}\\)</div>
<div>Add: \\(${num1} + ${num2} = ${sum}\\)</div>
<div>Convert back to Roman numerals: \\(${sum}\\) = ${romanSum}</div>
<div>Final answer: ${romanSum}</div>
  `.trim();
}

function generateRomanSubtractionExplanation(roman1, roman2, num1, num2, romanDiff, difference) {
  return `
<div>Step-by-step subtraction:</div>
<div>First convert to decimal:</div>
<div>${roman1} = \\(${num1}\\)</div>
<div>${roman2} = \\(${num2}\\)</div>
<div>Subtract: \\(${num1} - ${num2} = ${difference}\\)</div>
<div>Convert back to Roman numerals: \\(${difference}\\) = ${romanDiff}</div>
<div>Final answer: ${romanDiff}</div>
  `.trim();
}

function generateRomanComparisonExplanation(roman1, roman2, num1, num2, correctAnswer) {
  const comparison = num1 > num2 ? 'greater than' : 'less than';
  const symbol = num1 > num2 ? '>' : '<';
  
  return `
<div>Step-by-step comparison:</div>
<div>Convert to decimal:</div>
<div>${roman1} = \\(${num1}\\)</div>
<div>${roman2} = \\(${num2}\\)</div>
<div>Compare: \\(${num1}\\) is ${comparison} \\(${num2}\\)</div>
<div>Therefore: ${roman1} ${symbol} ${roman2}</div>
<div>Final answer: ${correctAnswer}</div>
  `.trim();
}

function generateRomanOrderingExplanation(romans, numbers, sortedNumbers, isAscending) {
  const orderWord = isAscending ? 'ascending' : 'descending';
  const conversions = romans.map((r, i) => `${r} = ${numbers[i]}`);
  const sortedRomans = sortedNumbers.map(n => decimalToRoman(n));
  
  return `
<div>Step-by-step ordering:</div>
<div>Convert each Roman numeral to decimal:</div>
${conversions.map(c => `<div>${c}</div>`).join('')}
<div>Order the decimal values in ${orderWord} order:</div>
<div>${sortedNumbers.join(', ')}</div>
<div>Convert back to Roman numerals:</div>
<div>${sortedRomans.join(', ')}</div>
<div>Final answer: ${sortedRomans.join(', ')}</div>
  `.trim();
}