<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;

class AdminBillingController extends Controller
{
    /**
     * Optionally, restrict access to admins only.
     */
    public function __construct()
    {
        $user = Auth::user();
        if($user->id !== 1) {
            return redirect()->route('dashboard');
        }
        
    }

    /**
     * Display all subscriptions and invoices.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $userId = Auth::id();
        if($userId !== 1){
            return redirect()->route('dashboard');
        }
        $subscriptions = Subscription::all();
        $invoices = Invoice::all();
        // dd($subscriptions['data'], $invoices['data']);
        return Inertia::render('AdminBilling', [
            'subscriptions' => $subscriptions,
            'invoices'      => $invoices,
        ]);
    }
}
