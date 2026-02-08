<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LocaleController extends Controller
{
    /**
     * Switch the application locale
     */
    public function switch(Request $request, string $locale)
    {
        if (!in_array($locale, ['en', 'fr'])) {
            abort(400, 'Invalid locale');
        }

        Session::put('locale', $locale);
        App::setLocale($locale);

        // Update user preference if logged in
        if ($user = $request->user()) {
            $user->update(['locale' => $locale]);
        }

        return back();
    }
}
