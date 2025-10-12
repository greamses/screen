import { generateBinaryQuestions } from './binary.js';

export const quizData = {
  'math-quiz': {
    title: 'Dynamic Binary Quiz',
    description: 'Test your binary conversion and arithmetic skills with randomly generated problems',
    timeLimit: 1800,
    questions: generateBinaryQuestions(50)
  },
};