<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProviderController extends Controller
{
    /**
     * Display a listing of all providers.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        if($userId !== 1){
            return redirect()->route('dashboard');
        }
        $providers = Provider::all();
        return inertia('ProviderIndex', [
            'providers' => $providers,
        ]);
    }

    /**
     * Show the edit form for a given provider.
     */
    public function edit($id)
    {
        $provider = Provider::findOrFail($id);
        return inertia('ProviderEdit', [
            'provider' => $provider,
        ]);
    }

    /**
     * Update the specified provider.
     */
    public function update(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'url'     => 'required|url',
            'api_key' => 'required|string',
        ]);

        $provider->update($data);

        return redirect()->route('provider.index')
            ->with('message', 'Provider updated successfully!');
    }
}
