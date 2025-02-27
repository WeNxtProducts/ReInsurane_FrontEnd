import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReInsuranceComponent } from './re-insurance.component';
import { RiBasisComponent } from './ri-basis/ri-basis.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/dashboard',
    pathMatch:'full'
  },
  {
    path:'dashboard',
    component: ReInsuranceComponent,
    children:[
      {
        path:'',
        redirectTo:'/dashboard/ri-basis',
        pathMatch:'full'
      },
      {
        path:'ri-basis',
        component:RiBasisComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReInsuranceRoutingModule { }
