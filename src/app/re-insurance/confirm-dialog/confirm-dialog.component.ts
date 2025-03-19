import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReInsuranceService } from '../../service/re-insurance.service';
import { take, takeUntil, finalize } from 'rxjs';
import { UnSubscriber } from '../../const-ts/un-subscriber';
import {ApprovalStatusComponent} from '../approval-status/approval-status.component'
import moment from 'moment'

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent extends UnSubscriber {
  loadingCheck = false;
  date = moment(new Date()).format("DD/MM/YYYY");
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private reInsuranceSer : ReInsuranceService,
    private dialog : MatDialog
  ) {
    super()
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  onConfirm(): void {
    this.reInsuranceSer.getApprove(this.data).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
      this.dialogRef.close(true);
      this.dialog.open(ApprovalStatusComponent,{
        data: data
      })
    },error:(err)=>{
      this.dialogRef.close(true);
    }})
  }

}
