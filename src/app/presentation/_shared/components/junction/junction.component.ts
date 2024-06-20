import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ManageQueueService } from 'src/app/core/services/manage-queue.service';
import { TrafficService } from 'src/app/core/services/traffic.service';
import { CarQueue } from 'src/app/data/models/CarQueue';
import { addTraffic } from '../../utilities/utils';

@Component({
  selector: 'app-junction',
  templateUrl: './junction.component.html',
  styleUrls: ['./junction.component.scss'],
  providers: [ManageQueueService, TrafficService],
})
export class JunctionComponent implements OnInit {

  carsManageQueueService!: ManageQueueService;
  carsQueue: CarQueue = { before: [], between: [], after: [] };
  interval: any;

  @Input() junctionDirection!: string;
  @Input() junctionPart!: string;
  @Input() CurrentLight!: string;
  @Output() carsQueueChange: EventEmitter<CarQueue> = new EventEmitter<CarQueue>();
  @Input() getJunctionTraffic!: () => any;
  @Input() setJunctionTraffic!: (newTraffic: any) => void;

  constructor() {
    this.interval = 0;
  }

  ngOnInit() {
    this.carsQueue = this.getJunctionTraffic();
    this.carsManageQueueService = new ManageQueueService(
      this.carsQueue,
      this.setJunctionTraffic
    );

    addTraffic(
      this.junctionDirection,
      this.carsQueue,
      this.carsManageQueueService,
      this.getJunctionTraffic,
      this.setJunctionTraffic,
      () => {
        this.emitCarsQueue();
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['CurrentLight'].previousValue) {
      if (
        changes['CurrentLight'].previousValue !== 'undefined' &&
        changes['CurrentLight'].previousValue !== changes['CurrentLight'].currentValue
      ) {
        console.log('CurrentLight has changed:', this.CurrentLight);
        this.clearTrafficInterval();
        this.setupTrafficInterval();
      }
    }
  }

  private setupTrafficInterval() {
    if (this.CurrentLight !== 'yellow') {
      this.interval = setInterval(() => {
        if (this.CurrentLight === 'green') {
          if (this.carsQueue.before.length > 0) {
            this.carsManageQueueService.beforQueueFirst();
            this.setJunctionTraffic(this.carsQueue);
            this.emitCarsQueue();
            this.carsManageQueueService.betweenQueueFirst();
            this.setJunctionTraffic(this.carsQueue);
            this.emitCarsQueue();
            setTimeout(() => {
              this.carsManageQueueService.betweenQueueSecond();
              this.setJunctionTraffic(this.carsQueue);
              this.emitCarsQueue();
              this.carsManageQueueService.afterQueueFirst();
              this.setJunctionTraffic(this.carsQueue);
              this.emitCarsQueue();
              this.removeOldCarsThatPassed();
            }, 2000);
          }
        }
      }, 1000);
    }
  }

  
  emitCarsQueue() {
    this.carsQueueChange.emit(this.carsQueue);
  }

  private removeOldCarsThatPassed(): void {
    setTimeout(() => {
      this.carsManageQueueService.afterQueueFirst();
    }, 20000);
  }

  private clearTrafficInterval() {
    clearInterval(this.interval);
  }
}