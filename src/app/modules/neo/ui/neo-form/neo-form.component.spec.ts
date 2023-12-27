import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoFormComponent } from './neo-form.component';

describe('NeoFormComponent', () => {
  let component: NeoFormComponent;
  let fixture: ComponentFixture<NeoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
