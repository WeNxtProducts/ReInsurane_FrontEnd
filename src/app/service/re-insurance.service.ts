import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment '
import { Observable } from 'rxjs';
import {DashboardData} from '../interface/dashboardInterface'
import {API, PXTFACHDR} from '../common/apiConstVariable'

@Injectable({
  providedIn: 'root'
})
export class ReInsuranceService {

  baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
getDashboard():Observable<DashboardData[]> {
  return this.http.get<DashboardData[]>(`${this.baseUrl}/${API}/${PXTFACHDR}`);
}

}
