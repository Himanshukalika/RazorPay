# Razorpay Payment Gateway Setup

This project includes Razorpay payment gateway integration for the MakeUp Mastry Club checkout page.

## Setup Instructions

### 1. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live API Keys
4. Copy the **Key ID** and **Key Secret**

### 2. Configure Environment Variables

Update the `.env.local` file with your Razorpay credentials:

```env
# Razorpay API Keys
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# Next.js Public Variables (accessible in browser)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

**Important:** 
- Use `rzp_test_` prefix for test mode keys
- Use `rzp_live_` prefix for production keys
- Never commit `.env.local` to version control

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the checkout page.

## Features Implemented

✅ **Razorpay Integration**
- Order creation API endpoint
- Payment verification with signature validation
- Secure server-side payment processing

✅ **Checkout Page**
- Product selection with quantity
- Order summary (mobile & desktop responsive)
- Plan details with course information
- Student testimonials
- Payment method selection (Razorpay/Test Card)
- Complete order button with loading state

✅ **Security**
- Server-side signature verification
- Environment variables for sensitive data
- HMAC SHA256 signature validation

## API Endpoints

### Create Order
- **Endpoint:** `POST /api/razorpay`
- **Body:** `{ amount: number, currency: string }`
- **Response:** `{ success: boolean, orderId: string, amount: number, currency: string }`

### Verify Payment
- **Endpoint:** `POST /api/razorpay/verify`
- **Body:** `{ razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }`
- **Response:** `{ success: boolean, message: string }`

## Testing

### Test Cards (Razorpay Test Mode)

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`

**More test cards:** [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

## Payment Flow

1. User clicks "Complete Order"
2. Frontend calls `/api/razorpay` to create order
3. Razorpay checkout modal opens
4. User completes payment
5. Razorpay sends payment details to handler
6. Frontend calls `/api/razorpay/verify` to verify signature
7. Success/failure message shown to user

## Important Notes

- Always test in **Test Mode** before going live
- Enable required payment methods in Razorpay Dashboard
- Set up webhooks for production (optional but recommended)
- Implement proper error handling and logging
- Store payment records in database (not implemented yet)

## Next Steps

- [ ] Add database integration to store payment records
- [ ] Implement webhook handler for payment status updates
- [ ] Add email notifications for successful payments
- [ ] Create admin dashboard for payment tracking
- [ ] Add subscription/recurring payment support

## Support

For Razorpay integration issues:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

For project issues:
- Check console logs for errors
- Verify environment variables are set correctly
- Ensure Razorpay script is loaded in browser
