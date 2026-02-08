import Modal from './Modal';
import DangerButton from './DangerButton';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default', // 'default' | 'danger'
    processing = false,
}) {
    const ConfirmButton = variant === 'danger' ? DangerButton : PrimaryButton;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    {variant === 'danger' ? (
                        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    ) : (
                        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        {message && (
                            <p className="mt-2 text-sm text-gray-500">{message}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {cancelText}
                    </SecondaryButton>
                    <ConfirmButton onClick={onConfirm} disabled={processing}>
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                            </span>
                        ) : confirmText}
                    </ConfirmButton>
                </div>
            </div>
        </Modal>
    );
}
