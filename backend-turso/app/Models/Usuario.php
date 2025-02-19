<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'fecha_nacimiento',
        'telefono',
        'correo',
        'imagen_biometrica'
    ];

    public function accesos()
    {
        return $this->hasMany(Acceso::class, 'id_usuario');
    }
}
