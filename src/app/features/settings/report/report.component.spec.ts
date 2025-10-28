import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { ReportService } from '../../../core/services/report.service';
import { of } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response';
import { ReportSummary } from '../../../core/models/report/report';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let mockReportService: jasmine.SpyObj<ReportService>;

  const mockReportData: ApiResponse<ReportSummary> = {
    success: true,
    data: {
      data: [
        { date: new Date('2025-10-21'), sales: 100 },
        { date: new Date('2025-10-22'), sales: 150 },
        { date: new Date('2025-10-23'), sales: 200 },
        { date: new Date('2025-10-24'), sales: 175 },
        { date: new Date('2025-10-25'), sales: 225 },
      ],
      maxSales: 225,
      minSales: 100,
      totalSales: 850,
    },
    message: 'Success',
  };

  beforeEach(async () => {
    mockReportService = jasmine.createSpyObj('ReportService', ['generateReport']);
    mockReportService.generateReport.and.returnValue(of(mockReportData));

    await TestBed.configureTestingModule({
      imports: [ReportComponent],
      providers: [{ provide: ReportService, useValue: mockReportService }, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default date range (7 days)', () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

      expect(component.endDate.toDateString()).toBe(today.toDateString());
      expect(component.startDate.toDateString()).toBe(sevenDaysAgo.toDateString());
    });

    it('should load report on init', () => {
      fixture.detectChanges();

      expect(mockReportService.generateReport).toHaveBeenCalledWith(
        component.startDate,
        component.endDate,
      );
    });

    it('should initialize with empty chart options', () => {
      expect(component.options).toEqual({});
    });

    it('should initialize reportSummary as null', () => {
      expect(component.reportSummary).toBeNull();
    });
  });

  describe('loadReport()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call reportService.generateReport with correct dates', () => {
      const startDate = new Date('2025-10-01');
      const endDate = new Date('2025-10-31');
      component.startDate = startDate;
      component.endDate = endDate;

      component.loadReport();

      expect(mockReportService.generateReport).toHaveBeenCalledWith(startDate, endDate);
    });

    it('should set reportSummary from API response', () => {
      component.loadReport();

      expect(component.reportSummary).toEqual(mockReportData.data);
      expect(component.reportSummary?.totalSales).toBe(850);
      expect(component.reportSummary?.maxSales).toBe(225);
      expect(component.reportSummary?.minSales).toBe(100);
    });

    it('should transform dates to MM/DD format in chart data', () => {
      component.loadReport();

      expect(component.options.data).toBeDefined();
      const chartData = component.options.data as { date: string; sales: number }[];
      expect(chartData[0].date).toBe('10/21');
      expect(chartData[1].date).toBe('10/22');
      expect(chartData[4].date).toBe('10/25');
    });

    it('should configure chart with correct dimensions', () => {
      component.loadReport();

      expect(component.options.width).toBe(window.innerWidth * 0.8);
      expect(component.options.height).toBe(350);
    });

    it('should configure chart with line series', () => {
      component.loadReport();

      expect(component.options.series).toBeDefined();
      expect(component.options.series?.length).toBe(1);
      const series = component.options.series?.[0] as { type: string; xKey: string; yKey: string };
      expect(series.type).toBe('line');
      expect(series.xKey).toBe('date');
      expect(series.yKey).toBe('sales');
    });

    it('should configure chart axes correctly', () => {
      component.loadReport();

      const options = component.options as {
        axes?: { type: string; position: string; keys?: string[] }[];
      };
      expect(options.axes).toBeDefined();
      expect(options.axes?.length).toBe(2);

      const categoryAxis = options.axes?.[0];
      expect(categoryAxis?.type).toBe('category');
      expect(categoryAxis?.position).toBe('bottom');

      const numberAxis = options.axes?.[1];
      expect(numberAxis?.type).toBe('number');
      expect(numberAxis?.position).toBe('left');
      expect(numberAxis?.keys).toEqual(['sales']);
    });

    it('should configure legend at bottom', () => {
      component.loadReport();

      const options = component.options as { legend?: { position: string } };
      expect(options.legend).toBeDefined();
      expect(options.legend?.position).toBe('bottom');
    });

    it('should handle empty data response', () => {
      const emptyResponse: ApiResponse<ReportSummary> = {
        success: true,
        data: {
          data: [],
          maxSales: 0,
          minSales: 0,
          totalSales: 0,
        },
        message: 'Success',
      };
      mockReportService.generateReport.and.returnValue(of(emptyResponse));

      component.loadReport();

      expect(component.reportSummary).toEqual(emptyResponse.data);
      expect(component.options.data).toEqual([]);
    });

    it('should handle null data in response', () => {
      const nullDataResponse: ApiResponse<ReportSummary> = {
        success: false,
        data: null,
        message: 'No data',
      };
      mockReportService.generateReport.and.returnValue(of(nullDataResponse));

      component.loadReport();

      expect(component.reportSummary).toBeNull();
      expect(component.options.data).toEqual([]);
    });
  });

  describe('onDateChange()', () => {
    beforeEach(() => {
      fixture.detectChanges();
      mockReportService.generateReport.calls.reset();
    });

    it('should reload report when both dates are set', () => {
      component.startDate = new Date('2025-10-01');
      component.endDate = new Date('2025-10-31');

      component.onDateChange();

      expect(mockReportService.generateReport).toHaveBeenCalledWith(
        component.startDate,
        component.endDate,
      );
    });

    it('should not reload report when startDate is null', () => {
      component.startDate = null as unknown as Date;
      component.endDate = new Date('2025-10-31');

      component.onDateChange();

      expect(mockReportService.generateReport).not.toHaveBeenCalled();
    });

    it('should not reload report when endDate is null', () => {
      component.startDate = new Date('2025-10-01');
      component.endDate = null as unknown as Date;

      component.onDateChange();

      expect(mockReportService.generateReport).not.toHaveBeenCalled();
    });

    it('should not reload report when both dates are null', () => {
      component.startDate = null as unknown as Date;
      component.endDate = null as unknown as Date;

      component.onDateChange();

      expect(mockReportService.generateReport).not.toHaveBeenCalled();
    });
  });

  describe('dateRangeToString()', () => {
    it('should format date range with full format', () => {
      component.startDate = new Date('2025-10-21');
      component.endDate = new Date('2025-10-28');

      const result = component.dateRangeToString();

      expect(result).toBe('Oct 21, 2025 - Oct 28, 2025');
    });

    it('should handle dates in different months', () => {
      component.startDate = new Date('2025-09-25');
      component.endDate = new Date('2025-10-05');

      const result = component.dateRangeToString();

      expect(result).toBe('Sep 25, 2025 - Oct 5, 2025');
    });

    it('should handle dates in different years', () => {
      component.startDate = new Date('2024-12-25');
      component.endDate = new Date('2025-01-05');

      const result = component.dateRangeToString();

      expect(result).toBe('Dec 25, 2024 - Jan 5, 2025');
    });
  });

  describe('simpleDateRangeToString()', () => {
    it('should format date range with simple format', () => {
      component.startDate = new Date('2025-10-21');
      component.endDate = new Date('2025-10-28');

      const result = component.simpleDateRangeToString();

      expect(result).toBe('10/21 - 10/28');
    });

    it('should handle single digit dates', () => {
      component.startDate = new Date('2025-10-01');
      component.endDate = new Date('2025-10-09');

      const result = component.simpleDateRangeToString();

      expect(result).toBe('10/01 - 10/09');
    });

    it('should handle dates in different months', () => {
      component.startDate = new Date('2025-09-25');
      component.endDate = new Date('2025-10-05');

      const result = component.simpleDateRangeToString();

      expect(result).toBe('09/25 - 10/05');
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display report summary values', () => {
      component.loadReport();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Total Sales');
      expect(compiled.textContent).toContain('Max Sales');
      expect(compiled.textContent).toContain('Min Sales');
    });

    it('should render ag-charts component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const chartElement = compiled.querySelector('ag-charts');

      expect(chartElement).toBeTruthy();
    });

    it('should render floating date button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const floatingButton = compiled.querySelector('.floating-date-button');

      expect(floatingButton).toBeTruthy();
      expect(floatingButton?.textContent).toContain('calendar_today');
    });

    it('should display date range on floating button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const floatingButton = compiled.querySelector('.floating-date-button');

      expect(floatingButton?.textContent).toContain(component.simpleDateRangeToString());
    });
  });
});
