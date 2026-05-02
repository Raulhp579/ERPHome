<?php

namespace App\Models\modulomovimiento;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Table('movimientos')]
#[Fillable(['cantidad', 'descripcion', 'tipo', 'user_id', 'created_at', 'update_at', 'deleted_at'])]
class movimiento extends Model
{
    protected $primaryKey = 'id';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
