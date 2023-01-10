import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  result: string | null = '';
  totalQuestions: number = 0;
  correctAnswers: number = 0;

  constructor(private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.result = this.storageService.result;
    this.totalQuestions = this.storageService.quizData.length;
    this.correctAnswers = this.storageService.correctAnswers;

    if(this.result == null) {
      this.router.navigate(['/'])
    }
    document.body.style.backgroundColor = (this.result === 'Pass' ? 'greenyellow' : 'rgb(253, 95, 83)');
  }

  reviewResult() {
    this.router.navigate(['/quiz'])
    document.body.style.backgroundColor = 'rgba(129, 245, 220, 0.5)';
  }
}
