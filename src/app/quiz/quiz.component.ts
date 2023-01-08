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

  numOfQuestions: number = 5;
  questionNo: number = 0;
  choosedId: number = 5;
  loading: boolean = false;

  result: [{
    catogory: string,
    correct_answer: string,
    difficulty: string,
    incorrect_answers: [string, string, string],
    question: string,
    type: string
  }] = [{
    catogory: '',
    correct_answer: '',
    difficulty: '',
    incorrect_answers: ['', '', ''],
    question: '',
    type: ''
  }];

  setOfQA: [{
    question: string;
    options: [string, string, string, string];
    choosed: number;
  }]
  = [{
    question: '',
    options: ['', '', '', ''],
    choosed: 5
  }];
  
  constructor(private http: HttpClient, private storageService: StorageService, private router: Router) {}
  
  ngOnInit(): void {
    if(localStorage.getItem('catagory') != null) {
      this.storageService.topic = localStorage.getItem('catagory')
      this.storageService.dificulty = localStorage.getItem('level')
    }
    if(this.storageService.topic && this.storageService.dificulty) {
      this.onLoad();
    }
  }

 decodeHtml(html: string) {
    let parser = new DOMParser().parseFromString(html, "text/html")
    let output =  parser.documentElement.textContent;
    return output;
}
  
  onLoad() {
    this.loading = true;
    this.http.get<Questions>('https://opentdb.com/api.php?amount=' + this.numOfQuestions + '&type=multiple&difficulty=' + this.storageService.dificulty + '&category=' + this.storageService.topic)
    .pipe(map(
      responseData => {
        const results = [];
        results.push(...responseData.results)
        for(let i = 0; i < this.numOfQuestions; i++) {
          this.result[i] = results[i]
          this.result[i].question = (<string>this.decodeHtml(results[i].question));
          
          this.result[i].correct_answer = (<string>this.decodeHtml(results[i].correct_answer));
          this.result[i].incorrect_answers[0] = (<string>this.decodeHtml(results[i].incorrect_answers[0]));
          this.result[i].incorrect_answers[1] = (<string>this.decodeHtml(results[i].incorrect_answers[1]));
          this.result[i].incorrect_answers[2] = (<string>this.decodeHtml(results[i].incorrect_answers[2]));
          
          this.setOfQA.push({question: this.result[i].question, options: [this.result[i].correct_answer, results[i].incorrect_answers[0], results[i].incorrect_answers[1], results[i].incorrect_answers[2]], choosed: 5})
        }
        return results
      }
    ))
    .subscribe(
      () => {
        console.log(this.result.length + " questions of difficulty level '" + this.result[0].difficulty + "' is generated." )
        this.loading = false;
        }
      )
    }

  onNext(text: string) {
    if(text == 'Next') {
      if (this.questionNo < this.result.length - 1) {
        this.questionNo += 1;
        this.choosedId = this.setOfQA[this.questionNo].choosed;
      }
    } else {
      this.onSubmit()
    }
    // this.logMessage('onNext')
  }

  onPrevious() {
    if (this.questionNo != 0) {
      this.questionNo -= 1;
      this.choosedId = this.setOfQA[this.questionNo].choosed;
    }
    // this.logMessage('onPrevious')
  }
  
  goToQuestion(n: number) {
    this.questionNo = n;
    this.choosedId = this.setOfQA[this.questionNo].choosed;
  }

  optionChoosed(i: number) {
    this.choosedId = i;
    this.setOfQA[this.questionNo].choosed = i;
    // this.logMessage('optionChoosed')
  }

  onSubmit() {
    let unanswered: boolean = false;
    // this.logMessage('onSubmit')
    for (let i = 0; i < this.setOfQA.length - 1; i++) {
      if(this.setOfQA[i].choosed == 5) {
        unanswered = true;
      }
    }
    if(unanswered) {
      alert('Not All questions are answered.')
    } else {
      // console.log('submitting')
      this.validation()
    }
  }

  // logMessage(msg: string) {
  //   console.log(msg + ':- Q.no.: ' + (this.questionNo + 1) + ' | Currently choosed: ' + (this.setOfQA[this.questionNo].choosed) + ' | choosedId: ' + this.choosedId)
  // }

  validation() {
    let correctAnswer: number = 0;
    for(let i = 0;i < this.setOfQA.length - 1; i++) {
      if(this.setOfQA[i+1].options[this.setOfQA[i].choosed] == this.result[i].correct_answer) {
        correctAnswer++;
      }
    }
    this.storageService.result = (correctAnswer > this.setOfQA.length * .5 ? 'Pass' : 'Fail')
    this.router.navigate(['/result'])
  }
}