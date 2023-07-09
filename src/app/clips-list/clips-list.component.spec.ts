import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLipsListComponent } from './clips-list.component';

describe('CLipsListComponent', () => {
  let component: CLipsListComponent;
  let fixture: ComponentFixture<CLipsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CLipsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
