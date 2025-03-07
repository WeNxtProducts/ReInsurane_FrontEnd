import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment '
import { Observable,  tap } from 'rxjs';
import {PolicyDetails} from '../interface/dashboardInterface'
import {API, PXTFACHDR, ALL, CREATE} from '../common/apiConstVariable'

@Injectable({
  providedIn: 'root'
})
export class ReInsuranceService {

  baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
getDashboard():Observable<PolicyDetails[]> {
  return this.http.get<PolicyDetails[]>(`${this.baseUrl}/${PXTFACHDR}/${ALL}`);
}

createDashboardData(data:any):Observable<PolicyDetails[]> {
  return this.http.post<PolicyDetails[]>(`${this.baseUrl}/${PXTFACHDR}/${CREATE}`, data)
}

}
