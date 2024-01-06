import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentCustomizableDropdownInputComponent } from './webagent-customizable-dropdown-input.component';

describe('WebagentCustomizableDropdownInputComponent', () => {
  let component: WebagentCustomizableDropdownInputComponent;
  let fixture: ComponentFixture<WebagentCustomizableDropdownInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentCustomizableDropdownInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentCustomizableDropdownInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
