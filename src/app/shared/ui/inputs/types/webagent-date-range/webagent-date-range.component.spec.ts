import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentDateRangeComponent } from './webagent-date-range.component';

describe('WebagentDateRangeComponent', () => {
  let component: WebagentDateRangeComponent;
  let fixture: ComponentFixture<WebagentDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentDateRangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
