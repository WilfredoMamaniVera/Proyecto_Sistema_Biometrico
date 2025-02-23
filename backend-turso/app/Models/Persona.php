<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Persona extends Model
{
    use HasFactory;

    // Especificamos los campos asignables
    protected $fillable = [
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'fecha_nacimiento',
        'telefono',
        'correo'
    ];

    // Indicamos que no se usarán los timestamps automáticos (ya que usamos 'fecha_registro')
    public $timestamps = false;

    // Relaciones: por ejemplo, una persona puede tener varios accesos y un usuario asociado
    public function accesos()
    {
        return $this->hasMany(Acceso::class, 'id_persona');
    }

    public function usuario()
    {
        return $this->hasOne(Usuario::class, 'id_persona');
    }

    // Si en algún momento se agrega la imagen biométrica en una tabla separada:
    public function biometrico()
    {
        return $this->hasOne(Biometrico::class, 'id_persona');
    }
}
