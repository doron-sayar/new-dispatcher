import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcceptedTicketsPageRoutingModule } from './accepted-tickets-routing.module';

import { AcceptedTicketsPage } from './accepted-tickets.page';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcceptedTicketsPageRoutingModule,
    HeaderComponent
  ],
  declarations: [
    AcceptedTicketsPage,
    ]
})
export class AcceptedTicketsPageModule {}
