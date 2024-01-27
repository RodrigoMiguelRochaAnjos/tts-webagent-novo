import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirSegmentComponent } from './air-segment.component';

describe('AirSegmentComponent', () => {
  let component: AirSegmentComponent;
  let fixture: ComponentFixture<AirSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirSegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
