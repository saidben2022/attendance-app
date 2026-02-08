import { router } from '@inertiajs/react';

export default function LanguageSwitcher({ currentLocale = 'en' }) {
    const switchLanguage = (locale) => {
        router.get(route('locale.switch', { locale }), {}, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 text-xs rounded transition ${
                    currentLocale === 'en'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                EN
            </button>
            <button
                onClick={() => switchLanguage('fr')}
                className={`px-2 py-1 text-xs rounded transition ${
                    currentLocale === 'fr'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                FR
            </button>
        </div>
    );
}
