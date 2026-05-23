<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('app_setting', function (Blueprint $table) {
            $table->id();
            $table->string('companyName');
            $table->string('tagLine');
            $table->string('address');
            $table->string('phone');
            $table->string('email');
            $table->string('website');
            $table->string('footer');
            $table->string('bin')->nullable();
            $table->string('mushak')->nullable();
            $table->string('logo')->nullable();
            $table->string('STRIPE_KEY')->nullable();
            $table->string('STRIPE_SECRET')->nullable();
            $table->string('STRIPE_WEBHOOK')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_setting');
    }
};
