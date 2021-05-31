export interface IRoom {
  code: string;
  title: string;
  hasStarted: boolean;
  isBlind: boolean;
  users?: { [id: string]: IUser };
  beers?: { [id: string]: IBeer };
  finished?: { [beerId: string]: boolean };
}

export interface IUser {
  id: string;
  name: string;
  timestamp: number;
  ratings?: IRating;
}

export interface IBeer {
  id: string;
  index: number;
  active: boolean;
  name: string;
  type: string;
  abv: number;
  brewer: string;
  country: string;
  description: string;
}

export type IRating = { [beerId: string]: number };
