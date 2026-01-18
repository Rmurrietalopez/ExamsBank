export type SpeakingTask = {
  id: string; // "T1"...
  title: string;
  instructions: string;
  prompt: string;
  prepSeconds: number;
  responseSeconds: number;
  imageSrc?: string; // from /public (use "/imageSpeaking1a.png" etc)
  tips?: string[];
};

export const SPEAKING_EXAM_1: SpeakingTask[] = [
  {
    id: 'T1',
    title: 'Giving Advice (Dar consejos)',
    instructions:
      'You will be asked to give advice to a friend in a specific situation. Provide clear suggestions and reasons for your advice.',
    prompt:
      'A friend wants to improve their English speaking skills. Suggest some effective methods they can use to practice.\n\nHelpful structure:\n- Hi Nati! I know you...\n- Let me give you a piece of advice on...\n- First / Second / Third / Finally\n- Topic → Why → For example',
    prepSeconds: 30,
    responseSeconds: 90,
  },
  {
    id: 'T2',
    title: 'Talking about a Personal Experience (Experiencia personal)',
    instructions:
      'You will be asked to talk about a personal experience. Give details about what happened, how you felt, and why it was important.',
    prompt:
      'Describe a fun day you spent with a close friend. What did you do, where did you go, and what made that day special?\n\nStarters:\n- Well, if I have to talk about a time when...\n- I remember when I had...',
    prepSeconds: 30,
    responseSeconds: 90,
  },
  {
    id: 'T3',
    title: 'Describing a Scene (Describir una escena)',
    instructions:
      'You will see a picture. Describe as many details as you can. Talk about the people, objects, and actions you notice. Try to give a clear and complete description.',
    prompt: 'Describe the picture with as many details as possible.',
    prepSeconds: 30,
    responseSeconds: 90,
    // ✅ Put the image in /public and reference like this:
    // If your file is: public/imageSpeaking1a.png -> use "/imageSpeaking1a.png"
    imageSrc: '/imageSpeaking1a.png',
  },
  {
    id: 'T4',
    title: 'Making Predictions (Hacer predicciones)',
    instructions:
      'You will see a picture. Based on what you see, make predictions about what might happen next. Use your imagination but keep your ideas realistic. Explain why you think these things will happen.',
    prompt: 'Look at the picture and predict what will probably happen next.',
    prepSeconds: 30,
    responseSeconds: 60,
    imageSrc: '/imageSpeaking1a.png',
  },
  {
    id: 'T5',
    title: 'Comparing and Persuading (Comparar y persuadir)',
    instructions:
      'You will be shown two options. Compare them, choose one, and persuade the other person that your choice is better.',
    prompt:
      'You and your friend are planning a weekend trip. You have two options. Choose ONE option and persuade your friend that it is the better choice.',
    prepSeconds: 60,
    responseSeconds: 60,
    imageSrc: '/imageSpeaking1b.png',
  },
  {
    id: 'T6',
    title: 'Dealing with a Difficult Situation (Situación difícil)',
    instructions:
      'You will be presented with a situation. Choose one of the two options provided. Explain your choice clearly and give reasons for it.',
    prompt:
      'You are invited to a work party, but you know that some people you don’t get along with will be there.\n\nChoose ONE:\n• Talk to your colleague and decide to attend the party and try to have a good time.\n• Talk to your boss and decline the invitation and stay home.',
    prepSeconds: 60,
    responseSeconds: 60,
  },
  {
    id: 'T7',
    title: 'Expressing Opinions (Expresar opiniones)',
    instructions:
      'You will be asked to express an opinion and support it with reasons and examples.',
    prompt:
      'Should parents limit the amount of screen time their children have? Explain your reasons.\n\nTip: Paraphrase the question, then give Topic → Why → Example. You can mention research/data (invented) as an example.',
    prepSeconds: 30,
    responseSeconds: 90,
  },
  {
    id: 'T8',
    title: 'Describing an Unusual Situation (Situación inusual)',
    instructions:
      'You are at an art store and see a painting you think your friend will like. Call your friend, describe the painting, and ask if they want you to buy it.',
    prompt:
      'Describe the painting to your friend and ask if they want you to buy it for them.',
    prepSeconds: 30,
    responseSeconds: 60,
    imageSrc: '/imageSpeaking1c.png',
  },
];

// Ready for later
export const SPEAKING_EXAM_2: SpeakingTask[] = [];
export const SPEAKING_EXAM_3: SpeakingTask[] = [];
export const SPEAKING_EXAM_4: SpeakingTask[] = [];
