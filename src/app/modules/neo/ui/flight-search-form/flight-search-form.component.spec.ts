import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchFormComponent } from './flight-search-form.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('FlightSearchFormComponent', () => {
  let component: FlightSearchFormComponent;
  let fixture: ComponentFixture<FlightSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightSearchFormComponent ],
      imports: [HttpClientModule, SharedModule, FormsModule, ReactiveFormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
