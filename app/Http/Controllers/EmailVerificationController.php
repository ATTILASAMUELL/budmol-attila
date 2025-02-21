<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserAuthService;

class EmailVerificationController extends Controller
{
    protected $userAuthService;

    public function __construct(UserAuthService $userAuthService)
    {
        $this->userAuthService = $userAuthService;
    }

    public function verify(Request $request, $id)
    {
        try {
            if (!$request->has('token')) {
                return view('emails.verify-error');
            }

            $token = $request->token;
            $verified = $this->userAuthService->verifyEmail($id, $token);

            if ($verified) {
                return view('emails.verify-response', ['status' => 'success']);
            }

            return view('emails.verify-error');
        } catch (\Exception $e) {
            return view('emails.verify-error');
        }
    }
}
