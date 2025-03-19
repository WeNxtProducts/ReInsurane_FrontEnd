import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReInsuranceService } from '../../service/re-insurance.service';

@Component({
  selector: 'app-approval-status',
  templateUrl: './approval-status.component.html',
  styleUrl: './approval-status.component.scss'
})
export class ApprovalStatusComponent {

  constructor(
    public dialogRef: MatDialogRef<ApprovalStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reInsurance : ReInsuranceService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
    this.reInsurance.isShow.next(true);
    localStorage.clear();
  }

}
