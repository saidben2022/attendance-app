export default function ApplicationLogo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">AttendEase</span>
        </div>
    );
}
