# 🚀 Hostinger Deployment Guide - Existing Website Ke Saath

## 🎯 Goal:
Client ki existing Hostinger website pe payment page add karna **WITHOUT deleting existing files**

---

## ✅ Best Solution: Subdomain Ya Subdirectory

### **Option 1: Subdomain (Recommended)**
```
Main site:    example.com
Payment page: pay.example.com
```

### **Option 2: Subdirectory**
```
Main site:    example.com
Payment page: example.com/payment
```

---

## 📋 Method 1: Subdomain Deployment (Easiest)

### **Step 1: Subdomain Banao (Hostinger Panel)**

1. **Hostinger hPanel** login karo
2. **Domains** section mein jao
3. **Subdomains** pe click karo
4. **Create Subdomain**:
   ```
   Subdomain: pay
   Domain: example.com
   Result: pay.example.com
   ```
5. Document root set karo: `/public_html/pay`

### **Step 2: Next.js Build Upload Karo**

Local machine pe:
```bash
cd /Users/himanshumac/Desktop/RazorPay
npm run build
```

Build files yahan hongi:
```
.next/          - Build output
public/         - Static files
package.json    - Dependencies
```

### **Step 3: Files Upload Karo (FTP/File Manager)**

Hostinger File Manager ya FTP se:

Upload karo:
```
/public_html/pay/
├── .next/
├── public/
├── src/
├── node_modules/  (ya server pe npm install karo)
├── package.json
├── next.config.ts
└── .env.local (environment variables)
```

### **Step 4: Node.js Setup (Hostinger)**

1. **hPanel** → **Advanced** → **Node.js**
2. **Create Application**:
   ```
   Application root: /public_html/pay
   Application URL: pay.example.com
   Application startup file: node_modules/next/dist/bin/next
   Application mode: Production
   Node.js version: 18.x or higher
   ```
3. **Environment variables** add karo:
   ```
   RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0
   RAZORPAY_KEY_SECRET=917FiE8XMWwrcpG7kzChKObR
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0
   NEXT_PUBLIC_META_PIXEL_ID=2064676100935063
   NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_Rx1jfbIaIu8tzL
   ```

4. **Run npm install**:
   ```bash
   cd /public_html/pay
   npm install --production
   ```

5. **Start application**

---

## 📋 Method 2: Vercel Deployment (Easiest - Recommended!)

Agar Hostinger pe Node.js support nahi hai ya complex lag raha hai:

### **Step 1: Vercel Pe Deploy Karo**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/himanshumac/Desktop/RazorPay
vercel
```

### **Step 2: Custom Domain Add Karo**

1. Vercel dashboard mein jao
2. Project settings → Domains
3. Add domain: `pay.example.com`
4. Vercel DNS records dikhayega

### **Step 3: Hostinger DNS Update Karo**

1. Hostinger hPanel → DNS/Name Servers
2. Add CNAME record:
   ```
   Type: CNAME
   Name: pay
   Points to: cname.vercel-dns.com
   ```

### **Step 4: Environment Variables (Vercel)**

Vercel Dashboard → Settings → Environment Variables:
```
RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0
RAZORPAY_KEY_SECRET=917FiE8XMWwrcpG7kzChKObR
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0
NEXT_PUBLIC_META_PIXEL_ID=2064676100935063
NEXT_PUBLIC_RAZORPAY_PLAN_ID=plan_Rx1jfbIaIu8tzL
```

**Redeploy** karo!

---

## 📋 Method 3: Subdirectory (Advanced)

Agar same domain pe chahiye: `example.com/payment`

### **Hostinger Reverse Proxy Setup:**

1. `.htaccess` file banao `/public_html/` mein:

```apache
# Existing site rules
# ... your existing rules ...

# Payment page proxy
RewriteEngine On
RewriteRule ^payment(.*)$ http://localhost:3000$1 [P,L]
RewriteRule ^thank-you(.*)$ http://localhost:3000/thank-you$1 [P,L]
```

2. Node.js app `/public_html/payment/` mein deploy karo
3. Port 3000 pe run karo

---

## ⚠️ Important Notes:

### **Razorpay Dashboard Update:**

Payment page deploy hone ke baad:
1. **https://dashboard.razorpay.com** → Settings → Website Details
2. Add new domain:
   ```
   pay.example.com  (ya jo bhi domain use kiya)
   ```
3. Verify karo

### **HTTPS Required:**

- Razorpay **HTTPS mandatory** hai
- Hostinger free SSL deta hai
- Vercel automatic SSL deta hai

---

## 🎯 Recommended Approach:

**Best Option:** **Vercel + Subdomain**

**Kyun?**
- ✅ **Easiest** - 5 minutes mein deploy
- ✅ **Free** - No cost
- ✅ **Auto SSL** - HTTPS automatic
- ✅ **Fast** - CDN included
- ✅ **No server management**
- ✅ **Existing site safe** - Koi change nahi

**Steps:**
1. Vercel pe deploy karo
2. `pay.example.com` subdomain add karo
3. Hostinger DNS update karo
4. Done! 🎉

---

## 🧪 Testing:

Deploy hone ke baad:
```
https://pay.example.com          → Payment page
https://pay.example.com/thank-you → Thank you page
https://example.com               → Original site (unchanged)
```

---

## 📞 Quick Commands:

### **Vercel Deployment:**
```bash
npm i -g vercel
vercel login
cd /Users/himanshumac/Desktop/RazorPay
vercel --prod
```

### **Build Locally:**
```bash
npm run build
npm start  # Test production build
```

---

**Recommendation: Vercel use karo! Sabse easy aur reliable hai!** 🚀
