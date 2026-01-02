import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { firstName, lastName, email, mobile, plan, amount, subscriptionId, paymentId, timestamp } = data;

        // Google Sheets Web App URL (you'll need to create this)
        const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || '';

        console.log('Google Sheet URL:', GOOGLE_SHEET_URL ? 'Configured ✓' : 'Missing ✗');
        console.log('Sending data to Google Sheets:', { firstName, lastName, email, mobile, plan, amount });

        if (!GOOGLE_SHEET_URL) {
            console.error('Google Sheet URL not configured');
            return NextResponse.json({ success: false, error: 'Sheet URL not configured in .env.local' }, { status: 500 });
        }

        // Send data to Google Sheets
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                mobile,
                plan,
                amount,
                subscriptionId,
                paymentId,
                timestamp,
            }),
        });

        const responseText = await response.text();
        console.log('Google Sheets Response Status:', response.status);
        console.log('Google Sheets Response:', responseText);

        if (!response.ok) {
            throw new Error(`Google Sheets returned status ${response.status}: ${responseText}`);
        }

        return NextResponse.json({ success: true, message: 'Data saved to Google Sheets' });
    } catch (error: any) {
        console.error('Error saving to Google Sheets:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: 'Check server console for more details'
        }, { status: 500 });
    }
}
