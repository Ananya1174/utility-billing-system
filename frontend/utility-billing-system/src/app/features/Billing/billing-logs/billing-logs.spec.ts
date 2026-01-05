import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingLogs } from './billing-logs';

describe('BillingLogs', () => {
  let component: BillingLogs;
  let fixture: ComponentFixture<BillingLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
