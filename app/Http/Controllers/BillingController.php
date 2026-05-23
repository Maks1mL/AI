<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function invoices(Request $request)
    {
        $user = $request->user();
        // Get a list of the user's invoices
        $invoices = $user->invoices();

        return response()->json(['invoices' => $invoices]);
    }
}
