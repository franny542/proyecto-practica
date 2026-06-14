import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPremiumComponent } from './navbar';

describe('Navbar', () => {
  let component: NavPremiumComponent;
  let fixture: ComponentFixture<NavPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavPremiumComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavPremiumComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
