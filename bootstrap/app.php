<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
   
    ->withRouting(
        // web: DIR . '/../routes/web.php',
        // commands: DIR . '/../routes/console.php',
        health: '/up',
        using: function () {
            Route::middleware('web')
                ->namespace('App\Http\Controllers')
                ->group(base_path('routes/web.php'));
            Route::middleware('api')
                ->namespace('App\Http\Controllers')
                ->prefix('api')
                ->group(base_path('routes/api.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            '/stripe/webhook',
        ]);
    })
    
    ->withExceptions(function (Exceptions $exceptions) {
        
    })->create();
