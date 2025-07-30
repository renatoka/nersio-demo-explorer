export interface Animal {
  id: number;
  name: string;
  species: string;
  size: "small" | "medium" | "large";
  prey: number[];
  predators: number[];
  color: string;
}

export interface AnimalsResponse {
  data: Animal[];
  count: number;
}

export interface AnimalResponse {
  data: Animal;
}
