<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Plan;
use App\Models\User;
use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;



class SubscriptionController extends Controller
{

    public function show(){
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId);
        $subscription = $user->activeSubscription()
            ->with('plan')
            ->first();

        $userAllSubscriptions = Subscription::with('plan')->where('user_id', $user->id)->get();
        if ($subscription) {
            $invoices = Invoice::with("user")->where('user_id', $user->id)
                ->where('subscription_id', $subscription->id)
                ->get();
        } else {
            $invoices = [];
        }

        return inertia('Subscription', [
            'user' => $user,
            'subscriptions' => $userAllSubscriptions,
            'invoices' => $invoices,
        ]);
    }
   
    public function showPlans(Request $request)
    {
        $plans = Plan::all();
        $activeSubscription = $request->user()
            ->activeSubscription()
            ->with('plan')
            ->first();
        $appsettings = AppSetting::first();
        if($appsettings->STRIPE_KEY){
            $stripeKey = $appsettings->STRIPE_KEY;
        }else{
            $stripeKey = env('STRIPE_KEY') ?? null;
        }

        return inertia('SubscriptionPlans', [
            'plans' => $plans,
            'activeSubscription' => $activeSubscription,
            'stripeKey' => $stripeKey,
        ]);
    }
    public function purchase(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plan,id',
        ]);

        $user = $request->user();
        $plan = Plan::findOrFail($request->plan_id);
        $stripePriceId = $plan->stripe_price_id;
        $quantity = 1;


        if ($plan->price > 0) {
            // For paid plans, create a Stripe Checkout session.
            // Make sure the user has a valid payment method (or let Stripe collect it during checkout).
            $checkoutSession = $user->checkout([
                $stripePriceId => $quantity
            ], [
                'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url'  => route('subscription.cancel'),
                'metadata'    => ['local_user_id' => $user->id, 'plan_id' => $plan->id],
            ]);

            return response()->json(['checkout_session_id' => $checkoutSession->id]);
        } else {
            // For free plans, create the subscription immediately (or set a trial period as needed).
            $user->newSubscription('default', $plan->stripe_price_id ?? 'free')
                ->create(); // For free plans, no payment is required.
            return response()->json(['message' => 'Subscription activated successfully!']);
        }
    }


    public function success()
    {
        return redirect()->route('subscription.plans')->with('message', 'Subscription purchased successfully!');
    }


    public function cancel()
    {
        return redirect()->route('subscription.plans')->with('message', 'Subscription purchase was cancelled.');
    }
}
