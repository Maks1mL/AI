<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Message;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $subscriber = User::with('plan')->where('id', $user->id)->first();

        $selectedMonth = $request->input('month', Carbon::now()->format('Y-m'));
        $subPage = $request->query('subPage');
        $invPage = $request->query('invPage');
        $monthStart = Carbon::parse($selectedMonth)->startOfMonth();
        $monthEnd = Carbon::parse($selectedMonth)->endOfMonth();

        if ($subscriber->id == 1) {
            // Admin Metrics
            $totalSubscriptions = Subscription::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $totalInvoice = Invoice::whereBetween('paid_at', [$monthStart, $monthEnd])->count();
            $totalRevenue = Invoice::whereBetween('paid_at', [$monthStart, $monthEnd])->sum('amount');
            $totalTextMessages = Message::where('type', 'text')->where('sender', 'assistant')->whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $totalImageMessages = Message::where('type', 'image')->where('sender', 'assistant')->whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $totalAudioMessages = Message::where('type', 'audio')->where('sender', 'assistant')->whereBetween('created_at', [$monthStart, $monthEnd])->count();

            // **Paginate Subscriptions & Invoices for Admin**

            $page = $request->input('page', 0);
            $subPagination = ($subPage - 1) * 10;
            $invoPagination = ($invPage - 1) * 10;



            $subscriptions = Subscription::with('plan')->whereBetween('created_at', [$monthStart, $monthEnd])
                ->skip($subPagination ?? 0)->take(10)->get();
            $invoices = Invoice::with('user')->whereBetween('paid_at', [$monthStart, $monthEnd])
                ->skip($invoPagination ?? 0)->take(10)->get();
        } else {
            // User Limits
            $subscription = Subscription::with('plan')->where('user_id', $subscriber->id)
                ->latest()->first();
            $totalTextChatlimit = $subscription ? $subscription->chat_limit : 0;
            $totalImageChatlimit = $subscription ? $subscription->image_limit : 0;
            $totalAudioChatlimit = $subscription ? $subscription->audio_limit : 0;
            // Count User Messages
            if ($subscription) {
                $monthStart = Carbon::parse($subscription->starts_at);
                $monthEnd = Carbon::parse($subscription->ends_at);
                $totalTextMessages = Message::whereHas('conversation', function ($q) use ($user, $monthStart, $monthEnd) {
                    $q->where('user_id', $user->id)->whereBetween('created_at', [$monthStart, $monthEnd]);
                })->where('sender', 'assistant')->where('type', 'text')->count();

                $totalImageMessages = Message::whereHas('conversation', function ($q) use ($user, $monthStart, $monthEnd) {
                    $q->where('user_id', $user->id)->whereBetween('created_at', [$monthStart, $monthEnd]);
                })->where('sender', 'assistant')->where('type', 'image')->count();

                $totalAudioMessages = Message::whereHas('conversation', function ($q) use ($user, $monthStart, $monthEnd) {
                    $q->where('user_id', $user->id)->whereBetween('created_at', [$monthStart, $monthEnd]);
                })->where('sender', 'assistant')->where('type', 'audio')->count();

                // Fetch user's subscriptions and invoices (without pagination)
                $subscriptions = Subscription::with('plan')->where('id', $subscription->id)->latest()->get();

                $invoices = Invoice::with('user')->where('user_id', $subscriber->id)->get();
            } else {
                $totalTextMessages = 0;
                $totalImageMessages = 0;
                $totalAudioMessages = 0;
                $subscriptions = [];
                $invoices = [];
            }
        }

        return Inertia::render('Dashboard', [
            'subscriptions' => $subscriptions,
            'invoices' => $invoices,
            'totalSubscriptions' => $totalSubscriptions ?? 0,
            'totalInvoice' => $totalInvoice ?? 0,
            'totalRevenue' => $totalRevenue ?? 0,
            'totalTextMessages' => $totalTextMessages,
            'totalImageMessages' => $totalImageMessages,
            'totalAudioMessages' => $totalAudioMessages ?? 0,
            'selectedMonth' => $selectedMonth,
            'totalAudioChatlimit' => $totalAudioChatlimit ?? 0,
            'totalTextChatlimit' => $totalTextChatlimit ?? 0,
            'totalImageChatlimit' => $totalImageChatlimit ?? 0,
        ]);
    }
}
