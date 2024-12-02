import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcceptedTicketsPage } from './accepted-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptedTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptedTicketsPageRoutingModule {}
