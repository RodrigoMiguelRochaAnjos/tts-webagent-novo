import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebagentTextComponent } from './webagent-text.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('WebagentTextComponent', () => {
  let component: WebagentTextComponent;
  let fixture: ComponentFixture<WebagentTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebagentTextComponent ],
      imports: [SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
