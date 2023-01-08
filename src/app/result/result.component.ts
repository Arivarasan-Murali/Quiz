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

  constructor(private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.result = this.storageService.result;
    console.log('result' + this.storageService.result)
    console.log('level' + this.storageService.dificulty)
    console.log('topic' + this.storageService.topic)
    if(this.result == null) {
      this.router.navigate(['/'])
    }
    document.body.style.backgroundColor = (this.result === 'Pass' ? 'greenyellow' : 'rgb(253, 95, 83)');
    localStorage.clear();
  }

}
