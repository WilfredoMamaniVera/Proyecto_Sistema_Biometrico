<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Usuario extends Model
{
    use HasFactory;
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

    public function imagenBiometrica(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => base64_encode($value), // Codifica a Base64 al obtener el valor
            set: fn ($value) => base64_decode($value), // Decodifica desde Base64 al guardar el valor (si es necesario)
        );
    }
}
