import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentCheckboxInputComponent } from './webagent-checkbox-input.component';

describe('WebagentCheckboxInputComponent', () => {
  let component: WebagentCheckboxInputComponent;
  let fixture: ComponentFixture<WebagentCheckboxInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentCheckboxInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentCheckboxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
