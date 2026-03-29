<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

Route::get('/{any}', function ($any = '') {
    $angularDist = public_path('angular/browser');

    // Serve static Angular assets directly
    $filePath = $angularDist . '/' . $any;
    if ($any !== '' && file_exists($filePath) && !is_dir($filePath)) {
        $mime = mime_content_type($filePath);
        // Fix MIME type for JS modules
        if (str_ends_with($any, '.js')) {
            $mime = 'application/javascript';
        } elseif (str_ends_with($any, '.css')) {
            $mime = 'text/css';
        }
        return Response::make(file_get_contents($filePath), 200, ['Content-Type' => $mime]);
    }

    // SPA fallback
    return Response::make(
        file_get_contents($angularDist . '/index.html'),
        200,
        ['Content-Type' => 'text/html']
    );
})->where('any', '.*');
