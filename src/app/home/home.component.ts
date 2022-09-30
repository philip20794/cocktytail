import { Component, OnInit } from '@angular/core';
import {CocktailsService} from "../services/cocktails.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  active = 1;
  constructor(public cocktailsService: CocktailsService) { }

  ngOnInit(): void {
  }



}
