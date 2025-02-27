import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReInsuranceComponent } from './re-insurance.component';

describe('ReInsuranceComponent', () => {
  let component: ReInsuranceComponent;
  let fixture: ComponentFixture<ReInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReInsuranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
