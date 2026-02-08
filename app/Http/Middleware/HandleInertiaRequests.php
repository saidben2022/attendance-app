<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Set locale from session or user
        $locale = Session::get('locale', $request->user()?->locale ?? 'en');
        App::setLocale($locale);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->load('roles'),
            ],
            'locale' => $locale,
            'translations' => $this->getTranslations($locale),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Get translations for the current locale
     */
    private function getTranslations(string $locale): array
    {
        $path = lang_path("{$locale}/app.php");

        if (file_exists($path)) {
            return require $path;
        }

        // Fallback to English
        return require lang_path('en/app.php');
    }
}
