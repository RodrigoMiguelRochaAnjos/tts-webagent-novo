import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentInputComponent } from './webagent-input.component';
import { InputType } from '../input-type.enum';

describe('WebagentInputComponent', () => {
  let component: WebagentInputComponent;
  let fixture: ComponentFixture<WebagentInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentInputComponent);
    component = fixture.componentInstance;

    component.type = InputType.TEXT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
