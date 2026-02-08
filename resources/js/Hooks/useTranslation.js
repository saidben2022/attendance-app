import { usePage } from '@inertiajs/react';

/**
 * Translation hook for easy i18n access
 * Usage: const { t, locale } = useTranslation();
 *        <h1>{t('dashboard.welcome')}</h1>
 */
export function useTranslation() {
    const { translations = {}, locale = 'en' } = usePage().props;

    /**
     * Get a translation by dot-notation key
     * @param {string} key - Dot-notation key like 'nav.dashboard' or 'buttons.save'
     * @param {object} replacements - Optional replacements for :placeholders
     * @returns {string} - Translated string or the key if not found
     */
    const t = (key, replacements = {}) => {
        // Navigate through nested object using dot notation
        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Key not found, return the key itself as fallback
                return key;
            }
        }

        // If value is not a string, return the key
        if (typeof value !== 'string') {
            return key;
        }

        // Replace placeholders like :name with provided values
        let result = value;
        for (const [placeholder, replacement] of Object.entries(replacements)) {
            result = result.replace(`:${placeholder}`, replacement);
        }

        return result;
    };

    return { t, locale, translations };
}

export default useTranslation;
