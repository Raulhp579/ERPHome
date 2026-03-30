<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission;

class Modulo extends Model
{
    protected $table = "modulos";
    protected $fillable = ["nombre"];
    protected $casts = ["id" => "integer"];

    public function permisos()
    {
        return $this->hasMany(Permission::class, "id_modulo");
    }
}
