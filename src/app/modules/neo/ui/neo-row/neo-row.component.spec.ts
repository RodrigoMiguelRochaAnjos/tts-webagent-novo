import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoRowComponent } from './neo-row.component';

describe('NeoRowComponent', () => {
  let component: NeoRowComponent;
  let fixture: ComponentFixture<NeoRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeoRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
