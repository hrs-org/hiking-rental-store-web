import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { AddEditPackageComponent } from './add-edit-package.component';

describe('AddEditPackageComponent', () => {
  let component: AddEditPackageComponent;
  let fixture: ComponentFixture<AddEditPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPackageComponent],
      providers: [provideStore({}), provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
