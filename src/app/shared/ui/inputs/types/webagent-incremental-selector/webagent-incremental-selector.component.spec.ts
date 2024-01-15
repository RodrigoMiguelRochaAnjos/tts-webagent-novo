import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentIncrementalSelectorComponent } from './webagent-incremental-selector.component';

describe('WebagentIncrementalSelectorComponent', () => {
  let component: WebagentIncrementalSelectorComponent;
  let fixture: ComponentFixture<WebagentIncrementalSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentIncrementalSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentIncrementalSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
