import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { ReportSummary } from '../models/report/report';
import { REPORT_PREFIX } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ReportService {
  http = inject(HttpClient);

  generateReport(startDate: Date, endDate: Date) {
    return this.http.get<ApiResponse<ReportSummary>>(REPORT_PREFIX, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  }
}
