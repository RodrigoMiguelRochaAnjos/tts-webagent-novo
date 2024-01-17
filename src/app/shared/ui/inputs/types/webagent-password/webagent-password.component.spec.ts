import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentPasswordComponent } from './webagent-password.component';

describe('WebagentPasswordComponent', () => {
  let component: WebagentPasswordComponent;
  let fixture: ComponentFixture<WebagentPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
