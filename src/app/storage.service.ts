import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  topic: string | null = null;
  difficulty: string | null = null;
  result: string | null = null; // Store PASS or FAIL
  noMoreEdit: boolean = false; // To prevent editing after the results are displayed
  correctAnswers: number = 0; // To display the number of questions answered correctly
  numberOfQuestions: number = 10; // To control how many number of questions to be fetched from API

  quizData: [
    {
      question: string;
      options: [string, string, string, string];
      chosen: number;
      correctAnswer: string;
    },
  ] = [
    {
      question: '',
      options: ['', '', '', ''],
      chosen: 5,
      correctAnswer: '',
    },
  ];
}
