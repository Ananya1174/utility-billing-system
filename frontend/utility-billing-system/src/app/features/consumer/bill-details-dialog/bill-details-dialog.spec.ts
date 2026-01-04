import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDetailsDialog } from './bill-details-dialog';

describe('BillDetailsDialog', () => {
  let component: BillDetailsDialog;
  let fixture: ComponentFixture<BillDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillDetailsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
