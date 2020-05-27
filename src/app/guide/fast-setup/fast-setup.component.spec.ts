import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastSetupComponent } from './fast-setup.component';

describe('FastSetupComponent', () => {
  let component: FastSetupComponent;
  let fixture: ComponentFixture<FastSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
