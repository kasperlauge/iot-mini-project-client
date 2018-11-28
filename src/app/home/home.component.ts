import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { EnergyService } from '../energy.service';
import { FixedScaleAxis, ILineChartOptions, plugins, IPieChartOptions } from 'chartist';
import { FormBuilder, FormGroup } from '@angular/forms';
import { empty } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {
  loading = true;
  resourceLoading = true;
  co2Loading = true;
  labels = ['man','tue','wed', 'thu', 'fri', 'sat', 'sun'];
  series = [
    [10, 6, 7, 8, 5, 4, 6],
    [4,  9, 3, 6, 3, 5, 5]
  ];
  


  pieseries = [5, 3];
  pielabels = ["Green energy","Other energy"]

  resouceSeries: number[];
  resourceLabels = ["Power plants","Sea mills", "Land mills", "Solar cells"];

  co2Series: number[][];
  co2Labels: string[];


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

    // plugins: [ plugins.ctAxisTitle({
    //   axisX: {
    //     axisTitle: 'Time (mins)',
    //     axisClass: 'ct-axis-title',
    //     textAnchor: 'middle'
    //   },
    //   axisY: {
    //     axisTitle: 'Goals',
    //     axisClass: 'ct-axis-title',
    //     textAnchor: 'middle',
    //     flipTitle: false
    //   }
    // })]

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

    // plugins: [ plugins.ctAxisTitle({
    //   axisX: {
    //     axisTitle: 'Time (mins)',
    //     axisClass: 'ct-axis-title',
    //     textAnchor: 'middle'
    //   },
    //   axisY: {
    //     axisTitle: 'Goals',
    //     axisClass: 'ct-axis-title',
    //     textAnchor: 'middle',
    //     flipTitle: false
    //   }
    // })]

  };
  
  form: FormGroup;

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
    this.energyService.getEnergyData(start, end).subscribe(res => {
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
        pieseries.push(series1.reduce(this.getSum));
        pieseries.push((series2.reduce(this.getSum)-pieseries[0]));
        
    
        this.pieseries = pieseries;
      }

      this.labels = labels;
      this.loading = false;
    });

    // Get resource data
    this.energyService.getResourceEnergyData(start, end).subscribe(res => {
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
    this.energyService.getCo2Data(start, end).subscribe(res => {
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

}
