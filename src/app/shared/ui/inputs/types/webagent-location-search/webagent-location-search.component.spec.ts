import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentLocationSearchComponent } from './webagent-location-search.component';

describe('WebagentLocationSearchComponent', () => {
  let component: WebagentLocationSearchComponent;
  let fixture: ComponentFixture<WebagentLocationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentLocationSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentLocationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
