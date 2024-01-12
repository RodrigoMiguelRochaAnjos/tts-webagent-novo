import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentLocationSearchComponent } from './webagent-location-search.component';
import { HttpClientModule } from '@angular/common/http';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { SharedModule } from 'src/app/shared/shared.module';

describe('WebagentLocationSearchComponent', () => {
  let component: WebagentLocationSearchComponent;
  let fixture: ComponentFixture<WebagentLocationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentLocationSearchComponent ],
      imports: [HttpClientModule, SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentLocationSearchComponent);
    component = fixture.componentInstance;

    component.value = new SelectedLocation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
