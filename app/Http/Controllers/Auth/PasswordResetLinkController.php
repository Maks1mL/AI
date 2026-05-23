<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PasswordResetToken;
use App\Http\Controllers\Controller;
use App\MailStructure\MailStructure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    protected MailStructure $MailStructure;

    public function __construct(MailStructure $MailStructure)
    {
        $this->MailStructure = $MailStructure;
    }
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        // $status = Password::sendResetLink(
        //     $request->only('email')
        // );

        // if ($status == Password::RESET_LINK_SENT) {
        //     return back()->with('status', __($status));
        // }

        // throw ValidationException::withMessages([
        //     'email' => [trans($status)],
        // ]);
        $user = User::where('email', $request->email)->first();

        $token = PasswordResetToken::Create(
            [
                'userId' => $user->id,
                'token' => Str::random(60),
                'experiresAt' => now()->addHours(2),
            ]
        );
        $forgetPassLink = env('APP_URL') . '/request-forget-password/' . $token->token;

        $mailData = [
            'title' => 'request forget password',
            'name' => $user->name,
            'resetLink' => $forgetPassLink,
            'expiryHours' => '2',
            'companyName' => 'Your Company Name',
        ];
        $emailSent = $this->MailStructure->requestForgetPassword($request->email, $mailData);

        if ($emailSent === false) {
            return back()->with('status', 'Email not sent!');
        }
        return back()->with('status', 'Password reset link sent on your email!');
    }

    public function index(Request $request)
    {
        $token = $request->route('token');

        $token = PasswordResetToken::where('token', $token)->first();
        $user = User::where('id', $token->userId)->first();

        if (!$token) {
            return response()->json(['error' => 'Invalid Token!'], 404);
        }

        if ($token->experiresAt < now()) {
            return response()->json(['error' => 'Token Expired!'], 404);
        }


        return Inertia::render('Auth/ResetPassword', [
            'token' => $token->token,
            'email' => $user->email,
        ]);
    }

    public function storeNewPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        $user->password = bcrypt($request->password);

        $user->save();

        return redirect()->route('login')->with('status', 'Password reset successfully!');
    }
   
}
