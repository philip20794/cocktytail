import { Injectable } from '@angular/core';
import {AlertService} from "./alert.service";
import {cocktail} from "../model/cocktail";
import {Subscription} from "rxjs";
import {AuthService} from "./auth.service";
import {AngularFirestore} from "@angular/fire/firestore";
import {ingredient} from "../model/ingredient";

@Injectable({
  providedIn: 'root'
})
export class CocktailsService {

  cocktails: Array<cocktail>;
  cocktailsSubscription: Subscription;
  loaded: boolean;
  selectedCocktail: cocktail;
  constructor(public afs: AngularFirestore, public authService: AuthService, private alertService: AlertService) {
    this.init();
  }

  public init(): void {
    this.selectedCocktail = null;
    this.loaded = false;
    this.getCocktails();
  }

  private getCocktails(): void {
    this.cocktails = [];
    this.getFromStorage();
    this.cocktailsSubscription = this.afs.collection('cocktails').valueChanges().subscribe(value => {
      // const merged = [].concat.apply([], value);
      this.cocktails = value;
      this.loaded = true;
    }, error => {
      this.alertService.error(error);
      this.loaded = true;
    });
  }

  getFromStorage(): void {
    const storage = localStorage.getItem('cocktails');
    if (storage) {
      if (this.cocktails.length < 1) {
        this.cocktails = JSON.parse(storage);
      }
    }
  }

  saveToStorage(): void {
    localStorage.setItem('cocktails', JSON.stringify(this.cocktails));
  }



  saveNew(cocktail: cocktail): any {
    cocktail = this.calcAll(cocktail);
    this.saveToStorage();
    return this.afs.collection('cocktails/').doc(cocktail.name).set(Object.assign({}, cocktail));
  }

  update(cocktail: cocktail): any {
    cocktail = this.calcAll(cocktail);
    if (!this.contains(cocktail)) {
      return;
    }
    this.saveToStorage();
    return this.afs.collection('cocktails/').doc(cocktail.name).update(Object.assign({}, cocktail));
  }

  delete(cocktail: cocktail): any {
    this.saveToStorage();
    return this.afs.collection('cocktails/').doc(cocktail.name).delete();
  }

  calcAll(cocktail: cocktail): cocktail {
    cocktail = this.calcVolume(cocktail);
    cocktail = this.calcAlk(cocktail);
    return cocktail;
  }

  private calcVolume(cocktail: cocktail): cocktail {
    cocktail.volume = 0;
    for (let ingredient of cocktail.ingredients) {
      if (ingredient.isLiquid) {
        cocktail.volume += this.getAmount(ingredient);
      }
    }
    cocktail.volume = Math.round(cocktail.volume);
    return cocktail;
  }

  private calcAlk(cocktail: cocktail): cocktail {
    cocktail.alcoholLevel = 0;
    for (let ingredient of cocktail.ingredients) {
      if (ingredient.isLiquid) {
        cocktail.alcoholLevel += (this.getAmount(ingredient) * ingredient.alcoholLevel) / cocktail.volume;
      }
    }
    cocktail.alcoholLevel = Math.round(cocktail.alcoholLevel * 10) /  10;
    return cocktail;
  }

  public getAmount(ingredient: ingredient): number {
    let amount = ingredient.amount;
    amount *= ingredient.unit === 'cl' ? 10 : 1;
    return amount;
  }

  public updateUnit(ingredient: ingredient): ingredient {
    if (ingredient.amount < 6) { return ingredient; }
    if (ingredient.unit === 'TL') {
      ingredient.amount /= 2;
      ingredient.unit = 'EL';
      return this.updateUnit(ingredient)
    }
    if (ingredient.unit === 'EL') {
      ingredient.amount *= 9.428626;
      ingredient.unit = 'g';
      ingredient.amount = Math.round(ingredient.amount * 10) / 10;
      return ingredient;
    }
    return ingredient;
  }

  private getAmountBack(ingredient: ingredient): number {
    let amount = ingredient.amount;
    amount /= ingredient.unit === 'cl' ? 10 : 1;
    return amount;
  }

  public getDifferentAmount(ingredient: ingredient, cocktail: cocktail, volume: number): number {
    const times = volume/cocktail.volume;
    ingredient.amount = this.getAmount(ingredient) * times;
    const round = ingredient.unit === 'cl' ? 10 : 1;
    return Math.round(this.getAmountBack(ingredient) * round) / round;
  };

  private contains(cocktail: cocktail): boolean {
    for (let cock of this.cocktails) {
      if (cock.name === cocktail.name) {
        return true;
      }
    }
    return false;
  }

}
