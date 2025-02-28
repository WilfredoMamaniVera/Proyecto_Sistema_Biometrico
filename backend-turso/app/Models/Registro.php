<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Registro extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_registro';
    public $timestamps = false;

    protected $fillable = [
        'fecha_ingreso', // Opcional si deseas permitir asignarlo manualmente.
        'estado',
        'id_usuario'
    ];

    // Relación: cada registro pertenece a un usuario.
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
