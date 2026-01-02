# Google Sheets Integration Setup Guide

## 📊 Overview
Customer data from payment forms will be automatically saved to Google Sheets after successful payment.

## 🚀 Setup Instructions

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "MakeUp Mastry Club - Customers"

### Step 2: Deploy Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy the entire code from `google-sheets-script.js` file
4. Paste it into the Apps Script editor
5. Click **Save** (💾 icon)
6. Click **Deploy > New deployment**
7. Click the gear icon ⚙️ next to "Select type"
8. Choose **Web app**
9. Configure deployment:
   - **Description:** "Customer Data API"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
10. Click **Deploy**
11. **Copy the Web App URL** (it will look like: `https://script.google.com/macros/s/...`)

### Step 3: Add URL to Environment Variables
1. Open your `.env.local` file
2. Add this line:
   ```
   GOOGLE_SHEET_URL=your_web_app_url_here
   ```
3. Replace `your_web_app_url_here` with the URL you copied
4. Save the file
5. Restart your dev server (`npm run dev`)

### Step 4: Test the Integration
1. Go to your checkout page
2. Fill in the form with test data
3. Complete a test payment
4. Check your Google Sheet - a new row should appear with customer data

## 📋 Data Saved to Sheet

The following information is saved for each customer:
- **Timestamp** - When the payment was made
- **First Name** - Customer's first name
- **Last Name** - Customer's last name
- **Email** - Customer's email address
- **Mobile** - Customer's mobile number
- **Plan** - Selected subscription plan (1 Month, 3 Months, etc.)
- **Amount** - Payment amount in ₹
- **Subscription ID** - Razorpay subscription ID
- **Payment ID** - Razorpay payment ID

## 🔒 Security Notes
- The Apps Script runs under your Google account
- Only you can access and modify the spreadsheet
- The Web App URL is public but doesn't expose your sheet data
- All data is sent via HTTPS

## 🐛 Troubleshooting

### Data not appearing in sheet?
1. Check if `GOOGLE_SHEET_URL` is set correctly in `.env.local`
2. Verify the Apps Script is deployed as "Anyone" can access
3. Check browser console for errors
4. Test the script manually using the `testDoPost()` function in Apps Script

### Permission errors?
1. Re-deploy the Apps Script
2. Make sure "Execute as" is set to "Me"
3. Authorize the script when prompted

## 📧 Support
If you need help, check the browser console logs or Razorpay dashboard for error messages.
