import { Injectable } from "@angular/core";


@Injectable({providedIn: "root"})
export class StorageService {
    topic: string | null = null;
    dificulty: string | null = null;
    result: string | null = null;           // Store PASS or FAIL
    noMoreEdit: boolean = false;            // To prevent editing after the results are displayed
    correctAnswers: number = 0;             // To display the number of questions answered correctly
    numberOfQuestions: number = 10;         // To control how many number of questions to be fetched from API

    quizData: [{
        question: string;
        options: [
            string,
            string,
            string,
            string
        ];
        choosed: number;
        correctAnswer: string;
    }] = [{
    question: '',
    options: ['', '', '', ''],
    choosed: 5,
    correctAnswer: ''
  }]
}