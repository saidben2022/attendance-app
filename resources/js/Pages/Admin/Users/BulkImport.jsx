import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { useToast } from '@/Context/ToastContext';

export default function BulkImport({ cohorts, template }) {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [selectedCohort, setSelectedCohort] = useState('');
    const [skipInvalid, setSkipInvalid] = useState(true);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewData(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.txt'))) {
            setFile(droppedFile);
            setPreviewData(null);
        } else {
            toast.error('Veuillez déposer un fichier CSV');
        }
    };

    const handlePreview = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(route('admin.bulk-import.preview'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            const data = await response.json();

            if (data.success) {
                setPreviewData(data);
                toast.success(`${data.valid_count} lignes valides trouvées`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Erreur lors de la lecture du fichier');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!previewData) return;

        const validRows = previewData.rows
            .filter(r => r.valid || !skipInvalid)
            .map(r => r.data);

        if (validRows.length === 0) {
            toast.error('Aucune ligne valide à importer');
            return;
        }

        setImporting(true);

        try {
            const response = await fetch(route('admin.bulk-import.import'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    rows: validRows,
                    cohort_id: selectedCohort || null,
                    skip_invalid: skipInvalid,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Importation réussie: ${data.stats.created} créés, ${data.stats.updated} mis à jour`);
                setFile(null);
                setPreviewData(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Erreur lors de l\'importation');
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        window.location.href = route('admin.bulk-import.template');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.users.index')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Importation en masse
                        </h2>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="rounded-xl bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Télécharger le modèle
                    </button>
                </div>
            }
        >
            <Head title="Importation en masse" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Instructions */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-200/50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                            <li>Téléchargez le modèle CSV en cliquant sur "Télécharger le modèle"</li>
                            <li>Remplissez le fichier avec les données des utilisateurs</li>
                            <li>Téléversez le fichier ci-dessous</li>
                            <li>Vérifiez les données dans l'aperçu</li>
                            <li>Cliquez sur "Importer" pour créer les utilisateurs</li>
                        </ol>
                        <div className="mt-4 p-3 bg-white/50 rounded-xl">
                            <p className="text-xs text-gray-500 font-medium mb-2">Colonnes attendues:</p>
                            <div className="flex flex-wrap gap-2">
                                {template.map((col) => (
                                    <span
                                        key={col.key}
                                        className={`px-2 py-1 rounded-lg text-xs ${
                                            col.required
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {col.label} {col.required && '*'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                                file ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 hover:border-indigo-400'
                            }`}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            {file ? (
                                <div className="flex items-center justify-center gap-3">
                                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / 1024).toFixed(1)} Ko
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setPreviewData(null);
                                        }}
                                        className="ml-4 text-gray-400 hover:text-red-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Glissez-déposez un fichier CSV ici, ou cliquez pour sélectionner
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Format accepté: CSV (max 2 Mo)
                                    </p>
                                </>
                            )}
                        </div>

                        {file && !previewData && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handlePreview}
                                    disabled={loading}
                                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Analyse en cours...' : 'Analyser le fichier'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    {previewData && (
                        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
                            {/* Stats */}
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Aperçu des données</h3>
                                    <div className="flex gap-4 text-sm">
                                        <span className="text-gray-600">
                                            Total: <strong>{previewData.total}</strong>
                                        </span>
                                        <span className="text-emerald-600">
                                            Valides: <strong>{previewData.valid_count}</strong>
                                        </span>
                                        {previewData.error_count > 0 && (
                                            <span className="text-red-600">
                                                Erreurs: <strong>{previewData.error_count}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
                                                #
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Nom
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Téléphone
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                                                Statut
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {previewData.rows.map((row) => (
                                            <tr
                                                key={row.row_number}
                                                className={row.valid ? 'hover:bg-gray-50' : 'bg-red-50'}
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {row.row_number}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {row.data.name}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {row.data.email}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {row.data.phone}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {row.valid ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            OK
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-red-600 text-xs" title={row.errors.join(', ')}>
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                            Erreur
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Import Options */}
                            <div className="border-t border-gray-200 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Inscrire automatiquement à une cohorte (optionnel)
                                        </label>
                                        <select
                                            value={selectedCohort}
                                            onChange={(e) => setSelectedCohort(e.target.value)}
                                            className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Aucune inscription</option>
                                            {cohorts.map((cohort) => (
                                                <option key={cohort.id} value={cohort.id}>
                                                    {cohort.name} ({cohort.course?.name})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={skipInvalid}
                                                onChange={(e) => setSkipInvalid(e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Ignorer les lignes invalides
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setPreviewData(null);
                                        }}
                                        className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        disabled={importing || previewData.valid_count === 0}
                                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-700 transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {importing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Importation...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                                Importer {previewData.valid_count} utilisateurs
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
