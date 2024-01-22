import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentSliderComponent } from './webagent-slider.component';

describe('WebagentSliderComponent', () => {
  let component: WebagentSliderComponent;
  let fixture: ComponentFixture<WebagentSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
