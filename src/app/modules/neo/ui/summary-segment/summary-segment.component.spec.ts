import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySegmentComponent } from './summary-segment.component';

describe('SummarySegmentComponent', () => {
  let component: SummarySegmentComponent;
  let fixture: ComponentFixture<SummarySegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarySegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
