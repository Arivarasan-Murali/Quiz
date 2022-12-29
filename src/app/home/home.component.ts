import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  topics = ['Maths', 'General Knowledge', 'Aptitude'];
  cardTitle: string = 'title';
  cardContent: string = 'Content for the corresponding topic';
  // check = document.getElementById('check');
  isTopicSelected: boolean = false;
  launch: boolean = true;

  levelText = {
    easy: 'Easy as 1 2 3',
    hard: 'I know 98th digit of PI'
  }
  
  constructor() { }

  ngOnInit(): void {
  }

  toggleLaunch() {
    this.launch = !this.launch;
  }
  
  onClickTopic(i: number) {
    this.cardTitle = this.topics[i];
    this.isTopicSelected = true
  }

  chooseLevel(level: string) {
    if(level == 'easy') {
      document.getElementById('easy')?.classList.add('active');
      document.getElementById('hard')?.classList.remove('active');
    } else if (level == 'hard') {
      document.getElementById('hard')?.classList.add('active');
      document.getElementById('easy')?.classList.remove('active');
    }
  }

}
