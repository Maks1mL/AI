<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class AppSettingController extends Controller
{
    /**
     * Show the edit form for application settings.
     */

    public function edit()
    {
        // Get the first (seeded) app setting
        $userId = Auth::id();
        if($userId !== 1){
            return redirect()->route('dashboard');
        }
        $appSetting = AppSetting::first();

        return inertia('AppSettings', [
            'appSetting' => $appSetting,
        ]);
    }

    /**
     * Update application settings.
     */
    public function update(Request $request)
    {
        $request->validate([
            'companyName' => 'required|string|max:255',
            'tagLine'     => 'nullable|string|max:255',
            'address'     => 'nullable|string|max:500',
            'phone'       => 'nullable|string|max:50',
            'email'       => 'nullable|email|max:255',
            'website'     => 'nullable|url|max:255',
            'footer'      => 'nullable|string|max:500',
            'bin'         => 'nullable|string|max:255',
            'mushak'      => 'nullable|string|max:255',
            'logo'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Get the first app setting record
        $appSetting = AppSetting::first();

        if (!$appSetting) {
            return redirect()->back()->with('error', 'Settings not found.');
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
            $appSetting->logo = $logoPath;
        }

        // Update other fields
        $appSetting->update($request->except(['logo']));
        if($request->has('STRIPE_KEY')){
            $this->updateEnv(['STRIPE_KEY' => $request->STRIPE_KEY]);
        }
        if($request->has('STRIPE_SECRET')){
            $this->updateEnv(['STRIPE_SECRET' => $request->STRIPE_SECRET]);
        }



        return redirect()->route('app-settings.edit')->with('message', 'Settings updated successfully!');
    }

    private function updateEnv($data)
    {
        $envPath = base_path('.env');
        $envContent = File::get($envPath);

        foreach ($data as $key => $value) {
            $pattern = "/^$key=.*$/m";
            $replacement = "$key=" . (strpos($value, ' ') !== false ? '"' . $value . '"' : $value);
            $envContent = preg_match($pattern, $envContent) ?
                preg_replace($pattern, $replacement, $envContent) :
                $envContent . PHP_EOL . "$key=$value";
        }

        File::put($envPath, $envContent);
    }
}
