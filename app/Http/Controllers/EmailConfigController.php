<?php

namespace App\Http\Controllers;

use App\Models\EmailConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailConfigController extends Controller
{
    /**
     * Show the email configuration edit form.
     */
    public function edit()
    {
        $userId = Auth::id();
        if($userId !== 1){
            return redirect()->route('dashboard');
        }
        // Get the first (seeded) email config
        $emailConfig = EmailConfig::first();

        return inertia('EmailConfig', [
            'emailConfig' => $emailConfig,
        ]);
    }

    /**
     * Update the email configuration settings.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'emailConfigName' => 'required|string|max:255',
            'emailHost'       => 'required|string|max:255',
            'emailPort'       => 'required|integer',
            'emailUser'       => 'required|string|max:255',
            'emailPass'       => 'required|string|max:255',
        ]);

        // Update existing record
        $emailConfig = EmailConfig::first();
        $emailConfig->update($data);

        return redirect()->route('email-config.edit')
            ->with('message', 'Email configuration updated successfully!');
    }
}
