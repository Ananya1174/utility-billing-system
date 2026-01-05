import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsReports } from './accounts-reports';

describe('AccountsReports', () => {
  let component: AccountsReports;
  let fixture: ComponentFixture<AccountsReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
