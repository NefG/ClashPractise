import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClashCircleComponent } from './clash-circle-component';

describe('ClashCircleComponent', () => {
  let component: ClashCircleComponent;
  let fixture: ComponentFixture<ClashCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClashCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClashCircleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
