import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUtilities } from './my-utilities';

describe('MyUtilities', () => {
  let component: MyUtilities;
  let fixture: ComponentFixture<MyUtilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyUtilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyUtilities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
