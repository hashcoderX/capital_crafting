<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $customer = $this->getAuthorizedCustomer($request);

        if (!$customer) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $today = now()->startOfDay();

        $investments = Investment::query()
            ->where('customer_email', $customer->email)
            ->latest()
            ->get()
            ->map(function (Investment $investment) use ($today) {
                [$startDate, $endDate] = $this->extractDateRange($investment->agreed_time_range);

                $status = 'running';
                if ($endDate && $endDate->lt($today)) {
                    $status = 'history';
                }

                return [
                    'id' => $investment->id,
                    'customer_name' => $investment->customer_name,
                    'investment_topic' => $investment->investment_topic,
                    'investment_amount' => (string) $investment->investment_amount,
                    'agreed_interest_rate' => (string) $investment->agreed_interest_rate,
                    'return_amount' => (string) $investment->return_amount,
                    'agreed_time_range' => $investment->agreed_time_range,
                    'start_date' => $startDate?->toDateString(),
                    'end_date' => $endDate?->toDateString(),
                    'status' => $status,
                    'certificate_code' => $investment->certificate_code,
                    'certificate_pdf_url' => $investment->certificate_pdf_path
                        ? url('storage/' . $investment->certificate_pdf_path)
                        : null,
                    'created_at' => $investment->created_at,
                ];
            });

        return response()->json([
            'running_investments' => $investments->where('status', 'running')->values(),
            'investment_history' => $investments->where('status', 'history')->values(),
            'summary' => [
                'total_investments' => $investments->count(),
                'running_count' => $investments->where('status', 'running')->count(),
                'history_count' => $investments->where('status', 'history')->count(),
                'total_invested_lkr' => $investments->reduce(function (float $carry, array $row) {
                    return $carry + (float) $row['investment_amount'];
                }, 0),
            ],
        ]);
    }

    private function getAuthorizedCustomer(Request $request): ?User
    {
        $requesterEmail = $request->header('X-User-Email');
        $requesterRole = $request->header('X-User-Role');

        if (!$requesterEmail || $requesterRole !== 'customer') {
            return null;
        }

        return User::where('email', $requesterEmail)
            ->where('role', 'customer')
            ->first();
    }

    /**
     * @return array{0: ?\Illuminate\Support\Carbon, 1: ?\Illuminate\Support\Carbon}
     */
    private function extractDateRange(string $timeRange): array
    {
        preg_match_all('/\d{4}-\d{2}-\d{2}/', $timeRange, $matches);

        if (!isset($matches[0]) || count($matches[0]) < 2) {
            return [null, null];
        }

        try {
            $startDate = now()->parse($matches[0][0])->startOfDay();
            $endDate = now()->parse($matches[0][1])->startOfDay();

            return [$startDate, $endDate];
        } catch (\Throwable) {
            return [null, null];
        }
    }
}
