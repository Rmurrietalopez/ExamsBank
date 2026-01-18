// lib/constants/correctAnswers.ts

// A = 0, B = 1, C = 2, D = 3, E = 4
// Each array represents the correct option index for that test.

export const correctAnswers = {
  // 📘 Reading Test 1
  // Q1–Q11
  readingTest1: [3, 3, 3, 2, 0, 0, 3, 1, 1, 2, 1],

  // 📗 Reading Test 2
  // Q1–Q8
  readingTest2: [1, 1, 0, 2, 3, 1, 2, 2],

  // 📙 Reading Test 3
  // Q1–Q9 (includes an "E" for Q5 → index 4)
  readingTest3: [1, 2, 2, 2, 4, 3, 0, 1, 3],

  // 📕 Reading Test 4
  // Q1–Q10
  readingTest4: [1, 2, 1, 2, 3, 0, 3, 2, 1, 2],
} as const;
