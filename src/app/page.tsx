'use client';

import { useState } from 'react';
import Script from 'next/script';
import { trackInitiateCheckout, trackPurchase, trackAddPaymentInfo } from '@/components/MetaPixel';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isAutopay, setIsAutopay] = useState(true);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            isAutopay: false,
          },
        }),
      });

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const createSubscription = async () => {
    try {
      // You need to create a plan in Razorpay Dashboard first
      // Then replace 'YOUR_PLAN_ID' with actual plan ID
      const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID || 'plan_xxxxxxxxxxxxx';

      const response = await fetch('/api/razorpay/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planId,
          totalCount: 12, // 12 months
          quantity: 1,
          notes: {
            isAutopay: true,
          },
        }),
      });

      const data = await response.json();
      return data.subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus('idle');

    // Track payment initiation
    trackAddPaymentInfo(isAutopay);
    trackInitiateCheckout(1, 'INR');

    try {
      if (isAutopay) {
        // Create subscription for autopay
        const subscription = await createSubscription();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: subscription.id,
          name: 'Autopay Subscription',
          description: 'Monthly Recurring Payment - ₹1',
          theme: {
            color: '#5f6fff',
          },
          handler: async function (response: any) {
            // Subscription activated
            setPaymentStatus('success');
            trackPurchase(1, 'INR', response.razorpay_payment_id);
            setLoading(false);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Create one-time order
        const order = await createOrder();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'One-time Payment',
          description: 'Single Payment - ₹1',
          order_id: order.id,
          prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#5f6fff',
          },
          handler: async function (response: any) {
            const isVerified = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (isVerified) {
              setPaymentStatus('success');
              trackPurchase(1, 'INR', response.razorpay_payment_id);
            } else {
              setPaymentStatus('error');
            }
            setLoading(false);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <main className="min-h-screen flex items-center justify-center p-8">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Card */}
          <div className="glass rounded-3xl p-12 text-center card-enter">
            {/* Logo/Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl animate-float glow-effect">
              💳
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-3 gradient-text">
              Razorpay Payment
            </h1>
            <p className="text-gray-400 mb-8">
              {isAutopay ? 'Setup recurring autopay' : 'One-time payment of ₹1'}
            </p>

            {/* Autopay Toggle */}
            <div className="mb-8 glass rounded-xl p-4 border border-primary/30">
              <label className="flex items-center justify-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutopay}
                  onChange={(e) => setIsAutopay(e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-card checked:bg-primary focus:ring-2 focus:ring-primary/50"
                />
                <span className="font-semibold text-white">Enable Autopay</span>
                <span className="text-xl">🔄</span>
              </label>
              {isAutopay && (
                <p className="text-xs text-gray-500 mt-2">
                  Monthly recurring payment mandate will be created
                </p>
              )}
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-5 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary glow-effect disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 mb-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span>🔒</span>
                  {isAutopay ? 'Setup Autopay (₹1/month)' : 'Pay ₹1 Now'}
                </span>
              )}
            </button>

            {/* Payment Status */}
            {paymentStatus === 'success' && (
              <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success animate-in slide-in-from-bottom">
                <p className="flex items-center justify-center gap-2 font-semibold">
                  <span className="text-2xl">✓</span>
                  {isAutopay ? 'Autopay Activated!' : 'Payment Successful!'}
                </p>
              </div>
            )}

            {paymentStatus === 'error' && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error animate-in slide-in-from-bottom">
                <p className="flex items-center justify-center gap-2 font-semibold">
                  <span className="text-2xl">✗</span>
                  Payment Failed
                </p>
              </div>
            )}

            {/* Info */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-gray-500">
                Powered by Razorpay
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Secure & Trusted Payment Gateway
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="glass glass-hover rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔐</div>
              <p className="text-xs text-gray-400">Secure</p>
            </div>
            <div className="glass glass-hover rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-xs text-gray-400">Fast</p>
            </div>
            <div className="glass glass-hover rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">✓</div>
              <p className="text-xs text-gray-400">Trusted</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
