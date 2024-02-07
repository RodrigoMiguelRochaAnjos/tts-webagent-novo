import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentOptionComponent } from './webagent-option.component';

describe('WebagentOptionComponent', () => {
  let component: WebagentOptionComponent;
  let fixture: ComponentFixture<WebagentOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebagentOptionComponent]
    });
    fixture = TestBed.createComponent(WebagentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
