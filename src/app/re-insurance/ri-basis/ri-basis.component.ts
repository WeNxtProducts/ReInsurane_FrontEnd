import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { ReInsuranceService } from '../../service/re-insurance.service';
import { map, take, takeUntil } from 'rxjs';
import { DashboardData } from '../../interface/dashboardInterface';
import { UnSubscriber } from '../../const-ts/un-subscriber';

@Component({
  selector: 'app-ri-basis',
  templateUrl: './ri-basis.component.html',
  styleUrl: './ri-basis.component.scss',
})
export class RiBasisComponent extends UnSubscriber implements OnInit {
  facForm: FormGroup;
  partcipantForm: FormGroup;
  taxForm: FormGroup;
  commissionForm: FormGroup;
  activePanelIndex: number | null = null;
  activaPanel: number | null = null;
  taxActivePanel: number | null = null;
  commissionActivePanel: number | null = null;
  riBtn: boolean = true;
  selectPolicy: string = 'Policy';
  selectedTabIndex: number = 0;
  presentAllRisk: boolean = false;
  isSinglePlacement: boolean = false;
  placeWiseAct: boolean = false;
  loadingCheck: boolean = false;
  tabs: string[] = ['select 1', 'select 2'];

  currencies: string[] = ['Local Currency: T2', 'Foreign Currency: T2'];

  facBasic: string[] = ['Policy', 'Risk'];

  securityOption = [{ value: 'Yes' }, { value: 'No' }];

  placeWise = [{ value: 'Yes' }, { value: 'No' }];
  partcipantCode = [
    { value: 'partcipant code 1' },
    { value: 'partcipant code 2' },
  ];
  commissionCodes = [{ value: 'Comm Code 1' }, { value: 'Comm Code 2' }];
  commissionTypes = [{ value: 'Type 1' }, { value: 'Type 2' }];
  taxCodes = [{ value: 'Tax Code 1' }, { value: 'Tax Code 2' }];
  taxTypes = [{ value: 'Tax Type 1' }, { value: 'Tax Type 2' }];

  constructor(
    private fb: FormBuilder,
    private reInsuranceSer: ReInsuranceService
  ) {
    super();
    this.facForm = this.fb.group({
      facPlacements: this.fb.array([this.createFacPlacementControls()]),
    });

    this.partcipantForm = this.fb.group({
      partcipantData: this.fb.array([this.createPartcipantControl()]),
    });

    this.taxForm = this.fb.group({
      taxData: this.fb.array([this.createTaxControl()]),
    });

    this.commissionForm = this.fb.group({
      commissionData: this.fb.array([this.createCommissionControl()]),
    });
  }

  ngOnInit(): void {
    this.loadingCheck = true;
    this.reInsuranceSer
      .getDashboard()
      .pipe(
        map((x: DashboardData[]) => x),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (data: DashboardData[]) => {
          console.log(data);
          this.loadingCheck = false;
        },
        (error) => {
          console.log(error);
          this.loadingCheck = false;
        }
      );
  }

  createFacPlacementControls(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), // security
      new FormControl('', Validators.required), // placeWiseSort
      new FormControl('', Validators.required), // si
      new FormControl('', Validators.required), // facRate
      new FormControl('', Validators.required), // facSi
      new FormControl('', Validators.required), // premium
      new FormControl('', Validators.required), // facPremium
    ]);
  }

  createPartcipantControl(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), //facPlacement number
      new FormControl('', Validators.required), // partcipant code
      new FormControl('', Validators.required), // Broker code
      new FormControl('', Validators.required), // partcipant percentage
      new FormControl('', Validators.required), // si
      new FormControl('', Validators.required), // premium
      new FormControl('', Validators.required), // overPremium
    ]);
  }

  createTaxControl(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), // Tax Code
      new FormControl('', Validators.required), // Tax Type
      new FormControl('', Validators.required), // Tax Percentage
      new FormControl('', Validators.required), // Tax Amount
    ]);
  }

  createCommissionControl(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), // Commission code
      new FormControl('', Validators.required), // Commission Type
      new FormControl('', Validators.required), //Commission Percentage
      new FormControl('', Validators.required), //Commission Amount
    ]);
  }

  get facPlacements(): FormArray {
    return this.facForm.get('facPlacements') as FormArray;
  }
  get partcipantData(): FormArray {
    return this.partcipantForm.get('partcipantData') as FormArray;
  }

  get taxData(): FormArray {
    return this.taxForm.get('taxData') as FormArray;
  }

  get commissionData(): FormArray {
    return this.commissionForm.get('commissionData') as FormArray;
  }

  addFacPlacement() {
    this.facPlacements.push(this.createFacPlacementControls());
    this.activePanelIndex = this.facPlacements.length - 1;
  }

  addPartcipant() {
    this.partcipantData.push(this.createPartcipantControl());
    this.activaPanel = this.partcipantData.length - 1;
  }

  addTaxForm() {
    this.taxData.push(this.createTaxControl());
    this.taxActivePanel = this.taxData.length - 1;
  }

  addCommissionsFrom() {
    this.commissionData.push(this.createCommissionControl());
    this.commissionActivePanel = this.commissionData.length - 1;
  }

  submitForm() {
    console.log(this.facForm.value);
    let placementFormControl = this.facForm.value.facPlacements.map(
      (placement: any) => ({
        placementNumber: placement[0],
        si: placement[1],
        premium: placement[2],
        facRate: placement[3],
        facSi: placement[4],
        facPremium: placement[5],
        security: placement[6],
      })
    );
    // this.facForm.reset();
    console.log(placementFormControl);
  }

  partcipantSubmitForm() {
    let partcipantFormControl = this.partcipantForm.value.partcipantData.map(
      (data: any) => ({
        facPlacementNumber: data[0],
        partcipantCode: data[1],
        brokerCode: data[2],
        partcipantPernt: data[3],
        si: data[4],
        premium: data[5],
        overPremium: data[6],
      })
    );
    console.log(partcipantFormControl, 'part');
  }

  commissionFormSubmit() {
    let commissionFormControl = this.commissionForm.value.commissionData.map(
      (item: any) => ({
        commissionCode: item[0],
        commissionType: item[1],
        commissionPernt: item[2],
        commissionAmount: item[3],
      })
    );
    console.log(commissionFormControl, 'commissionForm');
  }

  taxFormSubmit() {
    let taxFormControl = this.taxForm.value.taxData.map((form: any) => ({
      taxCode: form[0],
      taxType: form[1],
      taxPernt: form[2],
      taxAmount: form[3],
    }));

    console.log(taxFormControl, 'taxFormControl');
  }

  facPlacementBtn() {
    this.riBtn = !this.riBtn;
  }

  onPanelOpenFacPlacement(index: number) {
    this.activePanelIndex = index;
  }
  onpanelOpen(idx: number) {
    this.activaPanel = idx;
  }

  taxPanelOpen(idx: number) {
    this.taxActivePanel = idx;
  }
  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  commissionPanelOpen(idx: number) {
    this.commissionActivePanel = idx;
  }

  closePanelFacPlacement(idx: number) {
    this.activePanelIndex -= 1;
    if (this.facPlacements.length > 1) {
      this.facPlacements.removeAt(idx);
    }
  }

  closePanelPartcipant(idx: number) {
    this.activaPanel -= 1;
    if (this.partcipantData.length > 1) {
      this.partcipantData.removeAt(idx);
    }
  }

  closeCommissions(idx: number) {
    this.commissionActivePanel -= 1;
    if (this.commissionData.length > 1) {
      this.commissionData.removeAt(idx);
    }
  }
  closeTaxForm(idx: number) {
    this.taxActivePanel -= 1;
    if (this.taxData.length > 1) {
      this.taxData.removeAt(idx);
    }
  }
  singlePlacementMethod() {
    console.log(this.facPlacements.value)
   if(this.isSinglePlacement){
    
   }

  }
}
