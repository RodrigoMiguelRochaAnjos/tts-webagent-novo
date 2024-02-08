import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentDateFilterComponent } from './webagent-date-filter.component';

describe('WebagentDateFilterComponent', () => {
  let component: WebagentDateFilterComponent;
  let fixture: ComponentFixture<WebagentDateFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebagentDateFilterComponent]
    });
    fixture = TestBed.createComponent(WebagentDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
