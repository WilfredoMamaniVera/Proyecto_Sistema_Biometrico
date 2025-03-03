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
        'nombre_de_rol'
    ];

    // Relación: Un rol tiene muchos usuarios.
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_rol');
    }
}
