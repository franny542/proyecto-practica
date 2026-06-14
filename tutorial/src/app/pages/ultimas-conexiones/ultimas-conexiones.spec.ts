import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimasConexiones } from './ultimas-conexiones';

describe('UltimasConexiones', () => {
  let component: UltimasConexiones;
  let fixture: ComponentFixture<UltimasConexiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimasConexiones],
    }).compileComponents();

    fixture = TestBed.createComponent(UltimasConexiones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
