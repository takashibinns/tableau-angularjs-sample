import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableauEmbeddedVizComponent } from './tableau-embedded-viz/tableau-embedded-viz.component';
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
    component: TableauEmbeddedVizComponent,
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
