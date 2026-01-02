'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackEvent } from '@/components/FacebookPixel';

function ThankYouContent() {
    const searchParams = useSearchParams();
    const [orderDetails, setOrderDetails] = useState({
        orderId: '',
        amount: '',
        paymentId: '',
        subscriptionId: '',
        type: 'subscription',
    });

    useEffect(() => {
        // Get order details from URL params
        const orderId = searchParams.get('order_id') || '';
        const amount = searchParams.get('amount') || '1.00';
        const paymentId = searchParams.get('payment_id') || '';
        const subscriptionId = searchParams.get('subscription_id') || '';
        const type = searchParams.get('type') || 'subscription';

        setOrderDetails({
            orderId,
            amount,
            paymentId,
            subscriptionId,
            type,
        });

        // Track page view and conversion
        trackEvent('PageView');

        // Track Lead event (successful conversion)
        trackEvent('Lead', {
            content_name: 'MakeUp Mastry Club',
            content_category: type === 'subscription' ? 'Subscription' : 'One-time',
            value: parseFloat(amount),
            currency: 'INR',
        });

        // Track CompleteRegistration
        trackEvent('CompleteRegistration', {
            content_name: 'MakeUp Mastry Club',
            status: 'completed',
            value: parseFloat(amount),
            currency: 'INR',
        });
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        🎉 Payment Successful!
                    </h1>

                    <p className="text-xl text-gray-600 mb-2">
                        Welcome to MakeUp Mastry Club!
                    </p>

                    <p className="text-lg text-gray-500">
                        Your journey to mastering makeup artistry begins now
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Order Confirmation
                    </h2>

                    <div className="space-y-4">
                        {orderDetails.subscriptionId && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Subscription ID</span>
                                <span className="text-gray-900 font-mono text-sm">{orderDetails.subscriptionId}</span>
                            </div>
                        )}

                        {orderDetails.orderId && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Order ID</span>
                                <span className="text-gray-900 font-mono text-sm">{orderDetails.orderId}</span>
                            </div>
                        )}

                        {orderDetails.paymentId && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Payment ID</span>
                                <span className="text-gray-900 font-mono text-sm">{orderDetails.paymentId}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Payment Type</span>
                            <span className="text-gray-900 font-semibold capitalize">
                                {orderDetails.type === 'subscription' ? (
                                    <span className="inline-flex items-center gap-1 text-blue-600">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" clipRule="evenodd" />
                                        </svg>
                                        Monthly Subscription
                                    </span>
                                ) : (
                                    'One-time Payment'
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4 mt-4">
                            <span className="text-gray-700 font-semibold text-lg">Amount Paid</span>
                            <span className="text-green-600 font-bold text-2xl">₹{orderDetails.amount}</span>
                        </div>
                    </div>
                </div>

                {/* What's Next Card */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-6">
                    <h2 className="text-2xl font-bold mb-4">🚀 What's Next?</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Check Your Email</h3>
                                <p className="text-blue-100 text-sm">
                                    We've sent your login credentials and access instructions to your email address.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Access Your Dashboard</h3>
                                <p className="text-blue-100 text-sm">
                                    Login to your member dashboard and start exploring the course content.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Join Our Community</h3>
                                <p className="text-blue-100 text-sm">
                                    Connect with fellow students and get support from our expert instructors.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Reminder */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Your Membership Includes:</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-gray-900">Weekly New Lessons</h3>
                                <p className="text-sm text-gray-600">Fresh content every week</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-gray-900">Expert Guidance</h3>
                                <p className="text-sm text-gray-600">Learn from professionals</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-gray-900">Certification</h3>
                                <p className="text-sm text-gray-600">Official certificate on completion</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-gray-900">Lifetime Access</h3>
                                <p className="text-sm text-gray-600">All course materials forever</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="mailto:support@makeupmastryclubcom"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Support
                    </a>

                    <a
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go to Dashboard
                    </a>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Need help? Contact us at <a href="mailto:support@makeupmastryclubcom" className="text-blue-600 hover:underline">support@makeupmastryclubcom</a></p>
                </div>
            </div>
        </div>
    );
}

export default function ThankYou() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
