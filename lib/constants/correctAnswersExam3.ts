// lib/constants/correctAnswersExam3.ts

// Answer key for Reading Exam 3
// ex1: Reading Correspondence
// ex2: Reading to Apply a Diagram
// ex3: Reading for Information
// ex4: Reading for Viewpoints

export const correctAnswersExam3 = {
  ex1: {
    // Multiple choice (Q1–Q6)
    // Options: 'A' | 'B' | 'C' | 'D'
    Q1: 'C', // express his apologies
    Q2: 'A', // to experience more in life
    Q3: 'B', // have not gotten married yet
    Q4: 'B', // teaching in front of people
    Q5: 'C', // have known each other for a long time (3rd option in the UI)
    Q6: 'C', // after he arrived in Beijing

    // Blanks in Ralph's reply (7–11)
    // Stored as 'a' | 'b' | 'c' | 'd'
    BLANK7: 'c',  // missing out on my wedding
    BLANK8: 'a',  // a college reunion
    BLANK9: 'd',  // you’re relocating to another country
    BLANK10: 'b', // makes a friendly teacher
    BLANK11: 'c', // be on the look out for something
  },

  ex2: {
    // Blanks in Dorothy's message (1–5)
    BLANK1: 'd', // pain medication
    BLANK2: 'b', // with other
    BLANK3: 'b', // take these concerns
    BLANK4: 'c', // dosage
    BLANK5: 'a', // throughout the day

    // Multiple choice (Q6–Q8)
    Q6: 'D', // is not fully aware of her medication
    Q7: 'D', // cannot be taken with children's medication
    Q8: 'C', // offers her expert advice willingly
  },

  ex3: {
    // Paragraph selection (A–D or E = Not given)
    Q1: 'C',
    Q2: 'D',
    Q3: 'B',
    Q4: 'A',
    Q5: 'C',
    Q6: 'B',
    Q7: 'E',
    Q8: 'D',
    Q9: 'A',
  },

  ex4: {
    // Multiple choice about viewpoints (Q1–Q5)
    Q1: 'D', // article questions health claims
    Q2: 'A', // less effective than synthetic pesticides
    Q3: 'B', // natural ingredients can be harmful, just like synthetic ones
    Q4: 'D', // to make more money by reducing chemicals/fertilizers
    Q5: 'A', // they are completely biodegradable

    // Blanks in the reflection text (6–10)
    BLANK6: 'a',  // misconceptions
    BLANK7: 'b',  // composition
    BLANK8: 'd',  // potentially
    BLANK9: 'c',  // emphasis
    BLANK10: 'c', // critical
  },
} as const;
