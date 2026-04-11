<?php

namespace Database\Seeders;

use App\Models\Modulo;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::create([
            'name' => 'admin'
        ]);

        Role::create([
            'name' => 'usuario'
        ]);

        User::factory(100)->create();
        
        Modulo::create([
            'nombre' => 'autenticacion',
            'icono' => 'admin_panel_settings',
            'estado' => true
        ]);

        $this->call(PermissionSeeder::class);

        User::factory()->create([
            'name' => 'Raúl',
            'email' => 'raulhenares5@gmail.com',
            'password'=>"12345678"
        ])->assignRole('admin');
    }
}
