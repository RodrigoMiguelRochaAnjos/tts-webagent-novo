import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentAutocompleteDropdownComponent } from './webagent-autocomplete-dropdown.component';

describe('WebagentAutocompleteDropdownComponent', () => {
  let component: WebagentAutocompleteDropdownComponent;
  let fixture: ComponentFixture<WebagentAutocompleteDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentAutocompleteDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentAutocompleteDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
