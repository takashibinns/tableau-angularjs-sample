import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableauEmbededVizComponent } from './tableau-embeded-viz/tableau-embeded-viz.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardCardsComponent } from './dashboard-cards/dashboard-cards.component';

import {LoginGuard} from './login.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginPageComponent,
  },
  { 
    path: 'home', 
    component: DashboardCardsComponent,
    canActivate: [LoginGuard]
  },
  { 
    path: 'dashboard/:id', 
    component: TableauEmbededVizComponent,
    canActivate: [LoginGuard]
  },
  { 
    path: '', 
    component: DashboardCardsComponent, 
    pathMatch: 'full',
    canActivate: [LoginGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
