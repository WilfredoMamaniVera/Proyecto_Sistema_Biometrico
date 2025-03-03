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
        'id_persona',
        'id_rol',
        'id_departamento'
    ];

    // Relación con la tabla personas
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }
    // Relación: Un usuario pertenece a un rol.
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol');
    }
    // Relación: cada usuario pertenece a un departamento
    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_departamento');
    }
}
