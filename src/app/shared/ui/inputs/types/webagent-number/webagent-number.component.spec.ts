import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentNumberComponent } from './webagent-number.component';

describe('WebagentNumberComponent', () => {
  let component: WebagentNumberComponent;
  let fixture: ComponentFixture<WebagentNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
