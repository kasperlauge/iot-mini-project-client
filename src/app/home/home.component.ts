import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges, OnDestroy } from '@angular/core';
import { EnergyService } from '../energy.service';
import { FixedScaleAxis, ILineChartOptions, plugins, IPieChartOptions } from 'chartist';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TotalEnergyDto } from '../domain/total-energy-dto.model';
import { GreenEnergyDto } from '../domain/green-energy-dto';
import { Co2EmissionDto } from '../domain/co2-emission-dto';
import { EnergyExchangeDto } from '../domain/energy-exchange-dto';
import { zip, Subscription } from 'rxjs';
import { ResourceEnergyDto } from '../domain/resource-energy-dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges, OnDestroy {
  loading = true;
  resourceLoading = true;
  co2Loading = true;
  exchangeLoading = true;
  currentDataLoading = true;

  labels = ['man','tue','wed', 'thu', 'fri', 'sat', 'sun'];
  series = [
    [10, 6, 7, 8, 5, 4, 6],
    [4,  9, 3, 6, 3, 5, 5]
  ];
  


  pieseries = [5, 3];
  pielabels = ["Other energy", "Green energy"]

  resouceSeries: number[];
  resourceLabels = ["Power plants","Sea mills", "Land mills", "Solar cells"];

  co2Series: number[][];
  co2Labels: string[];

  exchangeSeries: number[][];
  exchangeLabels: string[];

  exchangeSum: number;

  currentTotalEnergy: TotalEnergyDto;
  currentGreenEnergy: GreenEnergyDto;
  currentResourceEnergy: ResourceEnergyDto;
  currentCo2Emission: Co2EmissionDto;
  currentExchangeEnergy: EnergyExchangeDto;

  pieChartOptions: IPieChartOptions = {
    chartPadding: 30
  }
  options: ILineChartOptions = {
    low: 0,
    showArea: true,
    showPoint: false,
    fullWidth: true,
    axisX: {
      labelInterpolationFnc: (value, index) => index % 50 === 0 ?  value : null
    },
    axisY: {
      labelInterpolationFnc: (value) =>  value.toFixed(2) + 'MWh'
    }
  };

  co2Options: ILineChartOptions = {
    low: 0,
    showArea: true,
    showPoint: false,
    fullWidth: true,
    axisX: {
      labelInterpolationFnc: (value, index) => index % 50 === 0 ?  value : null
    },
    axisY: {
      labelInterpolationFnc: (value) =>  value.toFixed(2) + 'g/kWh'
    }
  };

  exchangeOptions: ILineChartOptions = {
    showArea: true,
    showPoint: false,
    fullWidth: true,
    axisX: {
      labelInterpolationFnc: (value, index) => index % 50 === 0 ?  value : null
    },
    axisY: {
      labelInterpolationFnc: (value) =>  value.toFixed(2) + 'MWh'
    }
  };
  
  form: FormGroup;

  currentDataSubscription: Subscription;
  totalEnergySubscription: Subscription;
  resourceEnergySubscription: Subscription;
  co2EmissionSubscription: Subscription;
  energyExhangeSubscription: Subscription;

  public get startTime() {
    return this.form.controls["startTime"].value;
  }
  public get endTime() {
    return this.form.controls["endTime"].value;
  }

  constructor(private energyService: EnergyService, private fb: FormBuilder) { }

  ngOnInit() {
    const et = new Date();
    const st = new Date(et.toDateString());
    st.setDate(et.getDate() - 1);
    this.form = this.fb.group({
                    endTime: et.toLocaleDateString(),
                    startTime: st.toLocaleDateString()
                  });

    const start = new Date(this.startTime);
    const end = new Date(this.endTime);
    start.setHours(12);
    end.setHours(12);
    this.getGraphDate(start, end);
  }

  onSubmit() {
    const start = new Date(this.startTime);
    const end = new Date(this.endTime);
    start.setHours(12);
    end.setHours(12);
    this.getGraphDate(start, end);
  }

  getGraphDate(start: Date, end: Date) {
    this.loading = true;
    this.resourceLoading = true;
    this.co2Loading = true;
    this.currentDataLoading = true;

    // Unsubscribe previous subscriptions
    if (this.totalEnergySubscription) {
      this.totalEnergySubscription.unsubscribe();
    }
    if (this.resourceEnergySubscription) {
      this.resourceEnergySubscription.unsubscribe();
    }
    if (this.co2EmissionSubscription) {
      this.co2EmissionSubscription.unsubscribe();
    }
    if (this.energyExhangeSubscription) {
      this.energyExhangeSubscription.unsubscribe();
    }
    if (this.currentDataSubscription) {
      this.currentDataSubscription.unsubscribe();
    }

    this.totalEnergySubscription = this.energyService.getEnergyData(start, end).subscribe(res => {
      // Aggregate data
      const labels = new Array<string>();
      const series1 = new Array<number>();
      const series2 = new Array<number>();
      // Data for piechart
      for (let i = 0; i < res.length; i++) {
        labels.push(new Date(res[i].timestamp).toLocaleDateString("da-dk"));
        series1.push(res[i].totalGreenEnergy);
        series2.push(res[i].totalEnergy);
      }
      this.series = [
        series2,
        series1
      ];

      if(series1.length > 0){
        const pieseries = new Array<number>();
        const totalGreenEnergy = series1.reduce(this.getSum);
        const totalEnergy = series2.reduce(this.getSum)-totalGreenEnergy;
        pieseries.push(totalEnergy);
        pieseries.push(totalGreenEnergy);
        
    
        this.pieseries = pieseries;
      }

      this.labels = labels;
      this.loading = false;
    });

    // Get resource data
    this.resourceEnergySubscription = this.energyService.getResourceEnergyData(start, end).subscribe(res => {
      // Aggregate data
      const landmills = new Array<number>();
      const seamills = new Array<number>();
      const powerplants = new Array<number>();
      const solarcells = new Array<number>();

      // Data for resouce pie chart
      for (let i = 0; i < res.length; i++) {
        landmills.push(res[i].landmills);
        seamills.push(res[i].seamills);
        powerplants.push(res[i].powerPlants);
        solarcells.push(res[i].solarCells);
      }

      if(landmills.length > 0){
        const pieseries = new Array<number>();
        pieseries.push(powerplants.reduce(this.getSum));
        pieseries.push(seamills.reduce(this.getSum));
        pieseries.push(landmills.reduce(this.getSum));
        pieseries.push(solarcells.reduce(this.getSum));
    
        this.resouceSeries = pieseries;
      }

      this.resourceLoading = false;
    });

    // Get co2 data
    this.co2EmissionSubscription = this.energyService.getCo2Data(start, end).subscribe(res => {
      // Aggregate data
      const labels = new Array<string>();
      const series1 = new Array<number>();

      // Data for piechart
      for (let i = 0; i < res.length; i++) {
        labels.push(new Date(res[i].timestamp).toLocaleDateString("da-dk"));
        series1.push(res[i].co2);
      }
      this.co2Series = [
        series1
      ];

      this.co2Labels = labels;
      this.co2Loading = false;
    });

    // Get energy exhange data
    this.energyExhangeSubscription = this.energyService.getEnergyExchangeData(start, end).subscribe(res => {
      // Aggregate data
      const labels = new Array<string>();
      const series1 = new Array<number>();

      // Data for line graph
      for (let i = 0; i < res.length; i++) {
        labels.push(new Date(res[i].timestamp).toLocaleDateString("da-dk"));
        series1.push(res[i].exchangeGermany + res[i].exchangeNorway + res[i].exhangeSweden);
      }
      this.exchangeSeries = [
        series1
      ];

      this.exchangeSum = series1.reduce(this.getSum);

      this.exchangeLabels = labels;
      this.exchangeLoading = false;
    });

    this.currentDataSubscription = zip(
      this.energyService.getCurrentEnergyData(),
      this.energyService.getCurrentGreenEnergyData(),
      this.energyService.getCurrentResourceEnergyData(),
      this.energyService.getCurrentCo2Data(),
      this.energyService.getCurrentEnergyExchangeData()
    ).subscribe(data => {
      this.currentTotalEnergy = data[0];
      this.currentGreenEnergy = data[1];
      this.currentResourceEnergy = data[2];
      this.currentCo2Emission = data[3];
      this.currentExchangeEnergy = data[4];
      this.currentDataLoading = false;
    });
    
  }

  getSum(total, num) {
    return total + num;
}

  onChange(val) {
    console.log(val);
  }

  ngOnChanges(value) {
    console.log(this.startTime);
    console.log(this.endTime);
  }

  ngOnDestroy() {
    if (this.totalEnergySubscription) {
      this.totalEnergySubscription.unsubscribe();
    }
    if (this.resourceEnergySubscription) {
      this.resourceEnergySubscription.unsubscribe();
    }
    if (this.co2EmissionSubscription) {
      this.co2EmissionSubscription.unsubscribe();
    }
    if (this.energyExhangeSubscription) {
      this.energyExhangeSubscription.unsubscribe();
    }
    if (this.currentDataSubscription) {
      this.currentDataSubscription.unsubscribe();
    }
  }

}
