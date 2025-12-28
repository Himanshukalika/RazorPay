# 📊 Meta Pixel (Facebook Pixel) Setup Guide

## ✅ Meta Pixel Successfully Integrated!

Aapke Razorpay payment page mein Meta Pixel tracking ab active hai!

---

## 🎯 Kya Track Ho Raha Hai:

### **1. Page View**
- Jab koi user page pe aata hai
- Automatically track hota hai

### **2. InitiateCheckout**
- Jab user payment button click karta hai
- Amount aur currency track hoti hai

### **3. AddPaymentInfo**
- Payment type track hota hai (Autopay ya One-time)
- User preference track hoti hai

### **4. Purchase (Conversion)**
- Successful payment track hoti hai
- Transaction ID, amount, currency save hoti hai
- **Yeh sabse important event hai!**

---

## 🔑 Meta Pixel ID Kaise Setup Karein:

### **Step 1: Meta Events Manager Mein Jayein**

1. Browser mein jayein: **https://business.facebook.com/events_manager**
2. Apne Facebook Business Account se login karein
3. Agar nahi hai toh pehle Business Account banayein

### **Step 2: Pixel Create Karein**

1. **"Connect Data Sources"** pe click karein
2. **"Web"** select karein
3. **"Meta Pixel"** choose karein
4. **Pixel name** enter karein (e.g., "Razorpay Payment Tracking")
5. **Website URL** enter karein (optional)
6. **"Create Pixel"** pe click karein

### **Step 3: Pixel ID Copy Karein**

Pixel create hone ke baad:
1. **Settings** tab mein jayein
2. **Pixel ID** dikhega (15-16 digit number)
3. Format: `123456789012345`
4. Copy karein

### **Step 4: .env.local Mein Add Karein**

`.env.local` file open karein aur yeh line update karein:

```env
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

**Example:**
```env
# Razorpay Live API Keys
RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0
RAZORPAY_KEY_SECRET=917FiE8XMWwrcpG7kzChKObR
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_Rx0dB1g3YMVHI0

# Meta Pixel ID
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

### **Step 5: Server Restart Karein**

```bash
# Terminal mein Ctrl+C
# Phir:
npm run dev
```

---

## 🧪 Testing Kaise Karein:

### **Method 1: Meta Pixel Helper Extension**

1. Chrome/Edge mein **Meta Pixel Helper** extension install karein
2. Link: https://chrome.google.com/webstore (search "Meta Pixel Helper")
3. Apni payment page pe jayein
4. Extension icon pe click karein
5. Events dikhenge:
   - ✅ PageView
   - ✅ InitiateCheckout
   - ✅ AddPaymentInfo
   - ✅ Purchase (payment success pe)

### **Method 2: Events Manager**

1. **https://business.facebook.com/events_manager** pe jayein
2. Apna Pixel select karein
3. **"Test Events"** tab pe jayein
4. Apni website pe activity karein
5. Real-time events dikhenge

### **Method 3: Browser Console**

1. Payment page pe **F12** press karein
2. **Console** tab open karein
3. Payment button click karein
4. Console mein Facebook Pixel events log dikhenge

---

## 📊 Events Details:

### **1. PageView**
```javascript
Event: PageView
Automatically triggered when page loads
```

### **2. InitiateCheckout**
```javascript
Event: InitiateCheckout
Parameters:
  - value: 1 (₹1)
  - currency: INR
  - content_name: "Razorpay Payment"
```

### **3. AddPaymentInfo**
```javascript
Event: AddPaymentInfo
Parameters:
  - content_name: "Autopay Setup" or "One-time Payment"
```

### **4. Purchase**
```javascript
Event: Purchase
Parameters:
  - value: 1 (₹1)
  - currency: INR
  - transaction_id: razorpay_payment_id
  - content_name: "Razorpay Payment"
```

---

## 🎯 Facebook Ads Mein Use Kaise Karein:

### **1. Custom Conversions Create Karein**

Events Manager mein:
1. **"Custom Conversions"** pe jayein
2. **"Create Custom Conversion"** click karein
3. **Purchase** event select karein
4. Name: "Payment Completed"
5. Save karein

### **2. Ads Campaign Mein Use Karein**

Facebook Ads Manager mein:
1. New campaign banayein
2. **Objective**: Conversions
3. **Conversion Event**: "Purchase" ya custom conversion select karein
4. Ads run karein
5. Pixel automatically track karega conversions

### **3. Retargeting Audiences Banayein**

1. **Audiences** section mein jayein
2. **Custom Audience** create karein
3. Source: **Website Traffic**
4. Rules:
   - **InitiateCheckout** but not **Purchase** → Cart abandoners
   - **PageView** → All visitors
   - **Purchase** → Customers

---

## 🔍 Troubleshooting:

### **Problem: Events Track Nahi Ho Rahe**

**Solution:**
1. `.env.local` mein Pixel ID sahi hai ya nahi check karein
2. Server restart karein
3. Browser cache clear karein
4. Meta Pixel Helper extension se verify karein

### **Problem: Purchase Event Nahi Dikh Raha**

**Solution:**
1. Payment successfully complete hona chahiye
2. Browser console mein errors check karein
3. Test payment karke dekho

### **Problem: Pixel Helper "No Pixel Found" Dikha Raha Hai**

**Solution:**
1. Pixel ID `.env.local` mein set hai ya nahi check karein
2. `NEXT_PUBLIC_` prefix zaroori hai
3. Server restart karein

---

## 📈 Advanced Features:

### **Custom Events Add Karna:**

Agar aur events track karne hain, toh `MetaPixel.tsx` mein functions use karein:

```typescript
import { trackEvent } from '@/components/MetaPixel';

// Custom event
trackEvent('CustomEventName', {
  custom_param: 'value',
  amount: 100,
});
```

### **Value Optimization:**

Facebook Ads ko better optimize karne ke liye:
1. Purchase event mein **actual amount** pass karein
2. Currency consistent rakhein
3. Transaction IDs unique hone chahiye

---

## 🎊 Summary:

✅ **Meta Pixel integrated** - Tracking active hai  
✅ **4 key events** - PageView, InitiateCheckout, AddPaymentInfo, Purchase  
✅ **Facebook Ads ready** - Conversions track kar sakte ho  
✅ **Retargeting ready** - Audiences bana sakte ho  

**Next Step**: Meta Pixel ID add karo aur testing start karo! 🚀

---

## 📞 Resources:

- **Meta Events Manager**: https://business.facebook.com/events_manager
- **Meta Pixel Helper**: https://chrome.google.com/webstore (search "Meta Pixel Helper")
- **Meta Pixel Documentation**: https://developers.facebook.com/docs/meta-pixel
- **Standard Events**: https://developers.facebook.com/docs/meta-pixel/reference

---

**Happy Tracking! 📊**
