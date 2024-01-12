import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentDateComponent } from './webagent-date.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('WebagentDateComponent', () => {
  let component: WebagentDateComponent;
  let fixture: ComponentFixture<WebagentDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentDateComponent ],
      imports: [SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
