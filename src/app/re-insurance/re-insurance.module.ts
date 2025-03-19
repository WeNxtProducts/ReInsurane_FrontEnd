import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReInsuranceRoutingModule } from './re-insurance-routing.module';
import { ReInsuranceComponent } from './re-insurance.component';
import { RiBasisComponent } from './ri-basis/ri-basis.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ApprovalStatusComponent } from './approval-status/approval-status.component';

@NgModule({
  declarations: [
    ReInsuranceComponent,
    RiBasisComponent,
    ConfirmDialogComponent,
    ApprovalStatusComponent
  ],
  imports: [
    CommonModule,
    ReInsuranceRoutingModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ReInsuranceModule { }
