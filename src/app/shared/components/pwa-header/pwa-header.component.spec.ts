import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaHeaderComponent } from './pwa-header.component';

describe('PwaHeaderComponent', () => {
  let component: PwaHeaderComponent;
  let fixture: ComponentFixture<PwaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PwaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
