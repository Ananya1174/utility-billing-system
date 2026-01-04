import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUtilityDialog } from './request-utility-dialog';

describe('RequestUtilityDialog', () => {
  let component: RequestUtilityDialog;
  let fixture: ComponentFixture<RequestUtilityDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestUtilityDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestUtilityDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
