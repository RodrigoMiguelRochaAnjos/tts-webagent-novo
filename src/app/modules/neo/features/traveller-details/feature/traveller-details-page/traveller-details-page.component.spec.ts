import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellerDetailsPageComponent } from './traveller-details-page.component';

describe('TravellerDetailsPageComponent', () => {
  let component: TravellerDetailsPageComponent;
  let fixture: ComponentFixture<TravellerDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravellerDetailsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravellerDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
