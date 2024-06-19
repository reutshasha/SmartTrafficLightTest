import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription, of, timer, combineLatest } from 'rxjs';
import { switchMap, tap, concatMap, delay, takeWhile, filter } from 'rxjs/operators';

type LightDirection = 'north-south' | 'east-west';
type LightState = 'red' | 'yellow' | 'green' | 'flash-green';

@Injectable({
  providedIn: 'root'
})
export class TrafficService implements OnDestroy {

  // TODO : i change to public make sure no mistakes
  private northSouthQueueSubject = new BehaviorSubject<any>({ northSouth: [] });
  private eastWestQueueSubject = new BehaviorSubject<any>({ eastWest: [] });

  public northSouthState = new BehaviorSubject<string>('green');
  public eastWestState = new BehaviorSubject<string>('green');
  public northSouthQueue = new BehaviorSubject<number>(0);
  public eastWestQueue = new BehaviorSubject<number>(0);
  private lightStateSubject = new BehaviorSubject<{ [key: string]: 'red' | 'yellow' | 'green' | 'flash-green' }>({
    'north-south': 'green',
    'east-west': 'red'
  });

  // public northSouthQueue$ = this.northSouthQueueSubject.asObservable();
  // public eastWestQueue$ = this.eastWestQueueSubject.asObservable();

  // northSouthState$ = this.northSouthState.asObservable();
  // eastWestState$ = this.eastWestState.asObservable();
  northSouthQueue$ = this.northSouthQueue.asObservable();
  eastWestQueue$ = this.eastWestQueue.asObservable();
  public lightState$ = this.lightStateSubject.asObservable();


  lightDirection = new BehaviorSubject<LightDirection>('north-south');
  // lightState = new BehaviorSubject<LightState>('red');

  private isFlashing = new BehaviorSubject<boolean>(false);

  private subscriptions: Subscription = new Subscription();


  constructor() {
    this.startGeneratingCars();
    //this.startLightSwitching();
    // this.processCars();

    this.startTrafficLightCycle();

    this.processCars();


    this.simulateTrafficUpdates();
  }
  private startGeneratingCars() {
    this.subscriptions.add(
      interval(this.getRandomInterval()).subscribe(() => {
        console.log(`Added car to northSouth queue: ${this.northSouthQueue.value}`);

        this.northSouthQueue.next(this.northSouthQueue.value + 1);
      })
    );

    this.subscriptions.add(
      interval(this.getRandomInterval()).subscribe(() => {
        console.log(`Added car to east-west queue: ${this.eastWestQueue.value}`);

        this.eastWestQueue.next(this.eastWestQueue.value + 1);
      })
    );
  }

  private getRandomInterval(): number {
    return Math.random() * (30000 - 10000) + 10000;
  }

  private startTrafficLightCycle(): void {

    combineLatest([
      this.northSouthQueue,
      this.eastWestQueue,
      this.lightStateSubject

    ]).pipe(
      filter(([northQueue, eastQueue, lightState]) => {
        console.log('northQueue ', northQueue + ' + eastQueue ', eastQueue + ' +lightState ', lightState);
        return (lightState['north-south'] === 'green' && northQueue > 0) ||
          (lightState['east-west'] === 'green' && eastQueue > 0);
      }),
      switchMap(([northQueue, eastQueue, lightState]) => {
        if (lightState['north-south'] === 'green') {
          return timer(5000).pipe(
            tap(() => this.setLightState('north-south', 'flash-green')),
            switchMap(() => timer(3000)),
            tap(() => this.setLightState('north-south', 'yellow')),
            switchMap(() => timer(2000)),
            tap(() => this.setLightState('north-south', 'red')),
            switchMap(() => timer(1000)),
            tap(() => this.setLightState('east-west', 'green')),
            tap(() => this.reduceQueueWhileGreen('east-west'))
          );
        } else {
          return timer(5000).pipe(
            tap(() => this.setLightState('east-west', 'yellow')),
            switchMap(() => timer(2000)),
            tap(() => this.setLightState('east-west', 'red')),
            switchMap(() => timer(1000)),
            tap(() => this.setLightState('north-south', 'green')),
            tap(() => this.reduceQueueWhileGreen('north-south'))
          );
        }
      })
    ).subscribe(() => {
      this.startTrafficLightCycle(); // Restart the cycle
    });
  }


  private setLightState(direction: 'north-south' | 'east-west', state: 'red' | 'yellow' | 'green' | 'flash-green'): void {
    const currentState = this.lightStateSubject.value;
    currentState[direction] = state;
    this.lightStateSubject.next(currentState);
  }

  private reduceQueueWhileGreen(direction: 'north-south' | 'east-west'): void {
    console.log('reduceQueueWhileGreen +direction' + direction)

    interval(2000).pipe(
      takeWhile(() => this.lightStateSubject.value[direction] === 'green'),

      tap(() => this.reduceQueue(direction))
    ).subscribe();
  }
  private reduceQueue(direction: LightDirection): void {
    if (direction === 'north-south' && this.northSouthQueue.value > 0) {

      this.northSouthQueue.next(this.northSouthQueue.value - 1);
      console.log(`reduceQueue car in north-west, queue is now ${this.eastWestQueue.value}`);

    } else if (direction === 'east-west' && this.eastWestQueue.value > 0) {
      console.log('reduceeeeee direction : ' + direction + ' car in north-south, queue is now ${this.northSouthQueue.value}');

      this.eastWestQueue.next(this.eastWestQueue.value - 1);
      console.log(`reduceQueue car in east-west, queue is now ${this.eastWestQueue.value}`);

    }
  }


  public processCars() {
    this.subscriptions.add(
      //TODO: afer 2 seconds delete one car
      interval(2000).subscribe(() => {
        if (this.lightDirection.value === 'north-south' && this.northSouthQueue.value > 0) {
          this.northSouthQueue.next(this.northSouthQueue.value - 1);

        } else if (this.lightDirection.value === 'east-west' && this.eastWestQueue.value > 0) {
          this.eastWestQueue.next(this.eastWestQueue.value - 1);
          console.log(`Processed car in east-west, queue is now ${this.eastWestQueue.value}`);

        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    // this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private startLightSwitching() {
    this.subscriptions.add(
      interval(1000).subscribe(() => {
        const currentDirection = this.lightDirection.value;
        const northSouthQueueLength = this.northSouthQueue.value;
        const eastWestQueueLength = this.eastWestQueue.value;

        if (
          (currentDirection === 'north-south' && northSouthQueueLength === 0 && eastWestQueueLength > 0) ||
          (currentDirection === 'east-west' && eastWestQueueLength === 0 && northSouthQueueLength > 0)
        ) {
          const newDirection = currentDirection === 'north-south' ? 'east-west' : 'north-south';
          this.lightDirection.next(newDirection);
        }
      })
    );
  }

  private generateRandomQueue(): any[] {
    const randomSize = Math.floor(Math.random() * 10); // Generate random queue size (0-9)
    const queue = [];
    for (let i = 0; i < randomSize; i++) {
      queue.push(`Car ${i + 1}`);
    }
    return queue;
  }

  
  // // Simulate traffic updates
  private simulateTrafficUpdates(): void {
    setInterval(() => {
      const northSouthQueue = this.generateRandomQueue();
      console.log('northSouthQueue', northSouthQueue);
      const eastWestQueue = this.generateRandomQueue();
      console.log('eastWestQueue', eastWestQueue);
      this.setNorthSouthQueue(northSouthQueue);
      this.setEastWestQueue(eastWestQueue);
    }, 6000);
  }
  // Method to set north-south queue
  public setNorthSouthQueue(queue: any[]): void {
    this.northSouthQueueSubject.next({ northSouth: queue });
  }

  // Method to set east-west queue
  public setEastWestQueue(queue: any[]): void {
    this.eastWestQueueSubject.next({ eastWest: queue });
  }

}



