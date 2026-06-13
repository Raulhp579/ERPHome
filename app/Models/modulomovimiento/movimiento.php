<?php

namespace App\Models\modulomovimiento;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Table('movimientos')]
#[Fillable(['cantidad', 'categoria', 'fecha', 'tipo', 'user_id','historial', 'created_at', 'update_at', 'deleted_at'])]
class Movimiento extends Model
{
    use SoftDeletes;
    protected $primaryKey = 'id';

    protected $casts = [
        'historial' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
