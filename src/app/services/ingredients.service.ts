import { Injectable } from '@angular/core';
import {ingredient} from "../model/ingredient";
import {cocktail} from "../model/cocktail";
import {CocktailsService} from "./cocktails.service";
import {min} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  private ingredients: Array<ingredient>;
  private cocktails: Array<cocktail>;
  private cocktailService: CocktailsService;
  public filteredCocktails: Array<cocktail>;
  public restCocktails: Array<cocktail>;
  public juices: Array<ingredient>;
  public liquids: Array<ingredient>;
  public filteredIngredients: Array<ingredient>;
  public mindestensEins = false;
  constructor() { }

  init(cocktailService: CocktailsService) {
    this.cocktailService = cocktailService;
    this.setCocktails(cocktailService.cocktails);
  }

  switchMindestensEins(): void {
    this.mindestensEins = !this.mindestensEins;
    this.getFilteredCocktails();
  }

  getFilteredCocktails(): void {
    this.filteredCocktails = [];
    this.restCocktails = [];
    for (const cocktail of this.cocktails) {
      if (this.mindestensEins) {
        if (this.cocktailContainsAtLeastOneOf(this.liquids, cocktail) ||
          this.cocktailContainsAtLeastOneOf(this.juices, cocktail)) {
          this.filteredCocktails.push(cocktail);
        } else {
          this.restCocktails.push(cocktail);
        }
      } else {
        if ((this.cocktailContainsAtLeastOneOf(this.liquids, cocktail) ||
          this.cocktailContainsAtLeastOneOf(this.juices, cocktail)) && !this.isFilteredOut(cocktail)) {
          this.filteredCocktails.push(cocktail);
        } else {
          this.restCocktails.push(cocktail);
        }
      }
    }
  }

  showClear(): boolean {
    for (const ingredient of this.liquids) {
      if (ingredient.filtered) {
        return true;
      }
    }
    for (const ingredient of this.juices) {
      if (ingredient.filtered) {
        return true;
      }
    }
    return false;
  }

  resetFilter(): void {
    for (const ingredient of this.ingredients) {
      ingredient.filtered = false;
    }
    this.getFilteredCocktails();
  }

  private isFilteredOut(cocktail: cocktail): boolean {
    let result = false;
    for (const ingredient of cocktail.ingredients) {
      if (!ingredient.isLiquid) {continue}
      if (ingredient.alcoholLevel > 0) {
        if (this.ingredientIsFiltered(ingredient, this.liquids)) {
          result = true;
        }
      } else if (this.ingredientIsFiltered(ingredient, this.juices)) {
        result = true;
      }
    }
    return result;
  }

  private cocktailContainsAtLeastOneOf(list: Array<ingredient>, cocktail: cocktail): boolean {
    let result = false;
    for (const ingredient of list) {
      if (ingredient.filtered) {
        if (!result) {
          result = this.containsExact(ingredient, cocktail.ingredients)
        }
        if (result) {
          return result;
        }
      }
    }
    return result;
  }

  private setCocktails(cocktails: Array<cocktail>): void {
    this.cocktails = cocktails;
    this.getIngredients();
    this.getFilteredCocktails();
  }

  private getIngredients(): void {
    this.ingredients = [];
    this.juices = [];
    this.liquids = [];
    this.filteredIngredients = [];
    for (const cocktail of this.cocktails) {
      for (const ingredient of cocktail.ingredients) {
        this.ingredients.push(ingredient);
      }
    }
    this.sortIngredients();
    for (const ingredient of this.ingredients) {
      if (ingredient.isLiquid) {
        if (ingredient.alcoholLevel > 0 && !this.contains(ingredient, this.liquids)) {
          this.liquids.push(ingredient);
          this.filteredIngredients.push(ingredient);
        } else if (ingredient.alcoholLevel === 0 && this.hasLargeAmount(ingredient) && !this.contains(ingredient, this.juices)){
          this.juices.push(ingredient);
          this.filteredIngredients.push(ingredient);
        }
      } else {
        if (!this.contains(ingredient, this.filteredIngredients)) {
          this.filteredIngredients.push(ingredient);
        }
      }
    }
    this.sortLiquidsAndJuices()
  }

  private sortIngredients(): void {
     this.ingredients = this.ingredients.sort((a, b) => a.name.length - b.name.length)
  }

  private sortLiquidsAndJuices(): void {
    this.juices = this.juices.sort((a, b) => a.name.localeCompare(b.name))
    this.liquids = this.liquids.sort((a, b) => a.name.localeCompare(b.name))
  }

  private contains(ingredient: ingredient, list: Array<ingredient>): boolean {
    for (const ing of list) {
      if (ingredient.name.includes(ing.name)) {
        return true;
      }
    }
    return false;
  }

  private containsExact(ingredient: ingredient, list: Array<ingredient>): boolean {
    for (const ing of list) {
      if (ingredient.name.toLowerCase() == ing.name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  private ingredientIsFiltered(ingredient: ingredient, list: Array<ingredient>): boolean {
    if (this.allFiltered(list)) {return false}
    for (const ing of list) {
      if (ingredient.name.includes(ing.name)) {
        return !ing.filtered;
      }
    }
    return false;
  }

  private allFiltered(list: Array<ingredient>): boolean {
    for (const ingredient of list) {
      if (ingredient.filtered) {return false}
    }
    return true;
  }

  private hasLargeAmount(ingredient: ingredient): boolean {
    return this.cocktailService.getAmount(ingredient) > 40
  }




}
