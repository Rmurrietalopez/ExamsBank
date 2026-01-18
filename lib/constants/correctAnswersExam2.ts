// lib/constants/correctAnswersExam2.ts

// Shape: exerciseId -> questionId / blankId -> correct optionId
// Option IDs must match what you used in the UI
// (MC: 'A' | 'B' | 'C' | 'D', blanks: 'a' | 'b' | 'c' | 'd')

export type Exam2CorrectAnswers = {
  [exerciseId: string]: {
    [questionOrBlankId: string]: string;
  };
};

export const correctAnswersExam2: Exam2CorrectAnswers = {
  // -------------------------------
  // EXERCISE 1 – Reading Correspondence (Q1–11)
  // MC: Q1–Q6 (A–D)
  // Blanks: BLANK7–BLANK11 (a–d)
  // -------------------------------
  ex1: {
    // Q1–6
    Q1: 'A', // his passion for exploring the world
    Q2: 'B', // have recently met
    Q3: 'D', // establish his own holiday company
    Q4: 'B', // successfully passed their class XII board examinations
    Q5: 'D', // both a and c
    Q6: 'B', // savoring fine cuisine

    // Q7–11 (email completion)
    BLANK7: 'c', // travel and tourism course
    BLANK8: 'a', // meet Nelson frequently
    BLANK9: 'd', // goodies
    BLANK10: 'b', // voracious reader
    BLANK11: 'c', // career
  },

  // -------------------------------
  // EXERCISE 2 – Reading to Apply a Diagram (Q1–8)
  // Blanks: BLANK1–BLANK5 (a–d)
  // MC: Q6–Q8 (A–D)
  // -------------------------------
  ex2: {
    // Q1–5 (email blanks)
    BLANK1: 'c', // painting and sculpting with clay
    BLANK2: 'd', // two-dimensional designs
    BLANK3: 'b', // shaping and detailing figures
    BLANK4: 'd', // lunch
    BLANK5: 'c', // both a and b

    // Q6–8 (MC under the diagram)
    Q6: 'C', // friends
    Q7: 'D', // distinct
    Q8: 'C', // polished and baked
  },

  // -------------------------------
  // EXERCISE 3 – Reading for Information (warthogs)
  // Q1–Q9, options A–E
  // -------------------------------
  ex3: {
    Q1: 'C',
    Q2: 'A',
    Q3: 'E',
    Q4: 'B',
    Q5: 'A',
    Q6: 'C',
    Q7: 'D',
    Q8: 'E',
    Q9: 'B',
  },

  // -------------------------------
  // EXERCISE 4 – Reading for Viewpoints (driving in Canada)
  // MC: Q1–Q5 (A–D)
  // Blanks: BLANK6–BLANK10 (a–d)
  // -------------------------------
  ex4: {
    // Q1–5
    Q1: 'C', // Montreal
    Q2: 'C', // fluent in two languages
    Q3: 'B', // courtesy on the road
    Q4: 'C', // limited availability of services
    Q5: 'B', // following distance

    // Q6–10 completion passage
    BLANK6: 'c', // remarkable adventure
    BLANK7: 'a', // geography
    BLANK8: 'b', // meticulously
    BLANK9: 'c', // winter tires
    BLANK10: 'b', // politeness
  },
};
