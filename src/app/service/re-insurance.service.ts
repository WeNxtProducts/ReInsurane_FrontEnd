import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environment/environment '
import { Observable,  of,  tap } from 'rxjs';
import {PolicyDetails, RiskData, SingleCover} from '../interface/dashboardInterface'
import {API, PXTFACHDR, ALL, FETCH_DETAILS, PXTFACRSKCVR, GET_DETAIL, UPDATE, BULK_UPDATE} from '../common/apiConstVariable'

@Injectable({
  providedIn: 'root'
})
export class ReInsuranceService {

  baseUrl = environment.apiUrl;

  data =  {
        "100101": {
            "risks": [
                {
                    "frc_RISK_TYP": "Fire",
                    "expanded": true,
                    "frc_UR_RSK_ID": "risk2",
                    "currencies": [
                        "USD",
                        "INR"
                    ],
                    "covers": [
                        {
                            "frc_FAC_SI": "1000000",
                            "cqs": "0%",
                            "frc_PLACE_REF_NO": "5001",
                            "frc_FAC_RATE": "5",
                            "tty": "0%",
                            "frc_CVR_CODE": "CVR002",
                            "frc_PREM": "5000",
                            "frc_SI": "1000000",
                            "frc_FAC_PREM": "5000"
                        }
                    ]
                },
                {
                    "frc_RISK_TYP": "Fire",
                    "expanded": true,
                    "frc_UR_RSK_ID": "risk1",
                    "currencies": [
                        "USD",
                        "INR"
                    ],
                    "covers": [
                        {
                            "frc_FAC_SI": "1000000",
                            "cqs": "0%",
                            "frc_PLACE_REF_NO": "5001",
                            "frc_FAC_RATE": "5",
                            "tty": "0%",
                            "frc_CVR_CODE": "CVR001",
                            "frc_PREM": "5000",
                            "frc_SI": "1000000",
                            "frc_FAC_PREM": "5000"
                        }
                    ]
                }
            ]
        },
        "100102": {
            "risks": [
                {
                    "frc_RISK_TYP": "Fire",
                    "expanded": true,
                    "frc_UR_RSK_ID": "risk3",
                    "currencies": [
                        "USD",
                        "INR"
                    ],
                    "covers": [
                        {
                            "frc_FAC_SI": "1000000",
                            "cqs": "0%",
                            "frc_PLACE_REF_NO": "5001",
                            "frc_FAC_RATE": "5",
                            "tty": "0%",
                            "frc_CVR_CODE": "CVR003",
                            "frc_PREM": "5000",
                            "frc_SI": "1000000",
                            "frc_FAC_PREM": "5000"
                        }
                    ]
                }
            ]
        },
        "100103": {
            "risks": [
                {
                    "frc_RISK_TYP": "Fire",
                    "expanded": true,
                    "frc_UR_RSK_ID": "risk4",
                    "currencies": [
                        "USD",
                        "INR"
                    ],
                    "covers": [
                        {
                            "frc_FAC_SI": "1000000",
                            "cqs": "0%",
                            "frc_PLACE_REF_NO": "5001",
                            "frc_FAC_RATE": "5",
                            "tty": "0%",
                            "frc_CVR_CODE": "CVR004",
                            "frc_PREM": "5000",
                            "frc_SI": "1000000",
                            "frc_FAC_PREM": "5000"
                        }
                    ]
                }
            ]
        }
    }

  constructor(private http : HttpClient) { }
  
getDashboard(policyNo:string):Observable<PolicyDetails[]> {
  let param = new HttpParams().set('FH_UW_NO',policyNo)
  return this.http.get<PolicyDetails[]>(`${this.baseUrl}/${PXTFACHDR}/${ALL}`,{params:param});
}

createDashboardData(data:any):Observable<PolicyDetails[]> {
  return this.http.post<PolicyDetails[]>(`${this.baseUrl}/${PXTFACHDR}/${FETCH_DETAILS}`, data);
}

getRiskDataById(policyId?:string):Observable<any>{
  let params = new HttpParams().set('FRC_FH_SYS_ID',policyId)
  // return this.http.get<RiskData>(`${this.baseUrl}/${PXTFACRSKCVR}/${GET_DETAIL}`,{params:params});
  return of(this.data)
}

updateSingleCover(data:SingleCover):Observable<SingleCover>{
  return this.http.put<SingleCover>(`${this.baseUrl}/${PXTFACRSKCVR}/${UPDATE}`,data)
}

updateBulkCover(data:SingleCover[]):Observable<SingleCover []>{
  return this.http.put<SingleCover[]>(`${this.baseUrl}/${PXTFACRSKCVR}/${BULK_UPDATE}`,data)
}

}
