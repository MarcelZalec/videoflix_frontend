import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../shared/services/database.service';

@Component({
  selector: 'app-main',
  imports: [NgClass],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  mainMenu:boolean = false;

  constructor(
    private dbs: DatabaseService,
    private router:Router
  ){
    this.dbs.get()
  }

  logout(){
    this.router.navigateByUrl('')
  }

  goToMainManu(){
    this.router.navigateByUrl('main')
  }

}
