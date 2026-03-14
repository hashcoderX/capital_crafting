<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
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
        'created_by_admin_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'investment_amount' => 'decimal:2',
            'agreed_interest_rate' => 'decimal:2',
            'return_amount' => 'decimal:2',
        ];
    }
}
