export class ingredient {
  name?: string;
  unit?: string;
  alcoholLevel?: number;
  isLiquid?: boolean;
  amount?: number;
  filtered?: boolean;

  constructor(json: ingredient = {}) {
    this.name = json.name ? json.name : '';
    this.unit = json.unit ? json.unit : 'cl';
    this.alcoholLevel = json.alcoholLevel ? json.alcoholLevel : 0;
    this.amount = json.amount ? json.amount : null;
    this.isLiquid = (json.isLiquid !== undefined) ? json.isLiquid : true;
    this.filtered = (json.filtered !== undefined) ? json.filtered : false;
  }
}
