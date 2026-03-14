<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Balance Confirmation Letter</title>
    <style>
        @page { margin: 42px; }
        body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 12px;
            line-height: 1.45;
            color: #0f172a;
            margin: 0;
        }
        .company { margin-bottom: 20px; }
        .company-name {
            font-size: 15px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .date { margin: 16px 0 20px; }
        .title {
            font-size: 15px;
            font-weight: 700;
            margin: 10px 0 16px;
            text-decoration: underline;
        }
        .section { margin: 12px 0; }
        .list { margin: 6px 0 0 16px; }
        .list-item { margin: 3px 0; }
        .signature-block { margin-top: 34px; }
        .signature-line {
            margin-top: 26px;
            border-top: 1px solid #0f172a;
            width: 240px;
            padding-top: 4px;
            font-size: 11px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="company">
        <div class="company-name">CAPITAL CRAFTING (Pvt.) Ltd.</div>
        <div>[Company Address Line 1]</div>
        <div>[City, Country]</div>
    </div>

    <div class="date">Date: {{ $asOfDate }}</div>

    <div>To Whom It May Concern,</div>

    <div class="title">Balance Confirmation Letter</div>

    <div class="section">Dear Sir/Madam,</div>

    <div class="section">
        This is to certify that the following investment account maintained with CAPITAL CRAFTING (Pvt.) Ltd.
        shows the balance as of {{ $asOfDate }}.
    </div>

    <div class="section">According to our official records:</div>
    <div class="list">
        <div class="list-item">&bull; Account Name: {{ $investment->customer_name }}</div>
        <div class="list-item">&bull; Account Number: {{ $accountNumber }}</div>
        <div class="list-item">&bull; Investment Type: {{ $investment->investment_topic }}</div>
        <div class="list-item">&bull; Balance as of {{ $asOfDate }}: LKR {{ number_format((float) $investment->investment_amount, 2) }}</div>
        <div class="list-item">&bull; Interest Rate: {{ number_format((float) $investment->agreed_interest_rate, 2) }}% per annum</div>
        <div class="list-item">&bull; Investment Period: {{ $investment->agreed_time_range }}</div>
    </div>

    <div class="section">
        Please note that the above balance represents the total investment amount maintained with our institution
        under the stated account.
    </div>

    <div class="section">
        If any withdrawal or disbursement has been made, the details are as follows:
    </div>
    <div class="list">
        <div class="list-item">&bull; Total Amount Withdrawn: LKR {{ number_format((float) ($withdrawnAmount ?? 0), 2) }}</div>
        <div class="list-item">&bull; Withdrawal Method: {{ $withdrawalMethod ?? 'N/A' }}</div>
        <div class="list-item">&bull; Date of Withdrawal: {{ $withdrawalDate ?? '-' }}</div>
    </div>

    <div class="section">
        Should you require any further information or clarification, please do not hesitate to contact us.
    </div>

    <div class="section">Thank you for your cooperation.</div>

    <div class="section">Yours faithfully,</div>

    <div class="signature-block">
        <div class="signature-line">Authorized Signatory<br>Manager<br>Capital Crafting (Pvt.) Ltd.</div>
        <div class="signature-line">Director<br>Capital Crafting (Pvt.) Ltd.</div>
    </div>
</body>
</html>
