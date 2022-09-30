import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {CocktailsService} from "../../services/cocktails.service";
import {IngredientsService} from "../../services/ingredients.service";
import {cocktail} from "../../model/cocktail";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() cocktailService: CocktailsService;
  list: Array<cocktail>;
  showRest = true;
  constructor(public ingredientsService: IngredientsService) { }

  ngOnInit(): void {
    this.checkLoaded();
  }



  checkLoaded(): void {
    if (this.cocktailService.loaded) {
      this.init();
    } else {
      setTimeout(() => {this.checkLoaded()}, 200)
    }
  }

  init(): void {
    this.ingredientsService.init(this.cocktailService);
    if (this.ingredientsService.filteredCocktails.length > -1) {
      this.list = this.ingredientsService.filteredCocktails;
    } else  {
      this.list = this.cocktailService.cocktails;
    }
  }



}
