import { Component } from '@angular/core';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  isDarkTheme = false;

  constructor(private storageService: StorageService) {}

  get pageTitle(): string {
    const topicName = this.storageService.topicName;
    const difficulty = this.storageService.difficulty;
    if (topicName && difficulty) {
      return `${topicName} (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})`;
    }
    if (topicName) {
      return topicName;
    }
    return 'Quiz';
  }

  onLoadHome() {
    this.storageService.noMoreEdit = false;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }
}
