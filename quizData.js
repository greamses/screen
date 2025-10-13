import { generateBinaryQuestions } from './binary.js';
import { generateRomanNumeralQuestions } from './roman.js';
import { generateSeriesQuestions } from './sequences.js';
import { generatePermutationCombinationQuestions } from './permutation.js';
import { generateAlgebraicExpressionQuestions } from './algebra-one.js';
import { generateIndicesQuestions } from './algebra-two.js';
import { generateAdvancedIndicesQuestions } from './algebra-three.js';

export const quizTopics = {
  'binary-conversion': {
    title: 'Binary Conversion',
    description: 'Convert between binary and decimal numbers',
    generator: (count) => generateBinaryQuestions(count, 'conversion')
  },
  'binary-arithmetic': {
    title: 'Binary Arithmetic',
    description: 'Perform arithmetic operations with binary numbers',
    generator: (count) => generateBinaryQuestions(count, 'arithmetic')
  },
  'roman-conversion': {
    title: 'Roman Numeral Conversion',
    description: 'Convert between Roman numerals and decimal numbers',
    generator: (count) => generateRomanNumeralQuestions(count, 'conversion')
  },
  'roman-arithmetic': {
    title: 'Roman Numeral Arithmetic',
    description: 'Perform addition and subtraction with Roman numerals',
    generator: (count) => generateRomanNumeralQuestions(count, 'arithmetic')
  },
  'roman-comparison': {
    title: 'Roman Numeral Comparison',
    description: 'Compare and order Roman numerals',
    generator: (count) => generateRomanNumeralQuestions(count, 'comparison')
  },
  'roman-all': {
    title: 'All Roman Numeral Topics',
    description: 'Mixed questions on Roman numerals',
    generator: (count) => generateRomanNumeralQuestions(count, 'all')
  },
  'arithmetic-sequences': {
    title: 'Arithmetic Sequences',
    description: 'Find terms and sums of arithmetic sequences',
    generator: (count) => generateSeriesQuestions(count, 'arithmetic')
  },
  'geometric-sequences': {
    title: 'Geometric Sequences',
    description: 'Find terms and sums of geometric sequences',
    generator: (count) => generateSeriesQuestions(count, 'geometric')
  },
  'factorial-sequences': {
    title: 'Factorial Sequences',
    description: 'Work with factorial expressions and patterns',
    generator: (count) => generateSeriesQuestions(count, 'factorial')
  },
  'special-sequences': {
    title: 'Special Sequences',
    description: 'Fibonacci, squares, cubes and other special sequences',
    generator: (count) => generateSeriesQuestions(count, 'special')
  },
  'all-sequences': {
    title: 'All Sequence Types',
    description: 'Mixed questions on all sequence types',
    generator: (count) => generateSeriesQuestions(count, 'all')
  },
  // PERMUTATION & COMBINATION TOPICS
  'basic-permutations': {
    title: 'Basic Permutations',
    description: 'Calculate simple permutations and arrangements',
    generator: (count) => generatePermutationCombinationQuestions(count, 'permutations')
  },
  'combinations': {
    title: 'Combinations',
    description: 'Calculate combinations and selections',
    generator: (count) => generatePermutationCombinationQuestions(count, 'combinations')
  },
  'perm-comb-word-problems': {
    title: 'Permutation & Combination Word Problems',
    description: 'Solve real-world problems using permutations and combinations',
    generator: (count) => generatePermutationCombinationQuestions(count, 'word-problems')
  },
  'all-permutations-combinations': {
    title: 'All Permutations & Combinations',
    description: 'Mixed questions on permutations and combinations',
    generator: (count) => generatePermutationCombinationQuestions(count, 'all')
  },
  // ALGEBRAIC EXPRESSION TOPICS
  'like-terms': {
    title: 'Like Terms',
    description: 'Identify and combine like terms in algebraic expressions',
    generator: (count) => generateAlgebraicExpressionQuestions(count, 'like-terms')
  },
  'unlike-terms': {
    title: 'Unlike Terms',
    description: 'Identify unlike terms and understand when terms cannot be combined',
    generator: (count) => generateAlgebraicExpressionQuestions(count, 'unlike-terms')
  },
  'substitution': {
    title: 'Substitution',
    description: 'Evaluate algebraic expressions by substituting values for variables',
    generator: (count) => generateAlgebraicExpressionQuestions(count, 'substitution')
  },
  'simplification': {
    title: 'Simplification',
    description: 'Simplify complex algebraic expressions by combining like terms',
    generator: (count) => generateAlgebraicExpressionQuestions(count, 'simplification')
  },
  'all-algebraic': {
    title: 'All Algebraic Expressions',
    description: 'Mixed questions on all algebraic expression topics',
    generator: (count) => generateAlgebraicExpressionQuestions(count, 'all')
  },
  // BASIC LAWS OF INDICES TOPICS
  'indices-multiplication': {
    title: 'Multiplication Law',
    description: 'Apply the multiplication law: aᵐ × aⁿ = aᵐ⁺ⁿ',
    generator: (count) => generateIndicesQuestions(count, 'multiplication')
  },
  'indices-division': {
    title: 'Division Law',
    description: 'Apply the division law: aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
    generator: (count) => generateIndicesQuestions(count, 'division')
  },
  'indices-power-of-power': {
    title: 'Power of a Power',
    description: 'Apply the power of a power law: (aᵐ)ⁿ = aᵐˣⁿ',
    generator: (count) => generateIndicesQuestions(count, 'power-of-power')
  },
  'indices-power-of-one': {
    title: 'Power of One',
    description: 'Understand that any number to the power of 1 equals itself: a¹ = a',
    generator: (count) => generateIndicesQuestions(count, 'power-of-one')
  },
  'all-indices': {
    title: 'All Basic Laws of Indices',
    description: 'Mixed questions on the first 4 laws of indices',
    generator: (count) => generateIndicesQuestions(count, 'all')
  },
  // ADVANCED LAWS OF INDICES TOPICS
  'indices-zero-power': {
    title: 'Zero Power Law',
    description: 'Apply the zero power law: a⁰ = 1 (where a ≠ 0)',
    generator: (count) => generateAdvancedIndicesQuestions(count, 'zero-power')
  },
  'indices-negative-power': {
    title: 'Negative Power Law',
    description: 'Apply the negative power law: a⁻ⁿ = 1/aⁿ',
    generator: (count) => generateAdvancedIndicesQuestions(count, 'negative-power')
  },
  'indices-fractional-power': {
    title: 'Fractional Power Law',
    description: 'Apply fractional powers: a^(1/n) = √[n](a) and a^(m/n) = (√[n](a))ᵐ',
    generator: (count) => generateAdvancedIndicesQuestions(count, 'fractional-power')
  },
  'indices-combined-laws': {
    title: 'Combined Laws',
    description: 'Apply multiple laws of indices in complex expressions',
    generator: (count) => generateAdvancedIndicesQuestions(count, 'combined-laws')
  },
  'all-advanced-indices': {
    title: 'All Advanced Laws of Indices',
    description: 'Mixed questions on all advanced laws of indices',
    generator: (count) => generateAdvancedIndicesQuestions(count, 'all')
  },
  'all-indices-complete': {
    title: 'Complete Laws of Indices',
    description: 'Mixed questions on all basic and advanced laws of indices',
    generator: (count) => [
      ...generateIndicesQuestions(Math.ceil(count / 2), 'all'),
      ...generateAdvancedIndicesQuestions(Math.floor(count / 2), 'all')
    ]
  }
};

export const quizCategories = {
  'number-systems': {
    name: 'Number Systems',
    topics: ['binary-conversion', 'binary-arithmetic', 'roman-conversion', 'roman-arithmetic', 'roman-comparison', 'roman-all']
  },
  'sequences-series': {
    name: 'Sequences & Series',
    topics: ['arithmetic-sequences', 'geometric-sequences', 'factorial-sequences', 'special-sequences', 'all-sequences']
  },
  'combinatorics': {
    name: 'Combinatorics',
    topics: ['basic-permutations', 'combinations', 'perm-comb-word-problems', 'all-permutations-combinations']
  },
  'algebra': {
    name: 'Algebra',
    topics: [
      'like-terms',
      'unlike-terms',
      'substitution',
      'simplification',
      'all-algebraic'
    ]
  },
  'laws-of-indices': {
    name: 'Laws of Indices',
    topics: [
      'indices-multiplication',
      'indices-division',
      'indices-power-of-power',
      'indices-power-of-one',
      'all-indices',
      'indices-zero-power',
      'indices-negative-power',
      'indices-fractional-power',
      'indices-combined-laws',
      'all-advanced-indices',
      'all-indices-complete'
    ]
  }
};

export function getAllQuizTopics() {
  return Object.keys(quizTopics);
}

export function getTopicsByCategory(category) {
  return quizCategories[category]?.topics || [];
}

export function getCategoryForTopic(topic) {
  for (const [category, data] of Object.entries(quizCategories)) {
    if (data.topics.includes(topic)) {
      return data.name;
    }
  }
  return 'Other';
}

// Helper function to get topic info
export function getTopicInfo(topic) {
  return quizTopics[topic] || null;
}

export function getAllCategories() {
  return Object.keys(quizCategories);
}

export function getCategoryInfo(category) {
  return quizCategories[category] || null;
}