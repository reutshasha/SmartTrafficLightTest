import { Car } from "./Car";

export interface CarQueue {
    before: Car[];
    between: Car[];
    after: Car[];
  }