import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoDatePickerComponent } from './neo-date-picker.component';

describe('NeoDatePickerComponent', () => {
  let component: NeoDatePickerComponent;
  let fixture: ComponentFixture<NeoDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeoDatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeoDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
