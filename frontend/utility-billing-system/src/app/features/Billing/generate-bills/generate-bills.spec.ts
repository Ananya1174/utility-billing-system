import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBills } from './generate-bills';

describe('GenerateBills', () => {
  let component: GenerateBills;
  let fixture: ComponentFixture<GenerateBills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateBills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
