<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Priority: session > user preference > browser > default
        $locale = Session::get('locale');

        if (!$locale && $user = $request->user()) {
            $locale = $user->locale;
        }

        if (!$locale) {
            $locale = substr($request->server('HTTP_ACCEPT_LANGUAGE', 'en'), 0, 2);
        }

        if (!in_array($locale, ['en', 'fr'])) {
            $locale = 'en';
        }

        App::setLocale($locale);
        Session::put('locale', $locale);

        return $next($request);
    }
}
