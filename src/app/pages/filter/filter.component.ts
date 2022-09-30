import {Component, Input, OnInit} from '@angular/core';
import {CocktailsService} from "../../services/cocktails.service";
import {IngredientsService} from "../../services/ingredients.service";
import {ingredient} from "../../model/ingredient";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input() cocktailService: CocktailsService;
  constructor(public ingredientsService: IngredientsService) { }

  ngOnInit(): void {
    this.ingredientsService.init(this.cocktailService);
  }

  click(ingredient: ingredient): void {
    ingredient.filtered = !ingredient.filtered;
    this.ingredientsService.getFilteredCocktails();
  }

  getBackgroundColor(ingredient: ingredient): string {
    if (ingredient.filtered) {
      return '#fff000';
    } else {
      return '#ffffff'
    }
  }

}
