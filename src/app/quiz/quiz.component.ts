import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { map } from "rxjs";
import { StorageService } from "../storage.service";

import { Questions } from './question.model'


@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"],
})
export class QuizComponent implements OnInit {

  numOfQuestions: number = 3;
  questionNo: number = 0;
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
    options?: [string, string, string, string];
  }
  ] = [{
    question: '',
    options: ['', '', '', '']
  }];
  
  constructor(private http: HttpClient, private storageService: StorageService) {}
  
  ngOnInit(): void {
    this.onLoad();
  }


 decodeHtml(html: string) {
    let parser = new DOMParser().parseFromString(html, "text/html")
    let output =  parser.documentElement.textContent;
    return output;
}

  
  onLoad() {
    console.log('topic: ' + this.storageService.topic + ' | dificulty: ' + this.storageService.dificulty)
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
        }
        // this.setOfQA[0].question = (<string>this.result[0].question);
        // this.setOfQA[0].options[0] = (<string>this.result[0].correct_answer);
        return results
      }
    ))
    .subscribe(
      (responseData) => {
        console.log(this.result.length + " questions of difficulty level '" + this.result[0].difficulty + "' is generated."  )
        // for(let i = 0; i < this.numOfQuestions; i++) {
        // this.setOfQA[i].question = responseData[i].question
        // }
        }
      )
    }
    
    onNext(text: string) {
    if(text == 'Next') {
      if (this.questionNo < this.result.length - 1) {
        this.questionNo += 1;
      }
    } else {
      this.onSubmit()
    }
  }

  onPrevious() {
    if (this.questionNo != 0) {
      this.questionNo -= 1;
    }
  }

  onSubmit() {

  }
}