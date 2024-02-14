import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentSliderComponent } from './webagent-slider.component';

describe('WebagentSliderComponent', () => {
  let component: WebagentSliderComponent;
  let fixture: ComponentFixture<WebagentSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebagentSliderComponent]
    });
    fixture = TestBed.createComponent(WebagentSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
