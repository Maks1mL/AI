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
        Schema::create('blog_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('topic')->nullable();
            $table->string('main_keyword')->nullable();
            $table->json('related_keywords')->nullable();
            $table->string('title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('outline')->nullable();
            $table->longText('blog_post')->nullable();
            $table->timestamps();
    
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_data');
    }
};
