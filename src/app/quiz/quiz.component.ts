import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"],
})
export class QuizComponent implements OnInit {
  questions = [
    {
      question: "question 1",
      optionA: "option 1A",
      optionB: "option 1B",
      optionC: "option 1C",
      optionD: "option 1D",
      answer: "answer1",
    },
    {
      question: "question 2",
      optionA: "option 2A",
      optionB: "option 2B",
      optionC: "option 2C",
      optionD: "option 2D",
      answer: "answer2",
    },
  ];

  questionNo: number = 0;

  constructor() {}

  ngOnInit(): void {}

  onNext() {
    if (this.questionNo < this.questions.length - 1) {
      this.questionNo += 1;
    }
  }

  onPrevious() {
    if (this.questionNo != 0) {
      this.questionNo -= 1;
    }
  }
}