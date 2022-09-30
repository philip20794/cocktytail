import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ingredient} from "../../model/ingredient";
import {CocktailsService} from "../../services/cocktails.service";
import {IngredientsService} from "../../services/ingredients.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.scss']
})

export class EditIngredientComponent implements OnInit {

  @Input() ingredient: ingredient;
  @Input() hideDelete = true;
  @Output() changed = new EventEmitter;
  @Output() delete = new EventEmitter;
  @Input() fontsize = 14;
  @Input() showSave = false;
  @Input() cocktailService: CocktailsService;
  isDecimal: boolean;
  myControl = new FormControl();
  filteredOptions: Observable<ingredient[]>;
  constructor(public ingredientsService: IngredientsService) {

  }

  ngOnInit(): void {
    this.updateIsLiquid();
    if (this.cocktailService) {
      this.ingredientsService.init(this.cocktailService);
    }
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filter(state) : this.ingredientsService.filteredIngredients.slice())
      );
  }

  ingredientNameChange(): void {
    if (this.cocktailService) {
      for (const ingredient of this.ingredientsService.filteredIngredients) {
        if (ingredient.name.toLowerCase() === this.ingredient.name.toLowerCase()) {
          this.ingredient.alcoholLevel = ingredient.alcoholLevel;
        }
      }
    }
    this.changed.emit(ingredient);
  }


  private _filter(value: string): ingredient[] {
    const filterValue = value.toLowerCase();

    return this.ingredientsService.filteredIngredients.filter(option => option.name.toLowerCase().includes(filterValue));
  }



  updateIsLiquid(): void {
    this.ingredient.isLiquid = this.ingredient.unit === 'ml' || this.ingredient.unit === 'cl';
    this.isDecimal = this.ingredient.isLiquid || this.ingredient.unit === 'g';
    this.changed.emit();
  }

}
