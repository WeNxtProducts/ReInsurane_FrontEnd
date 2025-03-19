import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { elementAt, filter, finalize, forkJoin, map, Observable, startWith, switchMap, take, takeUntil } from 'rxjs';
import { UnSubscriber } from '../../const-ts/un-subscriber';
import { PolicyDetails, PlacementDetail, GetDashoboard } from '../../interface/dashboardInterface';
import { CommonLogicService } from '../../service/common-logic.service';
import { ReInsuranceService } from '../../service/re-insurance.service';
import { ToastServiceService } from '../../service/toast-service.service';
import { percentageValidator } from '../../validation/percentageValidation';
import { MatDialog } from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component'


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
export class RiBasisComponent extends UnSubscriber implements OnInit {
  facForm: FormGroup;
  participantForm: FormGroup;
  taxForm: FormGroup;
  commissionForm: FormGroup;
  policyControl : FormControl;
  facRefNoSelect : FormControl;
  filteredPolicy: Observable<any[]>;
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
  getTablePolicyData :any;
  facData: any = {};
  singleFacRefNo:number = 0;
  singleFacRate:number = 0;
  isProcess:boolean = false;
  getPlacement:PlacementDetail[] = [];
  getHeaderData:any;
  risks:any [] = []
  policyNumbers: string[] = [];
  isSaveAll:boolean = false;
  participantCode:any[] = []
  brokerCode:any[] = [];
  commission:any[] = [];
  tax:any[] = [];
  $fpSysId:any = null;
  $fpcSysId:any = null;
  $ftSysId:any = null;
  isParticipant = true;
  isCommission = true;
  isTax = true;
  $overPremiumAmt:any = null;
  isHide:boolean = false
  // public coverDetails = new CoverDetails();
 

  facRefNo:any[] = [];
  tabs: string[] = [];
  facBasic: string[] = ['Policy', 'Risk'];
  placeWise = [{ value: 'Yes' }, { value: 'No' }];
  



  constructor(
    private fb: FormBuilder,
    private reInsuranceSer: ReInsuranceService,
    private commonSer : CommonLogicService,
    private toaster : ToastServiceService,
    private cdr : ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    super();
    // this.facForm = this.fb.group({
    //   facPlacements: this.fb.array([this.createFacPlacementControls()]),
    // });

    this.participantForm = this.fb.group({
      participantData: this.fb.array([this.createParticipantControl()]),
    });

    this.taxForm = this.fb.group({
      taxData: this.fb.array([this.createTaxControl()]),
    });

    this.commissionForm = this.fb.group({
      commissionData: this.fb.array([this.createCommissionControl()]),
    });
    this.policyControl = new FormControl();
    this.filteredPolicy = this.policyControl.valueChanges.pipe(
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
    if($headerData && Object.keys($headerData).length > 0){
      this.getHeaderData = $headerData;
      this.policyControl.setValue($headerData?.fh_UW_NO);
      this.selectPolicy = $headerData?.fh_BASIS;
      this.facPercentage = $headerData?.fh_FAC_PERC;
      this.isPresentAllRisk = $headerData?.fh_PERC_ALL_RSK_YN ? true : false ;
      this.isSinglePlacement = $headerData?.fh_SINGLE_PLACE ? true : false ;
      this.cdr.detectChanges();
    }
    this.loadingCheck = false;
    this.filteredPolicy = this.policyControl.valueChanges.pipe(filter((value) => !!value && value.length > 18), switchMap((val: string) => this.reInsuranceSer.getDashboardData(val)),map(({data}: any) => data.map((item: any) => item.ucsPolNo)));
    this.policyControl.valueChanges.pipe(filter((value) => !!value && value.length > 18), switchMap((val: string) => this.reInsuranceSer.getDashboardData(val)),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
      this.getHeaderData = data.find((item:any) => item)
    }});
   this.initializeFacData();
   if(this.isPresentAllRisk){
    Object.keys(this.facData).forEach(tabIndex => {
      Object.keys(this.facData[tabIndex]).forEach(riskIndex => {
        Object.keys(this.facData[tabIndex][riskIndex]).forEach(coverIndex => {
          if (this.facData[tabIndex][riskIndex][coverIndex]) {
            this.facData[tabIndex][riskIndex][coverIndex].frc_FAC_RATE = this.percentageAll;
          }
        });
      });
    });
    this.cdr.detectChanges();
  }
   this.reInsuranceSer.isShow.subscribe((data:boolean) => {
    if(data) {
      location.reload();
      this.getTablePolicyData = null;
      this.riBtn = !this.riBtn;
    };
   })

  }
  trackByFn(index: number, item: any) {
    return item.frc_UR_RSK_ID; 
  }
  selectPolicyNo(policy:string){
    this.$policyNo = policy;
    this.loadingCheck = true;
    this.reInsuranceSer.getDashboard(this.$policyNo).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
      this.policyData = data ?? [];
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

  get isButtonDisabled(): boolean {
    return this.policyNoValidation || this.getTablePolicyData || this.$policyNo === 'No Item found' || !this.policyControl.valid;
  }
  

  sendToDashboardData(){
    console.log(this.$policyNo)
    const obj = {
      fh_UW_NO: this.$policyNo,
      fh_POL_IDX : this.getHeaderData.ucsPolIdx,
      fh_UW_SYS_ID:this.getHeaderData.ucsUwSysId,
      fh_FMD:  this.getHeaderData.ucsFmd,
      fh_TOD: this.getHeaderData.ucsTod,
      fh_BASIS: this.selectPolicy, 
      fh_FAC_PERC: this.facPercentage,
      fh_PERC_ALL_RSK_YN: this.isPresentAllRisk ? 1 : 0,
      fh_SINGLE_PLACE: this.isSinglePlacement ? 1 : 0   ,
      fac_FAC_IDX : 0,
      ucsEndNo : this.getHeaderData.ucsEndNo
  };
  
      this.loadingCheck = true;
      this.reInsuranceSer.createDashboardData(obj).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
        this.getTablePolicyData  = data;
        let $policyId:any = Object.values(this.getTablePolicyData )
        localStorage.setItem('policyNo' , JSON.stringify($policyId[0]?.risks[0].frc_FH_SYS_ID))
        localStorage.setItem('headerData',JSON.stringify(obj))
        this.tabs = Object.keys(this.getTablePolicyData ).map(item => item)
        this.risks = Object.values(this.getTablePolicyData )
        this.toaster.success('Success')
        this.initializeFacData();
        if(this.isPresentAllRisk){
          Object.keys(this.facData).forEach(tabIndex => {
            Object.keys(this.facData[tabIndex]).forEach(riskIndex => {
              Object.keys(this.facData[tabIndex][riskIndex]).forEach(coverIndex => {
                if (this.facData[tabIndex][riskIndex][coverIndex]) {
                  this.facData[tabIndex][riskIndex][coverIndex].frc_FAC_RATE = this.percentageAll;
                }
              });
            });
          });
          this.cdr.detectChanges();
        }
      },error:(error)=>{
        // console.log(error)
        this.toaster.error(error?.data?.errorMessage);
        this.loadingCheck = false
      }})
  }

  updatePercentageToAll(){
    this.percentageValidationToAll =  percentageValidator(this.facPercentage);
      if(this.isPresentAllRisk){
        this.percentageAll = this.facPercentage
      }
    }

  getByRiskById(){
    this.loadingCheck = true;
    let policyId = JSON.parse(localStorage.getItem('policyNo'))
    if(policyId != null){
      this.reInsuranceSer.getRiskDataById(policyId).pipe(take(1),takeUntil(this.destroy$),finalize(()=>this.loadingCheck = false)).subscribe({next:({data})=>{
        this.getTablePolicyData  = data;
        this.tabs = Object.keys(this.getTablePolicyData ).map(item => item)
        this.risks = Object.values(this.getTablePolicyData )
        this.tapVisible(this.risks);
        this.initializeFacData();
        if(this.isPresentAllRisk){
          Object.keys(this.facData).forEach(tabIndex => {
            Object.keys(this.facData[tabIndex]).forEach(riskIndex => {
              Object.keys(this.facData[tabIndex][riskIndex]).forEach(coverIndex => {
                if (this.facData[tabIndex][riskIndex][coverIndex]) {
                  this.facData[tabIndex][riskIndex][coverIndex].frc_FAC_RATE = this.percentageAll;
                }
              });
            });
          });
        }
      },error:(err)=>{
        console.log(err)
        this.toaster.error('Data not found');
        this.loadingCheck = false
      }})
    }
   
  }
  initializeFacData() {
    for (let tabIndex = 0; tabIndex <= this.tabs.length; tabIndex++) {
      if (!this.facData[tabIndex]) {
        this.facData[tabIndex] = {};
      }
      if(this.risks.length > 0){
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
  }
  // createFacPlacementControls(): FormArray {
  //   return this.fb.array([
  //     // new FormControl('',[ Validators.required]), // facRefNo
  //     new FormControl('',[ Validators.required]), // placementNumber
  //     new FormControl('', Validators.required), // si
  //     new FormControl('', Validators.required), // premium
  //     // new FormControl('', Validators.required), // facRate
  //     new FormControl('', Validators.required), // facSi
  //     new FormControl('', Validators.required), // facPremium
  //     new FormControl('', Validators.required), // security
  //     new FormControl('', Validators.required), // Place Wise Accounting
  //   ]);
  // }

  createParticipantControl(): FormArray {
    return this.fb.array([
      new FormControl('', Validators.required), // participant code
      new FormControl('', Validators.required), // Broker code
      new FormControl('', [Validators.required, percentageValid]), // participant percentage
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

  // get facPlacements(): FormArray {
  //   return this.facForm.get('facPlacements') as FormArray;
  // }
  get participantData(): FormArray {
    return this.participantForm.get('participantData') as FormArray;
  }

  get taxData(): FormArray {
    return this.taxForm.get('taxData') as FormArray;
  }

  get commissionData(): FormArray {
    return this.commissionForm.get('commissionData') as FormArray;
  }




  addFacPlacement() {
    // this.facPlacements.push(this.createFacPlacementControls());
    this.activePanelIndex = this.getPlacement.length - 1;
  }

  addParticipant() {
    this.participantData.push(this.createParticipantControl());
    this.activaPanel = this.participantData.length - 1;
  }

  addTaxForm() {
    this.taxData.push(this.createTaxControl());
    this.taxActivePanel = this.taxData.length - 1;
  }

  addCommissionsFrom() {
    this.commissionData.push(this.createCommissionControl());
    this.commissionActivePanel = this.commissionData.length - 1;
  }

  // submitForm() {
  //   console.log(this.facForm.value);
  //   let placementFormControl = this.facForm.value.facPlacements.map(
  //     (placement: any) => ({
  //       // facRefNo : placement[0],
  //       placementNumber: placement[0],
  //       si: placement[1],
  //       premium: placement[2],
  //       // facRate: placement[4],
  //       facSi: placement[3],
  //       facPremium: placement[4],
  //       security: placement[5],
  //       placeWiseAct: placement[6],
  //     })
  //   );
  //   // this.facForm.reset();
  //   console.log(placementFormControl);
  // }

  participantSubmitForm() {
    let participantFormControl = this.participantForm.value.participantData.map(
      (data: any) => ({
        fpPartCode: data[0],
        fpBrkCode: data[1],
        fpPartPerc: data[2],
        fpSi: parseFloat(data[3]),
        fpPrem: parseFloat(data[4]),
        fpOvrPrem: parseFloat(data[5]),
        fpUwSysId : this.getHeaderData.fh_UW_SYS_ID,
        fpPolIdx : this.getHeaderData.fh_POL_IDX,
        fpFacIdx : this.getHeaderData?.fac_FAC_IDX,
        fpPlaceNo : this.getPlacement[0].fpd_PLACE_NO,
        fpFpdSysId : this.getPlacement[0].fpd_SYS_ID,
        fpSysId : this.$fpSysId
      })
    );
    this.$overPremiumAmt = participantFormControl[0].fpOvrPrem;
    this.loadingCheck = true;
    this.reInsuranceSer.saveParticipant(participantFormControl[0]).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
      this.$fpSysId = data?.fpSysId;
      this.isParticipant = false;
      this.toaster.success('saved successful')
    },error:(err)=>{
      console.log(err);
      this.toaster.error(err?.data?.errorMessage);
      this.loadingCheck = false
    }})
  }

  commissionFormSubmit() {
    let commissionFormControl = this.commissionForm.value.commissionData.map(
      (item: any) => ({
        fpcCommCode: item[0],
        fpcCommTyp: item[1],
        fpcCommPer: item[2],
        fpcComm: parseFloat(item[3]),
        fpcUwSysId : this.getHeaderData.fh_UW_SYS_ID,
        fpcPolIdx : this.getHeaderData.fh_POL_IDX,
        fpcFacIdx : this.getHeaderData?.fac_FAC_IDX,
        fpcFpSysId : this.$fpSysId,
        fpcSysId : this.$fpcSysId
      })
    );
    // console.log(commissionFormControl, 'commissionForm');
    this.loadingCheck = true;
    this.reInsuranceSer.saveCommission(commissionFormControl[0]).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
      this.$fpcSysId = data?.fpcSysId;
      this.isCommission = false;
      this.toaster.success('saved successful')
    },error:(err)=>{
      console.log(err)
      this.toaster.error(err?.data?.errorMessage);
      this.loadingCheck = false
    }})
  }

  taxFormSubmit() {
    let taxFormControl = this.taxForm.value.taxData.map((form: any) => ({
      ftTaxCode: form[0],
      ftTaxTyp: form[1],
      ftTaxPerc: form[2],
      ftTax: parseFloat(form[3]),
      fpcUwSysId : this.getHeaderData.fh_UW_SYS_ID,
      fpcPolIdx : this.getHeaderData.fh_POL_IDX,
      fpcFacIdx : this.getHeaderData?.fac_FAC_IDX,
      fpcFpSysId : this.$fpSysId,
      ftSrcAmt :this.$overPremiumAmt,
      ftSysId : this.$ftSysId
    }));

    // console.log(taxFormControl, 'taxFormControl');
    this.reInsuranceSer.saveTax(taxFormControl[0]).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
      console.log(data);
      this.$ftSysId = data.ftSysId;
      this.isTax = false;
      this.toaster.success('saved successfuly');
    },error:(err)=>{
      console.log(err);
      this.toaster.error(err?.data?.errorMessage);
      this.loadingCheck = false
    }})
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
    if (this.getPlacement.length > 1) {
      this.getPlacement.splice(idx, 1);
    }
  }

  closePanelParticipant(idx: number) {
    this.activaPanel -= 1;
    if (this.participantData.length > 1) {
      this.participantData.removeAt(idx);
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
  // singlePlacementVerify() {
  //  if(this.isSinglePlacement && this.getPlacement.length > 1){
  //   this.facPlacements.clear();
  //   // this.facPlacements.push(this.createFacPlacementControls());
  //  }

  // }
 
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
    this.singleFacRate = this.facData[tabIndex][riskIndex][coverIndex].frc_FAC_RATE 
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
  // console.log(this.facData)
  let obj:any[] = Object.values(this.facData).flatMap(risk =>
    Object.values(risk).flatMap(item => Object.values(item))
  );
  obj = obj.filter(item => item?.frc_FAC_RATE != '' && item?.frc_PLACE_REF_NO != '');
  this.loadingCheck = true;
  this.reInsuranceSer.updateBulkCover(obj).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:(data)=>{
    console.log(data)
    this.isSaveAll = true;
    this.toaster.success('Saved Successfully')
  },error:(error)=>{
    console.log(error)
    this.toaster.error(error?.data?.errorMessage);
    this.loadingCheck = false
  }})
}

singleCoverUpdate(item:any){

  this.loadingCheck = true;
  let op = Object.values(this.facData).flatMap(risk => Object.values(risk).flatMap(item => Object.values(item))).filter((item:any) => item.frc_FAC_RATE != '' && item.frc_PLACE_REF_NO != '');
  let $obj:any = op.find((t:any) => t.frc_SYS_ID == item.frc_SYS_ID)
  this.reInsuranceSer.updateSingleCover($obj).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:(data)=>{
    this.toaster.success('Saved Successfully')
  },error:(error)=>{
    console.log(error);
    this.toaster.error(error?.data?.errorMessage)
    this.loadingCheck = false
  }})

}


getProcessDataHandler(){
   let id = JSON.parse(localStorage.getItem('policyNo')) ? JSON.parse(localStorage.getItem('policyNo')) : ''
   let $headerData = JSON.parse(localStorage.getItem('headerData'));
        if(!$headerData && Object.keys($headerData).length < 0) return;
           let obj = {
          fh_UW_SYS_ID : $headerData.fh_UW_SYS_ID,
          fh_POL_IDX : $headerData.fh_POL_IDX,
          fac_FAC_IDX : $headerData.fac_FAC_IDX,
          fh_SYS_ID : id
         }
  this.loadingCheck = true;
  this.reInsuranceSer.getProcessData(obj).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:(data)=> {
    console.log(data)
    this.isProcess = true;
    this.toaster.success('Process Completed')
  },error:(error)=>{
    // console.log(error)
    this.loadingCheck = false
    this.toaster.error(error?.data?.errorMessage)
  }})
}


getPlacementData(){
  let id = JSON.parse(localStorage.getItem('policyNo')) ? JSON.parse(localStorage.getItem('policyNo')) : ''
  this.loadingCheck = true;
  this.reInsuranceSer.placementDetail(id).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:({data}:any)=>{
    this.getPlacement = data;
    this.getParticipantData();
    this.riBtn = !this.riBtn;
  },error:(error)=>{
    console.log(error)
    this.loadingCheck = false
  }})

}

tapVisible(risks:any){
  risks.forEach((tab:any, tabIndex:number) => {
    tab.risks.forEach((risk: any, riskIndex: number) => {
      risk.expanded = tabIndex === this.selectedTabIndex && riskIndex === tabIndex; 
    });
  });
}

getParticipantData(){
  this.loadingCheck = true;
  forkJoin(
    [
      this.reInsuranceSer.getParticipantDetail(),
      this.reInsuranceSer.getBrokerCode(),
      this.reInsuranceSer.CommissionDetails(),
      this.reInsuranceSer.taxDetail()
    ]
  ).pipe(take(1),takeUntil(this.destroy$),finalize(()=> this.loadingCheck = false)).subscribe({next:([paticipant , broker, commission,tax])=>{
      this.brokerCode = broker.data;
      this.participantCode = paticipant.data;
      this.commission = commission.data;
      this.tax = tax.data;
      console.log(tax,'_________________c')
    },error:(err)=>{
      console.log(err);
      this.loadingCheck = false
    }})
  }

  // participantPercentage(event:any){
  //  this.participantData.at(3).patchValue(event.target.value);
  // }

  participantPercentage(event: any, idx:number): void {
    const percentage = event.target.value;
    let baseValue = this.getPlacement[0].fpd_FAC_SI; 
    let basePremium = this.getPlacement[0].fpd_FAC_PREM

    const formArray = this.participantForm.get('participantData') as FormArray;

if (formArray && formArray.length > 0) {
  const participantForm = formArray.at(0) as FormArray;

  if (participantForm.length > 3) {
    this.isParticipant = true;
    participantForm.at(3).setValue((baseValue * (percentage / 100)).toFixed(2));
    participantForm.at(4).setValue((basePremium * (percentage / 100)).toFixed(2));
    participantForm.at(5).setValue((basePremium * (percentage / 100)).toFixed(2));
  } 
}
    
  }

  updatePercentageParticipant(event:any){
    
    let value = event.target.value;
   
    const formArray = this.commissionForm.get('commissionData') as FormArray;

    if (formArray && formArray.length > 0) {
      const commissionForm = formArray.at(0) as FormArray;
      this.isParticipant = true;
      let comPercentage = commissionForm.at(2).value;
    
      if (commissionForm.length > 3) {
       commissionForm.at(3).setValue(value * (comPercentage / 100));
       this.isCommission = true;
      } 
    }

    const formArr = this.taxForm.get('taxData') as FormArray;

    if (formArr && formArr.length > 0) {
      const taxForm = formArr.at(0) as FormArray;

      let taxPercentage = taxForm.at(2).value;
    
      if (taxForm.length > 3) {
        taxForm.at(3).setValue((value * (taxPercentage / 100)).toFixed(2))
       this.isTax = true;
      } 
    }

  }


  commissionCalculation(event:any){
    const percentage = event.target.value;

    const form = this.participantForm.get('participantData') as FormArray;
    if(form && form.length > 0){
    let f =  form.at(0) as FormArray;
    let value =  f.at(5).value;

    const formArray = this.commissionForm.get('commissionData') as FormArray;

    if (formArray && formArray.length > 0) {
      const commissionForm = formArray.at(0) as FormArray;
    
      if (commissionForm.length > 3) {
        this.isCommission = true;
       commissionForm.at(3).setValue((value * (percentage / 100)).toFixed(2))
      } 
      
    }
   
    }

  }


  taxCalculation(event:any){
    const percentage = event.target.value;

    const form = this.participantForm.get('participantData') as FormArray;
    if(form && form.length > 0){
    let f =  form.at(0) as FormArray;
    let value =  f.at(5).value;

    const formArray = this.taxForm.get('taxData') as FormArray;

    if (formArray && formArray.length > 0) {
      const commissionForm = formArray.at(0) as FormArray;
    
      if (commissionForm.length > 3) {
        this.isTax = true;
       commissionForm.at(3).setValue((value * (percentage / 100)).toFixed(2))
      } 
    }
   
    }

  }

  openDeleteDialog() {
    
    let local = JSON.parse(localStorage.getItem('headerData'));
    if (Object.keys(local).length < 0) return null;
    let obj = {
      fpUwSysId:local.fh_UW_SYS_ID,
      fpPolIdx:local.fh_POL_IDX,
      fpFacIdx:local.fac_FAC_IDX
    }
   return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data : obj
    }).afterClosed();
   
  }

}