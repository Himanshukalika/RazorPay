# Razorpay Payment Gateway with Autopay

A modern, secure payment gateway implementation using Razorpay with autopay/recurring payment functionality built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

- 🔐 **Secure Payments** - Industry-standard encryption and security
- 🔄 **Autopay Functionality** - Set up recurring payments (monthly, quarterly, yearly)
- 💳 **Multiple Payment Methods** - Credit/Debit cards, UPI, Net Banking, Wallets, EMI
- 🎨 **Premium UI/UX** - Modern glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works seamlessly on all devices
- ✅ **Payment Verification** - Secure signature verification
- 🚀 **Fast & Optimized** - Built with Next.js 14 App Router

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Razorpay account ([Sign up here](https://razorpay.com))

### Installation

1. **Clone or navigate to the project directory**

```bash
cd /Users/himanshumac/Desktop/RazorPay
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Razorpay API Keys
# Get these from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Next.js Public Variables (accessible in browser)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**To get your Razorpay API keys:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Generate Test/Live keys
4. Copy the Key ID and Key Secret

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
RazorPay/
├── src/
│   └── app/
│       ├── api/
│       │   └── razorpay/
│       │       ├── create-order/
│       │       │   └── route.ts          # Create payment orders
│       │       ├── create-subscription/
│       │       │   └── route.ts          # Create autopay subscriptions
│       │       └── verify-payment/
│       │           └── route.ts          # Verify payment signatures
│       ├── globals.css                    # Global styles & design system
│       ├── layout.tsx                     # Root layout with metadata
│       └── page.tsx                       # Main payment page
├── public/                                # Static assets
├── .env.local                            # Environment variables (create this)
├── env.example                           # Environment variables template
├── next.config.ts                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
├── tsconfig.json                         # TypeScript configuration
└── package.json                          # Dependencies
```

## 🎯 Usage

### One-Time Payment

1. Fill in the payment details (amount, name, email, phone)
2. Click "Pay Now"
3. Complete payment in the Razorpay checkout modal
4. Receive confirmation

### Autopay/Recurring Payment

1. Fill in the payment details
2. Toggle "Enable Autopay"
3. Select payment frequency (Monthly/Quarterly/Yearly)
4. Click "Setup Autopay"
5. Complete the initial payment
6. Future payments will be automatically charged

## 🔧 API Routes

### Create Order
**POST** `/api/razorpay/create-order`

Creates a new Razorpay order for one-time payments.

```json
{
  "amount": 1000,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": {}
}
```

### Create Subscription
**POST** `/api/razorpay/create-subscription`

Creates a recurring subscription for autopay.

```json
{
  "planId": "plan_xxx",
  "totalCount": 12,
  "quantity": 1,
  "notes": {}
}
```

### Verify Payment
**POST** `/api/razorpay/verify-payment`

Verifies payment signature for security.

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

## 🎨 Design Features

- **Dark Theme** - Modern dark mode with vibrant accents
- **Glassmorphism** - Frosted glass effect on cards
- **Gradient Text** - Eye-catching gradient headings
- **Smooth Animations** - Floating elements and transitions
- **Responsive Layout** - Mobile-first design
- **Custom Scrollbar** - Branded scrollbar styling

## 🔒 Security

- Payment signature verification
- Environment variables for sensitive data
- HTTPS required for production
- PCI DSS compliant (via Razorpay)
- No card details stored on server

## 📝 Testing

Use Razorpay test mode credentials for development:

**Test Cards:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI:**
- UPI ID: `success@razorpay`

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set production environment variables:
- Use **Live** API keys from Razorpay Dashboard
- Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Set `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📚 Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Subscriptions](https://razorpay.com/docs/payments/subscriptions/)

## 🤝 Support

For issues or questions:
- Razorpay Support: [support@razorpay.com](mailto:support@razorpay.com)
- Razorpay Dashboard: [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Next.js and Razorpay**
