import { Component, OnInit } from '@angular/core';
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

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {}

  toggleLaunch() {
    if(this.level != '') {
      this.launch = !this.launch;
      this.launch ? document.getElementById('launch')?.classList.remove('active') : document.getElementById('launch')?.classList.add('active');
    }
  }
  
  onClickTopic(i: number) {
    this.cardTitle = this.topics[i].name;
    this.isTopicSelected = true;
    this.launch = false;
    this.chooseLevel('');
    this.storageService.topic = this.topics[i].id
  }
  
  chooseLevel(level: string) {
    this.level = level;
    this.storageService.dificulty = level;
    // (<HTMLInputElement>document.getElementById('check')).checked = false;
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
  }
}
