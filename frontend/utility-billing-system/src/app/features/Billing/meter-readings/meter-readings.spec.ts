import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReadings } from './meter-readings';

describe('MeterReadings', () => {
  let component: MeterReadings;
  let fixture: ComponentFixture<MeterReadings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeterReadings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterReadings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
