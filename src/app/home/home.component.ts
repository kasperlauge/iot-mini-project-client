import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { EnergyService } from '../energy.service';
import { FixedScaleAxis, ILineChartOptions } from 'chartist';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {
  loading = true;
  labels = ['man','tue','wed', 'thu', 'fri', 'sat', 'sun'];
  series = [
    [10, 6, 7, 8, 5, 4, 6],
    [4,  9, 3, 6, 3, 5, 5]
  ];

  options: ILineChartOptions = {
    low: 0,
    showArea: true,
    showPoint: false,
    fullWidth: true,
    axisX: {
      labelInterpolationFnc: (value, index) => index % 50 === 0 ? value : null
    }
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
    this.energyService.getEnergyData(start, end).subscribe(res => {
      // Aggregate data
      const labels = new Array<string>();
      const series1 = new Array<number>();
      const series2 = new Array<number>();
      for (let i = 0; i < res.length; i++) {
        labels.push(new Date(res[i].timestamp).toLocaleDateString("da-dk"));
        series1.push(res[i].totalGreenEnergy);
        series2.push(res[i].totalEnergy);
      }
      this.series = [
        series2,
        series1
      ];

      this.labels = labels;
      this.loading = false;
    });
  }

  onChange(val) {
    console.log(val);
  }

  ngOnChanges(value) {
    console.log(this.startTime);
    console.log(this.endTime);
  }

}
