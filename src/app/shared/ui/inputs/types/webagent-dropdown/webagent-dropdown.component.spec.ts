import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentDropdownComponent } from './webagent-dropdown.component';

describe('WebagentDropdownComponent', () => {
  let component: WebagentDropdownComponent;
  let fixture: ComponentFixture<WebagentDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
