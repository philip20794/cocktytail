import {Component, Input, OnInit} from '@angular/core';
import {CocktailsService} from "../../services/cocktails.service";
import {ingredient} from "../../model/ingredient";
import {cocktail} from "../../model/cocktail";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmComponent} from "../confirm/confirm.component";

@Component({
  selector: 'app-edit-cocktail',
  templateUrl: './edit-cocktail.component.html',
  styleUrls: ['./edit-cocktail.component.scss']
})
export class EditCocktailComponent implements OnInit {

  @Input() cocktailService: CocktailsService;
  @Input() cocktail: cocktail;
  newIngredient: ingredient;
  constructor(public dialogRef: MatDialogRef<EditCocktailComponent>, public dialog: MatDialog) {
    this.init();
  }

  init(): void {
    this.newIngredient = new ingredient();
  }

  ngOnInit(): void {
  }

  addIngredient(): void {
    if (!this.newIngredient.amount) {return; }
    if (!this.newIngredient.name) {return; }
    if (this.newIngredient.name.length < 3) {return; }
    this.cocktail.ingredients.push(Object.assign({}, this.newIngredient));
    this.newIngredient = new ingredient();
  }

  removeIngredient(ingredient: ingredient): void {
    const index = this.cocktail.ingredients.indexOf(ingredient);
    if (index > -1) {
      this.cocktail.ingredients.splice(index, 1);
    }
  }

  updateIsLiquid(ingredient: ingredient): void {
    ingredient.isLiquid = ingredient.unit === 'ml' || ingredient.unit === 'cl';
    this.cocktailService.update(this.cocktail)
  }


  askToDelete(): void {
    const dialog = this.dialog.open(ConfirmComponent, {autoFocus: false});
    dialog.afterClosed().subscribe((del) => {
      if (del) {
        this.dialogRef.close('del')
      }
    })
  }

}
