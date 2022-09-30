import {Component, Input, OnInit} from '@angular/core';
import {CocktailsService} from "../../services/cocktails.service";
import {cocktail} from "../../model/cocktail";
import {ingredient} from "../../model/ingredient";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  @Input() cocktailService: CocktailsService;
  cocktail: cocktail;
  newIngredient: ingredient;
  constructor() {
    this.init();
  }

  init(): void {
    this.cocktail = new cocktail();
    this.newIngredient = new ingredient();
  }

  ngOnInit(): void {
  }

  canSave(): boolean {
    return this.cocktail.name.length > 2 && this.cocktail.ingredients.length > 1
  }

  addIngredient(): void {
    if (!this.newIngredient.amount) {return; }
    if (!this.newIngredient.name) {return; }
    if (this.newIngredient.name.length < 3) {return; }
    const oldIngredient = JSON.parse(JSON.stringify(this.newIngredient)) as ingredient;
    this.cocktail.ingredients.push(Object.assign({}, this.newIngredient));
    this.newIngredient = new ingredient();
    this.newIngredient.unit = oldIngredient.unit;
    this.newIngredient.isLiquid = oldIngredient.isLiquid;
  }

  removeIngredient(ingredient: ingredient): void {
    const index = this.cocktail.ingredients.indexOf(ingredient);
    if (index > -1) {
      this.cocktail.ingredients.splice(index, 1);
    }
  }

  save(): void {
    this.cocktail = this.cocktailService.calcAll(this.cocktail);
    this.cocktailService.saveNew(this.cocktail).then(() => {
      this.init();
    }).catch(error => {
      console.log(error)
    })
  }



}
