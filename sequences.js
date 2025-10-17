 function generateSeriesQuestions(count = 10, questionType = 'all') {
  let questionTypes;
  
  switch (questionType) {
    case 'arithmetic':
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 4));
      break;
    case 'geometric':
      questionTypes = Array.from({ length: count }, () => 4 + Math.floor(Math.random() * 4));
      break;
    case 'factorial':
      questionTypes = Array.from({ length: count }, () => 8 + Math.floor(Math.random() * 2));
      break;
    case 'special':
      questionTypes = Array.from({ length: count }, () => 10 + Math.floor(Math.random() * 3));
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 13));
  }
  
  return questionTypes.map(type => {
    switch (type) {
      case 0:
        return generateArithmeticNthTerm();
      case 1:
        return generateArithmeticSum();
      case 2:
        return generateArithmeticMissingTerm();
      case 3:
        return generateArithmeticGivenSum();
      case 4:
        return generateGeometricNthTerm();
      case 5:
        return generateGeometricSum();
      case 6:
        return generateGeometricInfiniteSum();
      case 7:
        return generateGeometricMissingTerm();
      case 8:
        return generateFactorialSimple();
      case 9:
        return generateFactorialExpression();
      case 10:
        return generateSquaresSum();
      case 11:
        return generateCubesSum();
      case 12:
        return generateFibonacciTerm();
      default:
        return generateArithmeticNthTerm();
    }
  });
}

function generateArithmeticNthTerm() {
  const a = 2 + Math.floor(Math.random() * 15);
  const d = 2 + Math.floor(Math.random() * 8);
  const n = 10 + Math.floor(Math.random() * 15);
  const nthTerm = a + (n - 1) * d;
  
  const { options, correctIndex } = generateOptionsWithIndex(nthTerm);
  
  const templates = [
    `Find the ${n}th term of the arithmetic sequence: \\(${a}, ${a+d}, ${a+2*d}, ...\\)`,
    `An arithmetic sequence has first term \\(${a}\\) and common difference \\(${d}\\). Find the ${n}th term.`,
    `What is \\(T_{${n}}\\) in the sequence \\(${a}, ${a+d}, ${a+2*d}, ${a+3*d}, ...\\)?`,
    `If \\(a_1 = ${a}\\) and \\(d = ${d}\\), calculate \\(a_{${n}}\\).`,
    `The sequence starts \\(${a}, ${a+d}, ${a+2*d}, ...\\). Find the ${n}th term.`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(T_n = a + (n-1)d\\)</div>
<div>Where: a = first term, d = common difference, n = term number</div>
<div></div>
<div><strong>Given:</strong></div>
<div>First term (a) = \\(${a}\\)</div>
<div>Common difference (d) = \\(${d}\\)</div>
<div>Term number (n) = \\(${n}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(T_{${n}} = ${a} + (${n}-1) × ${d}\\)</div>
<div>\\(T_{${n}} = ${a} + ${n-1} × ${d}\\)</div>
<div>\\(T_{${n}} = ${a} + ${(n-1)*d}\\)</div>
<div>\\(T_{${n}} = ${nthTerm}\\)</div>
    `.trim()
  };
}

function generateArithmeticSum() {
  const a = 2 + Math.floor(Math.random() * 12);
  const d = 2 + Math.floor(Math.random() * 6);
  const n = 8 + Math.floor(Math.random() * 12);
  const l = a + (n - 1) * d;
  const sum = (n * (a + l)) / 2;
  
  const { options, correctIndex } = generateOptionsWithIndex(sum);
  
  const templates = [
    `Find the sum of the first ${n} terms of: \\(${a}, ${a+d}, ${a+2*d}, ...\\)`,
    `Calculate \\(S_{${n}}\\) for the arithmetic sequence with \\(a = ${a}\\) and \\(d = ${d}\\).`,
    `What is the sum of ${n} terms starting from ${a} with common difference ${d}?`,
    `Find \\(\\sum_{i=1}^{${n}}\\) for the sequence \\(${a}, ${a+d}, ${a+2*d}, ...\\)`,
    `An arithmetic series has first term ${a} and common difference ${d}. Find the sum of ${n} terms.`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(S_n = \\frac{n}{2}(a + l)\\) or \\(S_n = \\frac{n}{2}(2a + (n-1)d)\\)</div>
<div>Where: a = first term, l = last term, d = common difference, n = number of terms</div>
<div></div>
<div><strong>Given:</strong></div>
<div>First term (a) = \\(${a}\\)</div>
<div>Common difference (d) = \\(${d}\\)</div>
<div>Number of terms (n) = \\(${n}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>First, find the last term:</div>
<div>\\(l = a + (n-1)d = ${a} + ${n-1} × ${d} = ${l}\\)</div>
<div></div>
<div>Now find the sum:</div>
<div>\\(S_{${n}} = \\frac{${n}}{2}(${a} + ${l})\\)</div>
<div>\\(S_{${n}} = \\frac{${n}}{2} × ${a + l}\\)</div>
<div>\\(S_{${n}} = ${n/2} × ${a + l}\\)</div>
<div>\\(S_{${n}} = ${sum}\\)</div>
    `.trim()
  };
}

function generateArithmeticMissingTerm() {
  const a = 3 + Math.floor(Math.random() * 10);
  const d = 2 + Math.floor(Math.random() * 5);
  const position = 3 + Math.floor(Math.random() * 4);
  const missingTerm = a + (position - 1) * d;
  const nextTerm = a + position * d;
  
  const sequence = Array.from({ length: 6 }, (_, i) =>
    i === position - 1 ? '?' : a + i * d
  );
  
  const { options, correctIndex } = generateOptionsWithIndex(missingTerm);
  
  return {
    question: `Find the missing term in the arithmetic sequence: \\(${sequence.join(', ')}, ...\\)`,
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Find the common difference and use it to find the missing term.</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Looking at the terms around the missing value:</div>
<div>Before: \\(${a + (position-2)*d}\\)</div>
<div>Missing: ?</div>
<div>After: \\(${nextTerm}\\)</div>
<div></div>
<div>Common difference: \\(d = ${d}\\)</div>
<div>Missing term = \\(${a + (position-2)*d} + ${d} = ${missingTerm}\\)</div>
<div>Or: Missing term = \\(${nextTerm} - ${d} = ${missingTerm}\\)</div>
    `.trim()
  };
}

function generateArithmeticGivenSum() {
  const a = 3 + Math.floor(Math.random() * 8);
  const d = 2 + Math.floor(Math.random() * 5);
  const n = 8 + Math.floor(Math.random() * 7);
  const l = a + (n - 1) * d;
  const sum = (n * (a + l)) / 2;
  
  const { options, correctIndex } = generateOptionsWithIndex(n);
  
  return {
    question: `How many terms of the sequence \\(${a}, ${a+d}, ${a+2*d}, ...\\) are needed to make a sum of ${sum}?`,
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(S_n = \\frac{n}{2}(2a + (n-1)d)\\)</div>
<div></div>
<div><strong>Given:</strong></div>
<div>First term (a) = \\(${a}\\)</div>
<div>Common difference (d) = \\(${d}\\)</div>
<div>Sum = \\(${sum}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(${sum} = \\frac{n}{2}(2 × ${a} + (n-1) × ${d})\\)</div>
<div>\\(${sum} = \\frac{n}{2}(${2*a} + ${d}n - ${d})\\)</div>
<div>\\(${sum} = \\frac{n}{2}(${2*a - d} + ${d}n)\\)</div>
<div></div>
<div>Solving for n: \\(n = ${n}\\)</div>
    `.trim()
  };
}

function generateGeometricNthTerm() {
  const a = 2 + Math.floor(Math.random() * 6);
  const r = 2 + Math.floor(Math.random() * 3);
  const n = 5 + Math.floor(Math.random() * 5);
  const nthTerm = a * Math.pow(r, n - 1);
  
  const { options, correctIndex } = generateOptionsWithIndex(nthTerm);
  
  const templates = [
    `Find the ${n}th term of the geometric sequence: \\(${a}, ${a*r}, ${a*r*r}, ...\\)`,
    `A geometric sequence has first term \\(${a}\\) and common ratio \\(${r}\\). Find the ${n}th term.`,
    `What is \\(T_{${n}}\\) in the sequence \\(${a}, ${a*r}, ${a*r*r}, ${a*r*r*r}, ...\\)?`,
    `If \\(a = ${a}\\) and \\(r = ${r}\\), calculate the ${n}th term.`,
    `The sequence starts \\(${a}, ${a*r}, ${a*r*r}, ...\\). Find \\(T_{${n}}\\).`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(T_n = ar^{n-1}\\)</div>
<div>Where: a = first term, r = common ratio, n = term number</div>
<div></div>
<div><strong>Given:</strong></div>
<div>First term (a) = \\(${a}\\)</div>
<div>Common ratio (r) = \\(${r}\\)</div>
<div>Term number (n) = \\(${n}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(T_{${n}} = ${a} × ${r}^{${n}-1}\\)</div>
<div>\\(T_{${n}} = ${a} × ${r}^{${n-1}}\\)</div>
<div>\\(T_{${n}} = ${a} × ${Math.pow(r, n-1)}\\)</div>
<div>\\(T_{${n}} = ${nthTerm}\\)</div>
    `.trim()
  };
}

function generateGeometricSum() {
  const a = 2 + Math.floor(Math.random() * 5);
  const r = 2 + Math.floor(Math.random() * 2);
  const n = 4 + Math.floor(Math.random() * 5);
  const sum = a * (Math.pow(r, n) - 1) / (r - 1);
  
  const { options, correctIndex } = generateOptionsWithIndex(sum);
  
  const templates = [
    `Find the sum of the first ${n} terms of: \\(${a}, ${a*r}, ${a*r*r}, ...\\)`,
    `Calculate \\(S_{${n}}\\) for the geometric sequence with \\(a = ${a}\\) and \\(r = ${r}\\).`,
    `What is the sum of ${n} terms starting from ${a} with common ratio ${r}?`,
    `A geometric series has first term ${a} and ratio ${r}. Find the sum of ${n} terms.`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(S_n = \\frac{a(r^n - 1)}{r - 1}\\) for r > 1</div>
<div>Where: a = first term, r = common ratio, n = number of terms</div>
<div></div>
<div><strong>Given:</strong></div>
<div>First term (a) = \\(${a}\\)</div>
<div>Common ratio (r) = \\(${r}\\)</div>
<div>Number of terms (n) = \\(${n}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(S_{${n}} = \\frac{${a}(${r}^{${n}} - 1)}{${r} - 1}\\)</div>
<div>\\(S_{${n}} = \\frac{${a}(${Math.pow(r,n)} - 1)}{${r-1}}\\)</div>
<div>\\(S_{${n}} = \\frac{${a} × ${Math.pow(r,n) - 1}}{${r-1}}\\)</div>
<div>\\(S_{${n}} = \\frac{${a * (Math.pow(r,n) - 1)}}{${r-1}}\\)</div>
<div>\\(S_{${n}} = ${sum}\\)</div>
    `.trim()
  };
}

function generateGeometricInfiniteSum() {
  const denominators = [2, 3, 4, 5];
  const numerators = [1, 1, 1, 2];
  const idx = Math.floor(Math.random() * denominators.length);
  const r = numerators[idx] / denominators[idx];
  const a = 2 + Math.floor(Math.random() * 8);
  const sum = a / (1 - r);
  
  const { options, correctIndex } = generateOptionsWithIndex(sum);
  
  const templates = [
    `Find the sum to infinity of: \\(${a}, ${a*r}, ${a*r*r}, ...\\)`,
    `Calculate \\(S_∞\\) for the geometric series with first term ${a} and ratio \\(\\frac{${numerators[idx]}}{${denominators[idx]}}\\).`,
    `What is the infinite sum of the series \\(${a} + ${a*r} + ${a*r*r} + ...\\)?`,
    `Find \\(\\sum_{n=0}^{∞} ${a}(\\frac{${numerators[idx]}}{${denominators[idx]}})^n\\)`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options: options.map(opt => `\(${opt.toFixed(2)}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(S_∞ = \\frac{a}{1 - r}\\) for |r| < 1</div>
<div>Where: a = first term, r = common ratio</div>
<div></div>
<div><strong>Given:</strong></div>
<div>First term (a) = \\(${a}\\)</div>
<div>Common ratio (r) = \\(\\frac{${numerators[idx]}}{${denominators[idx]}}\\) = \\(${r}\\)</div>
<div></div>
<div><strong>Check:</strong> |r| = ${Math.abs(r)} < 1 ✓ (convergent)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(S_∞ = \\frac{${a}}{1 - ${r}}\\)</div>
<div>\\(S_∞ = \\frac{${a}}{${1-r}}\\)</div>
<div>\\(S_∞ = ${sum}\\)</div>
    `.trim()
  };
}

function generateGeometricMissingTerm() {
  const a = 2 + Math.floor(Math.random() * 5);
  const r = 2 + Math.floor(Math.random() * 3);
  const position = 2 + Math.floor(Math.random() * 3);
  const missingTerm = a * Math.pow(r, position - 1);
  
  const sequence = Array.from({ length: 5 }, (_, i) =>
    i === position - 1 ? '?' : a * Math.pow(r, i)
  );
  
  const { options, correctIndex } = generateOptionsWithIndex(missingTerm);
  
  return {
    question: `Find the missing term in the geometric sequence: \\(${sequence.join(', ')}, ...\\)`,
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Find the common ratio and use it to find the missing term.</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Common ratio: \\(r = \\frac{\\text{any term}}{\\text{previous term}} = ${r}\\)</div>
<div></div>
<div>Term before missing: \\(${a * Math.pow(r, position-2)}\\)</div>
<div>Missing term = \\(${a * Math.pow(r, position-2)} × ${r} = ${missingTerm}\\)</div>
<div></div>
<div>Verification with next term:</div>
<div>\\(${missingTerm} × ${r} = ${a * Math.pow(r, position)}\\) ✓</div>
    `.trim()
  };
}

function generateFactorialSimple() {
  const n = 4 + Math.floor(Math.random() * 6);
  const factorial = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
  
  const { options, correctIndex } = generateOptionsWithIndex(factorial);
  
  const templates = [
    `Calculate \\(${n}!\\)`,
    `What is \\(${n}\\) factorial?`,
    `Evaluate \\(${n}!\\)`,
    `Find the value of \\(${n}!\\)`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Definition:</strong> \\(n! = n × (n-1) × (n-2) × ... × 2 × 1\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(${n}! = ${Array.from({length: n}, (_, i) => n - i).join(' × ')}\\)</div>
${Array.from({length: n-1}, (_, i) => {
  const partial = Array.from({length: i+2}, (_, j) => n - j).reduce((a, b) => a * b, 1);
  const remaining = Array.from({length: n - i - 2}, (_, j) => n - i - j - 2);
  return `<div>\\(= ${partial} × ${remaining.join(' × ') || '1'}\\)</div>`;
}).join('')}
<div>\\(${n}! = ${factorial}\\)</div>
    `.trim()
  };
}

function generateFactorialExpression() {
  const n = 5 + Math.floor(Math.random() * 5);
  const k = 2 + Math.floor(Math.random() * 3);
  const numerator = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
  const denominator = Array.from({ length: k }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
  const result = numerator / denominator;
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `Simplify: \\(\\frac{${n}!}{${k}!}\\)`,
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Expand and cancel common factors</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(\\frac{${n}!}{${k}!} = \\frac{${Array.from({length: n}, (_, i) => n - i).join(' × ')} × ${k}!}{${k}!}\\)</div>
<div></div>
<div>Cancel \\(${k}!\\) from numerator and denominator:</div>
<div>\\(= ${Array.from({length: n-k}, (_, i) => n - i).join(' × ')}\\)</div>
${n-k > 2 ? Array.from({length: n-k-1}, (_, i) => {
  const partial = Array.from({length: i+2}, (_, j) => n - j).reduce((a, b) => a * b, 1);
  const remaining = Array.from({length: n - k - i - 2}, (_, j) => n - i - j - 2);
  return `<div>\\(= ${partial} × ${remaining.join(' × ') || '1'}\\)</div>`;
}).join('') : ''}
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateSquaresSum() {
  const n = 5 + Math.floor(Math.random() * 8);
  const sum = (n * (n + 1) * (2 * n + 1)) / 6;
  
  const { options, correctIndex } = generateOptionsWithIndex(sum);
  
  return {
    question: `Find the sum: \\(1^2 + 2^2 + 3^2 + ... + ${n}^2\\)`,
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}\\)</div>
<div></div>
<div><strong>Given:</strong> n = ${n}</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(\\sum_{i=1}^{${n}} i^2 = \\frac{${n}(${n}+1)(2×${n}+1)}{6}\\)</div>
<div>\\(= \\frac{${n} × ${n+1} × ${2*n+1}}{6}\\)</div>
<div>\\(= \\frac{${n * (n+1) * (2*n+1)}}{6}\\)</div>
<div>\\(= ${sum}\\)</div>
    `.trim()
  };
}

function generateCubesSum() {
  const n = 4 + Math.floor(Math.random() * 7);
  const sum = Math.pow((n * (n + 1)) / 2, 2);
  
  const { options, correctIndex } = generateOptionsWithIndex(sum);
  
  return {
    question: `Find the sum: \\(1^3 + 2^3 + 3^3 + ... + ${n}^3\\)`,
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(\\sum_{i=1}^{n} i^3 = [\\frac{n(n+1)}{2}]^2\\)</div>
<div></div>
<div><strong>Given:</strong> n = ${n}</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(\\sum_{i=1}^{${n}} i^3 = [\\frac{${n}(${n}+1)}{2}]^2\\)</div>
<div>\\(= [\\frac{${n} × ${n+1}}{2}]^2\\)</div>
<div>\\(= [\\frac{${n * (n+1)}}{2}]^2\\)</div>
<div>\\(= ${(n * (n+1)) / 2}^2\\)</div>
<div>\\(= ${sum}\\)</div>
    `.trim()
  };
}

function generateFibonacciTerm() {
  const n = 8 + Math.floor(Math.random() * 7);
  const fib = [1, 1];
  for (let i = 2; i < n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  const result = fib[n - 1];
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `Find the ${n}th term of the Fibonacci sequence: \\(1, 1, 2, 3, 5, 8, ...\\)`,
    options: options.map(opt => `\(${opt}\)`),
    correct: correctIndex,
    explanation: `
<div><strong>Rule:</strong> Each term is the sum of the two preceding terms</div>
<div>\\(F_n = F_{n-1} + F_{n-2}\\) with \\(F_1 = 1, F_2 = 1\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
${fib.slice(0, Math.min(8, n)).map((val, i) => `<div>\\(F_{${i+1}} = ${val}\\)</div>`).join('')}
${n > 8 ? '<div>...</div>' : ''}
<div>\\(F_{${n}} = ${result}\\)</div>
    `.trim()
  };
}

function generateOptionsWithIndex(correctValue) {
  const offsets = [-Math.floor(correctValue * 0.2), -Math.floor(correctValue * 0.1),
    Math.floor(correctValue * 0.1), Math.floor(correctValue * 0.2)
  ];
  const wrongValues = offsets.map(offset => {
    const wrongValue = correctValue + offset;
    return wrongValue > 0 && wrongValue !== correctValue ? wrongValue : null;
  }).filter(Boolean);
  
  const uniqueWrongValues = [...new Set(wrongValues)].slice(0, 3);
  
  let options = [correctValue, ...uniqueWrongValues];
  
  while (options.length < 4) {
    const additionalValue = correctValue + [5, -5, 10, -10][options.length - 1];
    if (additionalValue > 0 && !options.includes(additionalValue)) {
      options.push(additionalValue);
    }
  }
  
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctValue);
  
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