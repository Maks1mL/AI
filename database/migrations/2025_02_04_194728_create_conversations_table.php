<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConversationsTable extends Migration
{
    public function up()
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            // If you have authentication, associate with a user:
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('title')->nullable();
            $table->string('type')->nullable();
            $table->string('status')->default('true');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('conversations');
    }
}
