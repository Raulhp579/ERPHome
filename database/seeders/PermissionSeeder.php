<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permisos = [
            // Módulo Roles
            'ver_roles',
            'crear_roles',
            'actualizar_roles',
            'eliminar_roles',

            // Módulo Usuarios
            'ver_usuarios',
            'crear_usuarios',
            'actualizar_usuarios',
            'eliminar_usuarios',
        ];

        foreach ($permisos as $permiso) {
            Permission::create([
                'name' => $permiso,
                'id_modulo' => 1
            ]);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $admin = Role::where('name', 'admin')->first();
        $admin->givePermissionTo($permisos);
    }
}
