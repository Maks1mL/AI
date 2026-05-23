<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanController extends Controller
{
    /**
     * Apply middleware to ensure only the super admin (user ID 1) can access these endpoints.
     */
    public function __construct()
    {   
        $this->middleware(function ($request, $next) {
            $user = Auth::class;
            $subscriber = $user::user();
            if ($subscriber->id !== 1) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
            return $next($request);
        });
    }

    /**
     * Display a listing of all plans as an Inertia view.
     */
    public function index()
    {
        $plans = Plan::all();
        return Inertia::render('AdminPlans', [
            'plans' => $plans,
            // Optionally, you can pass flash messages:
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created plan in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'price'           => 'required|numeric',
            'chat_limit'      => 'required|integer',
            'image_limit'     => 'required|integer',
            'audio_limit'     => 'required|integer',
            'stripe_price_id' => 'nullable|string',
        ]);

        Plan::create($data);

        return redirect()->route('plans.index')
                         ->with('success', 'Plan created successfully!');
    }

    /**
     * Update the specified plan in storage.
     */
    public function update(Request $request, Plan $plan)
    {
        $data = $request->validate([
            'name'            => 'sometimes|required|string|max:255',
            'price'           => 'sometimes|required|numeric',
            'chat_limit'      => 'sometimes|required|integer',
            'image_limit'     => 'sometimes|required|integer',
            'audio_limit'     => 'sometimes|required|integer',
            'stripe_price_id' => 'nullable|string',
        ]);

        $plan = Plan::find($plan->id);
        $plan->name = $data['name'] ?? $plan->name;
        $plan->price = $data['price'] ?? $plan->price;
        $plan->chat_limit = $data['chat_limit'] ?? $plan->chat_limit;
        $plan->image_limit = $data['image_limit'] ?? $plan->image_limit;
        $plan->audio_limit = $data['audio_limit'] ?? $plan->audio_limit;
        $plan->stripe_price_id = $data['stripe_price_id'] ?? $plan->stripe_price_id;
        $plan->save();

        return redirect()->route('plans.index')
                         ->with('success', 'Plan updated successfully!');
    }

    /**
     * Remove the specified plan from storage.
     */
    public function destroy(Plan $plan)
    {
        
        $user = User::where('planId', $plan->id)->get();
        if ($user) {
            return redirect()->route('plans.index')
                             ->with('error', 'Cannot delete plan with active subscribers.');
        }
        $plan->delete();
        return redirect()->route('plans.index')
                         ->with('success', 'Plan deleted successfully!');
    }
}

