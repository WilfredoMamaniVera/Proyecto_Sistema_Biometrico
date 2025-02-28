<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Departamento extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_departamento';
    public $timestamps = false;

    protected $fillable = [
        'nombre_departamento',
        'descripcion_departamento',
        'id_usuario'
    ];

    // Relación: cada departamento pertenece a un usuario.
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    // Relación opcional: un departamento puede tener varios horarios.
    public function horarios()
    {
        return $this->hasMany(Horario::class, 'id_departamento');
    }
}
