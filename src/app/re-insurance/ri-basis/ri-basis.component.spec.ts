import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiBasisComponent } from './ri-basis.component';

describe('RiBasisComponent', () => {
  let component: RiBasisComponent;
  let fixture: ComponentFixture<RiBasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RiBasisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiBasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
