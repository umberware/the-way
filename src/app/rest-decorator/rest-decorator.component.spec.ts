import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestDecoratorComponent } from './rest-decorator.component';

describe('RestDecoratorComponent', () => {
  let component: RestDecoratorComponent;
  let fixture: ComponentFixture<RestDecoratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestDecoratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestDecoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
