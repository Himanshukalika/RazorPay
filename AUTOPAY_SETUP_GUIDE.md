# 🔄 Razorpay Autopay Setup Guide

## ⚠️ Important: Subscription Plan Banana Zaroori Hai

Real autopay/recurring payments ke liye Razorpay mein **Subscription Plan** create karna padta hai.

---

## 📋 Step-by-Step Setup:

### **Step 1: Razorpay Dashboard Mein Plan Banao**

1. **https://dashboard.razorpay.com** pe jao
2. Left sidebar mein **"Subscriptions"** pe click karo
3. **"Plans"** tab select karo
4. **"Create Plan"** button pe click karo

### **Step 2: Plan Details Fill Karo**

```
Plan Name:       Test Autopay Plan
Billing Cycle:   Monthly (ya Quarterly/Yearly)
Amount:          100 (₹1 = 100 paise)
Currency:        INR
Description:     Monthly recurring payment
```

### **Step 3: Plan ID Copy Karo**

Plan create hone ke baad:
- **Plan ID** dikhega (format: `plan_xxxxxxxxxxxxx`)
- Copy karo

### **Step 4: Environment Variable Add Karo**

`.env.local` file mein add karo:

```env
NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_xxxxxxxxxxxxx
```

**Complete .env.local:**
```env
# Razorpay Live API Keys
RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0
RAZORPAY_KEY_SECRET=917FiE8XMWwrcpG7kzChKObR
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0

# Meta Pixel ID
NEXT_PUBLIC_META_PIXEL_ID=2064676100935063

# Razorpay Subscription Plan ID
NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_xxxxxxxxxxxxx
```

### **Step 5: Vercel Mein Bhi Add Karo**

Agar Vercel pe deploy hai:
1. Vercel Dashboard → Settings → Environment Variables
2. Add karo:
   ```
   Name: NEXT_PUBLIC_RAZORPAY_PLAN_ID
   Value: plan_xxxxxxxxxxxxx
   Environment: Production, Preview, Development
   ```
3. Redeploy karo

### **Step 6: Server Restart**

```bash
# Terminal mein Ctrl+C
npm run dev
```

---

## 🎯 Kaise Kaam Karega:

### **Autopay Enabled (Checkbox ON):**
1. User "Setup Autopay" button click karega
2. Razorpay **Subscription** checkout khulega
3. User payment method select karega
4. **Autopay mandate** create hoga
5. Har mahine automatically ₹1 deduct hoga

### **Autopay Disabled (Checkbox OFF):**
1. User "Pay ₹1 Now" button click karega
2. Normal one-time payment hoga
3. Koi recurring charge nahi hoga

---

## 📱 User Experience:

### **Autopay Setup Flow:**
```
1. User clicks "Setup Autopay (₹1/month)"
2. Razorpay modal opens
3. User selects payment method (Card/UPI/Net Banking)
4. User authorizes recurring payment mandate
5. First payment of ₹1 processed
6. Autopay activated ✅
7. Next month automatically ₹1 charged
```

### **What User Sees:**
- Google Pay/PhonePe mein **mandate notification** aayega
- "Autopay enabled for ₹1/month" message
- Mandate details (frequency, amount, merchant)
- Option to cancel anytime

---

## 🔍 Testing:

### **Test Mode:**
1. Test mode plan banao
2. Test keys use karo
3. Test card se autopay setup karo
4. Razorpay dashboard mein subscriptions check karo

### **Live Mode:**
1. Live mode plan banao
2. Live keys use karo
3. Real payment method se test karo
4. Actual autopay mandate create hoga

---

## 📊 Razorpay Dashboard Mein Kya Dikhega:

### **Subscriptions Tab:**
```
Active Subscriptions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Customer: test@example.com
Plan: Test Autopay Plan
Amount: ₹1/month
Status: Active
Next Charge: 28 Jan 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **Automatic Charges:**
- Har billing cycle pe automatically charge hoga
- Success/failure notifications
- Retry logic (agar payment fail ho)

---

## ⚙️ Advanced Configuration:

### **Different Billing Cycles:**

Monthly Plan:
```
Billing Cycle: Monthly
Amount: ₹100
```

Quarterly Plan:
```
Billing Cycle: Quarterly
Amount: ₹300
```

Yearly Plan:
```
Billing Cycle: Yearly
Amount: ₹1200
```

### **Multiple Plans:**

Aap multiple plans bana sakte ho aur user ko choose karne de sakte ho:
- Basic Plan: ₹99/month
- Pro Plan: ₹299/month
- Premium Plan: ₹999/month

---

## 🚨 Important Notes:

### **Live Mode Requirements:**
- ✅ Business verification complete hona chahiye
- ✅ Bank account linked hona chahiye
- ✅ KYC approved hona chahiye

### **Subscription Limits:**
- Test mode: Unlimited subscriptions
- Live mode: Based on your Razorpay plan

### **Cancellation:**
- Users can cancel autopay anytime
- From their bank app/UPI app
- Or you can provide cancel option in your app

---

## 🎊 Summary:

**Autopay Setup Steps:**
1. ✅ Razorpay dashboard mein plan banao
2. ✅ Plan ID copy karo
3. ✅ `.env.local` mein add karo
4. ✅ Vercel mein bhi add karo (if deployed)
5. ✅ Server restart karo
6. ✅ Test karo!

**Ab real autopay mandate create hoga jaise Google Pay mein!** 🚀

---

## 📞 Support:

Agar koi issue aaye:
- Razorpay Docs: https://razorpay.com/docs/payments/subscriptions/
- Support: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com
