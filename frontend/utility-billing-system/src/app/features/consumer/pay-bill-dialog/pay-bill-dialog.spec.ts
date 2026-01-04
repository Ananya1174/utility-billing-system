import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBillDialog } from './pay-bill-dialog';

describe('PayBillDialog', () => {
  let component: PayBillDialog;
  let fixture: ComponentFixture<PayBillDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayBillDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayBillDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
