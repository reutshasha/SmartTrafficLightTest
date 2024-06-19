import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, switchMap, tap, timer } from 'rxjs';
import { TrafficService } from 'src/app/core/services/traffic.service';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss']
})
export class TrafficLightComponent implements OnInit, OnDestroy {

  @Input() direction!: 'north-south' | 'east-west';
  @Input() initialState!: any;

  lightDirection$: Observable<'north-south' | 'east-west'> | undefined;
  lightState: 'red' | 'yellow' | 'green' | 'flash-green' = 'green';
  cars$!: Observable<any>;
  // carsNorthSouth: number = 0;
  // carsWestEast: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(private trafficService: TrafficService) {}

  ngOnInit(): void {

    //TODO : DELTE initialState
    this.lightState = this.initialState;
    this.lightDirection$ = this.trafficService.lightDirection;
    this.cars$ = this.direction === 'north-south' ? this.trafficService.northSouthQueue : this.trafficService.eastWestQueue;

    // // // Subscribe to lightDirection$ changes to update lightState
    // this.subscriptions.push(
    //   this.lightDirection$.subscribe(direction => {
    //     if (this.direction === direction) {
    //       this.changeLightState();
    //     } else {
    //       this.lightState = 'red';
    //     }
    //   })
    // );

    // Automatically handle state changes based on lightState

    this.subscriptions.push(
      this.trafficService.lightState$.subscribe(state => {
        this.lightState = state[this.direction];
        // console.log(`Light state for ${this.direction}:`, this.lightState);
      })
    );

    // Start observing cars and handle subscriptions
    this.startObservingCars();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private changeLightState(): void {
    console.log('changeLightState():');
    console.log('Light state:', this.lightState);  
    if (this.lightState === 'green') {
    // Switch to yellow after 2.5 seconds of green
    timer(2500).pipe(
      tap(() => {
        this.lightState = 'flash-green';
      }),
      
      switchMap(() => timer(5000).pipe(
        tap(() => {
          this.lightState = 'yellow';
        }),
        switchMap(() => timer(2000).pipe(
          tap(() => {
            this.lightState = 'red';
          })
        ))
      ))
    ).subscribe(); 
  }else if (this.lightState === 'red') {
      // Switch to green directly
      timer(5000).pipe(
        tap(() => {
          this.lightState = 'yellow';
        }),)
      timer(3000).pipe(
        tap(() => {
          this.lightState = 'green';
          //this.changeLightState(); // Restart the cycle
        })
      ).subscribe();
    }   
  }

  private startObservingCars(): void {
    // Example subscription to cars$ (you can adjust this based on your actual implementation)
    this.subscriptions.push(
      this.cars$.subscribe(cars => {
        console.log('Current cars:', cars);
      })
    );
  }

  // updateServiceState() {
  //   if (this.direction === 'north-south') {
  //     this.trafficService.setNorthSouthState(this.lightState);
  //   } else {
  //     this.trafficService.setEastWestState(this.lightState);
  //   }
  // }
}

