export interface IRoom {
  code: string;
  title: string;
  hasStarted: boolean;
  users: { [id: string]: IUser };
  beers: { [id: string]: IBeer };
}

export interface IUser {
  id: string;
  name: string;
}

export interface IBeer {
  id: string;
  index: number;
  active: boolean;
  finished: boolean;
  name: string;
  type: string;
  abv: number;
  brewer: string;
  country: string;
  description: string;
}
