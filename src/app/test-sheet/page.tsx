'use client';

import { useState } from 'react';

export default function TestSheet() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const testGoogleSheet = async () => {
        setLoading(true);
        setStatus('Testing...');

        try {
            const response = await fetch('/api/save-to-sheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    mobile: '9876543210',
                    plan: '3 Months Plan',
                    amount: 2799,
                    subscriptionId: 'sub_test_123',
                    paymentId: 'pay_test_456',
                    timestamp: new Date().toISOString(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus('✅ SUCCESS! Check your Google Sheet - a new row should be added!');
            } else {
                setStatus(`❌ ERROR: ${data.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            setStatus(`❌ NETWORK ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    🧪 Google Sheets Test
                </h1>

                <p className="text-gray-600 mb-6">
                    Click the button below to test if data is being saved to your Google Sheet.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-blue-900 mb-2">Test Data:</h2>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• First Name: Test</li>
                        <li>• Last Name: User</li>
                        <li>• Email: test@example.com</li>
                        <li>• Mobile: 9876543210</li>
                        <li>• Plan: 3 Months Plan</li>
                        <li>• Amount: ₹2799</li>
                    </ul>
                </div>

                <button
                    onClick={testGoogleSheet}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors mb-4"
                >
                    {loading ? 'Testing...' : 'Test Google Sheet Integration'}
                </button>

                {status && (
                    <div className={`p-4 rounded-lg ${status.includes('SUCCESS')
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        <p className="font-mono text-sm whitespace-pre-wrap">{status}</p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">📋 Checklist:</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>✓ Google Apps Script deployed</li>
                        <li>✓ GOOGLE_SHEET_URL added to .env.local</li>
                        <li>✓ Dev server restarted</li>
                        <li>□ Test button clicked</li>
                        <li>□ Check Google Sheet for new row</li>
                    </ul>
                </div>

                <div className="mt-4">
                    <a
                        href="/"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        ← Back to Checkout
                    </a>
                </div>
            </div>
        </div>
    );
}
