import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedTicketsPage } from './completed-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedTicketsPageRoutingModule {}
