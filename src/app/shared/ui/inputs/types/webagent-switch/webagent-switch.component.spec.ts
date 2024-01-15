import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentSwitchComponent } from './webagent-switch.component';

describe('WebagentSwitchComponent', () => {
  let component: WebagentSwitchComponent;
  let fixture: ComponentFixture<WebagentSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
