<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogGeneratorController;
use App\Http\Controllers\ImageAnalysisController;

    Route::post('/generate-keyword', [BlogGeneratorController::class, 'generateKeyword']);
    Route::post('/store-keyword', [BlogGeneratorController::class, 'saveOrUpdateKeyword']);
    
    Route::post('/generate-title', [BlogGeneratorController::class, 'generateTitle']);
    Route::post('/store-title', [BlogGeneratorController::class, 'saveOrUpdateTitle']);


    Route::post('/generate-meta-description', [BlogGeneratorController::class, 'generateMetaDescription']);
    Route::post('/store-meta-description', [BlogGeneratorController::class, 'saveOrUpdateMetaDescription']);

    Route::post('/generate-outline', [BlogGeneratorController::class, 'generateOutline']);
    Route::post('/store-outline', [BlogGeneratorController::class, 'saveOrUpdateOutline']);

    Route::post('/generate-blog', [BlogGeneratorController::class, 'generateBlogPost']);

    Route::post('/upsert/blog', [BlogGeneratorController::class, 'updateOrCreateBlogData']);

    Route::post('/ai-vision', [ImageAnalysisController::class, 'analyzeImage']);
