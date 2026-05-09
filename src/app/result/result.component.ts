import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: false,
})
export class ResultComponent implements OnInit {
  result: string | null = '';
  totalQuestions: number = 0;
  correctAnswers: number = 0;

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.result = this.storageService.result;
    this.totalQuestions = this.storageService.quizData.length;
    this.correctAnswers = this.storageService.correctAnswers;

    // To prevent page load, If the webpage is refreshed in Result page or the route is manually entered in URL
    if (this.result == null || this.totalQuestions === 0) {
      this.router.navigate(['/']);
    }

  }

  reviewResult() {
    this.router.navigate(['/quiz']);
  }
}
