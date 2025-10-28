import { Component, inject, OnInit } from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import {
  AgCategoryAxisOptions,
  AgChartOptions,
  AgLineSeriesOptions,
  AgNumberAxisOptions,
} from 'ag-charts-community';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { ReportService } from '../../../core/services/report.service';
import moment from 'moment';
import { ReportSummary } from '../../../core/models/report/report';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-report',
  imports: [
    PwaHeaderComponent,
    AgCharts,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    MatNativeDateModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
  private reportService = inject(ReportService);
  options: AgChartOptions = {};

  endDate: Date = new Date();
  startDate: Date = new Date(
    this.endDate.getFullYear(),
    this.endDate.getMonth(),
    this.endDate.getDate() - 7,
  );
  reportSummary: ReportSummary | null = null;

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.reportService.generateReport(this.startDate, this.endDate).subscribe((response) => {
      this.reportSummary = response.data || null;
      const transformedData = (response.data?.data || []).map((item) => ({
        ...item,
        date: moment(item.date).format('MM/DD'),
      }));

      this.options = {
        width: window.innerWidth * 0.8,
        height: 350,
        data: transformedData,
        series: [
          {
            type: 'line',
            xKey: 'date',
            yKey: 'sales',
          } as AgLineSeriesOptions,
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
          } as AgCategoryAxisOptions,
          {
            type: 'number',
            position: 'left',
            keys: ['sales'],
          } as AgNumberAxisOptions,
        ],
        legend: {
          position: 'bottom',
        },
      };
    });
  }

  onDateChange() {
    if (this.startDate && this.endDate) {
      this.loadReport();
    }
  }

  dateRangeToString(): string {
    const start = moment(this.startDate).format('MMM D, YYYY');
    const end = moment(this.endDate).format('MMM D, YYYY');
    return `${start} - ${end}`;
  }

  simpleDateRangeToString(): string {
    const start = moment(this.startDate).format('MM/DD');
    const end = moment(this.endDate).format('MM/DD');
    return `${start} - ${end}`;
  }
}
