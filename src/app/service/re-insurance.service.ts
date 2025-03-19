import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environment/environment ';
import {
  ALL,
  BULK_UPDATE,
  FETCH_DETAILS,
  GET_DETAIL,
  PXTFACHDR,
  PXTFACRSKCVR,
  UPDATE,
  PLACEMENT,
  PROCESS,
  POLICY_MASTER,
  PARTICIPANT_CODE,
  BROKER_CODE,
  COMMISION_TYPE,
  TAX_TYPE,
  PARTICIPANT,
  SAVE,
  COMMISSION,
  TAX,
  APPROVE
} from '../common/apiConstVariable';
import {
  PolicyDetails,
  RiskData,
  SingleCover,
  PlacementDetail,
  GetDashoboard
} from '../interface/dashboardInterface';

@Injectable({
  providedIn: 'root',
})
export class ReInsuranceService {
  baseUrl = environment.apiUrl;
  isShow = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getDashboard(policyNo: string): Observable<PolicyDetails[]> {
    let param = new HttpParams().set('FH_UW_NO', policyNo);
    return this.http.get<PolicyDetails[]>(
      `${this.baseUrl}/${PXTFACHDR}/${ALL}`,
      { params: param }
    );
  }


  getDashboardData($policyNo : string): Observable<GetDashoboard>{
    let polNo = $policyNo.split('/')[0];
    let params = new HttpParams().set('ucsPolNo', polNo)
    return this.http.get<GetDashoboard>(`${this.baseUrl}/${POLICY_MASTER}/${ALL}`,{params:params})
  }

  createDashboardData(data: any): Observable<PolicyDetails[]> {
    return this.http.post<PolicyDetails[]>(
      `${this.baseUrl}/${PXTFACHDR}/${FETCH_DETAILS}`,
      data
    );
  }

  getRiskDataById(policyId?: string): Observable<any> {
    let params = new HttpParams().set('FRC_FH_SYS_ID', policyId);
    return this.http.get<RiskData>(
      `${this.baseUrl}/${PXTFACRSKCVR}/${GET_DETAIL}`,
      { params: params }
    );
  }

  updateSingleCover(data: SingleCover): Observable<SingleCover> {
    return this.http.put<SingleCover>(
      `${this.baseUrl}/${PXTFACRSKCVR}/${UPDATE}`,
      data
    );
  }

  updateBulkCover(data: SingleCover[]): Observable<SingleCover[]> {
    return this.http.put<SingleCover[]>(
      `${this.baseUrl}/${PXTFACRSKCVR}/${BULK_UPDATE}`,
      data
    );
  }

  placementDetail(id:string): Observable<PlacementDetail[]> {
    let params = new HttpParams().set('FPD_FH_SYS_ID' , id)
    return this.http.get<PlacementDetail[]>(`${this.baseUrl}/${PLACEMENT}/${ALL}`,{params:params});
  }

  getProcessData(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/${PLACEMENT}/${PROCESS}`,data)
  }

  getParticipantDetail():Observable<any>{
    return this.http.get(`${this.baseUrl}/${PLACEMENT}/${PARTICIPANT_CODE}`)
  }
  getBrokerCode():Observable<any>{
    return this.http.get(`${this.baseUrl}/${PLACEMENT}/${BROKER_CODE}`)
  }

  CommissionDetails():Observable<any>{
    return this.http.get(`${this.baseUrl}/${PLACEMENT}/${COMMISION_TYPE}`)
  }

  taxDetail():Observable<any>{
    return this.http.get(`${this.baseUrl}/${PLACEMENT}/${TAX_TYPE}`)

  }
  saveParticipant(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/${PARTICIPANT}/${SAVE}`,data)
  }

  saveCommission(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/${COMMISSION}/${SAVE}`,data)
  }

  saveTax(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/${TAX}/${SAVE}`,data)
  }

  getApprove(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/${PARTICIPANT}/${APPROVE}`,data)
  }

}
