import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClashSettings } from './clash-settings';

describe('ClashSettings', () => {
  let component: ClashSettings;
  let fixture: ComponentFixture<ClashSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClashSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClashSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
