<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Horario extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_horario';
    public $timestamps = false;

    protected $fillable = [
        'horario_ingreso',
        'horario_salida',
        'horario_descanso',
        'id_departamento'
    ];

    // Relación: cada horario pertenece a un departamento.
    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_departamento');
    }
}
