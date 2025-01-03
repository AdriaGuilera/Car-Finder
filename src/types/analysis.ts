export interface CarAnalysis {
  "Car Make": string;
  "Model": string;
  "Year": [number, number];
  "Price": {
    min: number;
    max: number;
    unit: string;
  };
  "HP": [number, number];
  "Speed": {
    max: [number];
    unit: string;
  };
  "Chances": {
    Rarity: string;
    Chance: string;
  };
}