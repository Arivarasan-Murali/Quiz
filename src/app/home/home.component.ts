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
  isTopicSelected: boolean = false;
  level: string = '';
  launch: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  toggleLaunch() {
    if(this.level != '') {
      this.launch = !this.launch;
      this.launch ? document.getElementById('launch')?.classList.remove('active') : document.getElementById('launch')?.classList.add('active');
    }
  }
  
  onClickTopic(i: number) {
    this.cardTitle = this.topics[i];
    this.isTopicSelected = true;
    this.launch = false;
    this.chooseLevel('');
  }
  
  chooseLevel(level: string) {
    this.level = level;
    (<HTMLInputElement>document.getElementById('check')).checked = false;
    if(this.level == 'easy') {
      document.getElementById('easy')?.classList.add('active');
      document.getElementById('hard')?.classList.remove('active');
    } else if (this.level == 'hard') {
      document.getElementById('hard')?.classList.add('active');
      document.getElementById('easy')?.classList.remove('active');
    } else {
      document.getElementById('hard')?.classList.remove('active');
      document.getElementById('easy')?.classList.remove('active');
    }
  }

}
