<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Biometrico extends Model
{
    use HasFactory;

    // Indicamos el nombre de la tabla en la base de datos
    protected $table = 'biometricos';

    // Definimos los campos asignables
    protected $fillable = [
        'id_persona',
        'imagen',
        'descriptor'
    ];

    public $timestamps = false;

    // Relación con la tabla personas
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }

    // Accesor para obtener la imagen en Base64 (útil para enviar en JSON)
    public function getImagenAttribute($value)
    {
        return $value ? base64_encode($value) : null;
    }

    // Mutador para almacenar la imagen (se espera que el valor enviado esté en Base64)
    public function setImagenAttribute($value)
    {
        $this->attributes['imagen'] = $value ? base64_decode($value) : null;
    }
}
