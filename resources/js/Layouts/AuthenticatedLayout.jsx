import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useToast } from '@/Context/ToastContext';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const toast = useToast();

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">AttendEase</span>
                                </Link>
                            </div>

                            <div className="hidden space-x-1 sm:-my-px sm:ms-8 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Tableau de bord
                                </NavLink>
                                {user?.roles?.some(r => ['admin', 'coordinator'].includes(r.name)) && (
                                    <>
                                        <NavLink
                                            href={route('admin.courses.index')}
                                            active={route().current('admin.courses.*')}
                                        >
                                            Formations
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.cohorts.index')}
                                            active={route().current('admin.cohorts.*')}
                                        >
                                            Cohortes
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.users.index')}
                                            active={route().current('admin.users.*')}
                                        >
                                            Utilisateurs
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.settings')}
                                            active={route().current('admin.settings*')}
                                        >
                                            Paramètres
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.statistics.index')}
                                            active={route().current('admin.statistics.*')}
                                        >
                                            Statistiques
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.reports.index')}
                                            active={route().current('admin.reports.*')}
                                        >
                                            Rapports
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.audit-log')}
                                            active={route().current('admin.audit-log*')}
                                        >
                                            Journal
                                        </NavLink>
                                    </>
                                )}
                                {user?.roles?.some(r => ['admin', 'coordinator', 'verifier', 'instructor'].includes(r.name)) && (
                                    <NavLink
                                        href={route('verifier.today')}
                                        active={route().current('verifier.*')}
                                    >
                                        Sessions
                                    </NavLink>
                                )}
                                {user?.roles?.some(r => r.name === 'attendee') && (
                                    <NavLink
                                        href={route('attendee.dashboard')}
                                        active={route().current('attendee.*')}
                                    >
                                        Ma présence
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200/50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:from-gray-50 hover:to-white hover:shadow-sm focus:outline-none"
                                            >
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">
                                                        {user?.name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                                {user?.name}
                                                <svg
                                                    className="h-4 w-4 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('help')}>
                                            Aide
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden bg-white/95 backdrop-blur-md'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Tableau de bord
                        </ResponsiveNavLink>
                        {user?.roles?.some(r => ['admin', 'coordinator'].includes(r.name)) && (
                            <>
                                <ResponsiveNavLink href={route('admin.courses.index')} active={route().current('admin.courses.*')}>
                                    Formations
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.cohorts.index')} active={route().current('admin.cohorts.*')}>
                                    Cohortes
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.users.index')} active={route().current('admin.users.*')}>
                                    Utilisateurs
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.settings')} active={route().current('admin.settings*')}>
                                    Paramètres
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.statistics.index')} active={route().current('admin.statistics.*')}>
                                    Statistiques
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.reports.index')} active={route().current('admin.reports.*')}>
                                    Rapports
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.audit-log')} active={route().current('admin.audit-log*')}>
                                    Journal
                                </ResponsiveNavLink>
                            </>
                        )}
                        {user?.roles?.some(r => ['admin', 'coordinator', 'verifier', 'instructor'].includes(r.name)) && (
                            <ResponsiveNavLink href={route('verifier.today')} active={route().current('verifier.*')}>
                                Sessions
                            </ResponsiveNavLink>
                        )}
                        {user?.roles?.some(r => r.name === 'attendee') && (
                            <ResponsiveNavLink href={route('attendee.dashboard')} active={route().current('attendee.*')}>
                                Ma présence
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200/50 pb-1 pt-4">
                        <div className="px-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="text-base font-medium text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('help')}>
                                Aide
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Déconnexion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white/60 backdrop-blur-sm border-b border-gray-200/30">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
