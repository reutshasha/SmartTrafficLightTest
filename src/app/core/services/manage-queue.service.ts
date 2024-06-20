import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Car } from 'src/app/data/models/Car';
import { CarQueue } from 'src/app/data/models/CarQueue';
import { generateRandomLicensePlate } from 'src/app/presentation/_shared/utilities/utils';

export const INITIAL_CAR_QUEUE = new InjectionToken<CarQueue>('InitialCarQueue');
export const SET_QUEUE = new InjectionToken<(newTraffic: any) => void>('SetQueueFunction');

@Injectable({
  providedIn: 'root'
})
export class ManageQueueService {

  private carQueue: CarQueue;
  private setQue: Function;

  constructor(@Inject(INITIAL_CAR_QUEUE) initialItems: CarQueue,
    @Inject(SET_QUEUE) setQue: Function
  ) {
    this.carQueue = initialItems;
    this.setQue = setQue;
  }


  beforQueueFirst(): void {
    let car = new Car(generateRandomLicensePlate());
    this.carQueue.before.push(car);
    this.setQue({ ...this.carQueue });
  }

  betweenQueueFirst(): void {
    let car = new Car(generateRandomLicensePlate());
    this.carQueue.between.push(car);
    this.setQue(this.carQueue);
  }

  afterQueueFirst(): void {
    let car = new Car(generateRandomLicensePlate());
    this.carQueue.after.push(car);
    this.setQue(this.carQueue);
  }

  beforQueueSecond(): void {
    this.carQueue.before.shift();
    this.setQue(this.carQueue);
  }

  betweenQueueSecond(): void {
    this.carQueue.between.shift();
    this.setQue(this.carQueue);
  }

  afterQueueSecond(): void {
    this.carQueue.after.shift();
    this.setQue(this.carQueue);
  }

}

