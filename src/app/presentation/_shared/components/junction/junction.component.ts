import { Component, OnInit } from '@angular/core';
import { TrafficService } from 'src/app/core/services/traffic.service';

@Component({
  selector: 'app-junction',
  templateUrl: './junction.component.html',
  styleUrls: ['./junction.component.scss']
})
export class JunctionComponent implements OnInit {
  northSouthQueue$ = this.trafficService.northSouthQueue;
  eastWestQueue$ = this.trafficService.eastWestQueue;
  eastWestQueue = this.trafficService.eastWestQueue;

  lightDirection$ = this.trafficService.lightDirection;

  constructor(private trafficService: TrafficService) {}

  ngOnInit(): void {}
}