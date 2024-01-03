import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentTextDateInputComponent } from './webagent-text-date-input.component';

describe('WebagentTextDateInputComponent', () => {
  let component: WebagentTextDateInputComponent;
  let fixture: ComponentFixture<WebagentTextDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentTextDateInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentTextDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
