import { Component, OnInit } from '@angular/core';
import { EnergyService } from '../energy.service';
import { FixedScaleAxis } from 'chartist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = true;
  labels = ['man','tue','wed', 'thu', 'fri', 'sat', 'sun'];
  series = [
    [10, 6, 7, 8, 5, 4, 6],
    [4,  9, 3, 6, 3, 5, 5]
  ];

  options = {
    low: 0,
    showArea: true,
    showPoint: false,
    fullWidth: true
  };

  constructor(private energyService: EnergyService) { }

  ngOnInit() {
    const start = new Date("2018-11-18");
    start.setHours(12);
    const end = new Date();
    this.energyService.getEnergyData(start, end).subscribe(res => {
      // Aggregate data
      const labels = new Array<string>();
      const series1 = new Array<number>();
      const series2 = new Array<number>();
      for (let i = 0; i < res.length; i++) {
        labels.push(new Date(res[i].timestamp).toLocaleDateString());
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

}
