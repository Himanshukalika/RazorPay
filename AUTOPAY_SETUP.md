# Razorpay AutoPay (Subscription) Setup Guide

## Overview
This guide will help you set up Razorpay Subscriptions (AutoPay) for recurring monthly payments.

## Prerequisites
- Razorpay account (Test or Live mode)
- API Keys configured in `.env.local`

## Step 1: Create a Plan in Razorpay Dashboard

### Using Razorpay Dashboard:

1. **Login** to [Razorpay Dashboard](https://dashboard.razorpay.com/)

2. **Navigate to Subscriptions**:
   - Go to **Products** → **Subscriptions** → **Plans**
   - Click **Create Plan**

3. **Configure Plan**:
   ```
   Plan Name: MakeUp Mastry Club Monthly
   Billing Interval: Monthly (1 month)
   Billing Amount: ₹1.00 (or your actual amount)
   Currency: INR
   Description: Monthly subscription for Makeup Mastery membership
   ```

4. **Save Plan** and copy the **Plan ID** (starts with `plan_`)

### Using API (Alternative):

```bash
curl -X POST https://api.razorpay.com/v1/plans \
  -u YOUR_KEY_ID:YOUR_KEY_SECRET \
  -H "Content-Type: application/json" \
  -d '{
    "period": "monthly",
    "interval": 1,
    "item": {
      "name": "MakeUp Mastry Club Monthly",
      "amount": 100,
      "currency": "INR",
      "description": "Monthly subscription"
    }
  }'
```

## Step 2: Update Environment Variables

Add the Plan ID to `.env.local`:

```env
# Razorpay Plan ID for Subscription
RAZORPAY_PLAN_ID=plan_XXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_XXXXXXXXXXXXXXX
```

## Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## How It Works

### User Flow:

1. **User fills checkout form** (Name, Email, etc.)
2. **AutoPay toggle** is enabled by default
3. **User clicks "Complete Order"**
4. **System creates subscription** via `/api/razorpay/subscription`
5. **Razorpay modal opens** for first payment
6. **User completes payment**
7. **Subscription is activated**
8. **Auto-renewal** happens monthly

### Payment vs Subscription:

| Feature | One-time Payment | Subscription (AutoPay) |
|---------|-----------------|----------------------|
| Recurring | ❌ No | ✅ Yes (Monthly) |
| Auto-renewal | ❌ No | ✅ Yes |
| Cancellation | N/A | Anytime from dashboard |
| API Endpoint | `/api/razorpay` | `/api/razorpay/subscription` |
| Razorpay Object | `order_id` | `subscription_id` |

## API Endpoints

### Create Subscription
- **Endpoint:** `POST /api/razorpay/subscription`
- **Body:**
  ```json
  {
    "planId": "plan_XXXXX",
    "totalCount": 12,
    "notes": {
      "customer_name": "John Doe",
      "customer_email": "john@example.com"
    }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "subscriptionId": "sub_XXXXX",
    "status": "created",
    "planId": "plan_XXXXX",
    "shortUrl": "https://rzp.io/i/XXXXX"
  }
  ```

### Verify Subscription Payment
- **Endpoint:** `POST /api/razorpay/subscription/verify`
- **Body:**
  ```json
  {
    "razorpay_subscription_id": "sub_XXXXX",
    "razorpay_payment_id": "pay_XXXXX",
    "razorpay_signature": "XXXXX"
  }
  ```

## Testing Subscriptions

### Test Mode:
1. Use **Test Mode** keys in Razorpay Dashboard
2. Create a test plan
3. Use test cards for payment:
   - **Success:** `4111 1111 1111 1111`
   - **Failed:** `4000 0000 0000 0002`

### Verify Subscription:
1. Go to **Dashboard** → **Subscriptions**
2. Check subscription status
3. View payment history
4. Test cancellation

## Managing Subscriptions

### Cancel Subscription:
```javascript
// API call to cancel (implement in your backend)
const response = await fetch('/api/razorpay/subscription/cancel', {
  method: 'POST',
  body: JSON.stringify({ subscriptionId: 'sub_XXXXX' })
});
```

### Pause Subscription:
```javascript
// API call to pause
const response = await fetch('/api/razorpay/subscription/pause', {
  method: 'POST',
  body: JSON.stringify({ subscriptionId: 'sub_XXXXX' })
});
```

## Webhooks (Recommended for Production)

Set up webhooks to handle subscription events:

### Events to Listen:
- `subscription.activated` - When subscription starts
- `subscription.charged` - Monthly payment successful
- `subscription.completed` - Subscription ended
- `subscription.cancelled` - User cancelled
- `subscription.paused` - Subscription paused
- `subscription.resumed` - Subscription resumed
- `payment.failed` - Payment failed

### Webhook URL:
```
https://yourdomain.com/api/webhooks/razorpay
```

## Important Notes

⚠️ **Before Going Live:**
1. Switch to **Live Mode** keys
2. Create **Live Plan** (not test plan)
3. Update `.env.local` with live credentials
4. Test with small amount first
5. Set up proper error handling
6. Implement subscription management UI
7. Add email notifications
8. Store subscription data in database

## Troubleshooting

### Error: "Plan not found"
- ✅ Check Plan ID in `.env.local`
- ✅ Ensure plan exists in Razorpay Dashboard
- ✅ Verify you're using correct mode (Test/Live)

### Error: "Subscription creation failed"
- ✅ Check API keys are correct
- ✅ Verify plan is active
- ✅ Check server logs for details

### Payment not auto-renewing
- ✅ Check subscription status in dashboard
- ✅ Verify customer has valid payment method
- ✅ Check webhook events

## Next Steps

- [ ] Implement subscription management page
- [ ] Add cancel/pause subscription UI
- [ ] Set up webhook handlers
- [ ] Add email notifications for renewals
- [ ] Create admin dashboard for subscriptions
- [ ] Implement retry logic for failed payments
- [ ] Add subscription analytics

## Support

- [Razorpay Subscriptions Docs](https://razorpay.com/docs/payments/subscriptions/)
- [Razorpay API Reference](https://razorpay.com/docs/api/subscriptions/)
- [Razorpay Support](https://razorpay.com/support/)
