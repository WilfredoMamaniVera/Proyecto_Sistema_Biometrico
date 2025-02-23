<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acceso extends Model
{
    protected $primaryKey = 'id_acceso';
    public $timestamps = false;

    protected $fillable = [
        'id_persona',
        'area_acceso'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }
}
