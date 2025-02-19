<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Definir rutas de la aplicación.
     */
    public function boot(): void
    {
        $this->routes(function () {
            // Rutas Web (Frontend)
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            // Rutas API (Backend)
            Route::middleware('api')
                ->prefix('api') // Aplica automáticamente el prefijo "api/"
                ->group(base_path('routes/api.php'));
        });
    }
}
