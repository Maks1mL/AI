<?php

use App\Models\Plan;
use Inertia\Inertia;
use App\Models\AppSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\STTController;
use App\Http\Controllers\TTSController;
use App\Http\Controllers\LogoController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\Img2ImgController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UpscaleController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppSettingController;
use App\Http\Controllers\EmailConfigController;
use App\Http\Controllers\AdminBillingController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\BlogGeneratorController;
use App\Http\Controllers\ImageAnalysisController;
use App\Http\Controllers\TextGenerationController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\BackgroundRemoverController;
use App\Http\Controllers\ImageGenerationController;
use App\Http\Controllers\StripeOneTimeWebhookController;

///login and register

Route::get('/install', [SetupController::class, 'index']);
Route::post('/install', [SetupController::class, 'setup']);
Route::get('/install/complete', function () {
    return view('successSetup');
});

Route::get('/', function () {
    if (env('APP_SETUP') === false) {
        return redirect('/install');
    }

    $plans = Plan::all();
    $appSetting = AppSetting::first();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'plans' => $plans,
        'appSetting' => $appSetting
    ]);
});

// //password reset
// Route::get('/forgot-password', [PasswordResetLinkController::class, 'forgotPassword'])->name('password.forgetPassword'); 
// Route::post('/forgot-password', [PasswordResetLinkController::class, 'resetPassword'])->name('password.resetPassword'); 



Route::middleware(['auth'])->group(function () {

    //Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    //Dashboard

    //Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
    //Profile

    // /ai-chat 
    Route::get('/ai-chat', [TextGenerationController::class, 'index'])
        ->name('model.index');
    // /ai-chat 

    // ai chat
    Route::post('/generate', [TextGenerationController::class, 'generate'])
        ->name('generate');
    // ai chat

    // image generation
    Route::get('/image-generate', [ImageGenerationController::class, 'index'])
        ->name('image.index');
        
    Route::post('/image-generate', [ImageGenerationController::class, 'generate'])->name('image.generate');
    // image generation



    // Plan endpoints
    Route::resource('admin/plans', PlanController::class);
    // Plan endpoints

    // Admin billing
    Route::get('/admin/billing', [AdminBillingController::class, 'index'])
        ->name('admin.billing.index');
    // Admin billing

    //Provider
    Route::get('/providers', [ProviderController::class, 'index'])
        ->name('provider.index');
    Route::get('/providers/{id}/edit', [ProviderController::class, 'edit'])
        ->name('provider.edit');
    Route::post('/providers/{id}', [ProviderController::class, 'update'])
        ->name('provider.update');
    //Provider

    //App settings
    //check logged in user 
    Route::get('/app-settings', [AppSettingController::class, 'edit'])
        ->name('app-settings.edit');
    Route::post('/app-settings', [AppSettingController::class, 'update'])
        ->name('app-settings.update');
    //App settings

    //Email config
    Route::get('/email-config', [EmailConfigController::class, 'edit'])
        ->name('email-config.edit');
    Route::post('/email-config', [EmailConfigController::class, 'update'])
        ->name('email-config.update');
    //Email config


    // Conversation
    Route::get('/conversations', [ConversationController::class, 'index'])
        ->name('conversations.index');
    Route::get('/conversations/{id}', [ConversationController::class, 'show'])
        ->name('conversations.show');
    Route::post('/conversations', [ConversationController::class, 'store'])
        ->name('conversations.store');
    Route::patch('/conversations/{id}/soft-delete', [ConversationController::class, 'softDelete']);
    // Conversation

    // Subscription endpoints
    Route::get('/subscription-plans', [SubscriptionController::class, 'showPlans'])
        ->name('subscription.plans');
    Route::post('/subscribe', [SubscriptionController::class, 'purchase'])
        ->name('subscribe.purchase');
    Route::get('/subscription/success', [SubscriptionController::class, 'success'])
        ->name('subscription.success');
    Route::get('/subscription/cancel', [SubscriptionController::class, 'cancel'])
        ->name('subscription.cancel');
    Route::get('/subscription', [SubscriptionController::class, 'show'])
        ->name('subscription');
    // Subscription endpoints

    //text to speech
    Route::get('/text-to-speech', [TTSController::class, 'index']);
    Route::post('/generate-tts', [TTSController::class, 'generateSpeech']);
    //text to speech

    //speech to text
    Route::get('/speech-to-text', [STTController::class, 'index'])->name('stt.index');
    Route::post('/transcribe-audio', [STTController::class, 'transcribeAudio'])->name('stt.transcribe');
    //speech to text

    // blog ///
    Route::get('/blog-data', [BlogGeneratorController::class, 'fetchBlogData']);
    Route::post('/generate-keyword', [BlogGeneratorController::class, 'generateKeyword']);
    Route::post('/generate-title', [BlogGeneratorController::class, 'generateTitle']);
    Route::post('/generate-meta-description', [BlogGeneratorController::class, 'generateMetaDescription']);
    Route::post('/generate-outline', [BlogGeneratorController::class, 'generateOutline']);
    Route::post('/generate-blog', [BlogGeneratorController::class, 'generateBlogPost']);
    Route::put('/upsert/blog', [BlogGeneratorController::class, 'updateOrCreateBlogData']);
    Route::get('/blog-data/{id}', [BlogGeneratorController::class, 'getSingleBlogPost']);
    Route::delete('/blog-data/{id}', [BlogGeneratorController::class, 'deleteSingleBlogPost']);
    Route::get('/blog', [BlogGeneratorController::class, 'getAllBlogPost']);
    /// blog //

    //Ai vision //
    Route::get('/ai-vision', [ImageAnalysisController::class, 'showForm'])->name('image.upload');
    Route::post('/analyze-image', [ImageAnalysisController::class, 'analyzeImage'])->name('image.analyze');
    //Ai vision //

    //Img2Img
    Route::post('/generate-img2img', [Img2ImgController::class, 'generate'])->name('generate.img2img');
    //Img2Img

    //remove background
    Route::post('/remove-background', [BackgroundRemoverController::class, 'remove'])->name('remove.background');
    //remove background

    //upscaling
    Route::post('/upscale', [UpscaleController::class, 'upscale'])->name('upscale');
    //upscaling

    //logo
    Route::post('/generate-logo', [LogoController::class, 'generate'])->name('generate.logo');
    //logo



});






//Cancel subscription
Route::post('/subscription/cancel', [SubscriptionController::class, 'cancelSubscription'])->name('subscription.cancelSubscription');


//stripe
Route::get('/invoices', [BillingController::class, 'invoices'])
    ->name('invoices.index');


Route::post('/stripe/webhook', [StripeOneTimeWebhookController::class, 'handleWebhook']);


require __DIR__ . '/auth.php';
