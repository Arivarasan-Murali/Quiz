import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { StorageService } from '../storage.service';

import { Questions } from './question.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  standalone: false,
})
export class QuizComponent implements OnInit {
  numOfQuestions: number = 0;
  questionNo: number = 0;
  chosenId: number = 5;
  loading: boolean = false;
  noMoreEdit: boolean = false;
  enableSubmit: boolean = false;
  unansweredQuestionNumbers: number[] = [15];

  setOfQA: {
    question: string;
    options: [string, string, string, string];
    chosen: number;
    correctAnswer: string;
  }[];

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.numOfQuestions = this.storageService.numberOfQuestions;
    this.setOfQA = [];
    if (localStorage.getItem('category') != null) {
      this.storageService.topic = localStorage.getItem('category');
      this.storageService.difficulty = localStorage.getItem('level');
    }
    if (
      this.storageService.topic &&
      this.storageService.difficulty &&
      !this.storageService.noMoreEdit
    ) {
      this.onLoad();
    }
    if (this.storageService.noMoreEdit) {
      this.setOfQA = [...this.storageService.quizData];
      this.chosenId = this.setOfQA[this.questionNo].chosen;
      this.noMoreEdit = true;
      for (let i = 0; i < this.setOfQA.length; i++) {
        if (
          this.setOfQA[i].options[this.setOfQA[i].chosen] ===
          this.setOfQA[i].correctAnswer
        ) {
        }
      }
    }
  }

  decodeHtml(html: string) {
    let parser = new DOMParser().parseFromString(html, 'text/html');
    let output = parser.documentElement.textContent;
    return output;
  }

  onLoad() {
    this.storageService.quizData = [];
    this.loading = true;

    // Trivia API :- https://opentdb.com/api_config.php
    this.http
      .get<Questions>(
        'https://opentdb.com/api.php?amount=' +
          this.numOfQuestions +
          '&type=multiple&difficulty=' +
          this.storageService.difficulty +
          '&category=' +
          this.storageService.topic,
      )
      .pipe(
        map((responseData) => {
          const results = [];
          results.push(...responseData.results);
          return results;
        }),
      )
      .subscribe((results) => {
        for (let i = 0; i < this.numOfQuestions; i++) {
          // sort the results retrived from API into local Array in random order
          let retrivedAnswers = [];
          retrivedAnswers.push(
            <string>this.decodeHtml(results[i].correct_answer),
            <string>this.decodeHtml(results[i].incorrect_answers[0]),
            <string>this.decodeHtml(results[i].incorrect_answers[1]),
            <string>this.decodeHtml(results[i].incorrect_answers[2]),
          );
          let randomAnswer = retrivedAnswers.sort((a, b) => {
            return 0.5 - Math.random();
          });

          this.storageService.quizData.push({
            question: <string>this.decodeHtml(results[i].question),
            options: [
              randomAnswer[0],
              randomAnswer[1],
              randomAnswer[2],
              randomAnswer[3],
            ],
            chosen: 5,
            correctAnswer: <string>this.decodeHtml(results[i].correct_answer),
          });
        }
        this.setOfQA = [...this.storageService.quizData];
        this.loading = false;
      });
  }

  onNext(text: string) {
    if (text == 'Next') {
      if (this.questionNo < this.setOfQA.length - 1) {
        this.questionNo += 1;
        this.chosenId = this.setOfQA[this.questionNo].chosen;
      }
      this.updateAnswered();
    } else {
      this.onSubmit();
    }
    this.checkSubmitReady();
  }

  onPrevious() {
    if (this.questionNo != 0) {
      this.questionNo -= 1;
      this.chosenId = this.setOfQA[this.questionNo].chosen;
    }
    this.updateAnswered();
    this.checkSubmitReady();
  }

  goToQuestion(n: number) {
    this.questionNo = n;
    this.chosenId = this.setOfQA[this.questionNo].chosen;
    this.checkSubmitReady();
  }

  optionChosen(i: number) {
    if (!this.storageService.noMoreEdit) {
      this.chosenId = i;
      this.setOfQA[this.questionNo].chosen = i;
      this.storageService.quizData[this.questionNo].chosen = i;
    } else {
      alert('Answer cannot be modified after viewing the results');
    }
    this.checkSubmitReady();
  }

  onSubmit() {
    if (this.unansweredQuestionNumbers[0] === 15) {
      this.unansweredQuestionNumbers.splice(0, 1);
    }
    let unanswered: boolean = false;
    for (let i = 0; i < this.setOfQA.length; i++) {
      if (this.setOfQA[i].chosen == 5) {
        unanswered = true;
        this.unansweredQuestionNumbers.push(i);
      } else {
        let filteredArray = this.unansweredQuestionNumbers.filter(
          (value) => value !== i,
        );
        this.unansweredQuestionNumbers = filteredArray;
      }
    }
    this.updateAnswered();
    for (let i = 0; i < this.unansweredQuestionNumbers.length; i++) {}
    if (unanswered) {
      alert('Not All questions are answered.');
    } else {
      this.validation();
    }
  }

  updateAnswered() {
    let elements = document.getElementsByClassName('pageNumber');
    for (let i = 0; i < this.setOfQA.length; i++) {
      elements[i].classList.remove('unanswered');
    }
    for (let j = 0; j < this.unansweredQuestionNumbers.length; j++) {
      elements[this.unansweredQuestionNumbers[j]].classList.add('unanswered');
    }
  }

  // Enable submit button to work only if all the questions are answered. Checked each time for all kind of events
  checkSubmitReady() {
    this.enableSubmit = true;
    for (let i = 0; i < this.storageService.quizData.length; i++) {
      if (this.storageService.quizData[i].chosen == 5) {
        this.enableSubmit = false;
      }
    }
  }

  validation() {
    this.storageService.correctAnswers = 0;
    for (let i = 0; i < this.setOfQA.length; i++) {
      if (
        this.setOfQA[i].options[this.setOfQA[i].chosen] ==
        this.storageService.quizData[i].correctAnswer
      ) {
        console.log('correct Answer');
        this.storageService.correctAnswers++;
      }
    }
    this.storageService.result =
      this.storageService.correctAnswers >= this.setOfQA.length * 0.5
        ? 'Pass'
        : 'Fail';
    this.storageService.noMoreEdit = true;
    this.router.navigate(['/result']);
  }
}
