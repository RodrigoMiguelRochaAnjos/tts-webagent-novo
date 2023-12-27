import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentDateComponent } from './webagent-date.component';

describe('WebagentDateComponent', () => {
  let component: WebagentDateComponent;
  let fixture: ComponentFixture<WebagentDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
