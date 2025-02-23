<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Usuario extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nombre_usuario',
        'contraseña',
        'id_persona'
    ];

    // Relación con la tabla personas
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }
}
