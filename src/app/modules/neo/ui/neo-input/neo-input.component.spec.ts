import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoInputComponent } from './neo-input.component';
import { HttpClientModule } from '@angular/common/http';

describe('NeoInputComponent', () => {
  let component: NeoInputComponent;
  let fixture: ComponentFixture<NeoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeoInputComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
