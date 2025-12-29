# 🚀 Vercel Subdomain Setup - Complete Guide

## ✅ Current Status:
- ✅ Vercel CLI installed
- ⏳ Waiting for login...

---

## 🔐 Step 1: Complete Vercel Login

### **Terminal Mein:**
```
Visit vercel.com/device and enter TMLT-WLGK
Press [ENTER] to open the browser
```

### **Kya Karna Hai:**
1. **ENTER** press karo (browser khulega)
2. **Vercel account** se login karo
3. **Authorize** karo
4. Terminal mein "Success!" dikhega

---

## 📦 Step 2: Deploy Karo

Login successful hone ke baad:

```bash
cd /Users/himanshumac/Desktop/RazorPay
vercel --prod
```

### **Questions Aayenge:**

```
? Set up and deploy "~/Desktop/RazorPay"? [Y/n]
→ Y (press ENTER)

? Which scope do you want to deploy to?
→ Select your account

? Link to existing project? [y/N]
→ N (new project)

? What's your project's name?
→ razorpay-payment (ya koi bhi naam)

? In which directory is your code located?
→ ./ (press ENTER)

? Want to override the settings? [y/N]
→ N (press ENTER)
```

### **Deployment Start Hoga:**
```
🔍 Inspect: https://vercel.com/...
✅ Production: https://razorpay-payment-xxx.vercel.app
```

---

## 🌐 Step 3: Custom Subdomain Add Karo

### **Vercel Dashboard:**

1. **https://vercel.com/dashboard** pe jao
2. Apna project select karo (razorpay-payment)
3. **Settings** tab pe click karo
4. **Domains** section mein jao
5. **Add Domain** button click karo

### **Domain Enter Karo:**
```
pay.example.com
```
(Replace `example.com` with client's actual domain)

### **Vercel Response:**
```
⚠️ Invalid Configuration
Add the following record to your DNS provider:

Type: CNAME
Name: pay
Value: cname.vercel-dns.com
```

---

## 🔧 Step 4: Hostinger DNS Update

### **Client's Hostinger Account:**

1. **hPanel** login karo
2. **Domains** section
3. Client ka domain select karo
4. **DNS / Name Servers** pe click karo
5. **Manage DNS Records**

### **Add CNAME Record:**
```
Type:     CNAME
Name:     pay
Points to: cname.vercel-dns.com
TTL:      14400 (default)
```

6. **Save** karo

### **Verification:**
- 5-10 minutes wait karo (DNS propagation)
- Vercel automatically verify kar lega
- Green checkmark dikhega ✅

---

## ⚙️ Step 5: Environment Variables Add Karo

### **Vercel Dashboard:**

1. Project → **Settings** → **Environment Variables**
2. **Add New** button click karo

### **Add These 5 Variables:**

#### **Variable 1:**
```
Name: RAZORPAY_KEY_ID
Value: rzp_live_Rx0dB1g3YMVHI0
Environment: Production, Preview, Development (all select)
```

#### **Variable 2:**
```
Name: RAZORPAY_KEY_SECRET
Value: 917FiE8XMWwrcpG7kzChKObR
Environment: Production, Preview, Development
```

#### **Variable 3:**
```
Name: NEXT_PUBLIC_RAZORPAY_KEY_ID
Value: rzp_live_Rx0dB1g3YMVHI0
Environment: Production, Preview, Development
```

#### **Variable 4:**
```
Name: NEXT_PUBLIC_META_PIXEL_ID
Value: 2064676100935063
Environment: Production, Preview, Development
```

#### **Variable 5:**
```
Name: NEXT_PUBLIC_RAZORPAY_PLAN_ID
Value: plan_Rx1jfbIaIu8tzL
Environment: Production, Preview, Development
```

### **Save Karo**

---

## 🔄 Step 6: Redeploy Karo

Environment variables add karne ke baad:

### **Option 1: Vercel Dashboard**
1. **Deployments** tab
2. Latest deployment ke saamne **"..."** (three dots)
3. **Redeploy** click karo

### **Option 2: Terminal**
```bash
vercel --prod
```

---

## 🎯 Step 7: Razorpay Dashboard Update

### **Razorpay Settings:**

1. **https://dashboard.razorpay.com** login karo
2. **Settings** → **Website and App Settings**
3. **Websites & API keys** tab
4. **Add additional website/app** button
5. Enter: `https://pay.example.com`
6. **Submit for verification**

---

## ✅ Step 8: Testing

### **Test URLs:**
```
https://pay.example.com           → Payment page
https://pay.example.com/thank-you → Thank you page
```

### **Test Payment Flow:**
1. Open payment page
2. Click "Setup Autopay"
3. Complete test payment
4. Verify thank you page
5. Check Meta Pixel events
6. Check Razorpay dashboard

---

## 🎊 Final Result:

```
✅ Client's existing site:  example.com (unchanged)
✅ Your payment page:       pay.example.com (live!)
✅ HTTPS:                   Automatic (Vercel SSL)
✅ Meta Pixel:              Tracking active
✅ Razorpay:                Live payments working
✅ Autopay:                 Mandate creation working
```

---

## 🐛 Troubleshooting:

### **Problem: Domain not verifying**
**Solution:**
- Wait 10-15 minutes for DNS propagation
- Check CNAME record in Hostinger
- Use `dig pay.example.com` to verify DNS

### **Problem: Payment failing**
**Solution:**
- Check environment variables in Vercel
- Verify Razorpay keys are correct
- Check browser console for errors

### **Problem: Meta Pixel not tracking**
**Solution:**
- Check Pixel ID in environment variables
- Use Meta Pixel Helper extension
- Check browser console

---

## 📞 Quick Commands:

### **Check Deployment Status:**
```bash
vercel ls
```

### **View Logs:**
```bash
vercel logs
```

### **Remove Deployment:**
```bash
vercel remove razorpay-payment
```

---

## 🎯 Summary Checklist:

- [ ] Vercel login complete
- [ ] Project deployed
- [ ] Custom domain added (pay.example.com)
- [ ] Hostinger DNS updated (CNAME record)
- [ ] Domain verified in Vercel
- [ ] Environment variables added (all 5)
- [ ] Redeployed after env vars
- [ ] Razorpay dashboard updated
- [ ] Payment tested
- [ ] Meta Pixel verified

---

**Sab steps follow karo aur payment page live ho jayega!** 🚀

**Current Step: Complete Vercel login (ENTER press karo terminal mein)**
