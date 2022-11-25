import {Component, Input, OnInit} from '@angular/core';
import {cocktail} from "../../model/cocktail";
import {CocktailsService} from "../../services/cocktails.service";
import {EditCocktailComponent} from "../../dialog/edit-cocktail/edit-cocktail.component";
import {MatDialog} from "@angular/material/dialog";
import {J} from "@angular/cdk/keycodes";
import {ingredient} from "../../model/ingredient";

@Component({
  selector: 'app-show-cocktail',
  templateUrl: './show-cocktail.component.html',
  styleUrls: ['./show-cocktail.component.scss']
})
export class ShowCocktailComponent implements OnInit {

  @Input() cocktail: cocktail;
  @Input() cocktailService: CocktailsService;
  volumen: number;
  cocktailShown: cocktail;
  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.volumen = JSON.parse(JSON.stringify(this.cocktail.volume));
    this.cocktailShown = JSON.parse(JSON.stringify(this.cocktail));
  }

  volumeUpdate(): void {
    this.cocktailShown = JSON.parse(JSON.stringify(this.cocktail));
    for (let ingredient of this.cocktailShown.ingredients) {
      ingredient.amount = this.cocktailService.getDifferentAmount(this.getFormerIngredient(ingredient),
        this.cocktail, this.volumen);
      if (this.cocktail.volume < this.volumen) {
        ingredient = this.cocktailService.updateUnit(ingredient);
      }
    }
  }

  getFormerIngredient(ingredientGiven: ingredient): ingredient {
    for (const ingredient of this.cocktail.ingredients) {
      if (ingredient.name === ingredientGiven.name) {
        return JSON.parse(JSON.stringify(ingredient));
      }
    }
    return null;
  }

  editCocktail(cocktail: cocktail): void {
    const component = this.dialog.open(EditCocktailComponent, {autoFocus: false, minWidth: '100vw'});
    component.componentInstance.cocktailService = this.cocktailService;
    component.componentInstance.cocktail = cocktail;
    component.afterClosed().subscribe(value => {
      if (value === 'del') {
        this.cocktailService.delete(cocktail);
      }
    })
  }

}
