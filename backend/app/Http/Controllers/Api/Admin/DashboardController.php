<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $recentUsers = User::query()
            ->latest()
            ->limit(10)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return response()->json([
            'stats' => [
                'total_users' => User::count(),
                'total_customers' => User::where('role', 'customer')->count(),
                'total_admins' => User::where('role', 'admin')->count(),
            ],
            'recent_users' => $recentUsers,
        ]);
    }

    public function customers(Request $request): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $search = trim((string) $request->query('search', ''));

        $query = User::query()->orderByDesc('id');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%");
            });
        }

        $users = $query->get(['id', 'name', 'email', 'role', 'created_at']);

        return response()->json([
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'customer'])],
        ]);

        $user->update([
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'User role updated successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function storeCustomer(Request $request): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:100'],
            'role' => ['nullable', Rule::in(['admin', 'customer'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'customer',
        ]);

        return response()->json([
            'message' => 'Customer registered successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ],
        ], 201);
    }

    public function updateCustomer(Request $request, User $user): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'max:100'],
            'role' => ['required', Rule::in(['admin', 'customer'])],
        ]);

        if ($admin->id === $user->id && $validated['role'] !== 'admin') {
            return response()->json([
                'message' => 'You cannot remove your own admin role.',
            ], 422);
        }

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return response()->json([
            'message' => 'Customer updated successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        if ($admin->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own admin account.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    public function investments(Request $request): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $investments = Investment::query()
            ->latest()
            ->get([
                'id',
                'customer_name',
                'customer_email',
                'customer_phone',
                'contact_address',
                'investment_topic',
                'investment_amount',
                'agreed_interest_rate',
                'return_amount',
                'agreed_time_range',
                'notes',
                'certificate_code',
                'certificate_pdf_path',
                'certificate_qr_path',
                'created_at',
            ]);

        $investments = $investments->map(function (Investment $investment) {
            return [
                'id' => $investment->id,
                'customer_name' => $investment->customer_name,
                'customer_email' => $investment->customer_email,
                'customer_phone' => $investment->customer_phone,
                'contact_address' => $investment->contact_address,
                'investment_topic' => $investment->investment_topic,
                'investment_amount' => (string) $investment->investment_amount,
                'agreed_interest_rate' => (string) $investment->agreed_interest_rate,
                'return_amount' => (string) $investment->return_amount,
                'agreed_time_range' => $investment->agreed_time_range,
                'notes' => $investment->notes,
                'certificate_code' => $investment->certificate_code,
                'certificate_pdf_url' => $investment->certificate_pdf_path
                    ? url('storage/' . $investment->certificate_pdf_path) . '?v=' . optional($investment->updated_at)->timestamp
                    : null,
                'certificate_qr_url' => $investment->certificate_qr_path
                    ? url('storage/' . $investment->certificate_qr_path)
                    : null,
                'created_at' => $investment->created_at,
            ];
        });

        return response()->json([
            'investments' => $investments,
        ]);
    }

    public function storeInvestment(Request $request): JsonResponse
    {
        $admin = $this->getAuthorizedAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'string', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:30'],
            'contact_address' => ['nullable', 'string', 'max:255'],
            'investment_topic' => ['required', 'string', 'max:120'],
            'investment_amount' => ['required', 'numeric', 'min:0.01'],
            'agreed_interest_rate' => ['required', 'numeric', 'min:0'],
            'return_amount' => ['required', 'numeric', 'min:0.01'],
            'agreed_time_range' => ['required', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1500'],
        ]);

        $investment = Investment::create([
            ...$validated,
            'created_by_admin_id' => $admin->id,
        ]);

        $certificateCode = $this->generateCertificateCode();
        $issuedAt = now()->format('Y-m-d H:i:s');

        $qrPayload = json_encode([
            'certificate_code' => $certificateCode,
            'investment_id' => $investment->id,
            'customer_email' => $investment->customer_email,
            'topic' => $investment->investment_topic,
            'issued_at' => $issuedAt,
        ]);

        // Use SVG output to avoid imagick dependency for PNG generation.
        $qrSvg = QrCode::format('svg')
            ->size(220)
            ->margin(1)
            ->generate($qrPayload);

        $qrPath = 'certificates/qr/' . $certificateCode . '.svg';
        Storage::disk('public')->put($qrPath, $qrSvg);

        $certificateBackgroundDataUri = null;
        $workspaceRootPath = dirname(base_path());
        $candidateBackgroundPaths = [
            $workspaceRootPath . DIRECTORY_SEPARATOR . 'frontend' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'certificate.png',
            public_path('certificate.png'),
            public_path('images/certificate.png'),
            base_path('public/certificate.png'),
        ];

        foreach ($candidateBackgroundPaths as $backgroundPath) {
            if (!is_file($backgroundPath)) {
                continue;
            }

            $backgroundBinary = file_get_contents($backgroundPath);

            if ($backgroundBinary === false) {
                continue;
            }

            $certificateBackgroundDataUri = 'data:image/png;base64,' . base64_encode($backgroundBinary);
            break;
        }

        $pdf = Pdf::loadView('certificates.investment-certificate', [
            'investment' => $investment,
            'certificateCode' => $certificateCode,
            'qrSvgDataUri' => 'data:image/svg+xml;base64,' . base64_encode($qrSvg),
            'certificateBackgroundDataUri' => $certificateBackgroundDataUri,
            'issuedAt' => $issuedAt,
        ])->setPaper('a4', 'landscape');

        $pdfPath = 'certificates/pdfs/' . $certificateCode . '.pdf';
        Storage::disk('public')->put($pdfPath, $pdf->output());

        $investment->update([
            'certificate_code' => $certificateCode,
            'certificate_pdf_path' => $pdfPath,
            'certificate_qr_path' => $qrPath,
        ]);

        return response()->json([
            'message' => 'Investment registered successfully.',
            'investment' => [
                'id' => $investment->id,
                'customer_name' => $investment->customer_name,
                'customer_email' => $investment->customer_email,
                'customer_phone' => $investment->customer_phone,
                'contact_address' => $investment->contact_address,
                'investment_topic' => $investment->investment_topic,
                'investment_amount' => (string) $investment->investment_amount,
                'agreed_interest_rate' => (string) $investment->agreed_interest_rate,
                'return_amount' => (string) $investment->return_amount,
                'agreed_time_range' => $investment->agreed_time_range,
                'notes' => $investment->notes,
                'certificate_code' => $investment->certificate_code,
                'certificate_pdf_url' => url('storage/' . $investment->certificate_pdf_path) . '?v=' . now()->timestamp,
                'certificate_qr_url' => url('storage/' . $investment->certificate_qr_path),
                'created_at' => $investment->created_at,
            ],
        ], 201);
    }

    private function generateCertificateCode(): string
    {
        do {
            $code = 'CC-INV-' . now()->format('Ymd') . '-' . Str::upper(Str::random(6));
        } while (Investment::where('certificate_code', $code)->exists());

        return $code;
    }

    private function getAuthorizedAdmin(Request $request): ?User
    {
        $requesterEmail = $request->header('X-User-Email');
        $requesterRole = $request->header('X-User-Role');

        if (!$requesterEmail || $requesterRole !== 'admin') {
            return null;
        }

        return User::where('email', $requesterEmail)
            ->where('role', 'admin')
            ->first();
    }
}
