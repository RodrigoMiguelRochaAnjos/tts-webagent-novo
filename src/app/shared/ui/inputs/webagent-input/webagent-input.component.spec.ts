import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentInputComponent } from './webagent-input.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
