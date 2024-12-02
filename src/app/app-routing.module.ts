import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'completed-tickets',
    loadChildren: () => import('./completed-tickets/completed-tickets.module').then( m => m.CompletedTicketsPageModule)
  },
  {
    path: 'accepted-tickets',
    loadChildren: () => import('./accepted-tickets/accepted-tickets.module').then( m => m.AcceptedTicketsPageModule)
  },
  {
    path: 'add-ticket',
    loadChildren: () => import('./add-ticket/add-ticket.module').then( m => m.AddTicketPageModule)
  },
  {
    path: 'add-ticket/:ticketNum',
    loadChildren: () => import('./add-ticket/add-ticket.module').then( m => m.AddTicketPageModule)
  },
  {
    path: 'edit-ticket/:ticketNum',
    loadChildren: () => import('./edit-ticket/edit-ticket.module').then( m => m.EditTicketPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
