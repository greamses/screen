 function generateBinaryQuestions(count = 10, questionType = 'all') {
  let questionTypes;
  
  // Filter question types based on the parameter
  switch (questionType) {
    case 'conversion':
      // Only binary to decimal and decimal to binary questions
      questionTypes = Array.from({length: count}, (_, i) => Math.floor(Math.random() * 2));
      break;
    case 'arithmetic':
      // Only arithmetic questions (addition, subtraction, multiplication, division)
      questionTypes = Array.from({length: count}, (_, i) => 2 + Math.floor(Math.random() * 4));
      break;
    case 'logic':
      // Logic questions (placeholder - you can add these later)
      questionTypes = Array.from({length: count}, (_, i) => Math.floor(Math.random() * 2));
      break;
    case 'systems':
      // Number systems questions (placeholder - you can add these later)
      questionTypes = Array.from({length: count}, (_, i) => Math.floor(Math.random() * 2));
      break;
    default:
      // All question types (0-5)
      questionTypes = Array.from({length: count}, (_, i) => Math.floor(Math.random() * 6));
  }

  const questions = questionTypes.map(type => {
    switch (type) {
      case 0: return generateBinaryToDecimalQuestion();
      case 1: return generateDecimalToBinaryQuestion();
      case 2: return generateBinaryAdditionQuestion();
      case 3: return generateBinarySubtractionQuestion();
      case 4: return generateBinaryMultiplicationQuestion();
      case 5: return generateBinaryDivisionQuestion();
      default: return generateBinaryToDecimalQuestion();
    }
  });

  return questions;
}

// Rest of your functions remain exactly the same...
function generateBinaryToDecimalQuestion() {
  const binaryLength = 4 + Math.floor(Math.random() * 3);
  const binaryNum = generateRandomBinary(binaryLength);
  const decimalValue = parseInt(binaryNum, 2);

  const { options, correctIndex } = generateDecimalOptionsWithIndex(decimalValue);

  const templates = [
    `Convert the binary number \\(${binaryNum}_2\\) to decimal.`,
    `What is the decimal equivalent of the binary number \\(${binaryNum}_2\\)?`,
    `Express \\(${binaryNum}_2\\) in base \\(10\\) form.`,
    `Translate the binary value \\(${binaryNum}_2\\) to its decimal representation.`,
    `Find the decimal form of the binary number \\(${binaryNum}_2\\).`,
    `How is \\(${binaryNum}_2\\) represented in the decimal number system?`,
    `Convert \\(${binaryNum}_2\\) from binary notation to decimal notation.`,
    `What decimal number corresponds to the binary number \\(${binaryNum}_2\\)?`,
    `Determine the decimal value for the binary number \\(${binaryNum}_2\\).`,
    `Write \\(${binaryNum}_2\\) in base \\(2\\) as a decimal number.`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateBinaryToDecimalExplanation(binaryNum, decimalValue)
  };
}

function generateDecimalToBinaryQuestion() {
  const decimalNum = 8 + Math.floor(Math.random() * 57);
  const binaryValue = decimalNum.toString(2);
  
  const { options, correctIndex } = generateBinaryOptionsWithIndex(binaryValue);
  
  const templates = [
    `Convert the decimal number \\(${decimalNum}_{10}\\) to binary.`,
    `What is the binary equivalent of the decimal number \\(${decimalNum}_{10}\\)?`,
    `Express \\(${decimalNum}_{10}\\) in binary form.`,
    `Translate the decimal value \\(${decimalNum}_{10}\\) to its binary representation.`,
    `Find the binary form of the decimal number \\(${decimalNum}_{10}\\).`,
    `How is \\(${decimalNum}_{10}\\) represented in the binary number system?`,
    `Convert \\(${decimalNum}_{10}\\) from decimal notation to binary notation.`,
    `What binary number corresponds to the decimal number \\(${decimalNum}_{10}\\)?`,
    `Determine the binary code for the decimal value \\(${decimalNum}_{10}\\).`,
    `Write \\(${decimalNum}_{10}\\) in base \\(10\\) as a binary number.`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateDecimalToBinaryExplanation(decimalNum, binaryValue)
  };
}

function generateBinaryAdditionQuestion() {
  const binary1 = generateRandomBinary(3 + Math.floor(Math.random() * 2));
  const binary2 = generateRandomBinary(3 + Math.floor(Math.random() * 2));
  const sum = parseInt(binary1, 2) + parseInt(binary2, 2);
  const binarySum = sum.toString(2);
  
  const { options, correctIndex } = generateBinaryOptionsWithIndex(binarySum);
  
  const templates = [
    `What is \\(${binary1}_2 + ${binary2}_2\\) in binary?`,
    `Calculate the binary sum of \\(${binary1}_2\\) and \\(${binary2}_2\\).`,
    `Add the binary numbers \\(${binary1}_2\\) and \\(${binary2}_2\\). What is the result?`,
    `Find the binary result of adding \\(${binary1}_2\\) to \\(${binary2}_2\\).`,
    `Perform binary addition: \\(${binary1}_2 + ${binary2}_2 = ?\\)`,
    `What binary number do you get when you add \\(${binary1}_2\\) and \\(${binary2}_2\\)?`,
    `Compute the sum of these binary values: \\(${binary1}_2\\) and \\(${binary2}_2\\)`,
    `Add these two binary numbers together: \\(${binary1}_2 + ${binary2}_2\\)`,
    `Determine the binary total when \\(${binary1}_2\\) is added to \\(${binary2}_2\\)`,
    `Solve this binary addition problem: \\(${binary1}_2 + ${binary2}_2\\)`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateBinaryAdditionExplanation(binary1, binary2, binarySum)
  };
}

function generateBinarySubtractionQuestion() {
  // Generate pairs until we get one with positive result
  const pairs = Array.from({ length: 5 }, () => [
    generateRandomBinary(3 + Math.floor(Math.random() * 2)),
    generateRandomBinary(3 + Math.floor(Math.random() * 2))
  ]);
  
  const validPair = pairs.find(([binA, binB]) => parseInt(binA, 2) > parseInt(binB, 2));
  const [binA, binB] = validPair || [generateRandomBinary(4), generateRandomBinary(2)];
  
  const difference = parseInt(binA, 2) - parseInt(binB, 2);
  const binaryDiff = difference.toString(2);
  
  const { options, correctIndex } = generateBinaryOptionsWithIndex(binaryDiff);
  
  const templates = [
    `What is \\(${binA}_2 - ${binB}_2\\) in binary?`,
    `Calculate the binary difference of \\(${binA}_2\\) minus \\(${binB}_2\\).`,
    `Subtract the binary number \\(${binB}_2\\) from \\(${binA}_2\\). What is the result?`,
    `Find the binary result of \\(${binA}_2 - ${binB}_2\\).`,
    `Perform binary subtraction: \\(${binA}_2 - ${binB}_2 = ?\\)`,
    `What binary number do you get when you subtract \\(${binB}_2\\) from \\(${binA}_2\\)?`,
    `Compute the difference of these binary values: \\(${binA}_2\\) minus \\(${binB}_2\\)`,
    `Subtract these binary numbers: \\(${binA}_2 - ${binB}_2\\)`,
    `Determine the binary result when \\(${binB}_2\\) is subtracted from \\(${binA}_2\\)`,
    `Solve this binary subtraction problem: \\(${binA}_2 - ${binB}_2\\)`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateBinarySubtractionExplanation(binA, binB, binaryDiff)
  };
}

function generateBinaryMultiplicationQuestion() {
  const mult1 = generateRandomBinary(2 + Math.floor(Math.random() * 2));
  const mult2 = generateRandomBinary(2 + Math.floor(Math.random() * 2));
  const product = parseInt(mult1, 2) * parseInt(mult2, 2);
  const binaryProduct = product.toString(2);
  
  const { options, correctIndex } = generateBinaryOptionsWithIndex(binaryProduct);
  
  const templates = [
    `What is \\(${mult1}_2 × ${mult2}_2\\) in binary?`,
    `Calculate the binary product of \\(${mult1}_2\\) and \\(${mult2}_2\\).`,
    `Multiply the binary numbers \\(${mult1}_2\\) and \\(${mult2}_2\\). What is the result?`,
    `Find the binary result of \\(${mult1}_2 × ${mult2}_2\\).`,
    `Perform binary multiplication: \\(${mult1}_2 × ${mult2}_2 = ?\\)`,
    `What binary number do you get when you multiply \\(${mult1}_2\\) by \\(${mult2}_2\\)?`,
    `Compute the product of these binary values: \\(${mult1}_2\\) and \\(${mult2}_2\\)`,
    `Multiply these binary numbers: \\(${mult1}_2 × ${mult2}_2\\)`,
    `Determine the binary result when \\(${mult1}_2\\) is multiplied by \\(${mult2}_2\\)`,
    `Solve this binary multiplication problem: \\(${mult1}_2 × ${mult2}_2\\)`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateBinaryMultiplicationExplanation(mult1, mult2, binaryProduct)
  };
}

function generateBinaryDivisionQuestion() {
  const divisors = Array.from({ length: 3 }, () => generateRandomBinary(2));
  const dividends = divisors.map(divisor => {
    const divisorValue = parseInt(divisor, 2);
    const multiple = 2 + Math.floor(Math.random() * 4);
    return (divisorValue * multiple).toString(2);
  });
  
  const randomIndex = Math.floor(Math.random() * divisors.length);
  const divisor = divisors[randomIndex];
  const dividend = dividends[randomIndex];
  const quotient = (parseInt(dividend, 2) / parseInt(divisor, 2)).toString(2);
  
  const { options, correctIndex } = generateBinaryOptionsWithIndex(quotient);
  
  const templates = [
    `What is \\(${dividend}_2 ÷ ${divisor}_2\\) in binary?`,
    `Calculate the binary quotient of \\(${dividend}_2\\) divided by \\(${divisor}_2\\).`,
    `Divide the binary number \\(${dividend}_2\\) by \\(${divisor}_2\\). What is the result?`,
    `Find the binary result of \\(${dividend}_2 ÷ ${divisor}_2\\).`,
    `Perform binary division: \\(${dividend}_2 ÷ ${divisor}_2 = ?\\)`,
    `What binary number do you get when you divide \\(${dividend}_2\\) by \\(${divisor}_2\\)?`,
    `Compute the quotient of these binary values: \\(${dividend}_2 ÷ ${divisor}_2\\)`,
    `Divide these binary numbers: \\(${dividend}_2 ÷ ${divisor}_2\\)`,
    `Determine the binary result when \\(${dividend}_2\\) is divided by \\(${divisor}_2\\)`,
    `Solve this binary division problem: \\(${dividend}_2 ÷ ${divisor}_2\\)`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    question: randomTemplate,
    options: options,
    correct: correctIndex,
    explanation: generateBinaryDivisionExplanation(dividend, divisor, quotient)
  };
}

// All the helper functions remain exactly the same...
function generateDecimalOptionsWithIndex(correctValue) {
  const offsets = [-5, -3, 3, 5];
  const wrongValues = offsets.map(offset => {
    const wrongValue = correctValue + offset;
    return wrongValue > 0 ? wrongValue : null;
  }).filter(Boolean);

  const uniqueWrongValues = [...new Set(wrongValues)].slice(0, 3);
  
  // Create options array with correct answer
  let options = [`\\(${correctValue}_{10}\\)`, ...uniqueWrongValues.map(v => `\\(${v}_{10}\\)`)];
  
  // Ensure we have exactly 4 options
  while (options.length < 4) {
    const additionalOffset = [2, 4, 6, 8][options.length - 1] || 7;
    const additionalValue = correctValue + additionalOffset;
    const formattedValue = `\\(${additionalValue}_{10}\\)`;
    if (!options.includes(formattedValue)) {
      options.push(formattedValue);
    }
  }

  // Store the correct answer and shuffle
  const correctAnswer = `\\(${correctValue}_{10}\\)`;
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    options: shuffledOptions,
    correctIndex: correctIndex
  };
}

function generateBinaryOptionsWithIndex(correctBinary) {
  const wrongOptions = Array.from({length: 6}, (_, i) => {
    if (i % 2 === 0) {
      // Flip bits at different positions
      const flipPos = i % correctBinary.length;
      const wrongBinary = correctBinary.split('').map((bit, idx) => 
        idx === flipPos ? (bit === '0' ? '1' : '0') : bit
      ).join('');
      return wrongBinary;
    } else {
      return generateRandomBinary(correctBinary.length);
    }
  });

  const uniqueWrongOptions = [...new Set(wrongOptions)]
    .filter(opt => opt !== correctBinary)
    .slice(0, 3);

  // Create options array with correct answer
  let options = [`\\(${correctBinary}_2\\)`, ...uniqueWrongOptions.map(opt => `\\(${opt}_2\\)`)];
  
  // Store the correct answer and shuffle
  const correctAnswer = `\\(${correctBinary}_2\\)`;
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    options: shuffledOptions,
    correctIndex: correctIndex
  };
}

function generateRandomBinary(length) {
  const bits = Array.from({length}, (_, i) => i === 0 ? '1' : Math.round(Math.random()).toString());
  return bits.join('');
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateBinaryToDecimalExplanation(binary, decimal) {
  const placeValues = Array.from({length: binary.length}, (_, i) => {
    const power = binary.length - 1 - i;
    return `2^{${power}}`;
  }).join(' ');

  const calculations = Array.from({length: binary.length}, (_, i) => {
    const bit = binary[i];
    const power = binary.length - 1 - i;
    const value = parseInt(bit) * Math.pow(2, power);
    return bit === '1' ? `${bit} × 2^{${power}} = ${value}` : null;
  }).filter(Boolean);

  const total = calculations.reduce((sum, calc) => sum + parseInt(calc.split(' = ')[1]), 0);

  return `
<div>Step-by-step conversion:</div>
<div>Binary: \\(${binary}_2\\)</div>
<div>Write the place values: \\(${placeValues}\\)</div>
<div>Multiply each bit by its place value:</div>
${calculations.map(c => `<div>\\(${c}\\)</div>`).join('')}
<div>Add the results: \\(${calculations.map(c => c.split(' = ')[1]).join(' + ')} = ${total}\\)</div>
<div>Final answer: \\(${decimal}_{10}\\)</div>
  `.trim();
}

function generateDecimalToBinaryExplanation(decimal, binary) {
  let temp = decimal;
  const steps = [];

  while (temp > 0) {
    const quotient = Math.floor(temp / 2);
    const remainder = temp % 2;
    steps.push(`\\(${temp} ÷ 2 = ${quotient}\\) remainder \\(${remainder}\\)`);
    temp = quotient;
  }

  const remainders = steps.map(step => step.split('remainder ')[1]).reverse();

  return `
<div>Step-by-step conversion:</div>
<div>Decimal: \\(${decimal}_{10}\\)</div>
<div>Repeated division by 2:</div>
${steps.map(s => `<div>${s}</div>`).join('')}
<div>Read remainders from bottom to top: \\(${remainders.join('')}\\)</div>
<div>Final answer: \\(${binary}_2\\)</div>
  `.trim();
}

function generateBinaryAdditionExplanation(bin1, bin2, result) {
  const num1 = parseInt(bin1, 2);
  const num2 = parseInt(bin2, 2);
  const sum = num1 + num2;

  const maxLength = Math.max(bin1.length, bin2.length);
  const padded1 = bin1.padStart(maxLength, '0');
  const padded2 = bin2.padStart(maxLength, '0');

  let carry = 0;
  const additionSteps = Array.from({length: maxLength}, (_, i) => {
    const pos = maxLength - 1 - i;
    const bit1 = parseInt(padded1[pos]);
    const bit2 = parseInt(padded2[pos]);
    const sumBits = bit1 + bit2 + carry;
    const resultBit = sumBits % 2;
    carry = Math.floor(sumBits / 2);
    return `Position ${i}: \\(${bit1} + ${bit2} + ${carry} = ${sumBits}\\) (write \\(${resultBit}\\), carry \\(${carry}\\))`;
  }).reverse();

  if (carry) {
    additionSteps.unshift(`Final carry: \\(${carry}\\)`);
  }

  return `
<div>Step-by-step addition:</div>
<div>First convert to decimal:</div>
<div>\\(${bin1}_2 = ${num1}_{10}\\)</div>
<div>\\(${bin2}_2 = ${num2}_{10}\\)</div>
<div>Add: \\(${num1} + ${num2} = ${sum}_{10}\\)</div>
<div>Convert back to binary: \\(${sum}_{10} = ${result}_2\\)</div>
<div>Binary addition method:</div>
<div>Align and add from right to left:</div>
${additionSteps.map(s => `<div>${s}</div>`).join('')}
<div>Final answer: \\(${result}_2\\)</div>
  `.trim();
}

function generateBinarySubtractionExplanation(bin1, bin2, result) {
  const num1 = parseInt(bin1, 2);
  const num2 = parseInt(bin2, 2);
  const diff = num1 - num2;

  return `
<div>Step-by-step subtraction:</div>
<div>First convert to decimal:</div>
<div>\\(${bin1}_2 = ${num1}_{10}\\)</div>
<div>\\(${bin2}_2 = ${num2}_{10}\\)</div>
<div>Subtract: \\(${num1} - ${num2} = ${diff}_{10}\\)</div>
<div>Convert back to binary: \\(${diff}_{10} = ${result}_2\\)</div>
<div>Final answer: \\(${result}_2\\)</div>
  `.trim();
}

function generateBinaryMultiplicationExplanation(bin1, bin2, result) {
  const num1 = parseInt(bin1, 2);
  const num2 = parseInt(bin2, 2);
  const product = num1 * num2;

  return `
<div>Step-by-step multiplication:</div>
<div>First convert to decimal:</div>
<div>\\(${bin1}_2 = ${num1}_{10}\\)</div>
<div>\\(${bin2}_2 = ${num2}_{10}\\)</div>
<div>Multiply: \\(${num1} × ${num2} = ${product}_{10}\\)</div>
<div>Convert back to binary: \\(${product}_{10} = ${result}_2\\)</div>
<div>Final answer: \\(${result}_2\\)</div>
  `.trim();
}

function generateBinaryDivisionExplanation(dividend, divisor, quotient) {
  const numDividend = parseInt(dividend, 2);
  const numDivisor = parseInt(divisor, 2);
  const numQuotient = parseInt(quotient, 2);

  return `
<div>Step-by-step division:</div>
<div>First convert to decimal:</div>
<div>\\(${dividend}_2 = ${numDividend}_{10}\\)</div>
<div>\\(${divisor}_2 = ${numDivisor}_{10}\\)</div>
<div>Divide: \\(${numDividend} ÷ ${numDivisor} = ${numQuotient}_{10}\\)</div>
<div>Convert back to binary: \\(${numQuotient}_{10} = ${quotient}_2\\)</div>
<div>Final answer: \\(${quotient}_2\\)</div>
  `.trim();
}