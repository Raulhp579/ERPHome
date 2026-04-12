import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRol } from './asignar-rol';

describe('AsignarRol', () => {
  let component: AsignarRol;
  let fixture: ComponentFixture<AsignarRol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarRol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarRol);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
