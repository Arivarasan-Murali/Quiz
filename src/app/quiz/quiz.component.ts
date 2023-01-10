import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { StorageService } from "../storage.service";

import { Questions } from './question.model'


@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"],
})
export class QuizComponent implements OnInit {

  numOfQuestions: number = 0;
  questionNo: number = 0;
  choosedId: number = 5;
  loading: boolean = false;
  noMoreEdit: boolean = false;
  enableSubmit: boolean = false;

  setOfQA: [{
    question: string;
    options: [string, string, string, string];
    choosed: number;
    correctAnswer: string;
  }]

  constructor(private http: HttpClient, private storageService: StorageService, private router: Router) {}
  
  ngOnInit(): void {
    this.numOfQuestions = this.storageService.numberOfQuestions;
    this.setOfQA = [{
      question: '',
      options: ['', '', '', ''],
      choosed: 5,
      correctAnswer: ''
    }];
    this.setOfQA.splice(0,1);
    if(localStorage.getItem('catagory') != null) {
      this.storageService.topic = localStorage.getItem('catagory')
      this.storageService.dificulty = localStorage.getItem('level')
    }
    if(this.storageService.topic && this.storageService.dificulty && !this.storageService.noMoreEdit) {
      this.onLoad();
    }
    if(this.storageService.noMoreEdit) {
      this.setOfQA.push(...this.storageService.quizData);
      this.choosedId = this.setOfQA[this.questionNo].choosed;
      this.noMoreEdit = true;
      for(let i = 0; i < this.setOfQA.length; i++) {
          if(this.setOfQA[i].options[this.setOfQA[i].choosed] === this.setOfQA[i].correctAnswer) {
            
          }
      }
    }
  }

  decodeHtml(html: string) {
    let parser = new DOMParser().parseFromString(html, "text/html")
    let output =  parser.documentElement.textContent;
    return output;
  }
  
  onLoad() {
    this.storageService.quizData.splice(0,1);
    this.loading = true;
    this.http.get<Questions>('https://opentdb.com/api.php?amount=' + this.numOfQuestions + '&type=multiple&difficulty=' + this.storageService.dificulty + '&category=' + this.storageService.topic)
    .pipe(map(
      responseData => {
        const results = [];
        results.push(...responseData.results)
        return results
      }
    ))
    .subscribe(
      (results) => {
        for(let i = 0; i < this.numOfQuestions; i++) {
          
          let retrivedAnswers = []
          retrivedAnswers.push((<string>this.decodeHtml(results[i].correct_answer)), 
          (<string>this.decodeHtml(results[i].incorrect_answers[0])), 
          (<string>this.decodeHtml(results[i].incorrect_answers[1])), 
          (<string>this.decodeHtml(results[i].incorrect_answers[2])));
          let randomAnswer = retrivedAnswers.sort((a, b) => {  
            return 0.5 - Math.random();
          })

        this.storageService.quizData.push({
            question: (<string>this.decodeHtml(results[i].question)), 
            options: [
              randomAnswer[0],
              randomAnswer[1],
              randomAnswer[2],
              randomAnswer[3]
            ], 
            choosed: 5,
            correctAnswer: (<string>this.decodeHtml(results[i].correct_answer))
          })
        }
        this.setOfQA.push(...this.storageService.quizData)
        this.loading = false;
        }
      )
    }

  onNext(text: string) {
    if(text == 'Next') {
      if (this.questionNo < this.storageService.quizData.length) {
        this.questionNo += 1;
        this.choosedId = this.setOfQA[this.questionNo].choosed;
      }
    } else {
      this.onSubmit()
    }
    this.checkSubmitReady()
  }

  onPrevious() {
    if (this.questionNo != 0) {
      this.questionNo -= 1;
      this.choosedId = this.setOfQA[this.questionNo].choosed;
    }
    this.checkSubmitReady()
  }
  
  goToQuestion(n: number) {
    this.questionNo = n;
    this.choosedId = this.setOfQA[this.questionNo].choosed;
    this.checkSubmitReady()
  }

  optionChoosed(i: number) {
    if(!this.storageService.noMoreEdit) {
      this.choosedId = i;
      this.setOfQA[this.questionNo].choosed = i;
      this.storageService.quizData[this.questionNo].choosed = i;
    } else {
      alert('Answer cannot be modified after viewing the results')
    }
    this.checkSubmitReady()
  }

  onSubmit() {
    let unanswered: boolean = false;
    for (let i = 0; i < this.setOfQA.length; i++) {
      if(this.setOfQA[i].choosed == 5) {
        unanswered = true;
      }
    }
    if(unanswered) {
      alert('Not All questions are answered.')
    } else {
      this.validation()
    }
  }

  checkSubmitReady() {
    this.enableSubmit = true
        for(let i = 0;i< this.storageService.quizData.length;i++) {
          if(this.storageService.quizData[i].choosed == 5) {
            this.enableSubmit = false;
          }
        }
  }

  validation() {
    this.storageService.correctAnswers = 0;
    for(let i = 0;i < this.setOfQA.length; i++) {
      if(this.setOfQA[i].options[this.setOfQA[i].choosed] == this.storageService.quizData[i].correctAnswer) {
        console.log('correct Answer')
        this.storageService.correctAnswers++;
      }
    }
    this.storageService.result = (this.storageService.correctAnswers > this.setOfQA.length * .5 ? 'Pass' : 'Fail')
    this.storageService.noMoreEdit = true;
    this.router.navigate(['/result'])
  }
}