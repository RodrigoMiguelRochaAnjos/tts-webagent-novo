import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentDateRangeComponent } from './webagent-date-range.component';
import { WebagentInputComponent } from '../../webagent-input/webagent-input.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { InputType } from '../../input-type.enum';

describe('WebagentDateRangeComponent', () => {
  let component: WebagentDateRangeComponent;
  let fixture: ComponentFixture<WebagentDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentDateRangeComponent ],
      imports: [SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentDateRangeComponent);
    component = fixture.componentInstance;

    component.value = new DateRange();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
