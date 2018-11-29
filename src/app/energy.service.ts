import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TotalEnergyDto } from './domain/total-energy-dto.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Co2EmissionDto } from './domain/co2-emission-dto';
import { ResourceEnergyDto } from './domain/resource-energy-dto';
import { EnergyExchangeDto } from './domain/energy-exchange-dto';
import { GreenEnergyDto } from './domain/green-energy-dto';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {

  constructor(private http: HttpClient) { }

  getEnergyData(start: Date, end: Date): Observable<TotalEnergyDto[]> {
    return this.http.get<TotalEnergyDto[]>(`${environment.rootUrl}/api/energy?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

  getCo2Data(start: Date, end: Date): Observable<Co2EmissionDto[]> {
    return this.http.get<Co2EmissionDto[]>(`${environment.rootUrl}/api/co2?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

  getResourceEnergyData(start: Date, end: Date): Observable<ResourceEnergyDto[]> {
    return this.http.get<ResourceEnergyDto[]>(`${environment.rootUrl}/api/energy/resource?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

  getEnergyExchangeData(start: Date, end: Date): Observable<EnergyExchangeDto[]> {
    return this.http.get<EnergyExchangeDto[]>(`${environment.rootUrl}/api/energy/exchange?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

  getCurrentEnergyData(): Observable<TotalEnergyDto> {
    return this.http.get<TotalEnergyDto>(`${environment.rootUrl}/api/energy/current`);
  }

  getCurrentGreenEnergyData(): Observable<GreenEnergyDto> {
    return this.http.get<GreenEnergyDto>(`${environment.rootUrl}/api/energy/green/current`);
  }

  getCurrentCo2Data(): Observable<Co2EmissionDto> {
    return this.http.get<Co2EmissionDto>(`${environment.rootUrl}/api/co2/current`);
  }

  getCurrentResourceEnergyData(): Observable<ResourceEnergyDto> {
    return this.http.get<ResourceEnergyDto>(`${environment.rootUrl}/api/energy/resource/current`);
  }

  getCurrentEnergyExchangeData(): Observable<EnergyExchangeDto> {
    return this.http.get<EnergyExchangeDto>(`${environment.rootUrl}/api/energy/exchange/current`);
  }

}
