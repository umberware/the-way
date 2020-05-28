import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamLogoComponent } from './stream-logo.component';

describe('StreamLogoComponent', () => {
  let component: StreamLogoComponent;
  let fixture: ComponentFixture<StreamLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
