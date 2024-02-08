import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentCalendarInputComponent } from './webagent-calendar-input.component';

describe('WebagentCalendarInputComponent', () => {
  let component: WebagentCalendarInputComponent;
  let fixture: ComponentFixture<WebagentCalendarInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebagentCalendarInputComponent]
    });
    fixture = TestBed.createComponent(WebagentCalendarInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
