import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableauEmbededVizComponent } from './tableau-embeded-viz/tableau-embeded-viz.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardCardsComponent } from './dashboard-cards/dashboard-cards.component';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
