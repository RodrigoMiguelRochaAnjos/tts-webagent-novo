import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoDatePickerComponent } from './neo-date-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NeoRowModule } from '../neo-row/module/neo-row.module';
import { NeoInputModule } from '../neo-input/module/neo-input.module';
import { HttpClientModule } from '@angular/common/http';

describe('NeoDatePickerComponent', () => {
  let component: NeoDatePickerComponent;
  let fixture: ComponentFixture<NeoDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeoDatePickerComponent ],
      imports: [SharedModule, FormsModule, ReactiveFormsModule, NeoRowModule, NeoInputModule, HttpClientModule]
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
