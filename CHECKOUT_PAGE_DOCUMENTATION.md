# 📚 Checkout Page - Complete Documentation

## 🎯 Overview

This is a Next.js checkout page for the **Makeup Mastery Club** membership subscription service. It integrates with Razorpay for payment processing, Facebook Pixel for tracking, and Google Sheets for customer data collection.

**File Location:** `/src/app/page.tsx`

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Payment Gateway:** Razorpay (Subscription-based)
- **Analytics:** Facebook Pixel
- **Data Storage:** Google Sheets (via Apps Script)
- **Styling:** Tailwind CSS

### Key Dependencies
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "razorpay": "^2.x"
}
```

---

## 📋 Features

### 1. **Multi-Plan Selection**
- 4 subscription plans: Monthly, Quarterly, Half-Yearly, Yearly
- Visual plan cards with psychological pricing
- Default selection: Quarterly (best conversion)

### 2. **Customer Information Form**
- First Name, Last Name
- Email (validated)
- Mobile Number (10-digit validation)
- Country & State selection

### 3. **Payment Integration**
- Razorpay Subscription API
- Automatic subscription creation
- Payment verification
- Redirect to thank-you page

### 4. **Data Collection**
- Automatic save to Google Sheets after payment
- Stores: Name, Email, Mobile, Plan, Amount, IDs, Timestamp

### 5. **Analytics Tracking**
- Facebook Pixel events:
  - `InitiateCheckout`
  - `AddToCart`
  - `Subscribe`
  - `Purchase`

### 6. **Social Proof Elements**
- "40,000+ Makeup artists trained" headline
- Student testimonials with real photos
- Founders section with images
- Trust badges and savings displays

---

## 🎨 Plan Configuration

### Location in Code
**Lines 20-105** in `/src/app/page.tsx`

### Plan Structure
```typescript
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
    subtitle: 'Most students quit before seeing results',
    trustBadge: null,
    razorpayPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID || '',
    bonus: null,
  },
  // ... other plans
}
```

### How to Modify Plans

#### **Change Plan Price**
```typescript
// Find the plan you want to modify
quarterly: {
  price: 2799,  // ← Change this number
  // ...
}
```

#### **Change Plan Name**
```typescript
quarterly: {
  name: 'Your New Plan Name',  // ← Change this
  // ...
}
```

#### **Change Savings Display**
```typescript
quarterly: {
  savings: '7% monthly = 21% savings quarterly',  // ← Modify this
  // ...
}
```

#### **Add/Remove Bonuses**
```typescript
quarterly: {
  bonus: {
    title: 'Quarterly Only Bonuses',
    items: [
      'Client Pricing Template',
      'New Bonus Item',  // ← Add new items here
      // Remove items by deleting lines
    ]
  },
}
```

#### **Change Default Selected Plan**
**Line 7:**
```typescript
const [selectedPlan, setSelectedPlan] = useState('quarterly');
//                                                  ↑ Change to: 'monthly', 'halfYearly', or 'yearly'
```

---

## 🔧 Environment Variables

### Required Variables

Create/edit `.env.local` file:

```env
# Razorpay Keys (Get from Razorpay Dashboard)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Razorpay Plan IDs (Create in Razorpay Dashboard)
NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_xxxxx              # Monthly
NEXT_PUBLIC_RAZORPAY_PLAN_ID_QUARTERLY=plan_xxxxx    # Quarterly
NEXT_PUBLIC_RAZORPAY_PLAN_ID_HALFYEARLY=plan_xxxxx   # Half-Yearly
NEXT_PUBLIC_RAZORPAY_PLAN_ID_YEARLY=plan_xxxxx       # Yearly

# Facebook Pixel (Get from Facebook Business Manager)
NEXT_PUBLIC_FB_PIXEL_ID=xxxxx

# Google Sheets Web App URL (Deploy Apps Script)
GOOGLE_SHEET_URL=https://script.google.com/macros/s/xxxxx/exec
```

### How to Get These Values

#### **Razorpay Keys:**
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live keys

#### **Razorpay Plan IDs:**
1. Go to Razorpay Dashboard → Subscriptions → Plans
2. Create a new plan for each duration
3. Copy the Plan ID (starts with `plan_`)

#### **Facebook Pixel ID:**
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a Pixel
3. Copy the Pixel ID

#### **Google Sheets URL:**
1. Follow instructions in `GOOGLE_SHEETS_SETUP.md`
2. Deploy Apps Script as Web App
3. Copy the deployment URL

---

## 💳 Payment Flow

### Step-by-Step Process

1. **User fills form** → Validates all fields
2. **Clicks "Complete Order"** → `handlePayment()` function triggered
3. **Creates Razorpay Subscription** → API call to `/api/razorpay/subscription`
4. **Opens Razorpay Checkout** → User enters payment details
5. **Payment Success** → Razorpay callback
6. **Verifies Payment** → API call to `/api/razorpay/verify`
7. **Saves to Google Sheets** → API call to `/api/save-to-sheet`
8. **Redirects to Thank You page** → `/thank-you?order_id=xxx`

### Payment Handler Function

**Location:** Lines 89-210

```typescript
const handlePayment = async () => {
  // 1. Validate form
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
    alert('Please fill in all required fields');
    return;
  }

  // 2. Track Facebook Pixel event
  trackEvent('InitiateCheckout', { /* ... */ });

  // 3. Create Razorpay subscription
  const response = await fetch('/api/razorpay/subscription', {
    method: 'POST',
    body: JSON.stringify({
      planId: currentPlan.razorpayPlanId,
      totalCount: currentPlan.totalMonths,
      notes: { /* customer data */ }
    }),
  });

  // 4. Open Razorpay checkout
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    subscription_id: data.subscriptionId,
    name: 'MakeUp Mastry Club',
    handler: async function (response) {
      // 5. Verify payment
      // 6. Save to Google Sheets
      // 7. Redirect to thank-you page
    }
  };
};
```

### How to Modify Payment Flow

#### **Change Company Name**
```typescript
const options = {
  name: 'Your Company Name',  // ← Change this
  description: 'Your Description',
  // ...
};
```

#### **Change Thank You Page URL**
```typescript
window.location.href = `/your-custom-page?order_id=${subscriptionId}`;
```

#### **Add Custom Payment Notes**
```typescript
notes: {
  customer_name: `${formData.firstName} ${formData.lastName}`,
  customer_email: formData.email,
  customer_mobile: formData.mobile,
  custom_field: 'your_value',  // ← Add custom fields
}
```

---

## 📊 Google Sheets Integration

### How It Works

1. After successful payment
2. Data sent to `/api/save-to-sheet`
3. API forwards to Google Apps Script Web App
4. Apps Script appends row to Google Sheet

### Data Saved
- Timestamp
- First Name
- Last Name
- Email
- Mobile
- Plan Name
- Amount
- Subscription ID
- Payment ID

### How to Modify Data Saved

**File:** `/src/app/api/save-to-sheet/route.ts`

```typescript
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
  customField: 'your_value',  // ← Add new fields
}),
```

**Also update:** `google-sheets-script.js` to handle new fields

---

## 🎨 UI Customization

### Change Main Heading

**Location:** Lines 416-418

```typescript
<h1 className="text-3xl font-bold text-gray-900">
  Join the Makeup Mastery Club  {/* ← Change this */}
</h1>
<p className="text-base text-gray-600">
  40,000+ Makeup artists trained till now  {/* ← Change this */}
</p>
```

### Change Plan Card Design

**Location:** Lines 430-505

```typescript
<div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
  plan.id === 'monthly' 
    ? 'opacity-75 scale-95'  // ← Modify de-emphasis
    : ''
}`}>
```

### Add/Remove Form Fields

**Location:** Lines 547-625

**Example - Add a new field:**

1. **Add to state:**
```typescript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  country: 'IN',
  state: '',
  newField: '',  // ← Add here
});
```

2. **Add input field:**
```tsx
<input
  type="text"
  name="newField"
  value={formData.newField}
  onChange={handleInputChange}
  placeholder="New Field"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
  required
/>
```

3. **Add to validation:**
```typescript
if (!formData.firstName || !formData.lastName || !formData.newField) {
  alert('Please fill in all required fields');
  return;
}
```

### Change Colors/Styling

**Primary Color (Blue):**
```typescript
className="bg-blue-600 hover:bg-blue-700"
// Change to: bg-purple-600, bg-green-600, etc.
```

**Plan Card Border:**
```typescript
className="border-blue-500"
// Change to any Tailwind color
```

---

## 🖼️ Images

### Student Testimonial Photos

**Location:** `/public/images/`

Files:
- `achievement-1.png` - Pooja
- `achievement-2.png` - Anjali
- `achievement-3.png` - Neha
- `founders.jpg` - Rekha
- `kavita.png` - Kavita

**To replace:**
1. Add new image to `/public/images/`
2. Update image path in code:

```typescript
<img 
  src="/images/your-new-image.jpg"  // ← Change this
  alt="Student Name"
/>
```

### Founders Section Images

**Location:** Lines 733-775

**Main Founders Photo:**
```typescript
src="https://membership.hsmschoolmakeup.in/wp-content/uploads/2025/11/Untitled-design-2025-06-08T020303.110.png"
// ← Replace with your URL or /public/images/ path
```

**Achievement Gallery (4 images):**
```typescript
src="https://membership.hsmschoolmakeup.in/wp-content/uploads/2025/11/IMG_9097.jpg"
// ← Replace each URL
```

---

## 📱 Responsive Design

### Mobile-First Approach

The page is designed mobile-first with responsive breakpoints:

```typescript
className="mb-8 lg:hidden"     // Mobile only
className="hidden lg:block"    // Desktop only
className="grid grid-cols-1 sm:grid-cols-2"  // 1 col mobile, 2 cols tablet+
```

### Breakpoints
- `sm:` - 640px and up (tablets)
- `md:` - 768px and up
- `lg:` - 1024px and up (laptops/desktops)
- `xl:` - 1280px and up

### How to Modify Responsive Behavior

**Example - Change plan grid:**
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                              ↑ Change to: sm:grid-cols-3, sm:grid-cols-4
```

---

## 🧪 Testing

### Test Payment Flow

1. **Use Razorpay Test Mode:**
   - Test Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

2. **Test Different Plans:**
   - Select each plan
   - Complete checkout
   - Verify Google Sheets entry

3. **Test Form Validation:**
   - Leave fields empty
   - Enter invalid email
   - Enter wrong mobile format

### Debug Mode

**Enable console logs:**
```typescript
console.log('Form Data:', formData);
console.log('Selected Plan:', currentPlan);
console.log('Payment Response:', response);
```

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Replace Razorpay Test keys with Live keys
- [ ] Update all Razorpay Plan IDs to Live plans
- [ ] Test live payment with real card
- [ ] Verify Google Sheets integration
- [ ] Test Facebook Pixel events
- [ ] Replace placeholder images with real photos
- [ ] Update company name and branding
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Set up error monitoring (Sentry, etc.)

### Environment Variables for Production

```env
# Production .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx  # ← LIVE key
RAZORPAY_KEY_SECRET=xxxxx                    # ← LIVE secret

# Create LIVE plans in Razorpay Dashboard
NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_xxxxx
NEXT_PUBLIC_RAZORPAY_PLAN_ID_QUARTERLY=plan_xxxxx
NEXT_PUBLIC_RAZORPAY_PLAN_ID_HALFYEARLY=plan_xxxxx
NEXT_PUBLIC_RAZORPAY_PLAN_ID_YEARLY=plan_xxxxx

NEXT_PUBLIC_FB_PIXEL_ID=xxxxx
GOOGLE_SHEET_URL=https://script.google.com/macros/s/xxxxx/exec
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Payment Not Working

**Symptoms:** Razorpay checkout doesn't open

**Solutions:**
1. Check if Razorpay script is loaded:
   ```typescript
   if (!window.Razorpay) {
     console.error('Razorpay script not loaded');
   }
   ```
2. Verify API keys in `.env.local`
3. Check browser console for errors
4. Ensure plan IDs are correct

### Issue 2: Google Sheets Not Saving

**Symptoms:** Payment succeeds but no data in sheet

**Solutions:**
1. Check `GOOGLE_SHEET_URL` in `.env.local`
2. Verify Apps Script deployment
3. Check Apps Script execution logs
4. Test `/api/save-to-sheet` endpoint directly

### Issue 3: Form Validation Failing

**Symptoms:** Can't submit form even with all fields filled

**Solutions:**
1. Check mobile number format (must be 10 digits)
2. Verify email format
3. Check console for validation errors
4. Ensure all required fields have `required` attribute

### Issue 4: Facebook Pixel Not Tracking

**Symptoms:** No events in Facebook Events Manager

**Solutions:**
1. Verify Pixel ID in `.env.local`
2. Use Facebook Pixel Helper extension
3. Check if Pixel script is loaded
4. Wait 15-30 minutes for events to appear

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Check Google Sheets for new entries
- Monitor Razorpay dashboard for payments
- Review Facebook Pixel conversion data

**Monthly:**
- Backup Google Sheets data
- Review and optimize conversion rates
- Update testimonials if needed
- Check for Razorpay API updates

### Getting Help

**Razorpay Issues:**
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

**Next.js Issues:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)

**Google Sheets:**
- [Apps Script Documentation](https://developers.google.com/apps-script)

---

## 📝 Code Structure

### Main Sections

```
page.tsx (1,177 lines)
├── Imports & Setup (1-5)
├── Component Definition (6)
├── State Management (7-18)
├── Plan Configurations (20-105)
├── Payment Handler (89-210)
├── Form Handler (212-220)
├── JSX Return (222-1,177)
│   ├── Header Section (390-420)
│   ├── Plan Selection (422-510)
│   ├── Order Summary Mobile (518-545)
│   ├── Basic Information Form (547-590)
│   ├── Billing Address (592-625)
│   ├── Complete Order Button #1 (627-660)
│   ├── Train With Founders (705-777)
│   ├── Plan Details (779-815)
│   ├── Testimonials Mobile (817-930)
│   ├── Complete Order Button #2 (932-960)
│   ├── Desktop Sidebar (995-1,145)
│   └── Desktop Testimonials (1,053-1,140)
```

### File Dependencies

```
/src/app/page.tsx
├── /src/components/FacebookPixel.tsx
├── /src/app/api/razorpay/subscription/route.ts
├── /src/app/api/razorpay/verify/route.ts
├── /src/app/api/save-to-sheet/route.ts
├── /public/images/*.{png,jpg}
└── /.env.local
```

---

## 🎓 Best Practices

### Code Organization

1. **Keep plan configs at top** - Easy to find and modify
2. **Separate concerns** - Payment logic, form handling, UI separate
3. **Use constants** - Don't hardcode values
4. **Comment complex logic** - Explain why, not what

### Performance

1. **Optimize images** - Use WebP format, compress
2. **Lazy load** - Load images only when needed
3. **Minimize re-renders** - Use React.memo if needed
4. **Code splitting** - Keep bundle size small

### Security

1. **Never expose secrets** - Use environment variables
2. **Validate on server** - Don't trust client data
3. **Sanitize inputs** - Prevent XSS attacks
4. **Use HTTPS** - Always in production

---

## 📚 Additional Resources

### Documentation Files
- `GOOGLE_SHEETS_SETUP.md` - Google Sheets integration guide
- `PRODUCTION_CHECKLIST.md` - Pre-launch checklist
- `README.md` - Project overview

### External Links
- [Razorpay Subscriptions API](https://razorpay.com/docs/api/subscriptions/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Facebook Pixel Events](https://developers.facebook.com/docs/meta-pixel/reference)

---

## 🔄 Version History

**v1.0.0** - Initial Release
- Basic checkout page
- Single plan
- Razorpay integration

**v2.0.0** - Multi-Plan Update
- 4 subscription plans
- Psychological pricing
- Bonus system

**v3.0.0** - Current Version
- Google Sheets integration
- Facebook Pixel tracking
- Enhanced UI/UX
- Student testimonials
- Founders section

---

## 👨‍💻 Developer Notes

### Quick Start for New Developers

1. **Clone the repo**
2. **Install dependencies:** `npm install`
3. **Copy `.env.local.example` to `.env.local`**
4. **Add your API keys**
5. **Run dev server:** `npm run dev`
6. **Open:** `http://localhost:3000`

### Making Your First Change

**Example: Change Quarterly Plan Price**

1. Open `/src/app/page.tsx`
2. Find line ~40 (quarterly plan config)
3. Change `price: 2799` to your new price
4. Save file
5. Refresh browser
6. Test checkout flow

### Common Modifications

**Most Requested Changes:**
1. Plan prices → Lines 20-105
2. Plan names → Lines 20-105
3. Form fields → Lines 11-17, 547-625
4. Images → `/public/images/` + update paths
5. Colors → Search for `bg-blue-` and replace
6. Text content → Search for specific text

---

**Last Updated:** 2026-01-03  
**Maintained By:** Development Team  
**Contact:** support@makeupmastery.com

---

## 🎯 Quick Reference

### Most Common Tasks

| Task | File | Line(s) |
|------|------|---------|
| Change plan price | `page.tsx` | 20-105 |
| Change default plan | `page.tsx` | 7 |
| Add form field | `page.tsx` | 11-17, 547-625 |
| Change company name | `page.tsx` | 150 |
| Update Razorpay keys | `.env.local` | 1-5 |
| Change heading | `page.tsx` | 416-418 |
| Modify bonuses | `page.tsx` | 50-60 |
| Update images | `/public/images/` | - |

---

**End of Documentation**
