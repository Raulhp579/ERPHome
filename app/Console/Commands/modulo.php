<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('make:modulo {nombre}')]
#[Description('Crea un nuevo modulo')]
class modulo extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $nombre = $this->argument('nombre');
        $nombreCarpeta = 'modulo' . $nombre;

        $this->info('Creando modulo: '.$nombre.' en la carpeta '.$nombreCarpeta);

        $frontPath = base_path('front/src/app/' . $nombreCarpeta);
        if (! is_dir($frontPath)) {
            mkdir($frontPath, 0777, true);
            $this->info('Carpeta de frontend creada en: front/src/app/' . $nombreCarpeta);
        }

        $this->call('make:controller', [
            'name' => $nombreCarpeta . '\\' . $nombre . 'Controller',
        ]);

        $this->call('make:model', [
            'name' => $nombreCarpeta . '\\' . $nombre,
        ]);

        $this->generarSQL($nombre);
        $this->info('SQL generado en database/updateSQL.sql');
    }

    private function generarSQL(string $nombre): void
    {
        $nombreLower = strtolower($nombre);
        $sqlPath = database_path('updateSQL.sql');

        if (! file_exists($sqlPath)) {
            file_put_contents($sqlPath,
                "-- ============================================================\n".
                "--  ERPHome - Script de inserción de módulos y permisos\n".
                "--  Tabla: modulos + permissions (Spatie)\n".
                "--  Patrón: 4 permisos por módulo (ver, crear, actualizar, eliminar)\n".
                "-- ============================================================\n\n"
            );
        }

        $bloque = <<<SQL

INSERT INTO `modulos` (`nombre`, `icono`, `estado`, `created_at`, `updated_at`) VALUES
('{$nombre}', 'extension', 1, NOW(), NOW());

SET @id_modulo = LAST_INSERT_ID();

INSERT INTO `permissions` (`name`, `guard_name`, `id_modulo`, `created_at`, `updated_at`) VALUES
('ver_{$nombreLower}',        'web', @id_modulo, NOW(), NOW()),
('crear_{$nombreLower}',      'web', @id_modulo, NOW(), NOW()),
('actualizar_{$nombreLower}', 'web', @id_modulo, NOW(), NOW()),
('eliminar_{$nombreLower}',   'web', @id_modulo, NOW(), NOW());

SQL;

        file_put_contents($sqlPath, $bloque, FILE_APPEND);
    }
}
