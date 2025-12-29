'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { trackPageView, trackEvent } from '@/components/MetaPixel';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState({
    paymentId: '',
    amount: '',
    isAutopay: false,
  });

  useEffect(() => {
    const paymentId = searchParams.get('payment_id') || '';
    const amount = searchParams.get('amount') || '1';
    const isAutopay = searchParams.get('autopay') === 'true';

    setPaymentDetails({ paymentId, amount, isAutopay });

    // Track page view
    trackPageView();

    // Track Purchase conversion event (most important for Facebook Ads)
    trackEvent('Purchase', {
      value: parseFloat(amount),
      currency: 'INR',
      transaction_id: paymentId,
      content_name: isAutopay ? 'Autopay Subscription' : 'One-time Payment',
      content_type: isAutopay ? 'subscription' : 'product',
      num_items: 1,
    });

    // Track custom ThankYou event for additional insights
    trackEvent('ThankYou', {
      payment_id: paymentId,
      value: parseFloat(amount),
      currency: 'INR',
      autopay: isAutopay,
      content_name: isAutopay ? 'Autopay Activated' : 'Payment Completed',
    });

    // Track Lead event if autopay (for lead generation campaigns)
    if (isAutopay) {
      trackEvent('Lead', {
        value: parseFloat(amount),
        currency: 'INR',
        content_name: 'Autopay Subscription',
      });
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="w-full max-w-2xl relative z-10">
        <div className="glass rounded-3xl p-12 text-center card-enter">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center animate-float glow-effect">
            <span className="text-6xl">✓</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Payment Successful!</h1>
          {paymentDetails.isAutopay ? (
            <>
              <p className="text-xl text-gray-300 mb-2">🎉 Autopay Successfully Activated</p>
              <p className="text-gray-400 mb-8">Your recurring payment mandate has been set up</p>
            </>
          ) : (
            <p className="text-xl text-gray-300 mb-8">Thank you for your payment</p>
          )}
          <div className="glass rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-300">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-white font-semibold text-lg">₹{paymentDetails.amount}</span>
              </div>
              {paymentDetails.paymentId && (
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono text-sm">{paymentDetails.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-gray-400">Payment Type</span>
                <span className="text-white font-semibold">
                  {paymentDetails.isAutopay ? <span className="flex items-center gap-2"><span>🔄</span>Recurring Autopay</span> : <span className="flex items-center gap-2"><span>��</span>One-time Payment</span>}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Status</span>
                <span className="px-4 py-1 rounded-full bg-success/20 text-success font-semibold text-sm">✓ Completed</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary glow-effect transition-all duration-300 transform hover:scale-105">← Back to Home</Link>
            <button onClick={() => window.print()} className="px-8 py-4 rounded-xl font-semibold text-white glass glass-hover border border-border transition-all duration-300">🖨️ Print Receipt</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
