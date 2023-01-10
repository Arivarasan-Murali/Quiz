import { Injectable } from "@angular/core";


@Injectable({providedIn: "root"})
export class StorageService {
    topic: string | null = null;
    dificulty: string | null = null;
    result: string | null = null;
    noMoreEdit: boolean = false;
    correctAnswers: number = 0;
    numberOfQuestions: number = 10;

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