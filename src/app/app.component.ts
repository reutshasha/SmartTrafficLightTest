import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TrafficLight';

  CurrentLightNS = 'green';
  CurrentLightEW = 'red';

  handleLightChange(newValue:any){
    console.log('Current Light:', newValue);

    this.handleLightChange1(newValue);
  }
  handleLightChange1(newValue: {
    lightStateNS: string;
    lightStateEW: string;
  }) {
    this.CurrentLightNS = newValue.lightStateNS;
    this.CurrentLightEW = newValue.lightStateEW;
  }

  junctionTrafficNS = { before: [], between: [], after: [] };
  junctionTrafficEW = { before: [], between: [], after: [] };

  getJunctionNS = () => this.junctionTrafficNS;
  setjunctionTrafficNS = (newTraffic: any) =>
    (this.junctionTrafficNS = newTraffic);

  getJunctionEW = () => this.junctionTrafficEW;
  setjunctionTrafficEW = (newTraffic: any) =>
    (this.junctionTrafficEW = { ...newTraffic });
}
