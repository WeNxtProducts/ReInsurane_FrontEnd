import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  PROCESS
} from '../common/apiConstVariable';
import {
  PolicyDetails,
  RiskData,
  SingleCover,
} from '../interface/dashboardInterface';

@Injectable({
  providedIn: 'root',
})
export class ReInsuranceService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(policyNo: string): Observable<PolicyDetails[]> {
    let param = new HttpParams().set('FH_UW_NO', policyNo);
    return this.http.get<PolicyDetails[]>(
      `${this.baseUrl}/${PXTFACHDR}/${ALL}`,
      { params: param }
    );
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

  placementDetail(id:string): Observable<any> {
    let params = new HttpParams().set('FPD_FH_SYS_ID' , id)
    return this.http.get(`${this.baseUrl}/${PLACEMENT}/${ALL}`,{params:params});
  }

  getProcessData(processId:string): Observable<any>{
    let params = new HttpParams().set('policyId',processId)
    return this.http.get(`${this.baseUrl}/${PLACEMENT}/${PROCESS}`,{params:params})
  }
}
