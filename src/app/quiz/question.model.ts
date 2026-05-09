export class Questions {
  responseCode: number;
  public results: [
    {
      category: string;
      correct_answer: string;
      difficulty: string;
      incorrect_answers: [string, string, string];
      question: string;
      type: string;
    },
  ];

  constructor(
    results: [
      {
        category: string;
        correct_answer: string;
        difficulty: string;
        incorrect_answers: [string, string, string];
        question: string;
        type: string;
      },
    ],
  ) {
    this.results = results;
  }
}
