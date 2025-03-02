<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $primaryKey = 'id_rol';
    public $timestamps = false;

    protected $fillable = [
        'nombre_de_rol',
        'id_usuario'
    ];

    public function creador()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    // Relación muchos a muchos con Usuario mediante la tabla pivote usuario_rol
    // (Si en tu sistema los roles se asignan a varios usuarios)
    public function usuarios()
    {
        return $this->belongsToMany(Usuario::class, 'usuario_rol', 'id_rol', 'id_usuario');
    }
}
