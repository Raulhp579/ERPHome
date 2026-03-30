import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUsuariosRolesPermisos } from './gestion-usuarios-roles-permisos';

describe('GestionUsuariosRolesPermisos', () => {
  let component: GestionUsuariosRolesPermisos;
  let fixture: ComponentFixture<GestionUsuariosRolesPermisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionUsuariosRolesPermisos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionUsuariosRolesPermisos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
