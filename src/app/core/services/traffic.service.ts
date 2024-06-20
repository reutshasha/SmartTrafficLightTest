
import { Injectable } from '@angular/core';
import { Observable, interval, BehaviorSubject, Subscription } from 'rxjs';
import { LightState } from 'src/app/data/models/LightState';

const cycleTime = 15000;
const yellowTime = 2500;
const redTimeMin = 6000;

@Injectable({
  providedIn: 'root',
})
export class TrafficService {

  private lightState: BehaviorSubject<string> = new BehaviorSubject<string>('green');
  private lightStateSubject = new BehaviorSubject<{ [key: string]: LightState }>({
    'north-south': 'green',
    'east-west': 'red'
  });

  private northSouthQueueSubject = new BehaviorSubject<any>({ northSouth: [] });

  private northToSouth: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private northToSouthBetween: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private northToSouthAfter: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private northToSouthAfterNow: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private eastToWest: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private eastToWestBetween: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private eastToWestAfter: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private eastToWestAfterNow: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private subscriptions: Subscription = new Subscription();

  constructor() {

    let interval: any;

    this.lightState.subscribe((state) => {
      clearInterval(interval);
      console.log('traffic light state has changed to:', state);

      if (state !== 'yellow') {
        interval = setInterval(() => {
          if (state == 'green') {
            if (this.northToSouth.value > 0) {
              this.northToSouth.next(this.northToSouth.value - 1);
              this.northToSouthBetween.next(this.northToSouthBetween.value + 1);
              console.log("between north-south count: ", this.northToSouthBetween.value)
              setTimeout(() => {
                this.northToSouthBetween.next(this.northToSouthBetween.value - 1);
                this.northToSouthAfter.next(
                  this.northToSouthAfter.value + 1
                );
                this.northToSouthAfterNow.next(this.northToSouthAfterNow.value + 1);
                console.log("passed north-south count: ", this.northToSouthAfterNow.value);

                this.removeOldPassed("north-south")
              }, 2000);
            }
          } else {

            if (this.eastToWest.value > 0) {
              this.eastToWest.next(this.eastToWest.value - 1);
              this.eastToWestBetween.next(this.eastToWestBetween.value + 1);
              console.log("between east-west count: ", this.eastToWestBetween.value)

              setTimeout(() => {
                this.eastToWestBetween.next(this.eastToWestBetween.value - 1);
                this.eastToWestAfter.next(
                  this.eastToWestAfter.value + 1
                );
                this.eastToWestAfterNow.next(this.eastToWestAfterNow.value + 1);
                console.log("passed east-west count: ", this.eastToWestAfterNow.value);
                this.removeOldPassed("east-west")
              }, 2000);
            }
          }
        }, 1000);
      }

    });
    this.startTrafficLight();
  }


  private startTrafficLight(): void {

    this.manageTrafficLight(cycleTime);

    setInterval(() => {
      this.manageTrafficLight(cycleTime);
    }, cycleTime);
  }

  private manageTrafficLight(cycleTime: number): void {
    const greenTime = this.calcGreenTime(cycleTime);
    const remainingTime = cycleTime - greenTime - 2 * yellowTime;
    const redTime = Math.max(remainingTime, redTimeMin);

    //traffic light state
    this.lightState.next('green');
    setTimeout(() => {
      this.lightState.next('yellow');
      setTimeout(() => {
        this.lightState.next('red');
        setTimeout(() => {
          this.lightState.next('yellow');
        }, redTime);
      }, yellowTime);
    }, greenTime);
  }

  private calcGreenTime(cycleTime: number): number {
    const amountCarsNS = this.northToSouth.value + this.northToSouthAfter.value;
    const amountCarsEW = this.eastToWestAfter.value + this.eastToWest.value;

    if (amountCarsNS !== 0 && amountCarsEW !== 0) {
      const greenRedRatio = Math.min(amountCarsEW / amountCarsNS, 2);
      return Math.max(Math.round(((cycleTime - 2 * yellowTime) / 2) * greenRedRatio), 5000);
    } else {
      return (cycleTime - 2 * yellowTime) / 2;
    }
  }

  private removeOldPassed(direction: string): void {
    setTimeout(() => {
      if (direction === 'north-south') {
        this.northToSouthAfterNow.next(this.northToSouthAfterNow.value - 1)

      } else {
        this.eastToWestAfterNow.next(this.eastToWestAfterNow.value - 1)
      }
    }, 20000);
  }

  getnorthToSouth(): Observable<number> {
    return this.northToSouth;
  }

  geteastToWest(): Observable<number> {
    return this.eastToWest;
  }
  getnorthToSouthAfterPass(): Observable<number> {
    return this.northToSouthAfterNow;
  }

  getEastToWestTraffiAfterPass(): Observable<number> {
    return this.eastToWestAfterNow;
  }

  getnorthToSouthBetweenPass(): Observable<number> {
    return this.northToSouthBetween;
  }

  geteastToWestBetweenPass(): Observable<number> {
    return this.eastToWestBetween;
  }

  getlightState(): Observable<string> {
    return this.lightState.asObservable();
  }

  public processCars() {
    this.subscriptions.add(
      interval(2000).subscribe(() => {
        if (this.lightState.value === 'north-south' && this.northToSouth.value > 0) {
          this.northToSouth.next(this.northToSouth.value - 1);
        } else if (this.lightState.value === 'east-west' && this.eastToWest.value > 0) {
          this.eastToWest.next(this.eastToWest.value - 1);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
