export interface ClashModel {
  name: string;
  speed: number;
  keyGroup?: string[][];
  sequence: ClashKey[];
}

export interface ClashKey {
  type: 'static' | 'random';
  key?: string;
  keyGroupIndex?: number;
  delay: number;
  positionX: number;
  positionY: number;
  speed?: number;
}

export interface ClashResult {
  resultClass: string;
  resultText: string;
}

export interface ClashSettings {
  perfectMargin:number;
  goodMargin:number;
}
