<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Stripe\Stripe;
use Stripe\Webhook;
use App\Models\Plan;
use App\Models\User;
use App\Models\Invoice;
use App\Models\AppSetting;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Issuing\Card;

class StripeOneTimeWebhookController extends Controller
{
    /**
     * Handle the incoming Stripe webhook.
     */
    public function handleWebhook(Request $request)
    {
        // Retrieve the raw payload and signature header.
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $appSettings = AppSetting::first();
        $endpointSecret = $appSettings->STRIPE_WEBHOOK;

        try {
            // Verify and construct the event.
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpointSecret
              );
          
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            return response()->json(['error' => 'Invalid payload'], 401);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            return response()->json(['error' => 'Invalid signature', "event"=> $sig_header ], 402);
        }

        Log::info('Stripe webhook event received', ['type' => $event->type]);

        // Handle the events we care about.
        switch ($event->type) {
            case 'checkout.session.completed':
                $this->handleCheckoutSessionCompleted($event->data->object);
                break;
            case 'payment_intent.payment_failed':
                $this->handlePaymentIntentPaymentFailed($event->data->object);
                break;
            default:
                return response()->json(['status' => 'success'], 200);
                break;
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Optionally handle the payment_intent.succeeded event.
     *
     * This event may provide additional confirmation details.
     */
    protected function handleCheckoutSessionCompleted($paymentIntent)
    {

        // Retrieve metadata passed in the Checkout Session.
        $localUserId = $paymentIntent->metadata->local_user_id;
        $plan_id   = $paymentIntent->metadata->plan_id;
        $plan = Plan::where('id', $plan_id)->first();

        $user = User::where('id', $localUserId)->first();
        $user->planId = $plan_id;
        $user->save();

        //check user has subscription between the dates
        $subscription = Subscription::where('user_id', $localUserId)->where('ends_at', '>', Carbon::now())->first();
        if(!$subscription){
            $subscription = Subscription::create([
                'user_id'       => $localUserId,
                'plan_id'       => $plan_id,
                'chat_limit'    => $plan->chat_limit,
                'image_limit'   => $plan->image_limit,
                'audio_limit'   => $plan->audio_limit,
                'starts_at'     => Carbon::now(),
                'ends_at'       => Carbon::now()->addDay(30),
            ]);
        }else{
            $lastSubscription = Subscription::where('user_id', $localUserId)->latest()->first();
            $newSubEndDate = Carbon::parse($lastSubscription->ends_at)->addDay(30);
            
            $subscription = Subscription::create([
                'user_id'       => $localUserId,
                'plan_id'       => $plan_id,
                'chat_limit'    => $plan->chat_limit + $lastSubscription->chat_limit,
                'image_limit'   => $plan->image_limit + $lastSubscription->image_limit,
                'audio_limit'   => $plan->audio_limit + $lastSubscription->audio_limit,
                'starts_at'     => Carbon::now(),
                'ends_at'       => $newSubEndDate,
            ]);

        }


        // Create a local invoice record.
        Invoice::create([
            'user_id'           => $localUserId,
            'subscription_id'   => $subscription->id,
            'amount'            => $plan->price,
            'paid_at'           => Carbon::now(),
        ]);
       
    }

    protected function handlePaymentIntentPaymentFailed($paymentIntent)
    {
        return response()->json(['status' => 'failed'], 400);
    }
}
