import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './presentation/angular-material.module';
import { TrafficLightComponent } from './presentation/_shared/components/traffic-light/traffic-light.component';
import { JunctionComponent } from './presentation/_shared/components/junction/junction.component';
import { CarComponent } from './presentation/_shared/components/car/car.component';
import { TrafficService } from './core/services/traffic.service';
import { MatIconModule } from '@angular/material/icon';
import { NumberToArrayPipe } from './presentation/number-to-array.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TrafficLightComponent,
    JunctionComponent ,
    CarComponent,
    NumberToArrayPipe
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    //AngularMaterialModule,

  ],
  providers: [TrafficService],
  bootstrap: [AppComponent]
})
export class AppModule { }
