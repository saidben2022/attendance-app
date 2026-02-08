<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BulkImportController extends Controller
{
    public function index()
    {
        $cohorts = Cohort::with('course:id,name')
            ->where('is_active', true)
            ->get(['id', 'name', 'course_id']);

        return Inertia::render('Admin/Users/BulkImport', [
            'cohorts' => $cohorts,
            'template' => $this->getTemplateColumns(),
        ]);
    }

    public function preview(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $rows = $this->parseCsv($file->getPathname());

        if (empty($rows)) {
            return response()->json([
                'success' => false,
                'message' => 'Le fichier est vide ou mal formaté',
            ], 422);
        }

        // Validate each row
        $validatedRows = [];
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // +2 because of header and 0-index
            $validation = $this->validateRow($row, $rowNumber);

            $validatedRows[] = [
                'row_number' => $rowNumber,
                'data' => $row,
                'valid' => $validation['valid'],
                'errors' => $validation['errors'],
            ];

            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        return response()->json([
            'success' => true,
            'rows' => $validatedRows,
            'total' => count($rows),
            'valid_count' => count(array_filter($validatedRows, fn($r) => $r['valid'])),
            'error_count' => count(array_filter($validatedRows, fn($r) => !$r['valid'])),
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'rows' => 'required|array|min:1',
            'rows.*.name' => 'required|string|max:255',
            'rows.*.email' => 'required|email',
            'rows.*.phone' => 'required|string|max:20',
            'rows.*.pin' => 'nullable|string|size:4',
            'cohort_id' => 'nullable|exists:cohorts,id',
            'skip_invalid' => 'boolean',
        ]);

        $rows = $request->input('rows');
        $cohortId = $request->input('cohort_id');
        $skipInvalid = $request->input('skip_invalid', true);

        $created = 0;
        $updated = 0;
        $enrolled = 0;
        $skipped = 0;
        $errors = [];

        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 1;

                // Check if user exists
                $existingUser = User::where('email', $row['email'])
                    ->orWhere('phone', $row['phone'])
                    ->first();

                if ($existingUser) {
                    // Update existing user
                    $existingUser->update([
                        'name' => $row['name'],
                    ]);
                    $updated++;
                    $user = $existingUser;
                } else {
                    // Create new user
                    $pin = $row['pin'] ?? $this->generatePin();

                    $user = User::create([
                        'name' => $row['name'],
                        'email' => $row['email'],
                        'phone' => $row['phone'],
                        'pin_code' => Hash::make($pin),
                        'password' => Hash::make('password123'),
                    ]);

                    $user->assignRole('attendee');
                    $created++;
                }

                // Enroll in cohort if specified
                if ($cohortId) {
                    $existingEnrollment = Enrollment::where('user_id', $user->id)
                        ->where('cohort_id', $cohortId)
                        ->first();

                    if (!$existingEnrollment) {
                        Enrollment::create([
                            'user_id' => $user->id,
                            'cohort_id' => $cohortId,
                            'status' => 'active',
                            'enrolled_at' => now(),
                        ]);
                        $enrolled++;
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Importation terminée avec succès',
                'stats' => [
                    'created' => $created,
                    'updated' => $updated,
                    'enrolled' => $enrolled,
                    'skipped' => $skipped,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'importation: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function downloadTemplate()
    {
        $headers = ['Nom', 'Email', 'Téléphone', 'PIN (optionnel)'];
        $example = ['Jean Dupont', 'jean.dupont@example.com', '+33612345678', '1234'];

        $handle = fopen('php://temp', 'w+');
        fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM for Excel

        fputcsv($handle, $headers, ';');
        fputcsv($handle, $example, ';');

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="modele_import_utilisateurs.csv"',
        ]);
    }

    protected function parseCsv($filepath): array
    {
        $rows = [];
        $handle = fopen($filepath, 'r');

        // Skip BOM if present
        $bom = fread($handle, 3);
        if ($bom !== chr(0xEF) . chr(0xBB) . chr(0xBF)) {
            rewind($handle);
        }

        // Get header row
        $header = fgetcsv($handle, 0, ';');
        if (!$header) {
            $header = fgetcsv($handle, 0, ',');
        }

        // Normalize header names
        $headerMap = $this->mapHeaders($header);

        // Parse data rows
        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            if (count($row) === 1 && strpos($row[0], ',') !== false) {
                $row = str_getcsv($row[0], ',');
            }

            if (count($row) >= 3) {
                $mappedRow = [];
                foreach ($headerMap as $key => $index) {
                    $mappedRow[$key] = trim($row[$index] ?? '');
                }
                $rows[] = $mappedRow;
            }
        }

        fclose($handle);
        return $rows;
    }

    protected function mapHeaders(array $header): array
    {
        $map = [];
        $normalized = array_map(fn($h) => strtolower(trim($h)), $header);

        $nameVariants = ['nom', 'name', 'nom complet', 'full name'];
        $emailVariants = ['email', 'e-mail', 'courriel', 'adresse email'];
        $phoneVariants = ['téléphone', 'telephone', 'phone', 'mobile', 'tel'];
        $pinVariants = ['pin', 'code pin', 'pin code'];

        foreach ($normalized as $index => $h) {
            if (in_array($h, $nameVariants)) {
                $map['name'] = $index;
            } elseif (in_array($h, $emailVariants)) {
                $map['email'] = $index;
            } elseif (in_array($h, $phoneVariants)) {
                $map['phone'] = $index;
            } elseif (in_array($h, $pinVariants)) {
                $map['pin'] = $index;
            }
        }

        // Fallback to positional mapping if headers not recognized
        if (!isset($map['name']))
            $map['name'] = 0;
        if (!isset($map['email']))
            $map['email'] = 1;
        if (!isset($map['phone']))
            $map['phone'] = 2;
        if (!isset($map['pin']) && count($header) > 3)
            $map['pin'] = 3;

        return $map;
    }

    protected function validateRow(array $row, int $rowNumber): array
    {
        $errors = [];

        if (empty($row['name'])) {
            $errors[] = "Ligne {$rowNumber}: Le nom est requis";
        }

        if (empty($row['email'])) {
            $errors[] = "Ligne {$rowNumber}: L'email est requis";
        } elseif (!filter_var($row['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Ligne {$rowNumber}: L'email '{$row['email']}' n'est pas valide";
        }

        if (empty($row['phone'])) {
            $errors[] = "Ligne {$rowNumber}: Le téléphone est requis";
        }

        if (!empty($row['pin']) && strlen($row['pin']) !== 4) {
            $errors[] = "Ligne {$rowNumber}: Le PIN doit contenir exactement 4 chiffres";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    protected function getTemplateColumns(): array
    {
        return [
            ['key' => 'name', 'label' => 'Nom', 'required' => true],
            ['key' => 'email', 'label' => 'Email', 'required' => true],
            ['key' => 'phone', 'label' => 'Téléphone', 'required' => true],
            ['key' => 'pin', 'label' => 'PIN (4 chiffres)', 'required' => false],
        ];
    }

    protected function generatePin(): string
    {
        return str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);
    }
}
