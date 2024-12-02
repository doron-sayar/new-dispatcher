import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTicketPageRoutingModule } from './edit-ticket-routing.module';

import { EditTicketPage } from './edit-ticket.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTicketPageRoutingModule,
  ],
  declarations: [EditTicketPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditTicketPageModule {}
