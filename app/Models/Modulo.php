<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission;

class Modulo extends Model
{
    protected $table = "modulos";
    protected $fillable = ["nombre", "icono", "estado"];
    protected $casts = [
        "id" => "integer",
        "estado" => "boolean"
    ];

    public function permisos()
    {
        return $this->hasMany(Permission::class, "id_modulo");
    }
}
