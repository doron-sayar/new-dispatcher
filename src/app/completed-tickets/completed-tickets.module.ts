import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedTicketsPageRoutingModule } from './completed-tickets-routing.module';

import { CompletedTicketsPage } from './completed-tickets.page';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedTicketsPageRoutingModule,
    HeaderComponent
  ],
  declarations: [
    CompletedTicketsPage,
  ]
})
export class CompletedTicketsPageModule {}
