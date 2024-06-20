import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subscription, switchMap, tap, timer } from 'rxjs';
import { TrafficService } from 'src/app/core/services/traffic.service';
import { CarQueue } from 'src/app/data/models/CarQueue';

const cycleTime = 15000;
const yellowTime = 2500;
const redTimeMin = 6000;

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss']
})

export class TrafficLightComponent implements OnInit {

  @Input() direction!: 'north-south' | 'east-west';
  @Input() initialState!: any;

  @Output() lightChanged: EventEmitter<any> = new EventEmitter<any>();
  lightStateNS!: string;
  lightStateEW!: string;

  carsQueueNS: CarQueue = { before: [], between: [], after: [] };
  carsQueueEW: CarQueue = { before: [], between: [], after: [] };


  @Input() getJunctionNS!: () => any;
  @Input() getJunctionEW!: () => any;

  get attribute(): any {
    return this.attribute;
  }


  constructor() { }

  ngOnInit(): void {
    //
    this.carsQueueNS = this.getJunctionNS();
    this.carsQueueEW = this.getJunctionEW();
    this.startTrafficLight();

  }

  private startTrafficLight(): void {

    this.manageTrafficLight(cycleTime);
    setInterval(() => {
      this.manageTrafficLight(cycleTime);
    }, cycleTime);
  }

  private manageTrafficLight(cycleTime: number): void {
    this.carsQueueNS = this.getJunctionNS();
    this.carsQueueEW = this.getJunctionEW();
    const greenTime = this.totalGreenTime(cycleTime);

    const remainingTime = (cycleTime - greenTime - 2) * yellowTime;
    const redTime = Math.max(remainingTime, redTimeMin);

    this.changeLightState('green');
    setTimeout(() => {
      this.changeLightState('yellow');
      setTimeout(() => {
        this.changeLightState('red');
        setTimeout(() => {
          this.changeLightState('yellow');
        }, redTime);
      }, yellowTime);
    }, greenTime);
  }

  private totalGreenTime(cycleTime: number): number {

    const totalCarNorthToSouth = this.carsQueueNS.before.length + this.carsQueueNS.after.length + this.carsQueueNS.between.length;
    const totalCarEastToWest = this.carsQueueEW.before.length + this.carsQueueEW.after.length + this.carsQueueEW.between.length;

    const totalCarsNorthCurrent = this.carsQueueNS.before.length;
    const totalCarsEastCurrent = this.carsQueueEW.before.length;

    console.log('Amount cars NorthToSouth', totalCarNorthToSouth);
    console.log('Amount cars EastToWest', totalCarNorthToSouth);

    if (totalCarsNorthCurrent !== 0 && totalCarsEastCurrent !== 0) {
      const greenRedRatio = Math.min(
        totalCarsEastCurrent / totalCarsNorthCurrent,
        2
      );
      return Math.max(
        Math.round(((cycleTime - 2 * yellowTime) / 2) * greenRedRatio),
        5000
      );
    } else {
      return (cycleTime - 2 * yellowTime) / 2;
    }
  }

  changeLightState(value: any) {
    console.log('first traffic changeLightState', value);

    this.lightStateNS = value;
    switch (value) {
      case 'red':
        this.lightStateEW = 'green';
        break;
      case 'green':
        this.lightStateEW = 'red';
        break;
      case 'yellow':
        this.lightStateEW = value;
        break;
      default:
        break;
    }

    this.lightChanged.emit({
      lightStateEW: this.lightStateEW,
      lightStateNS: this.lightStateNS,
    });
  }
}

