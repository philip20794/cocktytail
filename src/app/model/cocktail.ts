import {ingredient} from "./ingredient";

export class cocktail {
  name?: string;
  alcoholLevel?: number;
  ingredients?: Array<ingredient>;
  volume?: number;

  constructor(json: cocktail = {}) {
    this.name = json.name ? json.name : '';
    this.alcoholLevel = json.alcoholLevel ? json.alcoholLevel : 0;
    this.ingredients = json.ingredients ? json.ingredients : [];
    this.volume = json.volume ? json.volume : 0;
  }
}
