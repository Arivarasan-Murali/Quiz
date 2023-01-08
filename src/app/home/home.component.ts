import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

import {catogories} from './catogory.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  topics = [
    {
      id: 0, 
      name: 'GK'
    }, 
    {
      id: 14, 
      name: 'TV'
    }, 
    {
      id: 15,
      name: 'Games'
    },
  {
    id: 18,
    name: 'Computers'
  }];
  cardTitle: string = 'title';
  cardContent: string = 'Content for the corresponding topic';
  isTopicSelected: boolean = false;
  level: string = '';
  launch: boolean = false;
  
  catagory: catogories[];

  constructor(private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {}
  
  onClickTopic(i: number) {
    this.cardTitle = this.topics[i].name;
    this.isTopicSelected = true;
    (<HTMLInputElement>document.getElementById('check')).checked = false;
    this.launch = false;
    this.chooseLevel('');
    this.storageService.topic = this.topics[i].id.toString()
    localStorage.setItem('catagory', this.topics[i].id.toString())
    this.enableLaunch();
  }
  
  chooseLevel(level: string) {
    this.level = level;
    this.storageService.dificulty = level;
    localStorage.setItem('level', level)

    document.getElementById('easy')?.classList.remove('active');
    document.getElementById('medium')?.classList.remove('active');
    document.getElementById('hard')?.classList.remove('active');
    switch(level) {
      case 'easy' : {
        document.getElementById('easy')?.classList.add('active');
      } break;
      case 'medium' : {
        document.getElementById('medium')?.classList.add('active');
      }break;
      case 'hard' : {
        document.getElementById('hard')?.classList.add('active');
      }break;
    }
    this.enableLaunch();
  }

  enableLaunch() {
    if(this.level && (<HTMLInputElement>document.getElementById('check')).checked) {
      this.launch = true;
      document.getElementById('launch')?.classList.remove('active')
    } else {
      this.launch = false;
      document.getElementById('launch')?.classList.add('active')
    }
  }

  launchQuiz() {
    this.router.navigate(['/quiz']);
  }
}
