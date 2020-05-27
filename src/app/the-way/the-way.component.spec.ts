import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheWayComponent } from './the-way.component';

describe('TheWayComponent', () => {
  let component: TheWayComponent;
  let fixture: ComponentFixture<TheWayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheWayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
