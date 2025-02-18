<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Contract\Auth;

class FirebaseAuthMiddleware
{
    protected $auth;

    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();

            if (!$token) {
                return response()->json(['message' => 'Token not provided'], 401);
            }

            $verifiedIdToken = $this->auth->verifyIdToken($token);

            $request->attributes->add(['firebase_uid' => $verifiedIdToken->claims()->get('sub')]);

            return $next($request);

        } catch (\Kreait\Firebase\Exception\Auth\InvalidIdToken $e) {
            return response()->json(['message' => 'Invalid token'], 401);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }
}