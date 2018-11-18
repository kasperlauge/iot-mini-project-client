import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TotalEnergyDto } from './domain/total-energy-dto.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {

  constructor(private http: HttpClient) { }

  getEnergyData(start: Date, end: Date): Observable<TotalEnergyDto[]> {
    return this.http.get<TotalEnergyDto[]>(`${environment.rootUrl}/api/energy?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

}
