<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Invoice;
use App\Models\Subscription;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;

class StripeWebhookController extends CashierWebhookController
{
/**
 * 
 * Handle the customer.subscription.created event.
 */
    public function handleCustomerSubscriptionCreated($payload)
    {
        //Extract Stripe subscription data
        $stripeSubscription = $payload['data']['object'];

        
            $user = User::find($stripeSubscription['metadata']['local_user_id']);
    

        if (!$user) {
            return $this->fail('User not found for Stripe customer ID.');
        }
        

        //Update or create your local subscription record.
        $subscription = Subscription::updateOrCreate(
            [
                'type'          => 'stripe',
                'user_id'       => $user->id,
                'plan_id'       => 2,
                'stripe_id'     => 'sdfdsf',
                'starts_at'     => Carbon::now(),
                'ends_at'       => Carbon::now()->addDay(30), // Set to a day from now
                'stripe_status' => 'active',
                'stripe_price'  => 'price_1JZ9ZzLz1cX4Y2eZzZzZzZzZ',
                'quantity'      => 1,
                'trial_ends_at' => null,
            ]
        );

        $invoice = Invoice::create([
            'subscription_id' => $subscription->id,
            'user_id' => $user->id,
            'stripe_id' => 'sdfdsf',
            'amount' => 100,
            'paid_at' => Carbon::now(),
        ]);
        return $this->successMethod();
    }
}