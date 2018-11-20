import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Line } from 'chartist';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() labels: string[];
  @Input() series: number[];
  @Input() options: any;
  @Input() type: string;
  @Input() height = "500px";
  @ViewChild("cs") cs: ElementRef;

  constructor() { }

  ngOnInit() {
    let c = null;
    switch (this.type) {
      case "line":
        c = new Line(this.cs.nativeElement, {labels: this.labels, series: this.series}, this.options);
      break;
      case "":

      break;

      default:
        throw Error(`Type ${this.type} is not implemented in ChartComponent`);
      break;
    }
  }

}
