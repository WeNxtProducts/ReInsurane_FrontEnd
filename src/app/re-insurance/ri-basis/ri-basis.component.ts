import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, startWith, take, takeUntil, finalize, tap } from 'rxjs';
import { UnSubscriber } from '../../const-ts/un-subscriber';
import { PolicyDetails } from '../../interface/dashboardInterface';
import { ReInsuranceService } from '../../service/re-insurance.service';
import { CoverDetails } from '../../modal/cover-modal'; 
import {percentageValidator} from '../../validation/percentageValidation'
import { CommonLogicService } from '../../service/common-logic.service';
import { ToastServiceService } from '../../service/toast-service.service';



export const decimalThreeDigitValidator = (control: FormControl): { [key: string]: boolean } | null => {
  const regex = /^-?\d+(?:\.\d{0,3})?$/;
  return control.value && !regex.test(control.value) ? { decimalThreeDigit: true } : null;
};

function percentageValid  (control:FormControl): { [key: string]: boolean } | null  {
  let value = control.value;
  if (value == null || value === '') {
    return null; 
  }
  let numericValue = Number(value); 
  if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
    return null;
  } else {
    return { percentage: true };
  }
}


@Component({
  selector: 'app-ri-basis',
  templateUrl: './ri-basis.component.html',
  styleUrl: './ri-basis.component.scss',
})
export class RiBasisComponent extends UnSubscriber implements OnInit, AfterViewInit {
  facForm: FormGroup;
  partcipantForm: FormGroup;
  taxForm: FormGroup;
  commissionForm: FormGroup;
  policyControl : FormControl;
  facRefNoSelect : FormControl;
  filteredCountry: Observable<any[]>;
  activePanelIndex: number | null = null;
  activaPanel: number | null = null;
  taxActivePanel: number | null = null;
  commissionActivePanel: number | null = null;
  riBtn: boolean = true;
  selectPolicy: string = 'Risk';
  selectedTabIndex: number = 0;
  isPresentAllRisk: boolean = false;
  isSinglePlacement: boolean = false;
  loadingCheck: boolean = false;
  percentageAll:number = 0;
  facPercentage:number = 0;
  percentageValidationToAll :any;
  policyData:PolicyDetails[] = [];
  $policyNo:any;
  policyNoValidation:boolean = false;
  getTablePoloicyData:any;
  facData: any = {};
  singleFacRefNo:number = 0;
  singleFacRate:number = 0;
  public coverDetails = new CoverDetails();

  facRefNo:any[] = [];
  tabs: string[] = [];
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

  // risks = [
  //   [
  //     { id: 1, description: 'Risk 1 Description', expanded: true, currencies: ['USD', 'INR'], covers: [
  //         { id: 1, description: 'Cover 1', cqs: '30%', fac: 10000, tty: '40%', si: 100000, premium: 100000, facSi: 10000000, uwRate: 1, rateYn: true, facRate: 1, facPrem: 3, facPlaceNo: 1 }
  //       ]
  //     }
  //   ],
  //   [
  //     { id: 2, description: 'Risk 2 Description', expanded: false, currencies: ['EUR', 'GBP'], covers: [
  //         { id: 2, description: 'Cover 2', cqs: '25%', fac: 20000, tty: '50%', si: 200000, premium: 200000, facSi: 20000000, uwRate: 2, rateYn: false, facRate: 2, facPrem: 4, facPlaceNo: 2 }
  //       ]
  //     }
  //   ],
  //   [
  //     { id: 3, description: 'Risk 3 Description', expanded: false, currencies: ['JPY', 'AUD'], covers: [
  //         { id: 3, description: 'Cover 3', cqs: '20%', fac: 30000, tty: '60%', si: 300000, premium: 300000, facSi: 30000000, uwRate: 3, rateYn: true, facRate: 3, facPrem: 5, facPlaceNo: 3 }
  //       ]
  //     }
  //   ]
  // ];
risks:any [] = []
  policyNumbers: string[] = [
    "POL-983274",
    "POL-472910",
    "POL-827364",
    "POL-165839",
    "POL-293847",
    "POL-756201",
    "POL-384756",
    "POL-948372",
    "POL-562019",
    "POL-102938",
    "POL-675849",
    "POL-495872",
    "POL-738291",
    "POL-849302",
    "POL-948374",
    "12345"
  ];

  constructor(
    private fb: FormBuilder,
    private reInsuranceSer: ReInsuranceService,
    private commonSer : CommonLogicService,
    private toaster : ToastServiceService
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
    this.policyControl = new FormControl();
    this.filteredCountry = this.policyControl.valueChanges.pipe(
      startWith(''),
      map((item) =>
        item ? this.filtercountry(item) : this.policyNumbers.slice()
      )
    );
  }

  filtercountry(policy: string) {
    let arr = this.policyNumbers.filter(
      (item) => item.toLowerCase().indexOf(policy.toLowerCase()) === 0
    );

    // return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
    return arr.length ? arr : ['No Item found'];

  }

  selectPolicyMethod(event:any){
   this.isPresentAllRisk = event.value == 'Policy' ? true : false;
  }
 
  ngOnInit(): void {
    this.getByRiskById();
    this.facRefNoSelect = new FormControl('')
    if(this.facRefNo.length == 0){
      let $refNo = this.commonSer.validateAndAddNumber();
      this.facRefNo = $refNo;
    }
    let $headerData = JSON.parse(localStorage.getItem('headerData'));
    if(Object.keys($headerData).length > 0){
      this.policyControl.setValue($headerData?.fh_UW_NO);
      this.selectPolicy = $headerData?.fh_BASIS;
      this.facPercentage = $headerData?.fh_FAC_PERC;
      this.isPresentAllRisk = $headerData?.fh_PERC_ALL_RSK_YN ? true : false ;
      this.isSinglePlacement = $headerData?.fh_SINGLE_PLACE ? true : false ;
    }
  }
  trackByFn(index: number, item: any) {
    return item.frc_UR_RSK_ID; 
  }
  selectPolicyNo(policy:string){
    this.$policyNo = policy;
    this.loadingCheck = true;
    this.reInsuranceSer.getDashboard(this.$policyNo).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:(data:any)=>{
      this.policyData = data.data ?? [];
       let policyNo = this.policyData.find((x:any) => x.fh_UW_NO == policy)
      if (policyNo && Object.keys(policyNo).length > 0) {
        this.policyNoValidation = true;
      } else {
        this.policyNoValidation = false;
      }
      this.loadingCheck = false;
    },error:(error)=>{
      this.loadingCheck = false;
      this.toaster.error('Data not found')
    }})
  }

  validationPolicy(event:any){
    let $name  = event.target.value;
    if($name == ''){
      this.policyNoValidation = false;
    }
  }

  sendToDashboardData(){
    const obj = {
      fh_UW_NO: this.$policyNo,
      fh_POL_IDX : 5478,
      fh_END_FMD: '2025-03-06',
      fh_END_TOD: '2025-03-07',
      fh_BASIS: this.selectPolicy, 
      fh_FAC_PERC: this.facPercentage,
      fh_PERC_ALL_RSK_YN: this.isPresentAllRisk ? 1 : 0,
      fh_SINGLE_PLACE: this.isSinglePlacement ? 1 : 0     
  };
      this.loadingCheck = true;
      this.reInsuranceSer.createDashboardData(obj).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:(data:any)=>{
        this.getTablePoloicyData = data.data;
        let $policyId:any = Object.values(this.getTablePoloicyData)
        localStorage.setItem('policyNo' , JSON.stringify($policyId[0]?.risks[0].frc_FH_SYS_ID))
        localStorage.setItem('headerData',JSON.stringify(obj))
        this.tabs = Object.keys(this.getTablePoloicyData).map(item => item)
        this.risks = Object.values(this.getTablePoloicyData)
      },error:(error)=>{
        console.log(error)
      }})
  }

  getByRiskById(){
    this.loadingCheck = true;
    let policyId = JSON.parse(localStorage.getItem('policyNo'))
    if(policyId != null){
      this.reInsuranceSer.getRiskDataById(policyId).pipe(take(1),takeUntil(this.destroy$),finalize(()=>this.loadingCheck = false)).subscribe({next:(data)=>{
        // this.getTablePoloicyData = data.data;
        this.getTablePoloicyData = data;
        this.tabs = Object.keys(this.getTablePoloicyData).map(item => item)
        this.risks = Object.values(this.getTablePoloicyData)
        this.initializeFacData();
      },error:(err)=>{
        console.log(err)
        this.toaster.error('Data not found')
      }})
    }
   
  }
  initializeFacData() {
    for (let tabIndex = 0; tabIndex <= this.tabs.length; tabIndex++) {
      if (!this.facData[tabIndex]) {
        this.facData[tabIndex] = {};
      }
  
      for (let riskIndex = 0; riskIndex <= this.risks[this.selectedTabIndex]['risks'].length ; riskIndex++) {
        if (!this.facData[tabIndex][riskIndex]) {
          this.facData[tabIndex][riskIndex] = {};
        }

        for (let coverIndex = 0; coverIndex <= this.risks[this.selectedTabIndex]['risks'].length; coverIndex++) {
          if (!this.facData[tabIndex][riskIndex][coverIndex]) {
            this.facData[tabIndex][riskIndex][coverIndex] = {
              frc_FAC_RATE: '',
              frc_PLACE_REF_NO: ''
            };
          }
        }
      }
    }
  }
  createFacPlacementControls(): FormArray {
    return this.fb.array([
      // new FormControl('',[ Validators.required]), // facRefNo
      new FormControl('',[ Validators.required]), // placementNumber
      new FormControl('', Validators.required), // si
      new FormControl('', Validators.required), // premium
      // new FormControl('', Validators.required), // facRate
      new FormControl('', Validators.required), // facSi
      new FormControl('', Validators.required), // facPremium
      new FormControl('', Validators.required), // security
      new FormControl('', Validators.required), // Place Wise Accounting
    ]);
  }

  createPartcipantControl(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), // partcipant code
      new FormControl('', Validators.required), // Broker code
      new FormControl('', [Validators.required, percentageValid]), // partcipant percentage
      new FormControl('', Validators.required), // si
      new FormControl('', Validators.required), // premium
      new FormControl('', Validators.required), // overPremium
    ]);
  }

  createTaxControl(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), // Tax Code
      new FormControl('', Validators.required), // Tax Type
      new FormControl('', [Validators.required, percentageValid]), // Tax Percentage
      new FormControl('', Validators.required), // Tax Amount
    ]);
  }

  createCommissionControl(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), // Commission code
      new FormControl('', Validators.required), // Commission Type
      new FormControl('', [Validators.required , percentageValid]), //Commission Percentage
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
        // facRefNo : placement[0],
        placementNumber: placement[0],
        si: placement[1],
        premium: placement[2],
        // facRate: placement[4],
        facSi: placement[3],
        facPremium: placement[4],
        security: placement[5],
        placeWiseAct: placement[6],
      })
    );
    // this.facForm.reset();
    console.log(placementFormControl);
  }

  partcipantSubmitForm() {
    let partcipantFormControl = this.partcipantForm.value.partcipantData.map(
      (data: any) => ({
        partcipantCode: data[0],
        brokerCode: data[1],
        partcipantPernt: data[2],
        si: data[3],
        premium: data[4],
        overPremium: data[5],
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
  singlePlacementVerify() {
   if(this.isSinglePlacement && this.facPlacements.length > 1){
    this.facPlacements.clear();
    this.facPlacements.push(this.createFacPlacementControls());
   }

  }
  updatePercentageToAll(){
  this.percentageValidationToAll =  percentageValidator(this.facPercentage);
    if(this.isPresentAllRisk){
      this.percentageAll = this.facPercentage
    }
  }
  numberGenerator(event: any) {
    let selectedValue = event.value;
    this.facRefNoSelect.setValue(selectedValue)
    if (selectedValue === this.facRefNo[this.facRefNo.length - 1]) {
      let newNumber = this.commonSer.validateAndAddNumber();
      if (newNumber) {
        this.facRefNo = newNumber;
      }
    }
  }

  updateFACPercentage(value: number, tabIndex: number, riskIndex: number, coverIndex: number) {

    this.singleFacRate = value;

    this.percentageValidationToAll =  percentageValidator(value);

    if (value < 0 || value > 100) {
      this.risks[tabIndex]['risks'][riskIndex].covers[coverIndex].frc_FAC_RATE = 0;
    }
  
    if (!this.facData[tabIndex]) {
      this.facData[tabIndex] = {};
    }
  
    if (!this.facData[tabIndex][riskIndex]) {     
      this.facData[tabIndex][riskIndex] = {};
    }
  
    if (typeof this.facData[tabIndex][riskIndex][coverIndex] !== 'object') {
      this.facData[tabIndex][riskIndex][coverIndex] = { frc_FAC_RATE: 0, frc_PLACE_REF_NO: '' };
    }
  
    this.facData[tabIndex][riskIndex][coverIndex].frc_FAC_RATE = value;
  }
  
  
  updateFACRefNo(value: number, tabIndex: number, riskIndex: number, coverIndex: number, item: any) {
    this.singleFacRefNo = value;
  
    if (!this.facData[tabIndex]) {
      this.facData[tabIndex] = {};
    }
  
    if (!this.facData[tabIndex][riskIndex]) {
      this.facData[tabIndex][riskIndex] = {};
    }
  
    if (typeof this.facData[tabIndex][riskIndex][coverIndex] !== 'object') {
      this.facData[tabIndex][riskIndex][coverIndex] = { frc_FAC_RATE: 0, frc_PLACE_REF_NO: '' };
    }
  
    this.facData[tabIndex][riskIndex][coverIndex].frc_PLACE_REF_NO = value;
    
    this.facData[tabIndex][riskIndex][coverIndex].frc_SYS_ID = item?.frc_SYS_ID;
  }

 
  
  

saveAllCovers() {

  let obj:any[] = Object.values(this.facData).flatMap(risk =>
    Object.values(risk).flatMap(item => Object.values(item))
  );
  obj = obj.filter(item => item?.frc_FAC_RATE != '' && item?.frc_PLACE_REF_NO != '');
  this.loadingCheck = true;
  this.reInsuranceSer.updateBulkCover(obj).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:(data)=>{
    console.log(data)
  },error:(error)=>{
    console.log(error)
  }})
}

singleCoverUpdate(item:any){
  const obj:any = {
    frc_FAC_RATE: this.singleFacRate,
    frc_PLACE_REF_NO: this.singleFacRefNo,
    frc_SYS_ID: item?.frc_SYS_ID
  };

  this.loadingCheck = true;
  this.reInsuranceSer.updateSingleCover(obj).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:(data)=>{
    console.log(data)
  },error:(error)=>{
    console.log(error)
  }})

}

ngAfterViewInit(): void {
  setTimeout(() => {
    this.risks.forEach((tab, tabIndex) => {
      tab.risks.forEach((risk: any, riskIndex: number) => {
        risk.expanded = tabIndex === this.selectedTabIndex && riskIndex === 0; 
      });
    });
  });
  
 }
}