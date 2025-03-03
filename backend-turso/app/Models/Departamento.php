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
    ];

    // Un departamento tiene muchos usuarios
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_departamento');
    }
}
