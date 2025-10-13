export function generatePermutationCombinationQuestions(count = 10, questionType = 'all') {
  let questionTypes;
  
  switch (questionType) {
    case 'permutations':
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 4));
      break;
    case 'combinations':
      questionTypes = Array.from({ length: count }, () => 4 + Math.floor(Math.random() * 4));
      break;
    case 'word-problems':
      questionTypes = Array.from({ length: count }, () => 8 + Math.floor(Math.random() * 4));
      break;
    default:
      questionTypes = Array.from({ length: count }, () => Math.floor(Math.random() * 12));
  }
  
  return questionTypes.map(type => {
    switch (type) {
      case 0:
        return generateSimplePermutation();
      case 1:
        return generatePermutationWithRepetition();
      case 2:
        return generateCircularPermutation();
      case 3:
        return generatePermutationRestrictions();
      case 4:
        return generateSimpleCombination();
      case 5:
        return generateCombinationWithRestrictions();
      case 6:
        return generateCombinationCommittee();
      case 7:
        return generateCombinationPaths();
      case 8:
        return generateWordArrangement();
      case 9:
        return generateCommitteeSelection();
      case 10:
        return generateDigitProblems();
      case 11:
        return generateSeatingArrangements();
      default:
        return generateSimplePermutation();
    }
  });
}

// PERMUTATION QUESTIONS

function generateSimplePermutation() {
  const n = 6 + Math.floor(Math.random() * 5); // 6 to 10
  const r = 3 + Math.floor(Math.random() * 3); // 3 to 5
  const result = factorial(n) / factorial(n - r);
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  const templates = [
    `Find \\(P(${n}, ${r})\\)`,
    `Calculate the number of permutations of ${n} objects taken ${r} at a time`,
    `How many ways can you arrange ${r} objects from ${n} distinct objects?`,
    `Evaluate: \\(\\frac{${n}!}{(${n}-${r})!}\\)`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(P(n, r) = \\frac{n!}{(n-r)!}\\)</div>
<div></div>
<div><strong>Given:</strong></div>
<div>\\(n = ${n}\\), \\(r = ${r}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(P(${n}, ${r}) = \\frac{${n}!}{(${n}-${r})!} = \\frac{${n}!}{${n-r}!}\\)</div>
<div>\\(= \\frac{${factorial(n)}}{${factorial(n-r)}}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generatePermutationWithRepetition() {
  const objects = ['A', 'B', 'C', 'D', 'E', 'F'];
  const selected = objects.slice(0, 4 + Math.floor(Math.random() * 2)); // 4 or 5 objects
  const word = selected.join('');
  const result = factorial(word.length);
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `How many distinct arrangements can be made using all the letters of the word "${word}"?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Rule:</strong> Number of permutations of n distinct objects = \\(n!\\)</div>
<div></div>
<div><strong>Given:</strong></div>
<div>Word: "${word}" (${word.length} distinct letters)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Number of arrangements = \\(${word.length}!\\)</div>
<div>\\(= ${factorial(word.length)}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateCircularPermutation() {
  const n = 5 + Math.floor(Math.random() * 4); // 5 to 8
  const result = factorial(n - 1);
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  const contexts = [
    `people sitting around a circular table`,
    `beads arranged in a necklace`,
    `chairs arranged in a circle`,
    `friends sitting in a circle`
  ];
  
  const context = contexts[Math.floor(Math.random() * contexts.length)];
  
  return {
    question: `In how many ways can ${n} ${context}?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> Circular permutations = \\((n-1)!\\)</div>
<div>(One position is fixed as reference point)</div>
<div></div>
<div><strong>Given:</strong> \\(n = ${n}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Number of circular arrangements = \\((${n}-1)!\\)</div>
<div>\\(= ${factorial(n-1)}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generatePermutationRestrictions() {
  const total = 7;
  const fixedPositions = 2;
  const result = factorial(fixedPositions) * factorial(total - fixedPositions);
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  const scenarios = [
    `A and B must sit together`,
    `X and Y must be at the ends`,
    `P and Q cannot be separated`
  ];
  
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  return {
    question: `In how many ways can ${total} people be arranged in a row if ${scenario}?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Treat the restricted items as a single unit</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Treat A and B as one unit: now we have 6 units to arrange</div>
<div>Ways to arrange 6 units = \\(6! = ${factorial(6)}\\)</div>
<div>Ways to arrange A and B within their unit = \\(2! = ${factorial(2)}\\)</div>
<div>Total arrangements = \\(6! × 2! = ${factorial(6)} × ${factorial(2)}\\)</div>
<div>\\(= ${factorial(6)} × ${factorial(2)} = ${result}\\)</div>
    `.trim()
  };
}

// COMBINATION QUESTIONS

function generateSimpleCombination() {
  const n = 8 + Math.floor(Math.random() * 5); // 8 to 12
  const r = 3 + Math.floor(Math.random() * 3); // 3 to 5
  const result = factorial(n) / (factorial(r) * factorial(n - r));
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  const templates = [
    `Find \\(C(${n}, ${r})\\) or \\(\\binom{${n}}{${r}}\\)`,
    `Calculate the number of combinations of ${n} objects taken ${r} at a time`,
    `How many ways to choose ${r} items from ${n} distinct items?`,
    `Evaluate: \\(\\frac{${n}!}{${r}!(${n}-${r})!}\\)`
  ];
  
  return {
    question: templates[Math.floor(Math.random() * templates.length)],
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> \\(C(n, r) = \\frac{n!}{r!(n-r)!}\\)</div>
<div></div>
<div><strong>Given:</strong></div>
<div>\\(n = ${n}\\), \\(r = ${r}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(C(${n}, ${r}) = \\frac{${n}!}{${r}! × (${n}-${r})!} = \\frac{${n}!}{${r}! × ${n-r}!}\\)</div>
<div>\\(= \\frac{${factorial(n)}}{${factorial(r)} × ${factorial(n-r)}}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateCombinationWithRestrictions() {
  const total = 10;
  const mustInclude = 2;
  const choose = 5;
  const result = factorial(total - mustInclude) / (factorial(choose - mustInclude) * factorial(total - choose));
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `From ${total} people, how many ways to choose a committee of ${choose} if ${mustInclude} specific people must be included?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Since ${mustInclude} specific people must be included, we only need to choose the remaining members</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>People already included: ${mustInclude}</div>
<div>Remaining people to choose from: \\(${total} - ${mustInclude} = ${total - mustInclude}\\)</div>
<div>Remaining spots to fill: \\(${choose} - ${mustInclude} = ${choose - mustInclude}\\)</div>
<div></div>
<div>Ways to choose remaining members = \\(C(${total - mustInclude}, ${choose - mustInclude})\\)</div>
<div>\\(= \\frac{${total - mustInclude}!}{${choose - mustInclude}! × (${total - mustInclude} - ${choose - mustInclude})!}\\)</div>
<div>\\(= \\frac{${factorial(total - mustInclude)}}{${factorial(choose - mustInclude)} × ${factorial(total - choose)}}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateCombinationCommittee() {
  const men = 6;
  const women = 5;
  const committeeSize = 4;
  const menRequired = 2;
  const womenRequired = 2;
  const result = (factorial(men) / (factorial(menRequired) * factorial(men - menRequired))) *
                 (factorial(women) / (factorial(womenRequired) * factorial(women - womenRequired)));
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `From ${men} men and ${women} women, how many ways to form a committee of ${committeeSize} with exactly ${menRequired} men and ${womenRequired} women?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Multiply the combinations for men and women</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Ways to choose ${menRequired} men from ${men}: \\(C(${men}, ${menRequired})\\)</div>
<div>Ways to choose ${womenRequired} women from ${women}: \\(C(${women}, ${womenRequired})\\)</div>
<div></div>
<div>Total ways = \\(C(${men}, ${menRequired}) × C(${women}, ${womenRequired})\\)</div>
<div>\\(= \\frac{${men}!}{${menRequired}! × ${men - menRequired}!} × \\frac{${women}!}{${womenRequired}! × ${women - womenRequired}!}\\)</div>
<div>\\(= ${factorial(men) / (factorial(menRequired) * factorial(men - menRequired))} × ${factorial(women) / (factorial(womenRequired) * factorial(women - womenRequired))}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateCombinationPaths() {
  const rows = 4;
  const columns = 5;
  // Number of paths = C(rows+columns-2, rows-1) or C(rows+columns-2, columns-1)
  const result = factorial(rows + columns - 2) / (factorial(rows - 1) * factorial(columns - 1));
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `How many shortest paths are there from the top-left corner to the bottom-right corner of a ${rows}×${columns} grid, moving only right and down?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> We need to make ${rows - 1} down moves and ${columns - 1} right moves</div>
<div>Total moves = \\(${rows - 1} + ${columns - 1} = ${rows + columns - 2}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Number of paths = ways to arrange D and R moves</div>
<div>\\(= C(${rows + columns - 2}, ${rows - 1})\\)</div>
<div>\\(= \\frac{${rows + columns - 2}!}{${rows - 1}! × (${rows + columns - 2} - ${rows - 1})!}\\)</div>
<div>\\(= \\frac{${factorial(rows + columns - 2)}}{${factorial(rows - 1)} × ${factorial(columns - 1)}}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

// WORD PROBLEMS

function generateWordArrangement() {
  const words = ['MATHEMATICS', 'ARRANGEMENT', 'COMBINATION', 'PERMUTATION'];
  const word = words[Math.floor(Math.random() * words.length)];
  
  const letters = word.split('');
  const frequency = {};
  letters.forEach(letter => {
    frequency[letter] = (frequency[letter] || 0) + 1;
  });
  
  let denominator = 1;
  Object.values(frequency).forEach(count => {
    if (count > 1) denominator *= factorial(count);
  });
  
  const result = factorial(word.length) / denominator;
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `How many distinct arrangements can be made using all letters of the word "${word}"?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> Permutations with repetition = \\(\\frac{n!}{n_1! × n_2! × ... × n_k!}\\)</div>
<div>Where n is total letters, and n₁, n₂, ... are frequencies of repeated letters</div>
<div></div>
<div><strong>Given:</strong> "${word}"</div>
<div>Letter frequencies: ${Object.entries(frequency).map(([letter, count]) => `${letter}: ${count}`).join(', ')}</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Total arrangements = \\(\\frac{${word.length}!}{${Object.values(frequency).filter(count => count > 1).map(count => `${count}!`).join(' × ')}}\\)</div>
<div>\\(= \\frac{${factorial(word.length)}}{${Object.values(frequency).filter(count => count > 1).map(count => factorial(count)).join(' × ')}}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateCommitteeSelection() {
  const people = 12;
  const committeeSizes = [3, 4, 5];
  const committeeSize = committeeSizes[Math.floor(Math.random() * committeeSizes.length)];
  const result = factorial(people) / (factorial(committeeSize) * factorial(people - committeeSize));
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `In how many ways can a committee of ${committeeSize} be selected from ${people} people?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> Combinations = \\(C(n, r) = \\frac{n!}{r!(n-r)!}\\)</div>
<div></div>
<div><strong>Given:</strong></div>
<div>\\(n = ${people}\\), \\(r = ${committeeSize}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>\\(C(${people}, ${committeeSize}) = \\frac{${people}!}{${committeeSize}! × (${people}-${committeeSize})!}\\)</div>
<div>\\(= \\frac{${people}!}{${committeeSize}! × ${people - committeeSize}!}\\)</div>
<div>\\(= \\frac{${factorial(people)}}{${factorial(committeeSize)} × ${factorial(people - committeeSize)}}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateDigitProblems() {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const length = 4;
  const evenRequired = true;
  
  // For 4-digit even numbers with distinct digits
  const lastDigitOptions = [2, 4, 6, 8]; // even digits
  const result = lastDigitOptions.length * 8 * 7 * 6; // 8 choices for first digit (exclude 0 and last digit), then 7, then 6
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  return {
    question: `How many ${length}-digit even numbers can be formed using digits 1-9 without repetition?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Method:</strong> Work from the last digit (units place) first</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Last digit (must be even): ${lastDigitOptions.length} choices (${lastDigitOptions.join(', ')})</div>
<div>First digit: 8 choices (cannot be 0 or the last digit used)</div>
<div>Second digit: 7 choices (cannot be the two digits used)</div>
<div>Third digit: 6 choices (cannot be the three digits used)</div>
<div></div>
<div>Total numbers = \\(${lastDigitOptions.length} × 8 × 7 × 6\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

function generateSeatingArrangements() {
  const people = 6;
  const result = factorial(people);
  
  const { options, correctIndex } = generateOptionsWithIndex(result);
  
  const scenarios = [
    'in a row',
    'on a bench',
    'in a line'
  ];
  
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  return {
    question: `In how many ways can ${people} people be arranged ${scenario}?`,
    options,
    correct: correctIndex,
    explanation: `
<div><strong>Formula:</strong> Linear permutations = \\(n!\\)</div>
<div></div>
<div><strong>Given:</strong> \\(n = ${people}\\)</div>
<div></div>
<div><strong>Solution:</strong></div>
<div>Number of arrangements = \\(${people}!\\)</div>
<div>\\(= ${factorial(people)}\\)</div>
<div>\\(= ${result}\\)</div>
    `.trim()
  };
}

// HELPER FUNCTIONS

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function generateOptionsWithIndex(correctValue) {
  const offsets = [
    -Math.floor(correctValue * 0.1),
    -Math.floor(correctValue * 0.05),
    Math.floor(correctValue * 0.05),
    Math.floor(correctValue * 0.1)
  ];
  
  const wrongValues = offsets.map(offset => {
    const wrongValue = correctValue + offset;
    return wrongValue > 0 && wrongValue !== correctValue ? wrongValue : null;
  }).filter(Boolean);
  
  const uniqueWrongValues = [...new Set(wrongValues)].slice(0, 3);
  
  let options = [correctValue, ...uniqueWrongValues];
  
  while (options.length < 4) {
    const additionalValue = correctValue + [2, -2, 5, -5][options.length - 1];
    if (additionalValue > 0 && !options.includes(additionalValue)) {
      options.push(additionalValue);
    }
  }
  
  const shuffledOptions = shuffleArray(options);
  const correctIndex = shuffledOptions.indexOf(correctValue);
  
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