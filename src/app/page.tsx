'use client';

import { useState } from 'react';
import { trackEvent, trackCustomEvent } from '@/components/FacebookPixel';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubscription, setIsSubscription] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    country: 'IN',
    state: '',
  });

  // Plan configurations
  const plans = {
    monthly: {
      id: 'monthly',
      name: 'Monthly Membership',
      price: 999,
      duration: '1 Month',
      totalMonths: 1,
      savings: null,
      popular: false,
      description: 'Try it out',
      warning: null,
      subtitle: 'Suitable for dabblers',
      trustBadge: null,
      razorpayPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID || '',
      bonus: null,
    },
    quarterly: {
      id: 'quarterly',
      name: 'Growth Plan – Best for Results',
      price: 2799,
      duration: '90 Days',
      totalMonths: 3,
      savings: '7% monthly = 21% savings quarterly',
      popular: true,
      description: 'Serious Artist Plan',
      subtitle: 'Minimum time needed to see real skill + income improvement',
      trustBadge: 'Chosen by 67% of active members',
      warning: null,
      razorpayPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_QUARTERLY || '',
      bonus: {
        title: 'Quarterly Only Bonuses',
        items: [
          'Client Pricing Template',
          'Bridal Booking Script',
          'Instagram Reel Hooks for Makeup Artists',
          'Live Q&A Replay Access',
          'Content Calendar',
          'AI for Editing Course'
        ]
      },
    },
    halfYearly: {
      id: 'halfYearly',
      name: 'Professional Track',
      price: 5499,
      duration: '6 Months',
      totalMonths: 6,
      savings: '8% monthly = 48% savings half-yearly',
      popular: false,
      description: 'Deep skill mastery',
      subtitle: 'For building a sustainable makeup career',
      warning: null,
      trustBadge: null,
      razorpayPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_HALFYEARLY || '',
      bonus: {
        title: 'Everything in Growth Plan +',
        items: [
          '1-on-1 Onboarding Call',
          'Secret Bonus'
        ]
      },
    },
    yearly: {
      id: 'yearly',
      name: 'Career Accelerator',
      price: 9999,
      duration: '12 Months',
      totalMonths: 12,
      savings: 'You save ₹2,001 per year',
      popular: false,
      description: 'Maximum transformation',
      subtitle: 'Complete professional development journey',
      warning: null,
      trustBadge: null,
      razorpayPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_YEARLY || '',
      bonus: {
        title: 'Everything in Growth Plan +',
        items: [
          '1-on-1 Onboarding Call',
          'Secret Bonus'
        ]
      },
    },
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];

  // Handler for bottom button - scrolls to top then processes payment
  const handlePaymentWithScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Wait for scroll to complete before processing payment
    setTimeout(() => {
      handlePayment();
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Track when user starts filling the form (InitiateCheckout)
    if (name === 'firstName' && value.length === 1) {
      trackEvent('InitiateCheckout', {
        content_name: 'MakeUp Mastry Club',
        content_category: 'Subscription',
        value: currentPlan.price,
        currency: 'INR',
      });
    }

    // Track form completion progress
    if (name === 'email' && value.includes('@')) {
      trackCustomEvent('FormProgress', {
        step: 'email_entered',
        content_name: 'MakeUp Mastry Club',
      });
    }
  };

  const handlePayment = async () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
      alert('Please fill in all required fields (First Name, Last Name, Email, Mobile Number)');
      return;
    }

    // Validate mobile number (10 digits)
    if (formData.mobile.length !== 10 || !/^\d{10}$/.test(formData.mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = currentPlan.price;

      // Track AddToCart event when user clicks Complete Order
      trackEvent('AddToCart', {
        content_name: 'MakeUp Mastry Club',
        content_type: 'product',
        content_category: isSubscription ? 'Subscription' : 'One-time',
        value: totalAmount,
        currency: 'INR',
      });

      if (selectedPayment === 'razorpay') {
        if (isSubscription) {
          // Create Subscription (AutoPay)
          console.log('Creating Razorpay subscription...');

          const response = await fetch('/api/razorpay/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planId: currentPlan.razorpayPlanId,
              totalCount: currentPlan.totalMonths,
              notes: {
                customer_name: `${formData.firstName} ${formData.lastName}`,
                customer_email: formData.email,
                customer_mobile: formData.mobile,
              }
            }),
          });

          const data = await response.json();
          console.log('Subscription response:', data);

          if (!data.success) {
            throw new Error(data.error || 'Failed to create subscription');
          }

          // Initialize Razorpay subscription checkout
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            subscription_id: data.subscriptionId,
            name: 'MakeUp Mastry Club',
            description: 'Monthly Subscription - Makeup Mastery Membership',
            handler: async function (response: any) {
              console.log('Subscription payment response:', response);

              try {
                // Verify subscription payment
                const verifyResponse = await fetch('/api/razorpay/subscription/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_subscription_id: response.razorpay_subscription_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });

                const verifyData = await verifyResponse.json();
                console.log('Subscription verification response:', verifyData);

                if (verifyData.success) {
                  // Track successful subscription purchase
                  trackEvent('Subscribe', {
                    content_name: 'MakeUp Mastry Club',
                    content_category: 'Subscription',
                    value: currentPlan.price,
                    currency: 'INR',
                    predicted_ltv: currentPlan.price * 12, // Annual value
                  });

                  trackEvent('Purchase', {
                    content_name: `MakeUp Mastry Club - ${currentPlan.name}`,
                    content_type: 'product',
                    value: currentPlan.price,
                    currency: 'INR',
                    num_items: 1,
                  });

                  // Save to Google Sheets
                  try {
                    await fetch('/api/save-to-sheet', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        mobile: formData.mobile,
                        plan: currentPlan.name,
                        amount: currentPlan.price,
                        subscriptionId: response.razorpay_subscription_id,
                        paymentId: response.razorpay_payment_id,
                        timestamp: new Date().toISOString(),
                      }),
                    });
                  } catch (error) {
                    console.error('Failed to save to Google Sheets:', error);
                    // Don't block the flow if sheet save fails
                  }

                  // Redirect to thank you page with order details
                  const params = new URLSearchParams({
                    subscription_id: response.razorpay_subscription_id,
                    payment_id: response.razorpay_payment_id,
                    amount: currentPlan.price.toString(),
                    type: 'subscription'
                  });
                  window.location.href = `/thank-you?${params.toString()}`;
                } else {
                  alert('❌ Subscription verification failed. Please contact support.');
                }
              } catch (verifyError) {
                console.error('Subscription verification error:', verifyError);
                alert('❌ Subscription verification failed. Please contact support.');
              }
              setIsProcessing(false);
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: '',
            },
            theme: {
              color: '#2563eb',
            },
            modal: {
              ondismiss: function () {
                console.log('Subscription modal dismissed');
                setIsProcessing(false);
              }
            }
          };

          console.log('Opening Razorpay subscription with options:', { ...options, key: 'HIDDEN' });

          if (typeof window !== 'undefined' && (window as any).Razorpay) {
            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
          } else {
            throw new Error('Razorpay SDK not loaded. Please refresh the page.');
          }
        } else {
          // One-time payment
          console.log('Creating Razorpay order...');

          const response = await fetch('/api/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount, currency: 'INR' }),
          });

          const data = await response.json();
          console.log('Order response:', data);

          if (!data.success) {
            throw new Error(data.error || 'Failed to create order');
          }

          // Initialize Razorpay checkout
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: 'MakeUp Mastry Club',
            description: 'One-time Payment - Makeup Mastery Membership',
            order_id: data.orderId,
            handler: async function (response: any) {
              console.log('Payment response:', response);

              try {
                // Verify payment
                const verifyResponse = await fetch('/api/razorpay/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });

                const verifyData = await verifyResponse.json();
                console.log('Verification response:', verifyData);

                if (verifyData.success) {
                  // Track successful one-time purchase
                  trackEvent('Purchase', {
                    content_name: `MakeUp Mastry Club - ${currentPlan.name}`,
                    content_type: 'product',
                    value: currentPlan.price,
                    currency: 'INR',
                    num_items: 1,
                  });


                  // Redirect to thank you page with order details
                  const params = new URLSearchParams({
                    order_id: response.razorpay_order_id,
                    payment_id: response.razorpay_payment_id,
                    amount: currentPlan.price.toString(),
                    type: 'onetime'
                  });
                  window.location.href = `/thank-you?${params.toString()}`;
                } else {
                  alert('❌ Payment verification failed. Please contact support.');
                }
              } catch (verifyError) {
                console.error('Verification error:', verifyError);
                alert('❌ Payment verification failed. Please contact support.');
              }
              setIsProcessing(false);
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: '',
            },
            theme: {
              color: '#2563eb',
            },
            modal: {
              ondismiss: function () {
                console.log('Payment modal dismissed');
                setIsProcessing(false);
              }
            }
          };

          console.log('Opening Razorpay with options:', { ...options, key: 'HIDDEN' });

          if (typeof window !== 'undefined' && (window as any).Razorpay) {
            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
          } else {
            throw new Error('Razorpay SDK not loaded. Please refresh the page.');
          }
        }
      } else {
        // Test card payment
        alert('Test card payment selected. This is a demo mode.');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message || 'Please try again.'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700"
          >
            <path
              d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M9 12L11 14L15 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">Join the Makeup Mastery Club</h1>
        </div>
        <p className="text-base text-gray-600">40,000+ Makeup artists trained till now</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Checkout Form (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Single Common Card for All Sections */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">

              {/* Product Section - Plan Selection */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Select Your Membership</h2>
                <p className="text-sm text-gray-600 mb-6">Choose the plan that works best for your learning journey</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.values(plans).map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${plan.id === 'monthly'
                        ? 'opacity-75 scale-95' // De-emphasize monthly
                        : ''
                        } ${selectedPlan === plan.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : plan.id === 'monthly'
                            ? 'border-gray-300' // Grey border for monthly
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            🏆 BEST CHOICE
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{plan.description}</p>
                          {plan.subtitle && (
                            <p className="text-xs text-blue-600 font-medium mt-1 italic">
                              {plan.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {plan.trustBadge && (
                        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 mb-2">
                          <p className="text-xs text-blue-700 font-semibold">✨ {plan.trustBadge}</p>
                        </div>
                      )}

                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
                        <span className="text-sm text-gray-500">for {plan.duration}</span>
                      </div>

                      {plan.totalMonths > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          ₹{Math.round(plan.price / plan.totalMonths)}/month
                        </p>
                      )}

                      {plan.savings && (
                        <div className="bg-green-50 border border-green-200 rounded px-2 py-1.5 mt-2">
                          <p className="text-xs text-green-700 font-bold">✅ {plan.savings}</p>
                        </div>
                      )}

                      {plan.warning && (
                        <div className="bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">
                          <p className="text-xs text-red-600 font-medium">⚠️ {plan.warning}</p>
                        </div>
                      )}

                      {plan.bonus && (
                        <div className="bg-yellow-50 border border-yellow-300 rounded px-2 py-2 mt-2">
                          <p className="text-xs font-bold text-yellow-800 mb-1">🎁 {plan.bonus.title}:</p>
                          <ul className="text-xs text-yellow-700 space-y-0.5">
                            {plan.bonus.items.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                          <p className="text-xs text-red-600 font-semibold mt-1">❌ Not included in Monthly</p>
                        </div>
                      )}

                      <div className={`mt-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                        }`}>
                        {selectedPlan === plan.id && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Order Summary - Mobile Only */}
              <div className="mb-8 lg:hidden">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                  <div className="space-y-3">
                    <div className="border-b border-gray-100 pb-2">
                      <p className="font-semibold text-gray-900 text-sm">MakeUp Mastry Club</p>
                    </div>

                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <p className="text-sm text-gray-900">{currentPlan.name}</p>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{currentPlan.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{currentPlan.duration}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <p className="text-sm font-semibold text-green-600">Total</p>
                      <p className="text-sm font-semibold text-green-600">₹{currentPlan.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Basic Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Mobile Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Billing Address</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                  </select>

                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select State</option>
                    <option value="AN">Andaman and Nicobar Islands</option>
                    <option value="AP">Andhra Pradesh</option>
                    <option value="AR">Arunachal Pradesh</option>
                    <option value="AS">Assam</option>
                    <option value="BR">Bihar</option>
                    <option value="CH">Chandigarh</option>
                    <option value="CT">Chhattisgarh</option>
                    <option value="DH">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="DL">Delhi</option>
                    <option value="GA">Goa</option>
                    <option value="GJ">Gujarat</option>
                    <option value="HR">Haryana</option>
                    <option value="HP">Himachal Pradesh</option>
                    <option value="JK">Jammu and Kashmir</option>
                    <option value="JH">Jharkhand</option>
                    <option value="KA">Karnataka</option>
                    <option value="KL">Kerala</option>
                    <option value="LA">Ladakh</option>
                    <option value="LD">Lakshadweep</option>
                    <option value="MP">Madhya Pradesh</option>
                    <option value="MH">Maharashtra</option>
                    <option value="MN">Manipur</option>
                    <option value="ML">Meghalaya</option>
                    <option value="MZ">Mizoram</option>
                    <option value="NL">Nagaland</option>
                    <option value="OR">Odisha</option>
                    <option value="PY">Puducherry</option>
                    <option value="PB">Punjab</option>
                    <option value="RJ">Rajasthan</option>
                    <option value="SK">Sikkim</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="TG">Telangana</option>
                    <option value="TR">Tripura</option>
                    <option value="UP">Uttar Pradesh</option>
                    <option value="UT">Uttarakhand</option>
                    <option value="WB">West Bengal</option>
                  </select>
                </div>
              </div>

              {/* Terms and Complete Order - Mobile Only */}
              <div className="lg:hidden space-y-4 mb-8">
                <p className="text-sm text-gray-700 text-left">
                  By clicking Complete Order, you agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
                </p>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold text-xl py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                  {!isProcessing && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M12 8L16 12L12 16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div className="text-center pt-2">
                  <div className="flex justify-center gap-2 mb-3">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23EB001B'/%3E%3Crect x='18' width='14' height='32' rx='0' fill='%23FF5F00'/%3E%3Crect x='18' width='32' height='32' rx='4' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" className="h-8" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%231A1F71'/%3E%3Cpath d='M20 8L16 24h4l4-16h-4zm8 0l-6 16h4l6-16h-4z' fill='%23F7B600'/%3E%3C/svg%3E" alt="Visa" className="h-8" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23003087'/%3E%3Cpath d='M18 10h-4l-4 12h4l4-12zm8 0l-4 12h4l4-12h-4z' fill='%23009CDE'/%3E%3C/svg%3E" alt="PayPal" className="h-8" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23006FCF'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='10' font-weight='bold'%3EAMEX%3C/text%3E%3C/svg%3E" alt="Amex" className="h-8" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23FF6000'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='8' font-weight='bold'%3EDISCOVER%3C/text%3E%3C/svg%3E" alt="Discover" className="h-8" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium">Your payment is always safe &amp; secure.</p>
                </div>
              </div>

              {/* Train With The Founders Section */}
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
                  Train With The Founders — Heena & Dhvani Shah
                </h2>

                <div className="flex flex-col gap-6 items-start">
                  {/* Text Content */}
                  <div className="flex-1 text-gray-700 text-sm sm:text-base leading-relaxed">
                    <p className="mb-4">
                      <span className="font-semibold">Heena Shah and Dhvani Shah</span> are the power duo behind{' '}
                      <span className="font-semibold">HSM School of Makeup & Hair</span> — a platform that has trained thousands of artists across India.
                    </p>

                    <p className="mb-4">
                      With <span className="font-semibold">40+ years of combined experience</span>, they've worked with Bollywood icons like Jacqueline Fernandez, Shehnaaz Gill, Javed Jaffrey, and Nawazuddin Siddiqui.
                    </p>

                    <p className="mb-4">
                      Their mission is to make world-class beauty education{' '}
                      <span className="font-semibold">simple, affordable & accessible</span> for every woman.
                    </p>

                    <p>
                      Inside this club, they share the same training taught in their luxury academy — now brought to your home. Learn from mentors who've built confidence and careers for thousands of women just like you.
                    </p>
                  </div>

                  {/* Founders Photo */}
                  <div className="w-full mt-6 lg:max-w-2xl lg:mx-auto">
                    <div className="rounded-lg overflow-hidden shadow-lg border-2 border-pink-200">
                      <img
                        src="https://membership.hsmschoolmakeup.in/wp-content/uploads/2025/11/Untitled-design-2025-06-08T020303.110.png"
                        alt="Heena & Dhvani Shah - Founders of HSM School of Makeup"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  {/* Additional Founders Gallery */}
                  <div className="w-full mt-4 lg:max-w-2xl lg:mx-auto">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                        <img
                          src="https://membership.hsmschoolmakeup.in/wp-content/uploads/2025/11/IMG_9097.jpg"
                          alt="HSM School - Achievement 1"
                          className="w-full h-full object-cover aspect-[3/4]"
                        />
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                        <img
                          src="https://membership.hsmschoolmakeup.in/wp-content/uploads/2025/11/IMG_9107.jpg"
                          alt="HSM School - Achievement 2"
                          className="w-full h-full object-cover aspect-[3/4]"
                        />
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                        <img
                          src="https://membership.hsmschoolmakeup.in/wp-content/uploads/2025/11/IMG_9106.jpg"
                          alt="HSM School - Achievement 3"
                          className="w-full h-full object-cover aspect-[3/4]"
                        />
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                        <img
                          src="https://membership.hsmschoolmakeup.in/wp-content/uploads/2025/11/IMG_0972_Original-scaled-1-1536x2048.jpg"
                          alt="HSM School - Achievement 4"
                          className="w-full h-full object-cover aspect-[3/4]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Details - Mobile Only */}
              <div className="mb-8 lg:hidden">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get Instantly</h3>

                  <div className="text-gray-700 text-sm space-y-4">
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Access to Makeup Mastery Club</strong> — a complete ongoing learning platform by HSM School of Makeup</li>
                      <li><strong>Weekly New Lessons</strong> — one fresh, practical lesson added every week</li>
                    </ul>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🎓 Topics Covered Inside the Membership</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Makeup:</strong> Learn everything from fundamentals to advanced, trend-driven looks for real clients</li>
                        <li><strong>Hair:</strong> Professional hairstyling techniques for bridal, party, and everyday looks</li>
                        <li><strong>Nails:</strong> Basic to advanced nail skills to add high-value services</li>
                        <li><strong>Business & Growth:</strong> Pricing, client acquisition, and scaling as a makeup professional</li>
                        <li><strong>Instagram Growth Mini Course:</strong> Step-by-step system to attract clients and build your personal brand</li>
                        <li><strong>AI Tools for Makeup Business:</strong> Smart tools to save time, automate work, and grow faster</li>
                        <li><strong>Certification After Completion:</strong> Official certification to boost credibility and client trust</li>
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <p><strong>One Membership, Everything Covered:</strong> Makeup, hair, nails, business, Instagram, and AI — all in one place</p>
                      <p><strong>Turn Skills Into Income:</strong> Learn techniques and how to attract clients and grow professionally</p>
                      <p><strong>Stay Credible & Future-Ready:</strong> Weekly updates, expert guidance, and certification to stay relevant</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials - Mobile Only */}
              <div className="mb-8 lg:hidden">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What Students Are Saying</h3>

                  <div className="space-y-5">
                    {/* Rekha */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200">
                          <img
                            src="/images/founders.jpg"
                            alt="Rekha"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm mb-1">Rekha – 15+ Years Experience (Mumbai)</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-sm">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"I've been in the industry for over 15 years, but the business lessons gave me a fresh perspective on pricing and client handling."</p>
                    </div>

                    {/* Anjali */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
                          <img
                            src="/images/achievement-2.png"
                            alt="Anjali"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm mb-1">Anjali – Beginner Makeup Artist (Jaipur)</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-sm">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"I was new to makeup and thought I'd need multiple courses. This one membership covered everything and saved me money and confusion."</p>
                    </div>

                    {/* Neha */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                          <img
                            src="/images/achievement-3.png"
                            alt="Neha"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm mb-1">Neha – Working Professional (Delhi)</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-sm">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"I'm not a full-time artist, but these lessons helped me confidently do my daily and event makeup."</p>
                    </div>

                    {/* Pooja */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                          <img
                            src="/images/achievement-1.png"
                            alt="Pooja"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm mb-1">Pooja – Freelance Makeup Artist (Indore)</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-sm">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"The Instagram mini course made content planning simple. My profile looks professional and enquiries have improved."</p>
                    </div>

                    {/* Kavita */}
                    <div className="pb-2">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                          <img
                            src="/images/kavita.png"
                            alt="Kavita"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm mb-1">Kavita – Certified Makeup Artist (Ahmedabad)</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-sm">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"The certification added instant credibility and helped clients trust me more during bookings."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Complete Order Button - Mobile Only (Bottom) */}
              <div className="lg:hidden space-y-4 mb-8">
                <button
                  onClick={handlePaymentWithScroll}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold text-xl py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                  {!isProcessing && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M12 8L16 12L12 16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <p className="text-xs text-center text-gray-600">
                  By clicking Complete Order, you agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>


            </div>



            {/* Terms and Complete Order - Desktop Only */}
            <div className="hidden lg:block space-y-4">
              <p className="text-sm text-gray-700 text-left">
                By clicking Complete Order, you agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
              </p>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold text-xl py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
                {!isProcessing && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M12 8L16 12L12 16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="text-center pt-2">
                <div className="flex justify-center gap-2 mb-3">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23EB001B'/%3E%3Crect x='18' width='14' height='32' rx='0' fill='%23FF5F00'/%3E%3Crect x='18' width='32' height='32' rx='4' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" className="h-8" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%231A1F71'/%3E%3Cpath d='M20 8L16 24h4l4-16h-4zm8 0l-6 16h4l6-16h-4z' fill='%23F7B600'/%3E%3C/svg%3E" alt="Visa" className="h-8" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23003087'/%3E%3Cpath d='M18 10h-4l-4 12h4l4-12zm8 0l-4 12h4l4-12h-4z' fill='%23009CDE'/%3E%3C/svg%3E" alt="PayPal" className="h-8" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23006FCF'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='10' font-weight='bold'%3EAMEX%3C/text%3E%3C/svg%3E" alt="Amex" className="h-8" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='32' viewBox='0 0 50 32'%3E%3Crect width='50' height='32' rx='4' fill='%23FF6000'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='8' font-weight='bold'%3EDISCOVER%3C/text%3E%3C/svg%3E" alt="Discover" className="h-8" />
                </div>
                <p className="text-sm text-gray-700 font-medium">Your payment is always safe &amp; secure.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Plan Details (1/3 width) */}
          <div className="lg:col-span-1">
            {/* Order Summary - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-2">
                  <p className="font-semibold text-gray-900 text-sm">MakeUp Mastry Club</p>
                </div>

                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <p className="text-sm text-gray-900">{currentPlan.name}</p>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{currentPlan.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{currentPlan.duration}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <p className="text-sm font-semibold text-green-600">Total</p>
                  <p className="text-sm font-semibold text-green-600">₹{currentPlan.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-5 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You’ll Get Instantly</h3>

              <div className="text-gray-700 text-sm space-y-4">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Access to Makeup Mastery Club</strong> — a complete ongoing learning platform by HSM School of Makeup</li>
                  <li><strong>Weekly New Lessons</strong> — one fresh, practical lesson added every week</li>
                </ul>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎓 Topics Covered Inside the Membership</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Makeup:</strong> Learn everything from fundamentals to advanced, trend-driven looks for real clients</li>
                    <li><strong>Hair:</strong> Professional hairstyling techniques for bridal, party, and everyday looks</li>
                    <li><strong>Nails:</strong> Basic to advanced nail skills to add high-value services</li>
                    <li><strong>Business & Growth:</strong> Pricing, client acquisition, and scaling as a makeup professional</li>
                    <li><strong>Instagram Growth Mini Course:</strong> Step-by-step system to attract clients and build your personal brand</li>
                    <li><strong>AI Tools for Makeup Business:</strong> Smart tools to save time, automate work, and grow faster</li>
                    <li><strong>Certification After Completion:</strong> Official certification to boost credibility and client trust</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p><strong>One Membership, Everything Covered:</strong> Makeup, hair, nails, business, Instagram, and AI — all in one place</p>
                  <p><strong>Turn Skills Into Income:</strong> Learn techniques and how to attract clients and grow professionally</p>
                  <p><strong>Stay Credible & Future-Ready:</strong> Weekly updates, expert guidance, and certification to stay relevant</p>
                </div>
              </div>
            </div>

            {/* Testimonials - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-5 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Students Are Saying</h3>

              <div className="space-y-5">
                {/* Rekha */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200">
                      <img
                        src="/images/founders.jpg"
                        alt="Rekha"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Rekha – 15+ Years Experience (Mumbai)</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">“I’ve been in the industry for over 15 years, but the business lessons gave me a fresh perspective on pricing and client handling.”</p>
                </div>

                {/* Anjali */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
                      <img
                        src="/images/achievement-2.png"
                        alt="Anjali"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Anjali – Beginner Makeup Artist (Jaipur)</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">“I was new to makeup and thought I’d need multiple courses. This one membership covered everything and saved me money and confusion.”</p>
                </div>

                {/* Neha */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                      <img
                        src="/images/achievement-3.png"
                        alt="Neha"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Neha – Working Professional (Delhi)</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">“I’m not a full-time artist, but these lessons helped me confidently do my daily and event makeup.”</p>
                </div>

                {/* Pooja */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                      <img
                        src="/images/achievement-1.png"
                        alt="Pooja"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Pooja – Freelance Makeup Artist (Indore)</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">“The Instagram mini course made content planning simple. My profile looks professional and enquiries have improved.”</p>
                </div>

                {/* Kavita */}
                <div className="pb-2">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                      <img
                        src="/images/kavita.png"
                        alt="Kavita"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Kavita – Certified Makeup Artist (Ahmedabad)</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">“The certification added instant credibility and helped clients trust me more during bookings.”</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
