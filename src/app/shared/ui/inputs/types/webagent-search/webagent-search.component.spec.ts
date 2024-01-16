import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentSearchComponent } from './webagent-search.component';

describe('WebagentSearchComponent', () => {
  let component: WebagentSearchComponent;
  let fixture: ComponentFixture<WebagentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
