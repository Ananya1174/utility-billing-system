import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityRequests } from './utility-requests';

describe('UtilityRequests', () => {
  let component: UtilityRequests;
  let fixture: ComponentFixture<UtilityRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilityRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
