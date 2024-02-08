import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLoadingComponent } from './default-loading.component';

describe('DefaultLoadingComponent', () => {
  let component: DefaultLoadingComponent;
  let fixture: ComponentFixture<DefaultLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultLoadingComponent]
    });
    fixture = TestBed.createComponent(DefaultLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
