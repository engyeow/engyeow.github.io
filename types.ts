
export enum AppScreen {
  OPENING = 'OPENING',
  BUILDUP = 'BUILDUP',
  THE_ASK = 'THE_ASK',
  SUCCESS = 'SUCCESS'
}

export interface HoneyDrop {
  id: number;
  left: number;
  duration: number;
  size: number;
}
