'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { trackPageView, trackEvent } from '@/components/MetaPixel';

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const [paymentDetails, setPaymentDetails] = useState({
        paymentId: '',
        amount: '',
        isAutopay: false,
    });

    useEffect(() => {
        // Get payment details from URL params
        const paymentId = searchParams.get('payment_id') || '';
        const amount = searchParams.get('amount') || '1';
        const isAutopay = searchParams.get('autopay') === 'true';

        setPaymentDetails({
            paymentId,
            amount,
            isAutopay,
        });

        // Track thank you page view
        trackPageView();

        // Track custom thank you event
        trackEvent('ThankYou', {
            payment_id: paymentId,
            value: parseFloat(amount),
            currency: 'INR',
            autopay: isAutopay,
            content_name: isAutopay ? 'Autopay Activated' : 'Payment Completed',
        });
    }, [searchParams]);

    return (
        <main className="min-h-screen flex items-center justify-center p-8">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Success Card */}
                <div className="glass rounded-3xl p-12 text-center card-enter">
                    {/* Success Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center animate-float glow-effect">
                        <span className="text-6xl">✓</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold mb-4 gradient-text">
                        Payment Successful!
                    </h1>

                    {paymentDetails.isAutopay ? (
                        <>
                            <p className="text-xl text-gray-300 mb-2">
                                🎉 Autopay Successfully Activated
                            </p>
                            <p className="text-gray-400 mb-8">
                                Your recurring payment mandate has been set up
                            </p>
                        </>
                    ) : (
                        <p className="text-xl text-gray-300 mb-8">
                            Thank you for your payment
                        </p>
                    )}

                    {/* Payment Details */}
                    <div className="glass rounded-2xl p-6 mb-8 text-left">
                        <h2 className="text-lg font-semibold mb-4 text-center text-gray-300">
                            Payment Details
                        </h2>

                        <div className="space-y-3">
                            {/* Amount */}
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-gray-400">Amount Paid</span>
                                <span className="text-white font-semibold text-lg">₹{paymentDetails.amount}</span>
                            </div>

                            {/* Payment ID */}
                            {paymentDetails.paymentId && (
                                <div className="flex justify-between items-center py-3 border-b border-border">
                                    <span className="text-gray-400">Transaction ID</span>
                                    <span className="text-white font-mono text-sm">{paymentDetails.paymentId}</span>
                                </div>
                            )}

                            {/* Payment Type */}
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-gray-400">Payment Type</span>
                                <span className="text-white font-semibold">
                                    {paymentDetails.isAutopay ? (
                                        <span className="flex items-center gap-2">
                                            <span>🔄</span>
                                            Recurring Autopay
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <span>💳</span>
                                            One-time Payment
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex justify-between items-center py-3">
                                <span className="text-gray-400">Status</span>
                                <span className="px-4 py-1 rounded-full bg-success/20 text-success font-semibold text-sm">
                                    ✓ Completed
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Autopay Info */}
                    {paymentDetails.isAutopay && (
                        <div className="glass rounded-2xl p-6 mb-8 border border-primary/30">
                            <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
                                <span>🔄</span>
                                Autopay Information
                            </h3>
                            <div className="text-left space-y-2 text-sm text-gray-400">
                                <p className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Monthly recurring payment of ₹{paymentDetails.amount} has been set up</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Next payment will be automatically charged on the same date next month</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>You can manage or cancel autopay anytime from your bank/UPI app</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Email notifications will be sent before each charge</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary glow-effect transition-all duration-300 transform hover:scale-105"
                        >
                            ← Back to Home
                        </Link>

                        <button
                            onClick={() => window.print()}
                            className="px-8 py-4 rounded-xl font-semibold text-white glass glass-hover border border-border transition-all duration-300"
                        >
                            🖨️ Print Receipt
                        </button>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <p className="text-sm text-gray-500">
                            A confirmation email has been sent to your registered email address
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            Transaction processed securely by Razorpay
                        </p>
                    </div>
                </div>

                {/* Additional Info Cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass glass-hover rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📧</div>
                        <p className="text-xs text-gray-400">Email Confirmation Sent</p>
                    </div>
                    <div className="glass glass-hover rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">🔒</div>
                        <p className="text-xs text-gray-400">Secure Transaction</p>
                    </div>
                    <div className="glass glass-hover rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">💯</div>
                        <p className="text-xs text-gray-400">100% Safe & Trusted</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
