# 🔑 Razorpay API Keys Setup Guide (Hindi)

## Step-by-Step Instructions

### 1️⃣ Razorpay Account Banayein

1. Browser mein jayein: **https://razorpay.com**
2. **"Sign Up"** button pe click karein
3. Apna email, phone number aur password enter karein
4. Email verification karein
5. Login karein

---

### 2️⃣ Dashboard Mein API Keys Generate Karein

#### **Option A: Test Mode (Recommended for Testing)**

1. **https://dashboard.razorpay.com** pe jayein
2. Left sidebar mein **"Settings"** (⚙️) pe click karein
3. **"API Keys"** option select karein
4. **"Test Mode"** toggle ON karein (top-right corner)
5. **"Generate Test Key"** button pe click karein
6. Aapko 2 keys milenge:
   ```
   Key ID:     rzp_test_xxxxxxxxxxxxx
   Key Secret: xxxxxxxxxxxxxxxxxxxxx
   ```
7. **IMPORTANT**: Key Secret ko copy karke safe jagah save karein (yeh sirf ek baar dikhega)

#### **Option B: Live Mode (Real Payments ke liye)**

⚠️ **Note**: Live mode ke liye business verification zaroori hai

1. Dashboard mein **"Live Mode"** toggle ON karein
2. Business verification complete karein (KYC, documents, etc.)
3. Verification approve hone ke baad **"Generate Live Key"** pe click karein
4. Live keys copy karein

---

### 3️⃣ Project Mein Keys Setup Karein

#### **File Location**: `/Users/himanshumac/Desktop/RazorPay/.env.local`

Maine already ek template file bana di hai. Ab aapko sirf keys replace karni hain:

1. **VS Code ya koi bhi editor** mein `.env.local` file open karein
2. `xxxxxxxxxx` ko apni **actual keys** se replace karein:

```env
# Razorpay API Keys
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET

# Browser ke liye (same Key ID)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
```

#### **Example** (Fake keys for reference):
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnop1234567890
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890abcd
```

---

### 4️⃣ Server Restart Karein

Environment variables load hone ke liye server restart karna zaroori hai:

```bash
# Terminal mein Ctrl+C press karke current server stop karein
# Phir dobara start karein:
npm run dev
```

---

### 5️⃣ Test Karein

1. Browser mein **http://localhost:3000** pe jayein
2. **"Setup Autopay (₹1)"** button pe click karein
3. Razorpay checkout modal open hoga
4. Test credentials use karein:

#### **Test Card Details**:
```
Card Number: 4111 1111 1111 1111
CVV:         123
Expiry:      Any future date (e.g., 12/25)
Name:        Test User
```

#### **Test UPI**:
```
UPI ID: success@razorpay
```

#### **Test Net Banking**:
- Koi bhi bank select karein
- Success/Failure test kar sakte hain

---

## 🎯 Quick Reference

### Razorpay Dashboard Links:
- **Dashboard**: https://dashboard.razorpay.com
- **API Keys**: https://dashboard.razorpay.com/app/keys
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Documentation**: https://razorpay.com/docs/

### Important Notes:

✅ **Test Mode**:
- Free hai
- Real payment nahi hoga
- Testing ke liye perfect
- Koi verification nahi chahiye

❌ **Live Mode**:
- Real payments hogi
- Business verification zaroori
- Transaction fees lagenge
- Production ke liye use karein

### Security Tips:

🔒 **Key Secret ko KABHI share mat karein**
🔒 **Git mein commit mat karein** (.env.local already gitignore mein hai)
🔒 **Public repositories mein mat dalein**
🔒 **Regular basis pe keys rotate karein**

---

## 🐛 Troubleshooting

### Problem: "Invalid API Key" error
**Solution**: 
- Check karein ki keys sahi copy hui hain
- Quotes (`" "`) use mat karein
- Spaces nahi hone chahiye
- Server restart karein

### Problem: Payment modal nahi khul raha
**Solution**:
- Browser console check karein (F12)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` set hai ya nahi verify karein
- Razorpay script load ho rahi hai ya nahi check karein

### Problem: Payment verification fail ho raha hai
**Solution**:
- `RAZORPAY_KEY_SECRET` sahi hai ya nahi check karein
- Server-side API routes chal rahe hain ya nahi verify karein

---

## 📞 Support

Agar koi problem aaye toh:
1. Razorpay Documentation: https://razorpay.com/docs/
2. Razorpay Support: support@razorpay.com
3. Dashboard mein "Help" section

---

**Happy Testing! 🚀**
