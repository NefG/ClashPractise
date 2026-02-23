import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClashManagerComponent } from './clash-manager-component';

describe('ClashManagerComponent', () => {
  let component: ClashManagerComponent;
  let fixture: ComponentFixture<ClashManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClashManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClashManagerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
