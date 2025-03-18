import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto'

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements AfterViewInit {
  ngAfterViewInit() {
    new Chart("usageChart", {
      type: "bar",
      data: {
        labels: ["Users", "Connections", "Forums", "Internships"],
        datasets: [{
          label: "Platform Stats",
          data: [500, 120, 45, 30],
          backgroundColor: ["blue", "yellow", "green", "red"]
        }]
      }
    });
  }
}