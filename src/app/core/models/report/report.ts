export interface ReportSummary {
  data: ReportData[];
  maxSales: number;
  minSales: number;
  totalSales: number;
}

export interface ReportData {
  date: Date;
  sales: number;
}
