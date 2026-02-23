import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClashCreateComponent } from './clash-create-component';

describe('ClashCreateComponent', () => {
  let component: ClashCreateComponent;
  let fixture: ComponentFixture<ClashCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClashCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClashCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
