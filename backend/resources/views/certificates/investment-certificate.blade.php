<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Investment Certificate</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: Helvetica, Arial, sans-serif;
            color: #0b1220;
            margin: 0;
            padding: 0;
            background: transparent;
        }
        .certificate {
            position: relative;
            width: 100%;
            min-height: 793px;
            overflow: hidden;
            background: transparent;
        }
        .certificate-bg {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }
        .certificate-bg img {
            width: 100%;
            height: 100%;
        }
        .content {
            position: relative;
            z-index: 1;
            padding: 42px 56px 34px;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            font-size: 10px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 14px;
        }
        .heading {
            font-size: 33px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            font-weight: 700;
            margin: 0 0 4px;
        }
        .sub {
            color: #1e293b;
            font-size: 11px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            margin-bottom: 18px;
        }
        .divider {
            margin: 0 0 14px;
        }
        .details-layout {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            background: transparent;
        }
        .details-layout td {
            vertical-align: top;
            width: 50%;
        }
        .details-left {
            padding-right: 26px;
        }
        .details-right {
            padding-left: 26px;
        }
        .detail-row {
            margin: 0 0 8px;
        }
        .detail-label {
            margin: 0;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            font-weight: 700;
            font-size: 10px;
            line-height: 1.05;
        }
        .detail-value {
            margin: 1px 0 0;
            font-size: 12px;
            color: #0f172a;
            font-weight: 700;
            letter-spacing: 0.02em;
            line-height: 1.08;
        }
        .footer {
            margin-top: 14px;
            padding-top: 10px;
            font-size: 10px;
            line-height: 1.2;
            letter-spacing: 0.04em;
            color: #334155;
            text-transform: uppercase;
        }
        .qr-wrap {
            margin-top: 10px;
            text-align: right;
        }
        .qr-wrap .qr-box {
            width: 106px;
            height: 106px;
            padding: 3px;
            background: transparent;
            margin-left: auto;
        }
        .qr-wrap .qr-box img {
            width: 100%;
            height: 100%;
            display: block;
        }
    </style>
</head>
<body>
<div class="certificate">
    @if(!empty($certificateBackgroundDataUri))
        <div class="certificate-bg">
            <img src="{{ $certificateBackgroundDataUri }}" alt="Certificate background">
        </div>
    @endif

    <div class="content">
        <div class="badge">CapitalCrafting</div>
        <div class="heading">Investment Certificate</div>
        <div class="sub">CapitalCrafting Financial Certificate</div>
        <div class="divider"></div>

        <table class="details-layout" role="presentation">
            <tr>
                <td class="details-left">
                    <div class="detail-row">
                        <p class="detail-label">Certificate Code</p>
                        <p class="detail-value">{{ $certificateCode }}</p>
                    </div>
                    <div class="detail-row">
                        <p class="detail-label">Customer Name</p>
                        <p class="detail-value">{{ $investment->customer_name }}</p>
                    </div>
                    <div class="detail-row">
                        <p class="detail-label">Customer Email</p>
                        <p class="detail-value">{{ $investment->customer_email }}</p>
                    </div>
                    <div class="detail-row">
                        <p class="detail-label">Contact Phone</p>
                        <p class="detail-value">{{ $investment->customer_phone ?: '-' }}</p>
                    </div>
                </td>
                <td class="details-right">
                    <div class="detail-row">
                        <p class="detail-label">Investment Topic</p>
                        <p class="detail-value">{{ $investment->investment_topic }}</p>
                    </div>
                    <div class="detail-row">
                        <p class="detail-label">Investment Amount</p>
                        <p class="detail-value">LKR {{ number_format((float) $investment->investment_amount, 2) }}</p>
                    </div>
                    <div class="detail-row">
                        <p class="detail-label">Annual Interest Rate</p>
                        <p class="detail-value">{{ number_format((float) $investment->agreed_interest_rate, 2) }}%</p>
                    </div>
                    <div class="detail-row">
                        <p class="detail-label">Return Amount</p>
                        <p class="detail-value">LKR {{ number_format((float) $investment->return_amount, 2) }}</p>
                    </div>
                    <div class="detail-row">
                        <p class="detail-label">Agreed Time Range</p>
                        <p class="detail-value">{{ $investment->agreed_time_range }}</p>
                    </div>
                    <div class="qr-wrap">
                        <div class="qr-box">
                            <img src="{{ $qrSvgDataUri }}" alt="Certificate QR Code">
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <div class="footer">
            Issued at: {{ $issuedAt }}<br>
            Generated by: CapitalCrafting Admin Portal
        </div>
    </div>
</div>
</body>
</html>
